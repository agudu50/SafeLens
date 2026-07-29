import { useState, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import AppRoutes from './routes/AppRoutes'
import { authService } from './services/authService'

function App() {
  const [user, setUser] = useState(() => authService.getCurrentUser())
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('safelens_theme')
      if (stored) return stored
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem('safelens_theme', theme)
    } catch (e) {
      console.error('Failed to save theme settings to localStorage', e)
    }
  }, [theme])

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar user={user} setUser={setUser} theme={theme} setTheme={setTheme} />
        <main className="main-content">
          <AppRoutes user={user} setUser={setUser} />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
