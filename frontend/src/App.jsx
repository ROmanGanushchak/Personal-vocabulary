import { useState } from 'react'
import GoogleAuth from './GoogleAuth'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Signup from './components/authentication/Signup'
import EmailSent from './components/authentication/EmailSent'
import Login from './components/authentication/Login'
import ResetPassword from './components/authentication/ResetPassword'
import ResetPasswordEmail from './components/authentication/ResetPasswordEmail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Signup />}/>
        <Route path='/email-sent' element={<EmailSent />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/password/reset/:token' element={<ResetPassword />}/>
        <Route path='/password/reset/get_email' element={<ResetPasswordEmail />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
