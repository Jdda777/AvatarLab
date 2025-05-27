import React from 'react'

const ResultCard = ({ image, title, isSelected, onClick }) => {
  return (
    <div
      className={`w-48 h-48 border-2 rounded-lg cursor-pointer transition-all overflow-hidden relative ${
        isSelected ? 'border-blue-500 border-4' : 'border-gray-400 hover:border-blue-500'
      }`}
      onClick={onClick}
    >
      {image ? (
        <>
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
            <p className="text-white text-center text-sm truncate">
              {title}
            </p>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-gray-400 text-center p-4">
            Procesando...
          </p>
        </div>
      )}
    </div>
  )
}

export default ResultCard

