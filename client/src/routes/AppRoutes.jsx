import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import PageLoader from '../components/ui/PageLoader'
import { authService } from '../services/authService'
import Home from '../pages/Home'

/* ── Lazy Loaded Page Chunks (Secondary Routes) ── */
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Scanner = lazy(() => import('../pages/Scanner'))
const Results = lazy(() => import('../pages/Results'))
const History = lazy(() => import('../pages/History'))
const About = lazy(() => import('../pages/About'))
const HowItWorks = lazy(() => import('../pages/HowItWorks'))
const Contact = lazy(() => import('../pages/Contact'))
const SafetyTips = lazy(() => import('../pages/SafetyTips'))
const Login = lazy(() => import('../pages/Login'))
const Register = lazy(() => import('../pages/Register'))
const Profile = lazy(() => import('../pages/Profile'))
const NotFound = lazy(() => import('../pages/NotFound'))
const Pricing = lazy(() => import('../pages/Pricing'))
const Billing = lazy(() => import('../pages/Billing'))
const Settings = lazy(() => import('../pages/Settings'))

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
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span>Scan Logs & History</span>
            </div>
            <div className="auth-feature-pill">
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem', color: 'var(--primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span>Ghana Scam Alerts</span>
            </div>
          </div>

          {/* Action Button Group */}
          <div className="auth-gate-actions">
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button variant="primary" style={{ padding: '0.65rem 1.6rem', fontWeight: 800 }}>
                Sign In to Account
              </Button>
            </Link>

            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" style={{ padding: '0.65rem 1.4rem' }}>
                Create Free Account
              </Button>
            </Link>

            <button
              type="button"
              onClick={handleQuickLogin}
              className="auth-gate-demo-btn"
            >
              <span className="live-pulse-dot" style={{ background: 'var(--success)' }} />
              Quick Demo Access (Kofi Mensah)
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

export default function AppRoutes({ user, setUser, triggerAuthModal }) {
  useEffect(() => {
    // Silently pre-fetch secondary page bundles during idle time for instantaneous route transitions
    const preloadSecondaryRoutes = () => {
      import('../pages/HowItWorks')
      import('../pages/About')
      import('../pages/Contact')
      import('../pages/Login')
      import('../pages/Register')
      import('../pages/Pricing')
      import('../pages/Scanner')
      import('../pages/Dashboard')
    }

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(preloadSecondaryRoutes)
    } else {
      setTimeout(preloadSecondaryRoutes, 1000)
    }
  }, [])

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/how-it-works" element={<HowItWorks user={user} />} />
        <Route path="/about" element={<About user={user} />} />
        <Route path="/contact" element={<Contact user={user} />} />
        <Route path="/pricing" element={<Pricing user={user} setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} triggerAuthModal={triggerAuthModal} />} />
        <Route path="/register" element={<Register setUser={setUser} triggerAuthModal={triggerAuthModal} />} />

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
          path="/scanner"
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
    </Suspense>
  )
}
