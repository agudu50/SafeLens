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
        navigate('/dashboard')
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
      navigate('/dashboard')
    }, 400)
  }

  return (
    <PageContainer>
      <section className="scanner-card animate-slide-up" style={{ maxWidth: '440px', margin: '1rem auto', padding: '1.6rem 1.6rem', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <div style={{ position: 'relative', display: 'inline-flex' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--surface-strong)', display: 'grid', placeItems: 'center', border: '1px solid var(--border)' }}>
                <img src="/safelens-logo.png" alt="SafeLens" style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '50%' }} />
              </div>
              <span className="live-pulse-dot" style={{ position: 'absolute', bottom: '1px', right: '1px', width: '10px', height: '10px', background: 'var(--success)', border: '2px solid var(--surface)' }} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text)' }}>Sign In to SafeLens</h1>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.84rem', margin: '0.1rem 0 0' }}>
            Access threat scanning, scan history, and security dashboard.
          </p>
        </div>

        {error ? (
          <Alert title="Authentication Error" type="danger" style={{ marginBottom: '1rem', padding: '0.6rem 0.8rem', fontSize: '0.82rem' }}>
            {error}
          </Alert>
        ) : null}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label className="input-label" htmlFor="login-email" style={{ fontSize: '0.82rem', marginBottom: '0.25rem' }}>Email Address</label>
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
                style={{ paddingLeft: '2.4rem', paddingBottom: '0.5rem', fontSize: '0.9rem', marginBottom: 0 }}
              />
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: 'var(--muted)', pointerEvents: 'none' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <label className="input-label" htmlFor="login-password" style={{ margin: 0, fontSize: '0.82rem' }}>Password</label>
              <button
                type="button"
                onClick={() => alert('Demo Account:\nEmail: kofi@example.com\nPassword: password123')}
                style={{ background: 'none', border: 'none', padding: 0, fontSize: '0.76rem', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
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
                style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem', fontSize: '0.9rem', marginBottom: 0 }}
              />
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: 'var(--muted)', pointerEvents: 'none' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  padding: '3px 6px',
                  cursor: 'pointer',
                  color: showPassword ? 'var(--primary)' : 'var(--muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '4px',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--text)', userSelect: 'none' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: '0.9rem', height: '0.9rem', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <span>Remember this session</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--text)', userSelect: 'none' }}>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                style={{ width: '0.9rem', height: '0.9rem', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <span>Show password</span>
            </label>
          </div>

          <Button type="submit" disabled={isLoading} style={{ marginTop: '0.2rem', width: '100%', gap: '0.4rem', justifyContent: 'center', padding: '0.55rem 1rem', fontSize: '0.9rem' }}>
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

        <div style={{ marginTop: '1rem', paddingTop: '0.9rem', borderTop: '1px solid var(--border)', width: '100%' }}>
          <button
            type="button"
            className="auth-demo-btn"
            onClick={handleQuickDemoLogin}
            disabled={isLoading}
            style={{ width: '100%', justifyContent: 'center', padding: '0.45rem 0.8rem', fontSize: '0.82rem' }}
          >
            <span>Quick Demo Login (Kofi Mensah)</span>
          </button>
        </div>

        <div style={{ marginTop: '0.9rem', textAlign: 'center', fontSize: '0.84rem', color: 'var(--muted)' }}>
          Don&apos;t have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Create free account &rarr;
          </Link>
        </div>
      </section>
    </PageContainer>
  )
}
