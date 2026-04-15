import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { useEffect } from 'react'
// import { get } from 'mongoose'
import axios from 'axios'


export const ServerUrl="http://localhost:8000"




function App() {

useEffect(()=>{
  const getUser=async()=>{
    try {

      const result= await axios.get(ServerUrl + "/api/user/current-user",{withCredentials:true})
      console.log(result.data);

    } catch (error) {
      console.log(error);
    }

  }
  getUser();
  }, [])



  return (
   <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/auth' element={<Auth />} />



   </Routes>
  )
}

export default App