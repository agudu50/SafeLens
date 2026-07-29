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

    // Simulate database lookup network latency
    setTimeout(() => {
      try {
        const loggedUser = authService.login({ email, password })
        setUser(loggedUser)
        setIsLoading(false)
        navigate('/profile')
      } catch (err) {
        setError(err.message || 'Failed to authenticate.')
        setIsLoading(false)
      }
    }, 800)
  }

  return (
    <PageContainer>
      <section className="scanner-card" style={{ maxWidth: '480px', margin: '2rem auto', padding: '2.5rem 2rem' }}>
        <div className="section-heading" style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <h1 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem' }}>Sign In to SafeLens</h1>
          <p>Access your personal dashboard and review recent scan assessments.</p>
        </div>

        {error ? <Alert title="Sign In failed" tone="danger">{error}</Alert> : null}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label className="input-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="scanner-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. kofi@example.com"
              required
              disabled={isLoading}
              style={{ marginBottom: 0 }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <label className="input-label" htmlFor="login-password" style={{ margin: 0 }}>Password</label>
              <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }} onClick={() => alert('Demo Feature: Enter "password123" to log in as Kofi.')}>
                Forgot Password?
              </span>
            </div>
            <input
              id="login-password"
              type="password"
              className="scanner-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
              style={{ marginBottom: 0 }}
            />
          </div>

          <Button type="submit" disabled={isLoading} style={{ marginTop: '0.5rem', width: '100%' }}>
            {isLoading ? 'Signing In…' : 'Sign In'}
          </Button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--muted)', borderTop: '1px solid var(--border)', paddingTop: '1.2rem' }}>
          Don&apos;t have an account yet?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Register here
          </Link>
        </div>
      </section>
    </PageContainer>
  )
}
