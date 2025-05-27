# Avatar Lab - Transformador de Imágenes con Estilos Artísticos

Este proyecto es una aplicación web que permite transformar fotografías utilizando diferentes estilos artísticos basados en la edad detectada del sujeto. La aplicación utiliza modelos de inteligencia artificial para realizar las transformaciones y ofrece una interfaz web moderna y fácil de usar.

## 🎨 Características

- Transformación automática de imágenes basada en la edad detectada:
  - Menores de 15 años: Estilo Cartoon (face_paint_512_v2)
  - 15-29 años: Estilo Anime (face_paint_512_v1)
  - 30 años o más: Estilo Artístico (paprika)
- Detección de edad en el cliente usando face-api.js
- Interfaz web moderna y responsiva
- Procesamiento en tiempo real
- Visualización lado a lado de imágenes originales y transformadas
- Descarga de imágenes procesadas

## 🛠️ Requisitos Previos

- Python 3.10 (obligatorio)
- Node.js (versión 16 o superior)
- npm (incluido con Node.js)
- GPU compatible con CUDA (opcional, pero recomendado para mejor rendimiento)

## 📦 Dependencias Principales

### Backend (Python)
```bash
fastapi==0.115.12
uvicorn==0.34.2
python-multipart==0.0.20
torch>=2.0.0
torchvision>=0.15.0
pillow==11.0.0
```

### Frontend (React/Vite)
```bash
react
vite
face-api.js
tailwindcss
```

## 🚀 Instalación y Configuración

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd avatar-lab
```

2. Configurar el entorno Python:
```bash
# Crear y activar entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt
```

3. Instalar dependencias de Node.js:
```bash
npm install
```

## 🎮 Uso

1. Iniciar los servidores:

Backend (Puerto 8000):
```bash
cd animegan2-pytorch
python api.py
```

Frontend (Puerto 5173):
```bash
npm run dev
```

2. Abrir la aplicación en el navegador:
```
http://localhost:5173
```

## 🏗️ Estructura del Proyecto

```
avatar-lab/
├── src/                    # Código fuente del frontend (React)
│   ├── components/        # Componentes React
│   └── ...
├── public/                 # Archivos estáticos
│   └── models/            # Modelos de face-api.js
├── animegan2-pytorch/     # Backend FastAPI y modelos AnimeGAN
└── processed_images/      # Imágenes procesadas (temporal)
```

## 🔧 Configuración Avanzada

- Los modelos de AnimeGAN se descargan automáticamente de torch.hub
- Los modelos de face-api.js se incluyen en la carpeta public/models
- La configuración de los puertos se puede modificar en los archivos respectivos
- Los parámetros de los modelos se pueden ajustar en sus archivos de configuración

## 🎓 Créditos y Atribuciones

Este proyecto utiliza los siguientes repositorios y trabajos:

- [AnimeGANv2](https://github.com/bryandlee/animegan2-pytorch) por bryandlee - Implementación PyTorch de AnimeGANv2
- [face-api.js](https://github.com/justadudewhohacks/face-api.js/) por justadudewhohacks - Detección facial y de edad en el navegador

## 📝 Licencia

Este proyecto está licenciado bajo la Licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue para discutir los cambios propuestos.

## ⚠️ Notas Importantes

- Se requiere Python 3.10 específicamente debido a compatibilidad con las dependencias
- El procesamiento de imágenes puede ser intensivo en recursos
- Las imágenes procesadas se almacenan temporalmente y se limpian periódicamente
- Para mejor rendimiento, se recomienda una GPU con soporte CUDA
- La detección de edad se realiza en el cliente para mejor rendimiento y privacidad
