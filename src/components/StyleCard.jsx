import React, {useState} from 'react'
import './css/StyleCard.css'

const StyleCard = ({title, image}) => {
  const [hovered, setHovered] = useState(false)
  const handleMouseEnter = ()=>{
    setHovered(true)
  }
  const handleMouseLeave = () =>{
    setHovered(false)
  }
  const hoverClass = hovered ? 'hovered':'unhovered'
  const titleStateClass = hovered ? 'hidden': 'showing'
  const descStateClass = hovered ? 'visible': 'occult'

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className= {`${hoverClass} flex-shrink-0 flex-col text-center items-center px-4 h-[400px] w-[250px]`}>
        <img src={image} alt={title} className='h-5/6 w-full rounded-md object-cover' />
        <p className={`${titleStateClass} mt-2 text-2xl`}>{title}</p>
        <p className={`${descStateClass} mt-2 text-2xl`}> Texto xddd </p>
    </div>
  )
}

export default StyleCard
