import { Route, Routes } from 'react-router-dom'
import './App.css'
import Authlayout from './components/auth/layout'
import AuthLogin from './pages/auth/login'
import AuthRegister from './pages/auth/register'
import SubjectPage from './pages/auth/main/subject'
import ChapterPage from './pages/auth/main/chapters'
import NotesPage from './pages/auth/main/notes'
import NotFound from './pages/auth/not-found'
import MainLayout from './components/main/mainlayout'
import CheckAuth from './components/common/checkAuth'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { checkAuth } from './../store/auth-slice/index'

function App() {

const {isAuthenticated ,user, isLoading}= useSelector(state=> state.auth)
const dispatch = useDispatch();

useEffect(() => {
  dispatch (checkAuth());
}, [dispatch]);

if (isLoading) {
  return <div>Loading...</div>
}

  return (
    <>
    <Routes>
      <Route path="/auth" element={
        <CheckAuth isAuthenticated={isAuthenticated} user={user} >
        <Authlayout/>
        </CheckAuth>
        } >
      <Route path="login" element={<AuthLogin/>} />
      <Route path="register" element={<AuthRegister/>} />
      </Route>
      <Route path="/dashboard" element={
        <CheckAuth isAuthenticated={isAuthenticated} user={user}>
        <MainLayout />
        </CheckAuth>
        
        }>
  <Route path="subject" element={<SubjectPage />} />
  <Route path="chapter/:subjectId" element={<ChapterPage />} />
  <Route path="notes" element={<NotesPage />} />
</Route>
      <Route path="*" element={<NotFound/>}> </Route>
   
    </Routes>
      
    </>
     
  )
}

export default App
