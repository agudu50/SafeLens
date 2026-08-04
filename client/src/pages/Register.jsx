import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import { authService } from '../services/authService'
import { walletService } from '../services/walletService'

const getPasswordStrength = (pass) => {
  if (!pass) return { score: 0, label: '', color: 'var(--muted)', percent: 0 }

  let score = 0
  if (pass.length >= 8) score += 25
  if (/[A-Z]/.test(pass)) score += 25
  if (/[0-9]/.test(pass)) score += 25
  if (/[^a-zA-Z0-9]/.test(pass)) score += 25

  if (pass.length < 8) {
    return {
      score,
      percent: 25,
      label: `Too short (${pass.length}/8 chars min)`,
      color: 'var(--danger)',
    }
  }

  if (score <= 25) {
    return {
      score,
      percent: 35,
      label: 'Weak — Add uppercase, numbers, or symbols',
      color: 'var(--danger)',
    }
  }

  if (score <= 50) {
    return {
      score,
      percent: 55,
      label: 'Fair — Add numbers or symbols (!@#$)',
      color: 'var(--warning)',
    }
  }

  if (score <= 75) {
    return {
      score,
      percent: 80,
      label: 'Good password',
      color: '#0284c7',
    }
  }

  return {
    score,
    percent: 100,
    label: 'Strong & Secure Password',
    color: 'var(--success)',
  }
}

export default function Register({ setUser }) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const strength = getPasswordStrength(password)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setError('Please fill in all the required fields.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    const phoneDigits = phone.trim().replace(/\D/g, '')
    if (phoneDigits.length !== 10 || !/^(02|05|03)/.test(phoneDigits)) {
      setError('Please enter a valid 10-digit Ghanaian phone number starting with 02, 03, or 05.')
      return
    }

    setError('')
    setIsLoading(true)

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
        navigate('/dashboard')
      } catch (err) {
        setError(err.message || 'Registration failed.')
        setIsLoading(false)
      }
    }, 700)
  }

  const handleWalletRegister = async () => {
    setError('')
    setIsLoading(true)
    try {
      const res = await walletService.connectWallet('sepolia')
      if (res.wallet?.address) {
        const shortAddr = `${res.wallet.address.slice(0, 6)}...${res.wallet.address.slice(-4)}`
        const walletUser = {
          name: `Base User (${shortAddr})`,
          email: `${res.wallet.address.slice(0, 8)}@base.eth`,
          walletAddress: res.wallet.address,
          network: res.wallet.network,
          isWalletAuth: true,
        }
        authService.setStoredUser(walletUser)
        setUser(walletUser)
        setIsLoading(false)
        navigate('/dashboard')
      } else {
        setError('Wallet connection was canceled.')
        setIsLoading(false)
      }
    } catch (err) {
      setError(err.message || 'Failed to connect wallet.')
      setIsLoading(false)
    }
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
      <section className="scanner-card animate-slide-up" style={{ maxWidth: '460px', margin: '1rem auto', padding: '1.6rem 1.6rem' }}>
          {/* Compact Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.1rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
              <div style={{ position: 'relative', display: 'inline-flex' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface-strong)', display: 'grid', placeItems: 'center', border: '1px solid var(--border)' }}>
                  <img src="/safelens-logo.png" alt="SafeLens" style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '50%' }} />
                </div>
                <span className="live-pulse-dot" style={{ position: 'absolute', bottom: '1px', right: '1px', width: '10px', height: '10px', background: 'var(--success)', border: '2px solid var(--surface)' }} />
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text)' }}>Create Account</h1>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '0.84rem', margin: 0 }}>
              Join SafeLens to monitor suspicious alerts and protect your transactions.
            </p>
          </div>

          {error ? (
            <Alert title="Registration Check" type="danger" style={{ marginBottom: '0.9rem', padding: '0.55rem 0.75rem', fontSize: '0.82rem' }}>
              {error}
            </Alert>
          ) : null}

          <button
            type="button"
            onClick={handleWalletRegister}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.65rem 1rem',
              borderRadius: '999px',
              border: '1px solid var(--primary)',
              background: 'rgba(56, 189, 248, 0.1)',
              color: 'var(--primary)',
              fontSize: '0.88rem',
              fontWeight: 850,
              cursor: isLoading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '0.8rem',
            }}
          >
            <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
            <span>Register with WalletConnect</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', margin: '0.8rem 0 1rem 0', gap: '0.5rem', color: 'var(--muted)', fontSize: '0.74rem', fontWeight: 700 }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span>OR REGISTER WITH DETAILS</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Full Name */}
            <div>
              <label className="input-label" htmlFor="register-name" style={{ fontSize: '0.8rem', marginBottom: '0.2rem' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="register-name"
                  type="text"
                  className="scanner-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kwame Boakye"
                  required
                  disabled={isLoading}
                  style={{ paddingLeft: '2.4rem', fontSize: '0.88rem', marginBottom: 0 }}
                />
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: 'var(--muted)', pointerEvents: 'none' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
            </div>

            {/* Email & Phone in 2 Columns */}
            <div className="auth-form-grid">
              <div>
                <label className="input-label" htmlFor="register-email" style={{ fontSize: '0.8rem', marginBottom: '0.2rem' }}>Email</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="register-email"
                    type="email"
                    className="scanner-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kwame@ex.com"
                    required
                    disabled={isLoading}
                    style={{ paddingLeft: '2.2rem', fontSize: '0.86rem', marginBottom: 0 }}
                  />
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', width: '0.9rem', height: '0.9rem', color: 'var(--muted)', pointerEvents: 'none' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
              </div>

              <div>
                <label className="input-label" htmlFor="register-phone" style={{ fontSize: '0.8rem', marginBottom: '0.2rem' }}>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="register-phone"
                    type="tel"
                    className="scanner-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0541234567"
                    required
                    disabled={isLoading}
                    style={{ paddingLeft: '2.2rem', fontSize: '0.86rem', marginBottom: 0 }}
                  />
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', width: '0.9rem', height: '0.9rem', color: 'var(--muted)', pointerEvents: 'none' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password & Confirm Password in 2 Columns */}
            <div className="auth-form-grid">
              <div>
                <label className="input-label" htmlFor="register-password" style={{ fontSize: '0.8rem', marginBottom: '0.2rem' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    className="scanner-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 chars"
                    required
                    disabled={isLoading}
                    style={{ paddingLeft: '2.2rem', paddingRight: '2.2rem', fontSize: '0.86rem', marginBottom: 0 }}
                  />
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', width: '0.9rem', height: '0.9rem', color: 'var(--muted)', pointerEvents: 'none' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    style={{
                      position: 'absolute',
                      right: '0.4rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      padding: '2px 4px',
                      cursor: 'pointer',
                      color: showPassword ? 'var(--primary)' : 'var(--muted)',
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: '4px'
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.95rem', height: '0.95rem' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.95rem', height: '0.95rem' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12c1.349-4.39 5.216-7.5 9.964-7.5s8.615 3.11 9.964 7.5c-1.349 4.39-5.216 7.5-9.964 7.5s-8.615-3.11-9.964-7.5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="input-label" htmlFor="register-confirm" style={{ fontSize: '0.8rem', marginBottom: '0.2rem' }}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="register-confirm"
                    type={showPassword ? 'text' : 'password'}
                    className="scanner-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter"
                    required
                    disabled={isLoading}
                    style={{ paddingLeft: '2.2rem', fontSize: '0.86rem', marginBottom: 0 }}
                  />
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', width: '0.9rem', height: '0.9rem', color: 'var(--muted)', pointerEvents: 'none' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Strength Indicator Bar */}
            {password ? (
              <div style={{ marginTop: '0.2rem', background: 'var(--surface-strong)', padding: '0.55rem 0.75rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, color: strength.color }}>
                    {strength.label}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 600 }}>
                    {password.length}/8 chars
                  </span>
                </div>

                {/* Progress Bar Track */}
                <div style={{ display: 'flex', gap: '3px', height: '4px', background: 'var(--border)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ flex: 1, background: strength.percent >= 25 ? strength.color : 'transparent', transition: 'background 0.3s ease' }} />
                  <div style={{ flex: 1, background: strength.percent >= 55 ? strength.color : 'transparent', transition: 'background 0.3s ease' }} />
                  <div style={{ flex: 1, background: strength.percent >= 80 ? strength.color : 'transparent', transition: 'background 0.3s ease' }} />
                  <div style={{ flex: 1, background: strength.percent >= 100 ? strength.color : 'transparent', transition: 'background 0.3s ease' }} />
                </div>

                {/* Character Mix Requirements Checklist */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: password.length >= 8 ? 'var(--success)' : 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: '0.15rem' }}>
                    {password.length >= 8 ? '✓' : '•'} 8+ Chars
                  </span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: /[A-Z]/.test(password) ? 'var(--success)' : 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: '0.15rem' }}>
                    {/[A-Z]/.test(password) ? '✓' : '•'} Uppercase (A-Z)
                  </span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: /[0-9]/.test(password) ? 'var(--success)' : 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: '0.15rem' }}>
                    {/[0-9]/.test(password) ? '✓' : '•'} Number (0-9)
                  </span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: /[^a-zA-Z0-9]/.test(password) ? 'var(--success)' : 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: '0.15rem' }}>
                    {/[^a-zA-Z0-9]/.test(password) ? '✓' : '•'} Symbol (!@#$)
                  </span>
                </div>
              </div>
            ) : null}

            {/* Show Password Option Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--text)', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  style={{ width: '0.9rem', height: '0.9rem', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
                <span>Show passwords</span>
              </label>
            </div>

            <Button type="submit" disabled={isLoading} style={{ marginTop: '0.2rem', width: '100%', gap: '0.4rem', justifyContent: 'center', padding: '0.55rem 1rem', fontSize: '0.88rem' }}>
              {isLoading ? (
                <>
                  <span className="live-pulse-dot" style={{ background: '#fff' }} />
                  Creating Account…
                </>
              ) : (
                'Register Free Account'
              )}
            </Button>
          </form>

          {/* Demo Shortcut */}
          <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', width: '100%' }}>
            <button
              type="button"
              className="auth-demo-btn"
              onClick={handleQuickDemoLogin}
              disabled={isLoading}
              style={{ width: '100%', justifyContent: 'center', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem', color: 'var(--primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              <span>Or Sign In as Demo User (Kofi)</span>
            </button>
          </div>

          <div style={{ marginTop: '0.75rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--muted)' }}>
            Already have a SafeLens account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              Sign in here &rarr;
            </Link>
          </div>
      </section>
    </PageContainer>
  )
}
