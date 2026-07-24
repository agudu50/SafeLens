import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Scanner from '../pages/Scanner'
import Results from '../pages/Results'
import History from '../pages/History'
import About from '../pages/About'
import NotFound from '../pages/NotFound'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/scan" element={<Scanner />} />
      <Route path="/results/:id" element={<Results />} />
      <Route path="/history" element={<History />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
