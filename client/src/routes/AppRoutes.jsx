import { Routes, Route, Link } from 'react-router-dom'
import Home from '../pages/Home'
import Scanner from '../pages/Scanner'
import Results from '../pages/Results'
import History from '../pages/History'
import About from '../pages/About'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Profile from '../pages/Profile'
import NotFound from '../pages/NotFound'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { authService } from '../services/authService'

function ProtectedRoute({ user, setUser, children, title = 'Authentication Required' }) {
  if (!user) {
    const handleQuickLogin = () => {
      const demoUser = authService.login({ email: 'kofi@example.com', password: 'password123' })
      setUser(demoUser)
    }

    return (
      <PageContainer>
        <section className="scanner-card animate-fade-in" style={{ maxWidth: '540px', margin: '3rem auto', textAlign: 'center', padding: '2.5rem 2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <Badge tone="medium">
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem', marginRight: '0.35rem', color: 'var(--warning)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              ACCOUNT REQUIRED
            </Badge>
          </div>
          
          <h2 style={{ fontSize: '1.6rem', margin: '0 0 0.6rem 0', color: 'var(--text)' }}>{title}</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.55, marginBottom: '1.8rem' }}>
            To access SafeLens threat scanning, review scam detection logs, and manage your account features, please sign in or register for a free account.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%', maxWidth: '320px', margin: '0 auto' }}>
            <Button as={Link} to="/login" variant="primary" style={{ justifyContent: 'center' }}>
              Sign In to Your Account
            </Button>
            <Button as={Link} to="/register" variant="secondary" style={{ justifyContent: 'center' }}>
              Create Free Account
            </Button>
            
            <button
              type="button"
              className="preset-sample-btn"
              onClick={handleQuickLogin}
              style={{ marginTop: '0.6rem', padding: '0.45rem 0.8rem', fontSize: '0.8rem' }}
            >
              ⚡ Quick Demo Login (Kofi Mensah)
            </button>
          </div>
        </section>
      </PageContainer>
    )
  }
  return children
}

export default function AppRoutes({ user, setUser }) {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route path="/register" element={<Register setUser={setUser} />} />

      {/* Protected Features (Accessible if user has an account) */}
      <Route
        path="/scan"
        element={
          <ProtectedRoute user={user} setUser={setUser} title="Account Required for Message Scanning">
            <Scanner user={user} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/results/:id"
        element={
          <ProtectedRoute user={user} setUser={setUser} title="Account Required to View Scan Results">
            <Results user={user} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute user={user} setUser={setUser} title="Account Required for Scan Logs">
            <History user={user} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute user={user} setUser={setUser} title="Account Required for Profile Management">
            <Profile user={user} setUser={setUser} />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
