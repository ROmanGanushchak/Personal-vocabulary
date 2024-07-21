import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './components/authentication/Signup'
import EmailSent from './components/authentication/EmailSent'
import Login from './components/authentication/Login'
import ResetPassword from './components/authentication/ResetPassword'
import ResetPasswordEmail from './components/authentication/ResetPasswordEmail'
import LogOutBtn from './components/authentication/LogOutBtn'
import TranslateMenu from './components/Tranlations/TranslateMenu'
import { AuthProvider } from './context/auth/useAuthContext'
import { ApiProvider } from './context/auth/useApiContext'
import GuardedComponent from './components/GuardedComponent'
import DictList from './components/dictionary/dictionaryList/DictList'
import { DictionaryContextProvider } from './context/useDictionary'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider children={
        <ApiProvider children={
          <DictionaryContextProvider children={
            <Routes>
              <Route path='/logout' element={<LogOutBtn />}/>
              <Route path='/signup' element={<Signup />}/>
              <Route path='/email-sent' element={<EmailSent />}/>
              <Route path='/login' element={<Login />}/>
              <Route path='/password/reset/:token' element={<ResetPassword />}/>
              <Route path='/password/reset/get_email' element={<ResetPasswordEmail />}/>
              
              <Route element={<GuardedComponent />}>
                  <Route path='/dictionaries' element={<DictList />}/>
                  <Route path='/' element={<TranslateMenu />}/>
              </Route> 
            </Routes>
          }></DictionaryContextProvider>
        }></ApiProvider>
      } />
    </BrowserRouter>
  )
};

export default App;
