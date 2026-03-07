import './App.css'
import Register from './pages/Register'
import { Routes, Route } from 'react-router-dom';
import {Toaster} from 'react-hot-toast'
import Login from './pages/Login';

function App() {

  return (
    <>
    <Toaster position='top-right'/>
    {/* <Register/> */}
    <Login/>
    
    </>
  )
}

export default App