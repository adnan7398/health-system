"""
Semantic Search Module for Desi Remedies Chatbot
Uses sentence transformers for semantic embeddings and FAISS for vector search
"""

import numpy as np
import json
import os
from sentence_transformers import SentenceTransformer
import faiss
from typing import List, Dict, Tuple, Optional
import pickle
from datetime import datetime


class SemanticRemedySearch:
    """Semantic search engine for remedies using embeddings"""
    
    def __init__(self, model_name: str = 'all-MiniLM-L6-v2', dataset_path: str = 'desi_remedies_dataset.json'):
        """
        Initialize semantic search engine
        
        Args:
            model_name: Name of the sentence transformer model
            dataset_path: Path to the remedies dataset JSON file
        """
        self.model_name = model_name
        self.dataset_path = dataset_path
        self.model = None
        self.embeddings = None
        self.index = None
        self.remedies_data = []
        self.embedding_dim = 384  # Dimension for all-MiniLM-L6-v2
        
        # Initialize model
        self._load_model()
        
        # Load and index dataset
        self._load_dataset()
        self._build_index()
    
    def _load_model(self):
        """Load sentence transformer model"""
        try:
            print(f"Loading sentence transformer model: {self.model_name}...")
            self.model = SentenceTransformer(self.model_name)
            print(f"✓ Model loaded successfully")
        except Exception as e:
            print(f"Error loading model: {e}")
            raise
    
    def _load_dataset(self):
        """Load remedies dataset from JSON"""
        try:
            if os.path.exists(self.dataset_path):
                with open(self.dataset_path, 'r', encoding='utf-8') as f:
                    self.remedies_data = json.load(f)
                print(f"✓ Loaded {len(self.remedies_data)} remedies from dataset")
            else:
                print(f"Warning: Dataset file {self.dataset_path} not found")
                self.remedies_data = []
        except Exception as e:
            print(f"Error loading dataset: {e}")
            self.remedies_data = []
    
    def _build_index(self):
        """Build FAISS index from dataset embeddings"""
        if not self.remedies_data:
            print("No data to index")
            return
        
        try:
            # Create searchable text for each remedy
            searchable_texts = []
            for entry in self.remedies_data:
                # Combine query, category, and remedy text for better semantic matching
                text = f"{entry.get('query', '')} {entry.get('category', '')} {entry.get('remedy', '')}"
                searchable_texts.append(text)
            
            # Generate embeddings
            print("Generating embeddings for remedies...")
            self.embeddings = self.model.encode(
                searchable_texts,
                show_progress_bar=True,
                convert_to_numpy=True
            )
            
            # Build FAISS index
            self.embedding_dim = self.embeddings.shape[1]
            self.index = faiss.IndexFlatL2(self.embedding_dim)
            self.index.add(self.embeddings.astype('float32'))
            
            print(f"✓ Built FAISS index with {self.index.ntotal} vectors")
            
            # Save index for faster loading
            self._save_index()
            
        except Exception as e:
            print(f"Error building index: {e}")
            raise
    
    def _save_index(self):
        """Save FAISS index and embeddings to disk"""
        try:
            index_path = 'models/remedies_index.faiss'
            embeddings_path = 'models/remedies_embeddings.pkl'
            
            os.makedirs('models', exist_ok=True)
            
            faiss.write_index(self.index, index_path)
            with open(embeddings_path, 'wb') as f:
                pickle.dump(self.embeddings, f)
            
            print(f"✓ Saved index and embeddings to disk")
        except Exception as e:
            print(f"Warning: Could not save index: {e}")
    
    def _load_index(self) -> bool:
        """Load FAISS index and embeddings from disk"""
        try:
            index_path = 'models/remedies_index.faiss'
            embeddings_path = 'models/remedies_embeddings.pkl'
            
            if os.path.exists(index_path) and os.path.exists(embeddings_path):
                self.index = faiss.read_index(index_path)
                with open(embeddings_path, 'rb') as f:
                    self.embeddings = pickle.load(f)
                self.embedding_dim = self.embeddings.shape[1]
                print(f"✓ Loaded index with {self.index.ntotal} vectors from disk")
                return True
            return False
        except Exception as e:
            print(f"Warning: Could not load index: {e}")
            return False
    
    def search(self, query: str, top_k: int = 5, threshold: float = 0.3) -> List[Tuple[Dict, float]]:
        """
        Search for remedies using semantic similarity
        
        Args:
            query: User query string
            top_k: Number of top results to return
            threshold: Minimum similarity threshold (0-1)
        
        Returns:
            List of tuples (remedy_dict, similarity_score)
        """
        if not self.index or not self.remedies_data:
            return []
        
        try:
            # Encode query
            query_embedding = self.model.encode([query], convert_to_numpy=True).astype('float32')
            
            # Search in FAISS index
            distances, indices = self.index.search(query_embedding, min(top_k, len(self.remedies_data)))
            
            # Convert distances to similarity scores (L2 distance -> cosine similarity approximation)
            # For normalized vectors, similarity ≈ 1 - (distance^2 / 2)
            results = []
            for i, (distance, idx) in enumerate(zip(distances[0], indices[0])):
                if idx < len(self.remedies_data):
                    # Convert L2 distance to similarity (higher is better)
                    # Using a simple conversion: similarity = 1 / (1 + distance)
                    similarity = 1 / (1 + distance)
                    
                    if similarity >= threshold:
                        results.append((self.remedies_data[idx], float(similarity)))
            
            return results
            
        except Exception as e:
            print(f"Error during search: {e}")
            return []
    
    def add_remedy(self, remedy: Dict):
        """
        Add a new remedy to the dataset and update index in real-time
        
        Args:
            remedy: Dictionary containing remedy data (query, category, remedy, intensity)
        """
        try:
            # Add to dataset
            self.remedies_data.append(remedy)
            
            # Create searchable text
            text = f"{remedy.get('query', '')} {remedy.get('category', '')} {remedy.get('remedy', '')}"
            
            # Generate embedding
            embedding = self.model.encode([text], convert_to_numpy=True).astype('float32')
            
            # Add to index
            if self.index is None:
                self.embedding_dim = embedding.shape[1]
                self.index = faiss.IndexFlatL2(self.embedding_dim)
                if self.embeddings is not None:
                    self.index.add(self.embeddings.astype('float32'))
            
            self.index.add(embedding)
            
            # Update embeddings array
            if self.embeddings is None:
                self.embeddings = embedding
            else:
                self.embeddings = np.vstack([self.embeddings, embedding])
            
            # Save updated dataset
            self._save_dataset()
            
            # Save updated index
            self._save_index()
            
            print(f"✓ Added new remedy: {remedy.get('query', 'unknown')}")
            return True
            
        except Exception as e:
            print(f"Error adding remedy: {e}")
            return False
    
    def _save_dataset(self):
        """Save updated dataset to JSON file"""
        try:
            with open(self.dataset_path, 'w', encoding='utf-8') as f:
                json.dump(self.remedies_data, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Warning: Could not save dataset: {e}")
    
    def update_dataset(self, new_data: List[Dict]):
        """
        Update entire dataset and rebuild index
        
        Args:
            new_data: List of remedy dictionaries
        """
        self.remedies_data = new_data
        self._build_index()
        self._save_dataset()
    
    def get_stats(self) -> Dict:
        """Get statistics about the search engine"""
        return {
            "total_remedies": len(self.remedies_data),
            "index_size": self.index.ntotal if self.index else 0,
            "embedding_dim": self.embedding_dim,
            "model_name": self.model_name
        }


# Global instance
_semantic_search = None

def get_semantic_search() -> SemanticRemedySearch:
    """Get or create global semantic search instance"""
    global _semantic_search
    if _semantic_search is None:
        _semantic_search = SemanticRemedySearch()
    return _semantic_search

