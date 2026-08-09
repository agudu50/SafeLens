import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import Dashboard from '../pages/Dashboard'
import Scanner from '../pages/Scanner'
import Results from '../pages/Results'
import History from '../pages/History'
import About from '../pages/About'
import SafetyTips from '../pages/SafetyTips'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Profile from '../pages/Profile'
import NotFound from '../pages/NotFound'
import Pricing from '../pages/Pricing'
import Billing from '../pages/Billing'
import Settings from '../pages/Settings'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { authService } from '../services/authService'

function ProtectedRoute({ user, setUser, children, title = 'Account Required for Feature Access' }) {
  const navigate = useNavigate()

  if (!user) {
    const handleQuickLogin = () => {
      const demoUser = authService.login({ email: 'kofi@example.com', password: 'password123' })
      setUser(demoUser)
      navigate('/pricing?selectPlan=true')
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span>Live MoMo Fraud Alerts</span>
            </div>
          </div>

          <div className="auth-gate-actions">
            <Link to="/login" className="button-primary auth-btn-full" style={{ textDecoration: 'none', textAlign: 'center' }}>
              Sign In with Email
            </Link>
          </div>

          <div style={{ marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'block', marginBottom: '0.5rem' }}>
              Want to test the platform instantly?
            </span>
            <button
              onClick={handleQuickLogin}
              type="button"
              style={{
                background: 'rgba(56, 189, 248, 0.1)',
                color: 'var(--primary)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                padding: '0.45rem 1rem',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              ⚡ Instant Demo Account Access (Kofi Mensah)
            </button>
          </div>
        </section>
      </PageContainer>
    )
  }

  // If user is logged in but has not chosen a plan yet, redirect to plan selection page
  if (user && !user.hasSelectedPlan) {
    return <Navigate to="/pricing?selectPlan=true" replace />
  }

  return children
}

export default function AppRoutes({ user, setUser }) {
  return (
    <Routes>
      <Route path="/" element={<Home user={user} />} />
      <Route path="/about" element={<About user={user} />} />
      <Route path="/pricing" element={<Pricing user={user} setUser={setUser} />} />
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route path="/register" element={<Register setUser={setUser} />} />

      {/* Protected Features (Accessible if user has an account) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute user={user} setUser={setUser} title="Account Required for Security Dashboard">
            <Dashboard user={user} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/scan"
        element={
          <ProtectedRoute user={user} setUser={setUser} title="Account Required for Message Scanning">
            <Scanner user={user} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/safety-tips"
        element={
          <ProtectedRoute user={user} setUser={setUser} title="Account Required for Ghana Safety Tips & Self-Defense">
            <SafetyTips user={user} />
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
        path="/billing"
        element={
          <ProtectedRoute user={user} setUser={setUser} title="Account Required for Billing">
            <Billing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute user={user} setUser={setUser} title="Account Required for Settings">
            <Settings />
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
