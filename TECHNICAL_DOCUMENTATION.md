# Documentación Técnica - Avatar Lab

## 📋 Índice
1. [Arquitectura General](#arquitectura-general)
2. [Frontend](#frontend)
3. [Backend](#backend)
4. [Modelos de IA](#modelos-de-ia)
5. [Flujo de Datos](#flujo-de-datos)
6. [APIs y Servicios](#apis-y-servicios)

## 🏗️ Arquitectura General

El proyecto sigue una arquitectura de microservicios, donde cada componente principal opera de manera independiente:

```
[Frontend (React/Vite)] ←→ [API Gateway]
           ↓
[Servidor AnimeGAN] [Face-API.js (Cliente)]
           ↓
[Modelos de IA y Procesamiento]
```

Cada servicio se ejecuta en su propio puerto:
- Frontend: Puerto 5173
- AnimeGAN API: Puerto 8000
- Face-API.js: Ejecutado en el cliente (browser)

## 💻 Frontend

### Tecnologías Utilizadas
- React + Vite
- TailwindCSS para estilos
- React Router para navegación
- Axios para peticiones HTTP
- Face-API.js para detección facial y análisis de edad

### Componentes Principales
1. **Uploader Component**
   - Maneja la carga de imágenes
   - Implementa drag & drop
   - Realiza validaciones de formato y tamaño

2. **Image Processing Component**
   - Muestra vista previa lado a lado
   - Controles de estilo y parámetros
   - Gestión de estado de procesamiento
   - Integración con Face-API.js para análisis facial

3. **Results Gallery**
   - Almacenamiento temporal de resultados
   - Opciones de descarga
   - Comparación de estilos

## ⚙️ Backend

### AnimeGAN Service
- Implementado con FastAPI
- Utiliza PyTorch para inferencia
- Endpoints:
  - `/transform`: Procesa imagen con estilo anime
  - `/models`: Lista modelos disponibles
  - `/health`: Estado del servicio

### Face Detection (Cliente)
- Implementado con Face-API.js
- Ejecutado completamente en el navegador
- Funcionalidades:
  - Detección facial en tiempo real
  - Estimación de edad
  - Análisis de expresiones faciales

## 🤖 Modelos de IA

### AnimeGANv2
- **Arquitectura**: Basada en CycleGAN con modificaciones
- **Características**:
  - Preservación de detalles faciales
  - Múltiples estilos de anime
  - Procesamiento en tiempo real
- **Modelos Pre-entrenados**:
  - face_paint_512_v1
  - face_paint_512_v2
  - paprika
  - celeba_distill

### Face-API.js
- **Características**:
  - Detección facial en el navegador
  - Estimación de edad y género
  - Detección de puntos faciales
  - Análisis de expresiones
- **Modelos Base**:
  - SSD MobileNet v1
  - Tiny Face Detector
  - Modelos pre-entrenados para edad y expresiones

## 🔄 Flujo de Datos

1. **Carga y Análisis de Imagen**
   ```
   Usuario → Frontend → Face-API.js → Análisis Facial
                    → Validación → Almacenamiento Temporal
   ```

2. **Procesamiento Artístico**
   ```
   Frontend → API Gateway → AnimeGAN → Modelo IA → Resultado
   ```

3. **Resultado**
   ```
   Modelo → Procesamiento Post → Frontend → Visualización
   ```

## 🔌 APIs y Servicios

### API Gateway
- Gestión de rutas
- Load balancing
- Manejo de errores
- Logging y monitoreo

### Endpoints Principales

#### AnimeGAN API
```python
POST /transform
- Input: Imagen (multipart/form-data)
- Output: Imagen procesada
- Parámetros: modelo, intensidad

GET /models
- Output: Lista de modelos disponibles
```

#### Face-API.js (Cliente)
```javascript
// Inicialización y carga de modelos
await faceapi.loadSsdMobilenetv1Model('/models')
await faceapi.loadAgeGenderModel('/models')
await faceapi.loadFaceExpressionModel('/models')

// Detección y análisis
const detections = await faceapi.detectAllFaces(image)
    .withAgeAndGender()
    .withFaceExpressions()
```

## 🔒 Seguridad y Optimización

### Seguridad
- Validación de tipos MIME
- Límites de tamaño de archivo
- Sanitización de entradas
- Headers de seguridad

### Optimización
- Caché de resultados
- Compresión de imágenes
- Procesamiento por lotes
- Limpieza automática de archivos temporales
- Carga asíncrona de modelos Face-API.js

## 📊 Monitoreo y Logging

- Logs estructurados
- Métricas de rendimiento
- Alertas de errores
- Dashboard de estado

## 🚀 Escalabilidad

El sistema está diseñado para escalar horizontalmente:
- Contenedores independientes
- Balanceo de carga
- Caché distribuida
- Procesamiento asíncrono
- Análisis facial en el cliente para reducir carga del servidor

## 🔍 Debugging y Desarrollo

### Herramientas de Desarrollo
- React Developer Tools
- Python Debugger
- TensorBoard para modelos
- Postman para APIs
- Chrome DevTools para Face-API.js

### Entorno de Desarrollo
- Hot Reload
- Entorno virtual Python
- Variables de entorno
- Scripts de desarrollo 