import React from 'react'
import { useState, useEffect } from 'react'
import HeaderHome from './HeaderHome'
import TryButton from './TryButton'
import ResultCard from './ResultCard'
import StyleModal from './StyleModal'
import { useNavigate } from 'react-router-dom'
import * as faceapi from 'face-api.js'

const UploadScreen = () => {
  const [image, setImage] = useState(null)
  const [style, setStyle] = useState(null)
  const [text, setText] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState(null)
  const [results, setResults] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState(null)
  const navigate = useNavigate()
  const [detectedAge, setDetectedAge] = useState(null)
  const [modelsLoaded, setModelsLoaded] = useState(false)

  useEffect(() => {
    const loadModels = async () => {
      try {
        setModelsLoaded(false)
        console.log('Iniciando carga de modelos...')
        
        // Usar modelos locales
        const MODEL_URL = '/models'
        
        // Cargar los modelos necesarios
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL)
        ])
        
        console.log('Modelos cargados exitosamente')
        setModelsLoaded(true)
      } catch (error) {
        console.error('Error cargando modelos:', error)
        setError('Error cargando modelos de detección facial')
        setModelsLoaded(false)
      }
    }
    loadModels()
  }, [])

  const detectAge = async (imageElement) => {
    try {
      if (!modelsLoaded) {
        console.log('Los modelos aún se están cargando...')
        return null
      }

      // Verificar que los modelos necesarios estén cargados
      if (!faceapi.nets.tinyFaceDetector.isLoaded || 
          !faceapi.nets.ageGenderNet.isLoaded) {
        console.log('Algunos modelos no están cargados, intentando recargar...')
        await loadModels()
        return null
      }

      const options = new faceapi.TinyFaceDetectorOptions({
        inputSize: 512,
        scoreThreshold: 0.5
      })

      const detections = await faceapi
        .detectAllFaces(imageElement, options)
        .withAgeAndGender()

      if (detections && detections.length > 0) {
        const age = Math.round(detections[0].age)
        console.log('Edad detectada:', age)
        return age
      }
      console.warn('No se detectaron rostros en la imagen')
      return null
    } catch (error) {
      console.error('Error detectando edad:', error)
      return null
    }
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        setImage(file)
        setError(null)
      } else {
        setError('Por favor, sube solo archivos de imagen')
      }
    }
  }

  const handleFileInput = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setImage(file)
      setError(null)
    } else {
      setError('Por favor, sube solo archivos de imagen')
    }
  }

  const handleRemoveImage = () => {
    setImage(null)
    setError(null)
  }

  const processImage = async () => {
    if (!image || !modelsLoaded) return
    
    try {
      setIsLoading(true)
      setError(null)

      // Detectar edad usando face-api.js
      const img = document.createElement('img')
      img.src = URL.createObjectURL(image)
      await new Promise((resolve) => {
        img.onload = resolve
      })

      const age = await detectAge(img)
      if (!age) {
        throw new Error('No se pudo detectar un rostro en la imagen')
      }
      setDetectedAge(age)
      
      // Seleccionar el modelo basado en la edad
      let modelName;
      let styleTitle;
      
      if (age < 15) {
        modelName = 'face_paint_512_v2';
        styleTitle = 'Estilo Cartoon';
      } else if (age < 30) {
        modelName = 'face_paint_512_v1';
        styleTitle = 'Estilo Anime';
      } else {
        modelName = 'paprika';
        styleTitle = 'Estilo Artístico';
      }

      console.log('Edad detectada:', age, 'usando modelo:', modelName);

      // Procesar la imagen con el modelo seleccionado
      const formData = new FormData()
      formData.append('file', image)

      const response = await fetch(`http://localhost:8000/process/${modelName}`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Error al procesar la imagen: ${response.status}\n${errorText}`)
      }

      const processedImageBlob = await response.blob()
      const processedImageUrl = URL.createObjectURL(processedImageBlob)

      setResults([
        {
          id: 1,
          title: styleTitle,
          age: age,
          image: processedImageUrl
        }
      ])
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAgeDetected = (age) => {
    if (age === null) {
      setError('No se pudo detectar un rostro en la imagen')
      return
    }
    console.log('Edad detectada:', age)
    setDetectedAge(age)
    setError(null)
  }

  const handleStyleClick = (style) => {
    if (!style.image) return // No abrir el modal si no hay imagen
    setSelectedStyle(style)
    setModalOpen(true)
  }

  const handleDiscardStyle = () => {
    setResults(results.filter(r => r.id !== selectedStyle.id))
    setModalOpen(false)
    setSelectedStyle(null)
  }

  const handleDownloadStyle = () => {
    // Crear un enlace temporal para descargar la imagen
    const link = document.createElement('a')
    link.href = selectedStyle.image
    link.download = `${selectedStyle.title.toLowerCase()}_style.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div>
      <div className='bg-black text-white min-h-screen flex flex-col items-center justify-center'>
        <HeaderHome descripcion={"Inserta tu imagen, nuestra inteligencia la procesará y te recomendará los mejores estilos para tí"} titulo={"Tu imagen"}/>
        <div className='w-full max-w-6xl px-8'>
          <div className='flex justify-between items-center mb-8'>
            {/* Área principal de carga de imagen */}
            <div className='flex-shrink-0'>
              {image ? (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="w-96 h-96 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-lg">
                    <button
                      onClick={handleRemoveImage}
                      className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md mr-2"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => document.getElementById('fileInput').click()}
                      className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md"
                    >
                      Cambiar
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={`w-96 h-96 border-4 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    isDragging ? 'border-blue-500 bg-blue-50 bg-opacity-10' : 'border-gray-400'
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-400 text-center">
                    Arrastra y suelta tu imagen aquí<br/>o haz clic para seleccionar
                  </p>
                </div>
              )}
              <input
                type="file"
                id="fileInput"
                className="hidden"
                accept="image/*"
                onChange={handleFileInput}
              />
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>

            {/* Botón central */}
            <button 
              className={`${
                isLoading 
                  ? 'bg-gray-500 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white rounded-full p-3 transform transition-all ${
                !isLoading && 'hover:scale-110'
              }`}
              onClick={processImage}
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
            </button>

            {/* Área de resultados */}
            <div className='flex-shrink-0 w-96'>
              <div className="flex space-x-4">
                {results.length > 0 ? (
                  results.map((result) => (
                    <div
                      key={result.id}
                      className="flex-1 transform transition-transform hover:scale-105 cursor-pointer"
                      onClick={() => handleStyleClick(result)}
                    >
                      <div className="border-4 border-dashed border-gray-400 rounded-lg p-4 flex flex-col items-center justify-between h-96">
                        <img
                          src={result.image}
                          alt={result.title}
                          className="w-full h-[85%] object-cover rounded-lg"
                        />
                        <div className="text-center mt-2">
                          <p className="text-white font-semibold text-lg">
                            {result.title}
                          </p>
                          {result.age && (
                            <p className="text-gray-400 text-sm">
                              Edad detectada: {result.age} años
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div 
                    className="w-96 h-96 border-4 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center p-6"
                  >
                    <div className="flex flex-col items-center space-y-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div className="text-center space-y-3">
                        <p className="text-gray-400 text-lg font-medium">
                          Tu imagen en estilo Anime, Cartoon o Artístico
                        </p>
                        <p className="text-gray-500 text-sm">
                          aparecerá aquí según tu edad
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de estilo */}
      {modalOpen && selectedStyle && (
        <StyleModal
          style={selectedStyle}
          onClose={() => {
            setModalOpen(false)
            setSelectedStyle(null)
          }}
          onDiscard={handleDiscardStyle}
          onDownload={handleDownloadStyle}
        />
      )}
    </div>
  )
}

export default UploadScreen