import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import DashBoard from './pages/DashBoard';
import Projects from './pages/Projects'
import Header from './components/Header';
import Footerr from './components/Footerr';


const App = () => {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route exact path='/' element={<Home/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/sign-in' element={<SignIn/>}/>
        <Route path='/sign-up' element={<SignUp/>}/>
        <Route path='/projects' element={<Projects/>}/>
        <Route path='/dashBoard' element={<DashBoard/>}/>
      </Routes>
      <Footerr/>
    </BrowserRouter>
  )
}

export default App