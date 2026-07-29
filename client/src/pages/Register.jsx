import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import { authService } from '../services/authService'

export default function Register({ setUser }) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validations
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setError('Please fill in all the required fields.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    // Basic Ghana phone validation (e.g. 054..., 020..., length 10 digits)
    const phoneDigits = phone.trim().replace(/\D/g, '')
    if (phoneDigits.length !== 10 || !/^(02|05|03)/.test(phoneDigits)) {
      setError('Please enter a valid 10-digit Ghanaian phone number starting with 02, 03, or 05.')
      return
    }

    setError('')
    setIsLoading(true)

    // Simulate account setup network delay
    setTimeout(() => {
      try {
        const registeredUser = authService.register({
          name: name.trim(),
          email: email.trim(),
          phone: phoneDigits,
          password,
        })
        setUser(registeredUser)
        setIsLoading(false)
        navigate('/profile')
      } catch (err) {
        setError(err.message || 'Registration failed.')
        setIsLoading(false)
      }
    }, 900)
  }

  return (
    <PageContainer>
      <section className="scanner-card" style={{ maxWidth: '520px', margin: '2rem auto', padding: '2.5rem 2rem' }}>
        <div className="section-heading" style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <h1 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem' }}>Create Account</h1>
          <p>Join SafeLens to monitor suspicious alerts and build your security ranking.</p>
        </div>

        {error ? <Alert title="Check details" tone="danger">{error}</Alert> : null}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label className="input-label" htmlFor="register-name">Full Name</label>
            <input
              id="register-name"
              type="text"
              className="scanner-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Kwame Boakye"
              required
              disabled={isLoading}
              style={{ marginBottom: 0 }}
            />
          </div>

          <div>
            <label className="input-label" htmlFor="register-email">Email Address</label>
            <input
              id="register-email"
              type="email"
              className="scanner-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. kwame@example.com"
              required
              disabled={isLoading}
              style={{ marginBottom: 0 }}
            />
          </div>

          <div>
            <label className="input-label" htmlFor="register-phone">Ghanaian Phone Number</label>
            <input
              id="register-phone"
              type="tel"
              className="scanner-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0541234567"
              required
              disabled={isLoading}
              style={{ marginBottom: 0 }}
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'block', marginTop: '0.2rem' }}>
              Used to help authenticate MoMo scam alerts sent to your number.
            </span>
          </div>

          <div>
            <label className="input-label" htmlFor="register-password">Password (min. 6 chars)</label>
            <input
              id="register-password"
              type="password"
              className="scanner-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              required
              disabled={isLoading}
              style={{ marginBottom: 0 }}
            />
          </div>

          <div>
            <label className="input-label" htmlFor="register-confirm">Confirm Password</label>
            <input
              id="register-confirm"
              type="password"
              className="scanner-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              disabled={isLoading}
              style={{ marginBottom: 0 }}
            />
          </div>

          <Button type="submit" disabled={isLoading} style={{ marginTop: '0.6rem', width: '100%' }}>
            {isLoading ? 'Creating Account…' : 'Register Account'}
          </Button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--muted)', borderTop: '1px solid var(--border)', paddingTop: '1.2rem' }}>
          Already have a SafeLens account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Sign In here
          </Link>
        </div>
      </section>
    </PageContainer>
  )
}
