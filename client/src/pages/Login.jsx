import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import { authService } from '../services/authService'

export default function Login({ setUser }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password fields.')
      return
    }

    setError('')
    setIsLoading(true)

    setTimeout(() => {
      try {
        const loggedUser = authService.login({ email: email.trim(), password })
        setUser(loggedUser)
        setIsLoading(false)
        // Redirect user to the plan selection page immediately after login so they choose their protection plan
        navigate('/pricing?selectPlan=true')
      } catch (err) {
        setError(err.message || 'Failed to authenticate. Please check your credentials.')
        setIsLoading(false)
      }
    }, 600)
  }

  const handleQuickDemoLogin = () => {
    setError('')
    setIsLoading(true)
    setTimeout(() => {
      const demoUser = authService.login({ email: 'kofi@example.com', password: 'password123' })
      setUser(demoUser)
      setIsLoading(false)
      // Redirect demo user to plan selection page upon login
      navigate('/pricing?selectPlan=true')
    }, 400)
  }

  return (
    /* Full Screen Fixed Viewport Container covering 100% of screen width and height from corner (0,0) to corner (100vw, 100vh) */
    <div 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0,
        bottom: 0,
        width: '100vw', 
        height: '100vh', 
        zIndex: 9999, 
        background: 'var(--background)',
        overflowY: 'auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'
      }}
    >
      {/* Left Column: Full Screen Desktop 3D Graphic Image & Brand Security Showcase */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, rgba(230, 60, 28, 0.08), var(--surface-alt))', 
          padding: '3.2rem 3rem', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          borderRight: '1px solid var(--border)',
          minHeight: '100vh'
        }}
      >
          {/* SafeLens Brand Identity Header */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.6rem' }}>
              <div style={{ position: 'relative', display: 'inline-flex' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--surface-strong)', display: 'grid', placeItems: 'center', border: '1px solid var(--border)' }}>
                  <img src="/safelens-logo.png" alt="SafeLens" style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '50%' }} />
                </div>
                <span className="live-pulse-dot" style={{ position: 'absolute', bottom: '1px', right: '1px', width: '11px', height: '11px', background: 'var(--success)', border: '2px solid var(--surface)' }} />
              </div>
              <div>
                <strong style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--text)', display: 'block', lineHeight: 1.1 }}>
                  SafeLens
                </strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 700 }}>AI Threat Intelligence</span>
              </div>
            </div>

            {/* Enlarged 3D Graphic Image Window spanning screen height */}
            <div style={{ background: 'var(--surface)', borderRadius: '20px', padding: '1rem', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', marginBottom: '1.8rem' }}>
              <div style={{ width: '100%', height: '260px', borderRadius: '14px', overflow: 'hidden', background: 'var(--surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                  src="/images/momo_fraud_analysis.png" 
                  alt="SafeLens 3D AI Security Engine" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '0.5rem', display: 'block' }} 
                />
              </div>
              <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 850, color: 'var(--primary)', letterSpacing: '0.04em', textTransform: 'uppercase', background: 'var(--surface-alt)', padding: '0.25rem 0.7rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
                  AI SHIELD ENGINE ACTIVE &bull; 99% THREAT INTERCEPT
                </span>
              </div>
            </div>

            {/* Security Feature Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text)', fontWeight: 700 }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--success)', flexShrink: 0 }}>
                  <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Real-Time Mobile Money &amp; USSD Scam Scanning</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text)', fontWeight: 700 }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--success)', flexShrink: 0 }}>
                  <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Instant Phishing Link &amp; Screenshot Audit</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text)', fontWeight: 700 }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--success)', flexShrink: 0 }}>
                  <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Plain-English Safety Reports &amp; Escalation Lines</span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 650, marginTop: '1.6rem' }}>
            Trusted by over 10,000+ users across Ghana.
          </div>
        </div>

        {/* Right Column: User Login Form Card Vertically & Horizontally Centered */}
        <div style={{ padding: '3rem 2.8rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {/* Centered Form Wrapper (Constrains input field width to 420px max for optimal readability) */}
          <div style={{ maxWidth: '420px', width: '100%', margin: '0 auto' }}>
            <div style={{ marginBottom: '1.6rem' }}>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 900, margin: '0 0 0.4rem 0', color: 'var(--text)' }}>
                Sign In to SafeLens
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.45 }}>
                Access threat scanning, scan history, and security dashboard.
              </p>
            </div>

            {error ? (
              <Alert title="Authentication Error" type="danger" style={{ marginBottom: '1.4rem', padding: '0.75rem 1rem', fontSize: '0.86rem' }}>
                {error}
              </Alert>
            ) : null}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label className="input-label" htmlFor="login-email" style={{ fontSize: '0.86rem', marginBottom: '0.35rem', fontWeight: 750 }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="login-email"
                    type="email"
                    className="scanner-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. kofi@example.com"
                    required
                    disabled={isLoading}
                    style={{ paddingLeft: '2.6rem', paddingBottom: '0.6rem', fontSize: '0.94rem', marginBottom: 0 }}
                  />
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', width: '1.15rem', height: '1.15rem', color: 'var(--muted)', pointerEvents: 'none' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label className="input-label" htmlFor="login-password" style={{ margin: 0, fontSize: '0.86rem', fontWeight: 750 }}>Password</label>
                  <button
                    type="button"
                    onClick={() => alert('Demo Account:\nEmail: kofi@example.com\nPassword: password123')}
                    style={{ background: 'none', border: 'none', padding: 0, fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer' }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    className="scanner-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    disabled={isLoading}
                    style={{ paddingLeft: '2.6rem', paddingRight: '2.6rem', fontSize: '0.94rem', marginBottom: 0 }}
                  />
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', width: '1.15rem', height: '1.15rem', color: 'var(--muted)', pointerEvents: 'none' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    style={{
                      position: 'absolute',
                      right: '0.7rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      color: showPassword ? 'var(--primary)' : 'var(--muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      borderRadius: '4px',
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.2rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', color: 'var(--text)', userSelect: 'none', fontWeight: 650 }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ width: '0.95rem', height: '0.95rem', accentColor: 'var(--primary)', cursor: 'pointer' }}
                  />
                  <span>Remember this session</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', color: 'var(--text)', userSelect: 'none', fontWeight: 650 }}>
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    style={{ width: '0.95rem', height: '0.95rem', accentColor: 'var(--primary)', cursor: 'pointer' }}
                  />
                  <span>Show password</span>
                </label>
              </div>

              <Button type="submit" disabled={isLoading} style={{ marginTop: '0.5rem', width: '100%', gap: '0.4rem', justifyContent: 'center', padding: '0.7rem 1rem', fontSize: '0.96rem' }}>
                {isLoading ? (
                  <>
                    <span className="live-pulse-dot" style={{ background: '#fff' }} />
                    Signing In…
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Quick Demo Login Section */}
            <div style={{ marginTop: '1.4rem', paddingTop: '1.1rem', borderTop: '1px solid var(--border)', width: '100%' }}>
              <button
                type="button"
                className="auth-demo-btn"
                onClick={handleQuickDemoLogin}
                disabled={isLoading}
                style={{ width: '100%', justifyContent: 'center', padding: '0.6rem 1rem', fontSize: '0.88rem' }}
              >
                <span>Quick Demo Login (Kofi Mensah)</span>
              </button>
            </div>

            <div style={{ marginTop: '1.2rem', textAlign: 'center', fontSize: '0.88rem', color: 'var(--muted)' }}>
              Don&apos;t have an account?{' '}
              <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 800, textDecoration: 'none' }}>
                Create free account &rarr;
              </Link>
            </div>
          </div>
        </div>
    </div>
  )
}
