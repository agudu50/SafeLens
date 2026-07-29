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

function ProtectedRoute({ user, setUser, children, title = 'Account Required for Feature Access' }) {
  if (!user) {
    const handleQuickLogin = () => {
      const demoUser = authService.login({ email: 'kofi@example.com', password: 'password123' })
      setUser(demoUser)
    }

    return (
      <PageContainer>
        <section className="scanner-card auth-gate-card animate-fade-in">
          {/* Animated Lock Shield Badge Icon */}
          <div className="auth-gate-icon-wrapper">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '2.4rem', height: '2.4rem', color: 'var(--primary)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>

          <div style={{ marginBottom: '0.6rem' }}>
            <Badge tone="medium">
              <span className="live-pulse-dot" style={{ background: 'var(--warning)', marginRight: '0.35rem' }} />
              AUTHENTICATION GATEWAY
            </Badge>
          </div>
          
          <h2 className="auth-gate-title">{title}</h2>
          <p className="auth-gate-desc">
            To access SafeLens AI threat scanning, review saved detection logs, and receive real-time scam warnings, please sign in or register for a free account.
          </p>

          {/* Key Unlocked Features Grid */}
          <div className="auth-gate-features-grid">
            <div className="auth-feature-pill">
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem', color: 'var(--primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span>Instant AI Scanning</span>
            </div>
            <div className="auth-feature-pill">
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem', color: 'var(--primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Personal Scan Logs</span>
            </div>
            <div className="auth-feature-pill">
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem', color: 'var(--primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zM12 3v18m-9-9h18" />
              </svg>
              <span>Ghana CSA Hotline Direct</span>
            </div>
          </div>

          <div className="auth-gate-actions">
            <Button as={Link} to="/login" variant="primary" style={{ justifyContent: 'center', width: '100%', gap: '0.5rem' }}>
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H2.25" />
              </svg>
              Sign In to Your Account
            </Button>
            <Button as={Link} to="/register" variant="secondary" style={{ justifyContent: 'center', width: '100%', gap: '0.5rem' }}>
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
              Create Free Account
            </Button>
            
            <div style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', width: '100%' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'block', marginBottom: '0.4rem' }}>
                Want to explore immediately without entering credentials?
              </span>
              <button
                type="button"
                className="auth-demo-btn"
                onClick={handleQuickLogin}
              >
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem', color: 'var(--primary)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                <span>Quick Demo Login (Kofi Mensah)</span>
              </button>
            </div>
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
