from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz  # PyMuPDF for text-based PDF extraction
import pytesseract  # OCR for scanned PDFs
from pdf2image import convert_from_path  # Convert PDF to images for OCR
from transformers import pipeline
import os

app = Flask(__name__)
CORS(app)

# Initialize the Hugging Face summarization pipeline
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB Limit

def extract_text_from_pdf(pdf_path):
    """Extracts text from a standard PDF file using PyMuPDF."""
    try:
        doc = fitz.open(pdf_path)
        text = "\n".join([page.get_text("text") for page in doc])
        return text.strip() if text else None
    except Exception as e:
        print(f"Error extracting text: {e}")
        return None

def extract_text_from_images(pdf_path):
    """Extracts text from scanned/image-based PDFs using OCR."""
    text = ""
    try:
        images = convert_from_path(pdf_path)
        for img in images:
            text += pytesseract.image_to_string(img) + "\n"
    except Exception as e:
        print(f"OCR extraction failed: {e}")
        return None
    return text.strip() if text else None

def summarize_text(text, max_chunk_size=500):
    """Summarizes large text by processing in smaller chunks."""
    if not text.strip():
        return "No valid text found in the document."

    sentences = text.split(". ")
    chunks = []
    current_chunk = ""

    for sentence in sentences:
        if len(current_chunk) + len(sentence) < max_chunk_size:
            current_chunk += sentence + ". "
        else:
            chunks.append(current_chunk.strip())
            current_chunk = sentence + ". "

    if current_chunk:
        chunks.append(current_chunk.strip())

    summary = []
    for chunk in chunks:
        try:
            summary_part = summarizer(chunk, max_length=200, min_length=50, do_sample=False)
            summary.append(summary_part[0]["summary_text"])
        except Exception as e:
            print(f"Summarization error: {e}")
            return f"Summarization error: {str(e)}"

    return " ".join(summary)

@app.route("/upload_pdf", methods=["POST"])
def upload_pdf():
    """Handles PDF uploads and returns summarized text."""
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if not file.filename.endswith(".pdf"):
        return jsonify({"error": "Invalid file format. Please upload a PDF."}), 400

    if request.content_length > MAX_FILE_SIZE:
        return jsonify({"error": "File too large. Maximum 10MB allowed."}), 400

    pdf_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    file.save(pdf_path)

    extracted_text = extract_text_from_pdf(pdf_path)

    if not extracted_text:
        print("No direct text found, attempting OCR...")
        extracted_text = extract_text_from_images(pdf_path)

    if not extracted_text:
        return jsonify({"error": "Failed to extract any text from the PDF."}), 500

    summarized_text = summarize_text(extracted_text)
    return jsonify({"summary": summarized_text})

if __name__ == "__main__":
    app.run(port=8080, debug=True)
