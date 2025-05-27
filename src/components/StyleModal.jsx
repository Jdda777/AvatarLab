import React from 'react'

const StyleModal = ({ style, onClose, onDiscard, onDownload }) => {
  if (!style) return null

  const descriptions = {
    "Estilo Artístico": "Un estilo artístico con trazos suaves y colores cálidos, ideal para resaltar la madurez y personalidad.",
    "Estilo Cartoon": "Un estilo más caricaturesco y divertido, perfecto para capturar la energía y alegría de los más jóvenes.",
    "Estilo Anime": "Un estilo anime balanceado, que combina elementos realistas con toques de animación japonesa."
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 relative">
        {/* Botón de cerrar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Contenido */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Imagen */}
          <div className="flex-shrink-0">
            <img 
              src={style.image} 
              alt={style.title} 
              className="w-72 h-72 object-cover rounded-lg"
            />
          </div>

          {/* Información */}
          <div className="flex flex-col justify-between text-black">
            <div>
              <h2 className="text-2xl font-bold mb-4">{style.title}</h2>
              <p className="text-gray-600 mb-6">
                {style.description || descriptions[style.title] || "Transformación personalizada basada en tu imagen."}
              </p>
              {style.age && (
                <p className="text-gray-600 mb-6">
                  Edad detectada: {style.age} años
                </p>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-4">
              <button
                onClick={onDownload}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Descargar Imagen
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StyleModal 