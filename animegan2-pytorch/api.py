import sys
import os
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Agregar el directorio padre al PYTHONPATH
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import torch
from PIL import Image
import io
from torchvision.transforms.functional import to_tensor, to_pil_image
import uuid
from model import Generator

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Asegurarse que existe el directorio para guardar las imágenes procesadas
os.makedirs("processed_images", exist_ok=True)

# Cargar el modelo una sola vez al iniciar el servidor
device = "cpu"  # Cambiar a "cuda" si tienes GPU disponible
models = {}

def load_models():
    global models
    try:
        # Cargar modelos de torch.hub
        model_names = ['face_paint_512_v1', 'face_paint_512_v2', 'paprika']
        for model_name in model_names:
            logger.info(f"Cargando modelo {model_name}...")
            models[model_name] = torch.hub.load("bryandlee/animegan2-pytorch:main", "generator", pretrained=model_name)
            models[model_name].to(device).eval()
            logger.info(f"Modelo {model_name} cargado exitosamente")
            
    except Exception as e:
        logger.error(f"Error al cargar los modelos: {str(e)}")
        raise

@app.on_event("startup")
async def startup_event():
    load_models()

def process_image(image: Image.Image, model_name: str) -> Image.Image:
    try:
        logger.info(f"Procesando imagen con modelo: {model_name}")
        
        if model_name not in models:
            raise HTTPException(status_code=404, detail=f"Modelo {model_name} no encontrado")
            
        image = image.convert("RGB")
        with torch.no_grad():
            input_image = to_tensor(image).unsqueeze(0) * 2 - 1
            output = models[model_name](input_image.to(device)).cpu()[0]
            output = output.clip(-1, 1) * 0.5 + 0.5
            return to_pil_image(output)
    except Exception as e:
        logger.error(f"Error al procesar la imagen: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al procesar la imagen: {str(e)}")

@app.post("/process/{model_name}")
async def process_image_endpoint(model_name: str, file: UploadFile = File(...)):
    try:
        logger.info(f"Recibida solicitud para modelo: {model_name}")
        
        # Verificar que el modelo existe
        if model_name not in models:
            raise HTTPException(status_code=404, detail=f"Modelo {model_name} no encontrado")
        
        # Leer la imagen
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Procesar la imagen
        result_image = process_image(image, model_name)
        
        # Guardar la imagen procesada
        output_filename = f"processed_images/{uuid.uuid4()}.png"
        result_image.save(output_filename)
        
        logger.info(f"Imagen procesada exitosamente, guardada como: {output_filename}")
        return FileResponse(output_filename)
        
    except Exception as e:
        logger.error(f"Error en el endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/models")
async def get_models():
    return {"models": list(models.keys())}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 