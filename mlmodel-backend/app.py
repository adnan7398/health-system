import os
import numpy as np
from PIL import Image
import cv2
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Flatten, Dense, Dropout
from tensorflow.keras.applications.vgg19 import VGG19
from datetime import datetime
import joblib
import json
import re
from difflib import SequenceMatcher
# Semantic search will be imported when needed

# -------------------------------
# Load VGG19 Pneumonia Model
# -------------------------------

# Load VGG19 Pneumonia Model
# -------------------------------

model_03 = None
try:
    base_model = VGG19(include_top=False, input_shape=(224, 224, 3))
    x = base_model.output
    flat = Flatten()(x)
    dense1 = Dense(4608, activation='relu')(flat)
    drop_out = Dropout(0.2)(dense1)
    dense2 = Dense(1152, activation='relu')(drop_out)
    output = Dense(2, activation='softmax')(dense2)

    model_03 = Model(inputs=base_model.input, outputs=output)
    
    if os.path.exists('vgg_unfrozen.h5'):
        model_03.load_weights('vgg_unfrozen.h5')
        print("Pneumonia model loaded successfully")
    else:
        print("Warning: vgg_unfrozen.h5 not found. Pneumonia detection may not work.")
except Exception as e:
    print(f"Warning: Could not load pneumonia model: {e}")
    model_03 = None


# -------------------------------
# Flask App
# -------------------------------

app = Flask(__name__)
# Configure CORS to allow requests from frontend
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# -------------------------------
# Load Trained ML Models
# -------------------------------

heart_model = None
heart_scaler = None
breast_model = None
breast_scaler = None
pcod_model = None
pcod_scaler = None

try:
    if os.path.exists('models/heart_disease_model.pkl'):
        heart_model = joblib.load('models/heart_disease_model.pkl')
        heart_scaler = joblib.load('models/heart_disease_scaler.pkl')
        print("✓ Heart Disease model loaded (Accuracy: ~93%)")
    else:
        print("Warning: Heart Disease model not found")
except Exception as e:
    print(f"Warning: Could not load Heart Disease model: {e}")

try:
    if os.path.exists('models/breast_cancer_model.pkl'):
        breast_model = joblib.load('models/breast_cancer_model.pkl')
        breast_scaler = joblib.load('models/breast_cancer_scaler.pkl')
        print("✓ Breast Cancer model loaded (Accuracy: ~91%)")
    else:
        print("Warning: Breast Cancer model not found")
except Exception as e:
    print(f"Warning: Could not load Breast Cancer model: {e}")

try:
    if os.path.exists('models/pcod_model.pkl'):
        pcod_model = joblib.load('models/pcod_model.pkl')
        pcod_scaler = joblib.load('models/pcod_scaler.pkl')
        print("✓ PCOD model loaded (Accuracy: ~99%)")
    else:
        print("Warning: PCOD model not found")
except Exception as e:
    print(f"Warning: Could not load PCOD model: {e}")

# -------------------------------
# Load Desi Remedies Dataset & Initialize Semantic Search
# -------------------------------

desi_remedies_data = []
semantic_search = None

try:
    with open('desi_remedies_dataset.json', 'r', encoding='utf-8') as f:
        desi_remedies_data = json.load(f)
    print(f"✓ Desi Remedies dataset loaded ({len(desi_remedies_data)} entries)")
except Exception as e:
    print(f"Warning: Could not load Desi Remedies dataset: {e}")

# Initialize semantic search engine
try:
    print("Initializing semantic search engine...")
    from semantic_search import SemanticRemedySearch
    semantic_search = SemanticRemedySearch()
    # Try to load existing index first
    index_loaded = semantic_search._load_index()
    
    # Check if index needs to be rebuilt (dataset size changed)
    if index_loaded:
        if semantic_search.index and semantic_search.index.ntotal != len(desi_remedies_data):
            print(f"Dataset size changed ({len(desi_remedies_data)} entries vs {semantic_search.index.ntotal} in index). Rebuilding index...")
            semantic_search.update_dataset(desi_remedies_data)
        else:
            print(f"✓ Loaded existing index with {semantic_search.index.ntotal if semantic_search.index else 0} entries")
    else:
        # If no index exists, build it
        print("Building semantic index (this may take a few minutes on first run)...")
        semantic_search._build_index()
    
    print(f"✓ Semantic search engine ready (Model: {semantic_search.model_name}, {len(desi_remedies_data)} remedies indexed)")
except Exception as e:
    print(f"Warning: Could not initialize semantic search: {e}")
    import traceback
    traceback.print_exc()
    print("Falling back to keyword-based search")
    semantic_search = None

# Emergency keywords that require immediate medical attention
EMERGENCY_KEYWORDS = [
    'heart attack', 'chest pain', 'stroke', 'severe', 'emergency', 'poisoning',
    'unconscious', 'severe bleeding', 'severe burn', 'difficulty breathing',
    'severe injury', 'severe headache', 'severe pain', 'can\'t breathe',
    'choking', 'severe allergic reaction', 'severe fever', 'severe diarrhea'
]

# Safety disclaimer templates
SAFETY_DISCLAIMER = "\n\n⚠️ **Important:** This is a traditional remedy based on cultural practices, not a medical treatment. For emergencies or symptoms that worsen, seek medical help immediately."

EMERGENCY_RESPONSE = "🚨 This sounds like a serious medical situation. Please seek IMMEDIATE medical help. Call emergency services or visit the nearest hospital. Traditional remedies are not appropriate for emergencies."

def similarity_score(a, b):
    """Calculate similarity between two strings"""
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

def classify_intensity(query):
    """Classify query intensity: mild, moderate, or emergency"""
    query_lower = query.lower()
    
    # Check for emergency keywords
    for keyword in EMERGENCY_KEYWORDS:
        if keyword in query_lower:
            return "emergency"
    
    # Check for moderate indicators
    moderate_indicators = ['persistent', 'chronic', 'frequent', 'severe', 'worsening', 'high fever']
    for indicator in moderate_indicators:
        if indicator in query_lower:
            return "moderate"
    
    return "mild"

def find_best_remedy(query, use_semantic=True):
    """
    Find the best matching remedy from the dataset
    Uses semantic search if available, falls back to keyword matching
    """
    # Use semantic search if available
    if use_semantic and semantic_search is not None:
        try:
            results = semantic_search.search(query, top_k=1, threshold=0.3)
            if results:
                best_match, best_score = results[0]
                return best_match, best_score
        except Exception as e:
            print(f"Semantic search error: {e}, falling back to keyword search")
    
    # Fallback to keyword-based search
    query_lower = query.lower()
    best_match = None
    best_score = 0
    
    for entry in desi_remedies_data:
        # Check query field
        query_score = similarity_score(query_lower, entry.get('query', ''))
        
        # Check category
        category_score = similarity_score(query_lower, entry.get('category', ''))
        
        # Combined score
        score = max(query_score, category_score * 0.7)
        
        if score > best_score:
            best_score = score
            best_match = entry
    
    # Return match if similarity is above threshold
    if best_score > 0.3:
        return best_match, best_score
    
    return None, 0

print("AI/ML Backend Server Started. Visit http://127.0.0.1:5001/")


def get_class_name(class_no):
    return "Normal" if class_no == 0 else "Person acquired Pneumonia"


def get_result(img_path):
    if model_03 is None:
        return None, 0.0

    image = cv2.imread(img_path)
    if image is None:
        return None, 0.0

    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = Image.fromarray(image)
    image = image.resize((224, 224))
    image = np.array(image) / 255.0
    input_img = np.expand_dims(image, axis=0)

    result = model_03.predict(input_img, verbose=0)
    prediction = np.argmax(result)
    confidence = float(np.max(result) * 100)

    return prediction, confidence


# -------------------------------
# Pneumonia API
# -------------------------------

@app.route('/pneumoniapredict', methods=['POST'])
def pneumonia_predict():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        f = request.files['file']
        if f.filename == '':
            return jsonify({"error": "No file selected"}), 400

        uploads_dir = os.path.join(os.path.dirname(__file__), 'uploads')
        os.makedirs(uploads_dir, exist_ok=True)

        file_path = os.path.join(uploads_dir, secure_filename(f.filename))
        f.save(file_path)

        result, confidence = get_result(file_path)
        if result is None:
            return jsonify({"error": "Invalid image or model not loaded"}), 400

        return jsonify({
            "prediction": get_class_name(result),
            "isNormal": result == 0,
            "confidence": round(confidence, 2),
            "timestamp": datetime.now().isoformat()
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------
# Heart Disease Prediction
# -------------------------------

@app.route('/heartpredict', methods=['POST'])
def heart_predict():
    try:
        if heart_model is None or heart_scaler is None:
            return jsonify({"error": "Heart Disease model not loaded"}), 500

        data = request.get_json()

        age = float(data.get('age', 0))
        gender_str = data.get('gender', '').lower()
        gender = 1 if gender_str == 'male' else 0
        bp = float(data.get('bloodPressure', 0))
        cholesterol = float(data.get('cholesterol', 0))
        diabetes = 1 if data.get('diabetes', '').lower() == 'yes' else 0

        # Prepare features: [age, gender, bp, cholesterol, diabetes]
        features = np.array([[age, gender, bp, cholesterol, diabetes]])
        
        # Scale features
        features_scaled = heart_scaler.transform(features)
        
        # Predict
        prediction = heart_model.predict(features_scaled)[0]
        probabilities = heart_model.predict_proba(features_scaled)[0]
        confidence = float(np.max(probabilities) * 100)

        # Map prediction to risk level
        risk_levels = ["Low Risk", "Medium Risk", "High Risk"]
        risk = risk_levels[prediction]

        return jsonify({
            "prediction": risk,
            "riskScore": int(prediction),
            "confidence": round(confidence, 2),
            "timestamp": datetime.now().isoformat()
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------
# Breast Cancer Prediction
# -------------------------------

@app.route('/breastpredict', methods=['POST'])
def breast_cancer_predict():
    try:
        if breast_model is None or breast_scaler is None:
            return jsonify({"error": "Breast Cancer model not loaded"}), 500

        data = request.get_json()
        features = data.get('features', [])

        if len(features) != 10:
            return jsonify({"error": "Exactly 10 features required"}), 400

        # Prepare features array
        features_array = np.array([features])
        
        # Scale features
        features_scaled = breast_scaler.transform(features_array)
        
        # Predict
        prediction = breast_model.predict(features_scaled)[0]
        probabilities = breast_model.predict_proba(features_scaled)[0]
        confidence = float(np.max(probabilities) * 100)

        return jsonify({
            "prediction": int(prediction),
            "isMalignant": bool(prediction == 1),
            "confidence": round(confidence, 2),
            "timestamp": datetime.now().isoformat()
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------
# PCOD Prediction
# -------------------------------

@app.route('/pcodpredict', methods=['POST'])
def pcod_predict():
    try:
        if pcod_model is None or pcod_scaler is None:
            return jsonify({"error": "PCOD model not loaded"}), 500

        data = request.get_json()

        age = float(data.get('age', 0))
        period_flow_str = data.get('periodFlow', 'normal').lower()
        bmi = float(data.get('bmi', 0))
        cycle_length = float(data.get('cycleLength', 0))

        # Map period flow to numeric: 0=light, 1=normal, 2=heavy
        period_flow_map = {'light': 0, 'normal': 1, 'heavy': 2}
        period_flow = period_flow_map.get(period_flow_str, 1)

        # Prepare features: [age, bmi, cycle_length, period_flow]
        features = np.array([[age, bmi, cycle_length, period_flow]])
        
        # Scale features
        features_scaled = pcod_scaler.transform(features)
        
        # Predict
        prediction = pcod_model.predict(features_scaled)[0]
        probabilities = pcod_model.predict_proba(features_scaled)[0]
        confidence = float(np.max(probabilities) * 100)

        # Map prediction to risk level
        risk_levels = ["Low Risk of PCOD", "Medium Risk of PCOD", "High Risk of PCOD"]
        level = risk_levels[prediction]

        return jsonify({
            "prediction": level,
            "riskScore": int(prediction),
            "confidence": round(confidence, 2),
            "timestamp": datetime.now().isoformat()
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------
# Desi Remedies Chatbot
# -------------------------------

@app.route('/desiremedy', methods=['POST'])
def desi_remedy_chatbot():
    """Desi Remedies Chatbot - Provides traditional Indian/Pakistani household remedies using semantic analysis"""
    try:
        data = request.get_json()
        user_query = data.get('query', '').strip()
        use_semantic = data.get('use_semantic', True)  # Allow disabling semantic search
        
        if not user_query:
            return jsonify({"error": "Please provide a query"}), 400
        
        # Classify intensity
        intensity = classify_intensity(user_query)
        
        # If emergency, return safety response immediately
        if intensity == "emergency":
            return jsonify({
                "response": EMERGENCY_RESPONSE,
                "intensity": "emergency",
                "category": "emergency",
                "timestamp": datetime.now().isoformat(),
                "search_method": "emergency_detection"
            })
        
        # Find best matching remedy using semantic search
        best_match, score = find_best_remedy(user_query, use_semantic=use_semantic)
        
        if best_match:
            # Build response with safety disclaimer
            response = best_match['remedy']
            
            # Add additional safety note if not already present
            if "medical" not in response.lower() and "doctor" not in response.lower():
                response += SAFETY_DISCLAIMER
            
            return jsonify({
                "response": response,
                "intensity": best_match.get('intensity', 'mild'),
                "category": best_match.get('category', 'general'),
                "confidence": round(score * 100, 2),
                "timestamp": datetime.now().isoformat(),
                "search_method": "semantic" if (use_semantic and semantic_search) else "keyword"
            })
        else:
            # No match found - provide general response with safety
            general_response = (
                "I understand you're asking about: '" + user_query + "'. "
                "While I provide traditional Indian/Pakistani household remedies, "
                "I don't have specific information about this query in my knowledge base. "
                "For personalized advice, please consult a healthcare professional. "
                "If this is an emergency, seek immediate medical help."
            )
            
            return jsonify({
                "response": general_response,
                "intensity": intensity,
                "category": "general",
                "confidence": 0,
                "timestamp": datetime.now().isoformat(),
                "search_method": "semantic" if (use_semantic and semantic_search) else "keyword"
            })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/desiremedy/add', methods=['POST'])
def add_remedy():
    """Add a new remedy to the dataset in real-time"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['query', 'category', 'remedy', 'intensity']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Create remedy entry
        new_remedy = {
            "category": data['category'],
            "query": data['query'],
            "remedy": data['remedy'],
            "intensity": data['intensity']
        }
        
        # Add to dataset
        desi_remedies_data.append(new_remedy)
        
        # Update semantic search index if available
        if semantic_search:
            success = semantic_search.add_remedy(new_remedy)
            if not success:
                return jsonify({"error": "Failed to update semantic index"}), 500
        
        # Save to file
        with open('desi_remedies_dataset.json', 'w', encoding='utf-8') as f:
            json.dump(desi_remedies_data, f, indent=2, ensure_ascii=False)
        
        return jsonify({
            "message": "Remedy added successfully",
            "remedy": new_remedy,
            "total_remedies": len(desi_remedies_data),
            "timestamp": datetime.now().isoformat()
        }), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/desiremedy/stats', methods=['GET'])
def get_remedy_stats():
    """Get statistics about the remedy dataset and search engine"""
    try:
        stats = {
            "total_remedies": len(desi_remedies_data),
            "semantic_search_enabled": semantic_search is not None,
            "timestamp": datetime.now().isoformat()
        }
        
        if semantic_search:
            stats.update(semantic_search.get_stats())
        
        return jsonify(stats), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------
# Lab Report Analysis
# -------------------------------

@app.route('/analyzelabreport', methods=['POST'])
def analyze_lab_report():
    """Analyze lab report and provide desi remedy suggestions - supports both text and image upload"""
    try:
        from lab_report_analyzer import get_analyzer
        
        report_text = ""
        gender = ""
        
        # Check if image is uploaded
        if 'image' in request.files:
            image_file = request.files['image']
            if image_file and image_file.filename:
                # Extract text from image using OCR
                try:
                    import pytesseract
                    from PIL import Image
                    import io
                    import numpy as np
                    import cv2
                    
                    # Read image
                    image_bytes = image_file.read()
                    image = Image.open(io.BytesIO(image_bytes))
                    
                    # Convert to RGB if needed
                    if image.mode != 'RGB':
                        image = image.convert('RGB')
                    
                    # Convert PIL to numpy array for preprocessing
                    img_array = np.array(image)
                    
                    # Preprocess image for better OCR results
                    # Convert to grayscale
                    if len(img_array.shape) == 3:
                        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
                    else:
                        gray = img_array
                    
                    # Apply additional preprocessing for better decimal detection
                    # Resize if too small (helps with decimal point detection)
                    height, width = gray.shape
                    if height < 300 or width < 300:
                        scale = max(300 / height, 300 / width)
                        new_width = int(width * scale)
                        new_height = int(height * scale)
                        gray = cv2.resize(gray, (new_width, new_height), interpolation=cv2.INTER_CUBIC)
                    
                    # Apply denoising
                    gray = cv2.fastNlMeansDenoising(gray, None, 10, 7, 21)
                    
                    # Apply adaptive thresholding for better text extraction
                    thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
                    
                    # Also try OTSU thresholding as fallback
                    _, thresh_otsu = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
                    
                    # Convert back to PIL Image
                    processed_image = Image.fromarray(thresh)
                    processed_image_otsu = Image.fromarray(thresh_otsu)
                    
                    # Extract text using OCR with custom config for better number/decimal detection
                    # Config: --psm 6 (assume uniform block of text), -c tessedit_char_whitelist includes digits and decimal
                    custom_config = r'--oem 3 --psm 6 -c tessedit_char_whitelist=0123456789.ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz /()-:'
                    report_text = pytesseract.image_to_string(processed_image, lang='eng', config=custom_config)
                    
                    # If first attempt doesn't get good results, try with OTSU
                    if len(report_text.strip()) < 50:
                        report_text_otsu = pytesseract.image_to_string(processed_image_otsu, lang='eng', config=custom_config)
                        if len(report_text_otsu.strip()) > len(report_text.strip()):
                            report_text = report_text_otsu
                    
                    if not report_text.strip():
                        return jsonify({"error": "Could not extract text from image. Please ensure the image is clear and contains readable text."}), 400
                    
                except ImportError:
                    return jsonify({"error": "OCR libraries not installed. Please install pytesseract and Pillow."}), 500
                except Exception as e:
                    import traceback
                    traceback.print_exc()
                    return jsonify({"error": f"Error processing image: {str(e)}"}), 500
                
                # Get gender from form data if provided
                gender = request.form.get('gender', '').strip()
        else:
            # Handle JSON data (text input)
            data = request.get_json()
            if not data:
                return jsonify({"error": "Please provide lab report text or upload an image"}), 400
            report_text = data.get('report_text', '').strip()
            gender = data.get('gender', '').strip()
        
        if not report_text:
            return jsonify({"error": "Please provide lab report text or upload an image"}), 400
        
        # Get analyzer instance
        analyzer = get_analyzer()
        
        # Analyze report
        analysis = analyzer.analyze_report(report_text, gender)
        
        # Add extracted text to response if image was uploaded
        if 'image' in request.files:
            analysis['extracted_text'] = report_text
        
        return jsonify(analysis), 200
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# -------------------------------
# Health Check
# -------------------------------

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "AI/ML Backend",
        "models": {
            "pneumonia": model_03 is not None,
            "heart_disease": heart_model is not None,
            "breast_cancer": breast_model is not None,
            "pcod": pcod_model is not None,
            "desi_remedies": len(desi_remedies_data) > 0,
            "semantic_search": semantic_search is not None
        }
    })


# -------------------------------
# Run Server
# -------------------------------

if __name__ == '__main__':
    app.run(debug=True, port=5001)
