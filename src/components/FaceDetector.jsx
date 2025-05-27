import React, { useEffect, useRef, useState } from 'react'
import * as faceapi from 'face-api.js'

const getStyleForAge = (age) => {
  if (age === null) return null
  if (age < 30) return 'face_paint_512_v2'
  if (age > 60) return 'paprika'
  return 'celeba'
}

const FaceDetector = ({ imageUrl, onAgeDetected, onStyleSelected }) => {
  const imageRef = useRef()
  const [isModelLoading, setIsModelLoading] = useState(true)

  // Función para cargar modelos
  const loadModels = async () => {
    try {
      setIsModelLoading(true)
      
      // Usar modelos locales
      const MODEL_URL = '/models'
      
      // Cargar solo los modelos necesarios
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
      console.log('Tiny Face Detector cargado')
      
      await faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL)
      console.log('Age Gender Net cargado')
      
      setIsModelLoading(false)
      console.log('Todos los modelos cargados exitosamente')
    } catch (error) {
      console.error('Error al cargar los modelos:', error)
      setIsModelLoading(true)
    }
  }

  // Cargar modelos al montar el componente
  useEffect(() => {
    loadModels()
  }, [])

  // Función para detectar edad y seleccionar estilo
  const detectAge = async (imgElement) => {
    try {
      if (isModelLoading) {
        console.log('Los modelos aún se están cargando...')
        return
      }

      // Verificar que los modelos necesarios estén cargados
      if (!faceapi.nets.tinyFaceDetector.isLoaded || 
          !faceapi.nets.ageGenderNet.isLoaded) {
        console.log('Algunos modelos no están cargados, intentando recargar...')
        await loadModels()
        return
      }

      // Configuración del detector
      const options = new faceapi.TinyFaceDetectorOptions({
        inputSize: 512,
        scoreThreshold: 0.5
      })

      // Realizar detección
      const detections = await faceapi
        .detectAllFaces(imgElement, options)
        .withAgeAndGender()

      if (detections && detections.length > 0) {
        const age = Math.round(detections[0].age)
        console.log('Edad detectada:', age)
        
        // Determinar el estilo basado en la edad
        const style = getStyleForAge(age)
        console.log('Estilo seleccionado:', style)
        
        // Notificar la edad y el estilo
        onAgeDetected(age)
        onStyleSelected(style)
      } else {
        console.warn('No se detectaron rostros en la imagen')
        onAgeDetected(null)
        onStyleSelected(null)
      }
    } catch (error) {
      console.error('Error al detectar la edad:', error)
      onAgeDetected(null)
      onStyleSelected(null)
    }
  }

  // Efecto para procesar la imagen cuando cambia la URL
  useEffect(() => {
    if (!imageUrl) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = imageUrl
    img.onload = async () => {
      if (imageRef.current) {
        imageRef.current.src = imageUrl
        await detectAge(imageRef.current)
      }
    }
    img.onerror = (error) => {
      console.error('Error al cargar la imagen:', error)
      onAgeDetected(null)
      onStyleSelected(null)
    }
  }, [imageUrl, isModelLoading])

  return (
    <div style={{ display: 'none' }}>
      <img 
        ref={imageRef}
        alt="face detection"
        crossOrigin="anonymous"
        onError={(e) => console.error('Error en elemento img:', e)}
      />
    </div>
  )
}

export default FaceDetector 