import os
import numpy as np
from PIL import Image
import cv2
from flask import Flask, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Flatten, Dense, Dropout
from tensorflow.keras.applications.vgg19 import VGG19

# Load VGG19 model
base_model = VGG19(include_top=False, input_shape=(224, 224, 3))
x = base_model.output
flat = Flatten()(x)
dense1 = Dense(4608, activation='relu')(flat)
drop_out = Dropout(0.2)(dense1)
dense2 = Dense(1152, activation='relu')(drop_out)
output = Dense(2, activation='softmax')(dense2)

model_03 = Model(inputs=base_model.input, outputs=output)
model_03.load_weights('vgg_unfrozen.h5')

app = Flask(__name__)
CORS(app)  # Enable CORS

print('Model loaded. Visit http://127.0.0.1:5000/')


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

    result = model_03.predict(input_img)
    prediction = np.argmax(result, axis=1)
    return prediction


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


if __name__ == '__main__':
    app.run(debug=True)
