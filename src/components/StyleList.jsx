import React from 'react'
import StyleCard from './StyleCard'

const styles= [

    {title:"Cyberpunk", image: "src/images/cyberpunk.png"},
    {title:"Pixar", image: "src/images/pixar.png"},
    {title:"Comic", image: "src/images/comic.png"},
    {title:"Barroco", image: "src/images/barroco.png"},
    {title:"Anime", image: "src/images/anime.png"},
    {title:"Caricatura Realista", image: "src/images/caricatura.png"},
    {title:"Retrowave", image: "src/images/retrowave.png"},
    {title:"Cartoon", image: "src/images/cartoon.png"}

]

const StyleList = () => {
  return (
    <div className='scrollbar scrollbar-thumb-black scrollbar-track-white w-full overflow-x-auto'>
      <div className='flex gap-24 whitespace-nowrap'>
        <div className="shrink-0 w-8"></div>
        {styles.map((style, index) => (
        <StyleCard key={index} title={style.title} image={style.image}/>
      ))}
      <div className="shrink-0 w-8"></div>
      </div>
    </div>
  )
}

export default StyleList
