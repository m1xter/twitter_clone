import { useState } from 'react'
import {Route,Routes} from "react-router-dom"
import HomePage from './pages/home/HomePage'
import LoginPage from './pages/auth/login/LoginPage'
import SingupPage from './pages/auth/Singup/SingupPage'
import Sidebar from './components/common/Sidebar'
import RightPanel from './components/common/RightPanel'
import NotificationPage from './pages/notifications/NotificationPage'
import ProfilePage from './pages/profile/ProfilePage'
function App() {
  const [count, setCount] = useState(0)

  return (
      <div className='flex max-w-6xl mx-auto'>
        <Sidebar/>
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/singup' element={<SingupPage/>}/>
          <Route path='/notifications' element={<NotificationPage/>}/>
          <Route path='/profile/:usermane' element={<ProfilePage/>}/>
          
        </Routes>
        <RightPanel/>
      </div>
  )
}

export default App
