import { useState, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import AppRoutes from './routes/AppRoutes'
import BackgroundAnimation from './components/layout/BackgroundAnimation'
import AuthToastModal from './components/ui/AuthToastModal'
import { authService } from './services/authService'

function App() {
  const [user, setUser] = useState(() => authService.getCurrentUser())
  const [authModal, setAuthModal] = useState(null)
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

  const triggerAuthModal = (modalConfig) => {
    setAuthModal(modalConfig)
  }

  return (
    <BrowserRouter>
      <div className="app-shell">
        <BackgroundAnimation />
        <AuthToastModal modal={authModal} onClose={() => setAuthModal(null)} />
        <Navbar user={user} setUser={setUser} theme={theme} setTheme={setTheme} triggerAuthModal={triggerAuthModal} />
        <main className="main-content">
          <AppRoutes user={user} setUser={setUser} triggerAuthModal={triggerAuthModal} />
        </main>
        <Footer user={user} />
      </div>
    </BrowserRouter>
  )
}

export default App
