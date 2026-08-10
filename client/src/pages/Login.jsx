import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import { authService } from '../services/authService'

export default function Login({ setUser, triggerAuthModal }) {
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
      setError('Please enter your email and password.')
      return
    }
    setError('')
    setIsLoading(true)
    setTimeout(() => {
      try {
        const loggedUser = authService.login({ email: email.trim(), password })
        setUser(loggedUser)
        setIsLoading(false)
        if (triggerAuthModal) {
          triggerAuthModal({
            type: 'login',
            title: `Welcome back, ${loggedUser?.name ? loggedUser.name.split(' ')[0] : 'User'}`
          })
        }
        navigate('/pricing?selectPlan=true')
      } catch (err) {
        setError(err.message || 'Incorrect email or password. Please try again.')
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
      if (triggerAuthModal) {
        triggerAuthModal({
          type: 'login',
          title: 'Welcome back, Kofi'
        })
      }
      navigate('/pricing?selectPlan=true')
    }, 400)
  }

  return (
    /* Full-screen 2-column layout: warm illustrated left panel + clean sign-in card on right */
    <>
    {/* Responsive styles for mobile — hides left panel, stacks form full-width */}
    <style>{`
      .auth-wrapper {
        position: fixed; inset: 0;
        width: 100vw; height: 100vh;
        z-index: 9999;
        display: grid;
        grid-template-columns: 1fr 1fr;
        overflow: hidden;
        background: var(--surface-alt);
      }
      .auth-left {
        position: relative;
        height: 100vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        background: #e63c1c;
      }
      .auth-right {
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 2rem 3rem;
        box-sizing: border-box;
        background: var(--surface-alt);
        overflow-y: auto;
      }
      /* Mobile brand bar — hidden on desktop */
      .auth-mobile-bar { display: none; }

      @media (max-width: 768px) {
        .auth-wrapper {
          grid-template-columns: 1fr;
          overflow-y: auto;
          height: auto;
          min-height: 100vh;
        }
        .auth-left { display: none; }
        .auth-right {
          height: auto;
          min-height: 100vh;
          padding: 1.5rem 1.2rem 2rem;
          justify-content: flex-start;
        }
        .auth-mobile-bar {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 1.4rem;
          width: 100%;
          max-width: 420px;
        }
      }
    `}</style>
    <div className="auth-wrapper">

      {/* LEFT PANEL — Brand story + 3D showcase */}
      <div className="auth-left">

        {/* Decorative ambient orbs behind content */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '340px', height: '340px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '280px', height: '280px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
        }} />

        {/* Brand header — top of left panel */}
        <div style={{ padding: '2rem 2.4rem', display: 'flex', alignItems: 'center', gap: '0.7rem', position: 'relative', zIndex: 1 }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.3)',
              display: 'grid', placeItems: 'center',
            }}>
              <img src="/safelens-logo.png" alt="SafeLens" style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '8px' }} />
            </div>
            {/* Live status dot */}
            <span style={{
              position: 'absolute', bottom: '-2px', right: '-2px',
              width: '10px', height: '10px', borderRadius: '50%',
              background: '#4ade80', border: '2px solid rgba(255,255,255,0.9)',
            }} />
          </div>
          <div>
            <strong style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff', display: 'block', lineHeight: 1.1 }}>SafeLens</strong>
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)', fontWeight: 600, letterSpacing: '0.02em' }}>AI Threat Intelligence</span>
          </div>
        </div>

        {/* Central hero content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 2.4rem 1rem', position: 'relative', zIndex: 1 }}>

          {/* 3D Shield Image */}
          <div style={{
            borderRadius: '20px',
            overflow: 'hidden',
            marginBottom: '1.8rem',
            height: 'calc(100vh - 440px)',
            minHeight: '220px',
            maxHeight: '320px',
            position: 'relative',
            background: 'rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}>
            <img
              src="/images/universal_ai_security_shield.png"
              alt="SafeLens AI Security Shield"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {/* Image overlay badge */}
            <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                fontSize: '0.7rem', fontWeight: 800, color: '#fff',
                letterSpacing: '0.06em', textTransform: 'uppercase',
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
                padding: '0.3rem 0.75rem', borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.15)',
              }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', flexShrink: 0 }} />
                AI Shield Active
              </span>
            </div>
          </div>

          {/* Headline copy */}
          <h2 style={{
            fontSize: '1.65rem', fontWeight: 900, color: '#fff',
            lineHeight: 1.2, margin: '0 0 0.6rem 0', letterSpacing: '-0.02em',
          }}>
            Protecting Ghanaians<br />from digital fraud.
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.65)', margin: '0 0 1.6rem 0', lineHeight: 1.6 }}>
            Real-time AI scanning for mobile money scams, phishing links, and USSD fraud across all networks.
          </p>

          {/* Feature chips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[
              'Mobile Money &amp; USSD Scam Scanning',
              'Phishing Link &amp; Screenshot Audit',
              'Plain-English Safety Reports',
            ].map((feat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(74, 222, 128, 0.2)',
                  border: '1px solid rgba(74,222,128,0.4)',
                  display: 'grid', placeItems: 'center',
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.82)', fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: feat }} />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom trust badge */}
        <div style={{ padding: '1.2rem 2.4rem', borderTop: '1px solid rgba(255,255,255,0.1)', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>
              Trusted by 10,000+ users across Ghana
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — Sign-in form */}
      <div className="auth-right">

        {/* Mobile-only brand bar — shown instead of the hidden left panel */}
        <div className="auth-mobile-bar">
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
            background: 'var(--primary)',
            display: 'grid', placeItems: 'center',
            boxShadow: '0 3px 10px rgba(230,60,28,0.35)',
          }}>
            <img src="/safelens-logo.png" alt="SafeLens" style={{ width: '24px', height: '24px', objectFit: 'cover', borderRadius: '6px' }} />
          </div>
          <div>
            <strong style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text)', display: 'block', lineHeight: 1.1 }}>SafeLens</strong>
            <span style={{ fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 600 }}>AI Threat Intelligence</span>
          </div>
        </div>

        {/* Enhanced form card — elevated with top accent bar and logo badge */}
        <div style={{
          width: '100%', maxWidth: '420px',
          background: 'var(--surface)',
          borderRadius: '24px',
          border: '1px solid var(--border)',
          boxShadow: '0 8px 48px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}>


          {/* Card inner content */}
          <div style={{ padding: '2.2rem 2.2rem 2rem' }}>

            {/* Header */}
            <div style={{ marginBottom: '1.6rem' }}>
              <h1 style={{ fontSize: '1.55rem', fontWeight: 900, margin: '0 0 0.2rem 0', color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                Welcome back
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '0.86rem', margin: 0, lineHeight: 1.45 }}>
                Sign in to your security dashboard.
              </p>
            </div>

            {/* Error alert */}
            {error && (
              <Alert title="Sign-in failed" type="danger" style={{ marginBottom: '1.2rem' }}>
                {error}
              </Alert>
            )}

            {/* Sign-in form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Email field */}
              <div>
                <label htmlFor="login-email" style={{
                  display: 'block', fontSize: '0.82rem', fontWeight: 700,
                  color: 'var(--text)', marginBottom: '0.38rem', letterSpacing: '0.01em',
                }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="login-email"
                    type="email"
                    className="scanner-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kofi@example.com"
                    required
                    disabled={isLoading}
                    style={{ paddingLeft: '2.6rem', fontSize: '0.91rem', marginBottom: 0, width: '100%', boxSizing: 'border-box' }}
                  />
                  <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" style={{
                    position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)',
                    width: '1rem', height: '1rem', color: 'var(--muted)', pointerEvents: 'none',
                  }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
              </div>

              {/* Password field */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.38rem' }}>
                  <label htmlFor="login-password" style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '0.01em' }}>
                    Password
                  </label>
                  <button type="button"
                    onClick={() => alert('Demo credentials:\nEmail: kofi@example.com\nPassword: password123')}
                    style={{ background: 'none', border: 'none', padding: 0, fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Forgot password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    className="scanner-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                    style={{ paddingLeft: '2.6rem', paddingRight: '3.2rem', fontSize: '0.91rem', marginBottom: 0, width: '100%', boxSizing: 'border-box' }}
                  />
                  <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" style={{
                    position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)',
                    width: '1rem', height: '1rem', color: 'var(--muted)', pointerEvents: 'none',
                  }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    style={{
                      position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)',
                      background: 'var(--surface-strong)', border: '1px solid var(--border)',
                      padding: '2px 8px', cursor: 'pointer',
                      color: 'var(--muted)', fontSize: '0.72rem', fontWeight: 700, borderRadius: '5px',
                    }}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', userSelect: 'none', fontSize: '0.82rem', color: 'var(--muted)', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ width: '15px', height: '15px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
                Keep me signed in for 30 days
              </label>

              {/* Sign in button — solid primary color */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  padding: '0.78rem 1rem', marginTop: '0.2rem',
                  background: isLoading ? 'var(--muted)' : 'var(--primary)',
                  border: 'none', borderRadius: '12px',
                  fontSize: '0.95rem', fontWeight: 800, color: '#fff',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: isLoading ? 'none' : '0 4px 18px rgba(230,60,28,0.38)',
                  transition: 'opacity 0.15s, box-shadow 0.15s',
                  opacity: isLoading ? 0.7 : 1,
                  letterSpacing: '0.01em',
                }}
              >
                {isLoading ? (
                  <>
                    <span className="live-pulse-dot" style={{ background: '#fff', flexShrink: 0 }} />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.4rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              <span style={{ fontSize: '0.73rem', color: 'var(--muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>or continue with</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>

            {/* Demo login button */}
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={isLoading}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.55rem',
                padding: '0.68rem 1rem',
                background: 'var(--surface-alt)',
                border: '1.5px solid var(--border)',
                borderRadius: '12px',
                fontSize: '0.86rem', fontWeight: 700, color: 'var(--text)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'border-color 0.15s, background 0.15s',
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Quick Demo — Kofi Mensah
            </button>

            {/* Sign-up nudge inside card bottom */}
            <p style={{ marginTop: '1.4rem', fontSize: '0.83rem', color: 'var(--muted)', textAlign: 'center', margin: '1.4rem 0 0 0' }}>
              New to SafeLens?{' '}
              <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 800, textDecoration: 'none' }}>
                Create a free account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
