import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Scanner from '../pages/Scanner'
import Results from '../pages/Results'
import History from '../pages/History'
import About from '../pages/About'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Profile from '../pages/Profile'
import NotFound from '../pages/NotFound'

export default function AppRoutes({ user, setUser }) {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/scan" element={<Scanner />} />
      <Route path="/results/:id" element={<Results />} />
      <Route path="/history" element={<History />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route path="/register" element={<Register setUser={setUser} />} />
      <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
