import React from 'react'

const TryButton = ({text, bg, onClick}) => {
  return (
    <button className={`${bg} text-black px-4 py-2 rounded-md mt-4 hover:bg-gray-300`} onClick={onClick}>
      {text}
    </button>
  )
}

export default TryButton
