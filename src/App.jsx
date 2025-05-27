import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/HeaderHome'
import StyleList from './components/StyleList'
import TryButton from './components/TryButton'
import Home from './components/Home';
import UploadScreen from './components/UploadScreen';
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element = {<Home/>}/>
        <Route path='/upload' element = {<UploadScreen/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
