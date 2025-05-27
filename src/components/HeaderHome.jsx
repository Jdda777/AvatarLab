import React from 'react'

const HeaderHome = ({descripcion, titulo}) => {
  return (
    <header className='text-center items-center my-6'>
      <h1 className='text-8xl font-bold'>AVATARLAB</h1>
      <p className='text_lg mt_2 py-2'>{descripcion}</p>
      <hr className='my-4 w-4/5 mx-auto border-gray py-1' />
      <h2 className='text-3xl font-semibold'>{titulo}</h2>
    </header>
  )
}

export default HeaderHome
