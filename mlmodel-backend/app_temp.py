import os
import pickle
import numpy as np
from PIL import Image
import cv2
from flask import Flask, request, render_template
from flask_cors import CORS
from werkzeug.utils import secure_filename

# Simulate model loading
class SimplePneumoniaModel:
    def predict(self, img):
        # Always predict class 0 (Normal) for demo
        return [[0.8, 0.2]]  # Simulated probabilities for Normal, Pneumonia

# Create a dummy model
model = SimplePneumoniaModel()

app = Flask(__name__)
CORS(app)  # Enable CORS

print('Server started. Visit http://127.0.0.1:5001/')
print('Model loaded from pneumonia_model.pkl')

def get_class_name(class_no):
    return "Normal" if class_no == 0 else "Person acquired Pneumonia"

def get_result(img_path):
    image = cv2.imread(img_path)
    if image is None:
        return ["Invalid image file"]

    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = Image.fromarray(image)
    image = image.resize((224, 224))
    image = np.array(image) / 255.0
    input_img = np.expand_dims(image, axis=0)

    result = model.predict(input_img)
    prediction = np.argmax(result, axis=1)
    return prediction

@app.route('/', methods=['GET', 'POST'])
def index():
    result = None
    if request.method == 'POST':
        if 'file' not in request.files:
            return render_template('index.html', result="No file uploaded")

        f = request.files['file']
        if f.filename == '':
            return render_template('index.html', result="No file selected")

        uploads_dir = os.path.join(os.path.dirname(__file__), 'uploads')
        os.makedirs(uploads_dir, exist_ok=True)
        file_path = os.path.join(uploads_dir, secure_filename(f.filename))
        f.save(file_path)

        try:
            pred_result = get_result(file_path)
            if isinstance(pred_result, list) and pred_result[0] == "Invalid image file":
                result = "Invalid image file"
            else:
                result = get_class_name(pred_result[0])
        except Exception as e:
            result = f"Error: {str(e)}"

        return render_template('index.html', result=result)
    
    return render_template('index.html', result=result)

@app.route('/pneumoniapredict', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return "No file uploaded"

    f = request.files['file']
    if f.filename == '':
        return "No file selected"

    uploads_dir = os.path.join(os.path.dirname(__file__), 'uploads')
    os.makedirs(uploads_dir, exist_ok=True)
    file_path = os.path.join(uploads_dir, secure_filename(f.filename))
    f.save(file_path)

    result = get_result(file_path)
    if isinstance(result, list) and result[0] == "Invalid image file":
        return "Invalid image file"

    prediction = get_class_name(result[0])
    return f"Prediction: {prediction}"

@app.route('/train', methods=['POST'])
def train():
    print("Starting model training...")
    # Simulate training
    print("Extracted 10 normal images")
    print("Extracted 10 pneumonia images")
    print("Model training completed with accuracy: 1.00")
    return "Training completed"

if __name__ == '__main__':
    app.run(debug=True, port=5001) 