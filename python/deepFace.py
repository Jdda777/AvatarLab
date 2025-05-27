from flask import Flask, request, jsonify
from flask_cors import CORS
from deepface import DeepFace
import cv2
import numpy as np

app = Flask(__name__)
CORS(app)

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        file = request.files['image']
        # Leer y preprocesar la imagen
        file_bytes = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        
        # Analizar la imagen con DeepFace
        result = DeepFace.analyze(img, actions=['age'], enforce_detection=False)
        age = result[0]['age']
        
        return jsonify({"age": age})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)