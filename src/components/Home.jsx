import React from 'react'
import HeaderHome from './HeaderHome'
import StyleList from './StyleList'
import TryButton from './TryButton'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  return (
      <div className='bg-black text-white min-h-screen flex flex-col items-center justify-center'>
        <HeaderHome descripcion={"Convierte tu imagen en un avatar 2D con los mejores estilos de forma sencilla y rápida"} titulo={"Estilos Disponibles"}/>
        <StyleList/>
        <TryButton text={"Prueba Ahora"} bg={'bg-white'} onClick={() => navigate('/upload')}/>
      </div>
  )
}

export default Home
