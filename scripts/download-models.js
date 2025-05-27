import fs from 'fs'
import https from 'https'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const MODELS_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights'
const MODELS_DIR = path.join(__dirname, '..', 'public', 'models')

// Lista de modelos necesarios
const MODELS = [
  'ssd_mobilenetv1_model-shard1',
  'ssd_mobilenetv1_model-shard2',
  'ssd_mobilenetv1_model-weights_manifest.json',
  'face_landmark_68_model-shard1',
  'face_landmark_68_model-weights_manifest.json',
  'age_gender_model-shard1',
  'age_gender_model-weights_manifest.json',
  'face_recognition_model-shard1',
  'face_recognition_model-shard2',
  'face_recognition_model-weights_manifest.json'
]

// Crear directorio si no existe
if (!fs.existsSync(MODELS_DIR)) {
  fs.mkdirSync(MODELS_DIR, { recursive: true })
}

// Función para descargar un archivo
function downloadFile(filename) {
  const url = `${MODELS_URL}/${filename}`
  const filePath = path.join(MODELS_DIR, filename)

  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(filePath)
        response.pipe(file)
        file.on('finish', () => {
          file.close()
          console.log(`Descargado: ${filename}`)
          resolve()
        })
      } else {
        reject(new Error(`Error al descargar ${filename}: ${response.statusCode}`))
      }
    }).on('error', (err) => {
      reject(err)
    })
  })
}

// Descargar todos los modelos
async function downloadModels() {
  try {
    await Promise.all(MODELS.map(model => downloadFile(model)))
    console.log('Todos los modelos han sido descargados exitosamente')
  } catch (error) {
    console.error('Error al descargar los modelos:', error)
  }
}

downloadModels() 