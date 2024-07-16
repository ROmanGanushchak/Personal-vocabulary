import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './components/authentication/Signup'
import EmailSent from './components/authentication/EmailSent'
import Login from './components/authentication/Login'
import ResetPassword from './components/authentication/ResetPassword'
import ResetPasswordEmail from './components/authentication/ResetPasswordEmail'
import LogOutBtn from './components/authentication/LogOutBtn'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/logout' element={<LogOutBtn />}/>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/email-sent' element={<EmailSent />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/password/reset/:token' element={<ResetPassword />}/>
        <Route path='/password/reset/get_email' element={<ResetPasswordEmail />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
