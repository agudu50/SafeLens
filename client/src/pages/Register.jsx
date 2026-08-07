import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import { authService } from '../services/authService'

/* Password strength helper function — returns score, label and color */
const getPasswordStrength = (pass) => {
  if (!pass) return { score: 0, label: '', color: 'var(--muted)', percent: 0 }
  let score = 0
  if (pass.length >= 8) score += 25
  if (/[A-Z]/.test(pass)) score += 25
  if (/[0-9]/.test(pass)) score += 25
  if (/[^a-zA-Z0-9]/.test(pass)) score += 25
  if (pass.length < 8) return { score, percent: 25, label: `Too short — ${pass.length}/8 chars`, color: 'var(--danger)' }
  if (score <= 25) return { score, percent: 35, label: 'Weak — add uppercase, numbers or symbols', color: 'var(--danger)' }
  if (score <= 50) return { score, percent: 55, label: 'Fair — add numbers or symbols', color: 'var(--warning)' }
  if (score <= 75) return { score, percent: 80, label: 'Good password', color: '#0284c7' }
  return { score, percent: 100, label: 'Strong password', color: 'var(--success)' }
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
      setError('Please fill in all required fields.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }
    const phoneDigits = phone.trim().replace(/\D/g, '')
    if (phoneDigits.length !== 10 || !/^(02|05|03)/.test(phoneDigits)) {
      setError('Please enter a valid 10-digit Ghanaian phone number (02x, 03x or 05x).')
      return
    }
    setError('')
    setIsLoading(true)
    setTimeout(() => {
      try {
        const registeredUser = authService.register({ name: name.trim(), email: email.trim(), phone: phoneDigits, password })
        setUser(registeredUser)
        setIsLoading(false)
        // Redirect newly registered user to plan selection immediately
        navigate('/pricing?selectPlan=true')
      } catch (err) {
        setError(err.message || 'Registration failed. Please try again.')
        setIsLoading(false)
      }
    }, 700)
  }

  const handleQuickDemoLogin = () => {
    setError('')
    setIsLoading(true)
    setTimeout(() => {
      const demoUser = authService.login({ email: 'kofi@example.com', password: 'password123' })
      setUser(demoUser)
      setIsLoading(false)
      // Redirect demo user to plan selection page
      navigate('/pricing?selectPlan=true')
    }, 400)
  }

  return (
    /* Full-screen 2-column layout — warm brand left panel + registration form on right */
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
        background: linear-gradient(155deg, #e63c1c 0%, #b52a10 45%, #1a1033 100%);
      }
      .auth-right {
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 1.6rem 2.2rem;
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
          padding: 1.2rem 1rem 2rem;
          justify-content: flex-start;
        }
        .auth-mobile-bar {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 1.2rem;
          width: 100%;
          max-width: 420px;
        }
      }
    `}</style>
    <div className="auth-wrapper">

      {/* LEFT PANEL — Brand story with onboarding steps */}
      <div className="auth-left">

        {/* Decorative ambient orbs */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '340px', height: '340px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

        {/* Brand header */}
        <div style={{ padding: '2rem 2.4rem', display: 'flex', alignItems: 'center', gap: '0.7rem', position: 'relative', zIndex: 1 }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.3)', display: 'grid', placeItems: 'center',
            }}>
              <img src="/safelens-logo.png" alt="SafeLens" style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '8px' }} />
            </div>
            <span style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '10px', height: '10px', borderRadius: '50%', background: '#4ade80', border: '2px solid rgba(255,255,255,0.9)' }} />
          </div>
          <div>
            <strong style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff', display: 'block', lineHeight: 1.1 }}>SafeLens</strong>
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)', fontWeight: 600, letterSpacing: '0.02em' }}>AI Threat Intelligence</span>
          </div>
        </div>

        {/* Central hero content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 2.4rem 1rem', position: 'relative', zIndex: 1 }}>

          {/* 3D Shield image */}
          <div style={{
            borderRadius: '20px', overflow: 'hidden', marginBottom: '1.8rem',
            height: 'calc(100vh - 460px)', minHeight: '180px', maxHeight: '260px',
            position: 'relative', background: 'rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}>
            <img src="/images/universal_ai_security_shield.png" alt="SafeLens AI Security" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                fontSize: '0.7rem', fontWeight: 800, color: '#fff',
                letterSpacing: '0.06em', textTransform: 'uppercase',
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
                padding: '0.3rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.15)',
              }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', flexShrink: 0 }} />
                AI Protection Ready
              </span>
            </div>
          </div>

          {/* Copy */}
          <h2 style={{ fontSize: '1.55rem', fontWeight: 900, color: '#fff', lineHeight: 1.2, margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' }}>
            Get protected in<br />under 2 minutes.
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'rgba(255,255,255,0.65)', margin: '0 0 1.6rem 0', lineHeight: 1.6 }}>
            Join thousands of Ghanaians using SafeLens to detect fraud before it happens.
          </p>

          {/* Onboarding steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              { step: '01', title: 'Create your account', desc: 'Quick 2-minute setup' },
              { step: '02', title: 'Choose your plan', desc: 'Free or premium protection' },
              { step: '03', title: 'Start scanning threats', desc: 'AI-powered, instant results' },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                  background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                  display: 'grid', placeItems: 'center',
                }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 900, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.03em' }}>{step}</span>
                </div>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: '0.1rem' }}>{title}</div>
                  <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom trust badge */}
        <div style={{ padding: '1.2rem 2.4rem', borderTop: '1px solid rgba(255,255,255,0.1)', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>Trusted by 10,000+ users across Ghana</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — Registration form */}
      <div className="auth-right">

        {/* Mobile-only brand bar — shown instead of the hidden left panel */}
        <div className="auth-mobile-bar">
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
            background: 'linear-gradient(135deg, #e63c1c 0%, #b52a10 100%)',
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

        {/* ── Enhanced card — all content in one padded wrapper ── */}
        <div style={{
          width: '100%', maxWidth: '420px',
          background: 'var(--surface)',
          borderRadius: '24px',
          border: '1px solid var(--border)',
          boxShadow: '0 8px 48px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.04)',
          padding: '1.3rem 1.6rem 1.2rem',
          boxSizing: 'border-box',
        }}>

          {/* Header */}
          <div style={{ marginBottom: '0.85rem' }}>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 900, margin: '0 0 0.2rem 0', color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Create your account
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.82rem', margin: 0, lineHeight: 1.45 }}>
              Free forever on the basic plan. No credit card needed.
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <Alert title="Please check your details" type="danger" style={{ marginBottom: '1rem' }}>
              {error}
            </Alert>
          )}

          {/* Registration form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

            {/* Full name */}
            <div>
              <label htmlFor="register-name" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.2rem' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="register-name" type="text" className="scanner-input"
                  value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kwame Boakye" required disabled={isLoading}
                  style={{ paddingLeft: '2.4rem', fontSize: '0.9rem', marginBottom: 0, width: '100%', boxSizing: 'border-box' }}
                />
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: 'var(--muted)', pointerEvents: 'none' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="register-email" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.2rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="register-email" type="email" className="scanner-input"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="kwame@example.com" required disabled={isLoading}
                  style={{ paddingLeft: '2.4rem', fontSize: '0.9rem', marginBottom: 0, width: '100%', boxSizing: 'border-box' }}
                />
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: 'var(--muted)', pointerEvents: 'none' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="register-phone" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.2rem' }}>
                Phone Number
                <span style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 500, marginLeft: '0.4rem' }}>(Ghana — 02x, 03x, 05x)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="register-phone" type="tel" className="scanner-input"
                  value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder="0541234567" required disabled={isLoading}
                  style={{ paddingLeft: '2.4rem', fontSize: '0.9rem', marginBottom: 0, width: '100%', boxSizing: 'border-box' }}
                />
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: 'var(--muted)', pointerEvents: 'none' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="register-password" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.2rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="register-password" type={showPassword ? 'text' : 'password'} className="scanner-input"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters" required disabled={isLoading}
                  style={{ paddingLeft: '2.4rem', paddingRight: '3rem', fontSize: '0.9rem', marginBottom: 0, width: '100%', boxSizing: 'border-box' }}
                />
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: 'var(--muted)', pointerEvents: 'none' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <button type="button" onClick={() => setShowPassword(prev => !prev)} aria-label={showPassword ? 'Hide' : 'Show'}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: '2px 4px', cursor: 'pointer', color: 'var(--muted)', fontSize: '0.74rem', fontWeight: 700, borderRadius: '4px' }}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {/* Password strength bar */}
              {password && (
                <div style={{ marginTop: '0.4rem' }}>
                  <div style={{ display: 'flex', gap: '3px', height: '3px', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.25rem' }}>
                    {[25, 55, 80, 100].map((t, i) => (
                      <div key={i} style={{ flex: 1, background: strength.percent >= t ? strength.color : 'var(--border)', transition: 'background 0.3s', borderRadius: '999px' }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: strength.color }}>{strength.label}</span>
                    <div style={{ display: 'flex', gap: '0.45rem' }}>
                      {[{ label: '8+', test: password.length >= 8 }, { label: 'A–Z', test: /[A-Z]/.test(password) }, { label: '0–9', test: /[0-9]/.test(password) }, { label: '!@#', test: /[^a-zA-Z0-9]/.test(password) }].map(({ label, test }) => (
                        <span key={label} style={{ fontSize: '0.68rem', fontWeight: 700, color: test ? 'var(--success)' : 'var(--muted)' }}>{test ? '✓' : '·'} {label}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="register-confirm" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.2rem' }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="register-confirm" type={showPassword ? 'text' : 'password'} className="scanner-input"
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password" required disabled={isLoading}
                  style={{
                    paddingLeft: '2.4rem', fontSize: '0.9rem', marginBottom: 0, width: '100%', boxSizing: 'border-box',
                    borderColor: confirmPassword ? (confirmPassword === password ? 'var(--success)' : 'var(--danger)') : undefined,
                  }}
                />
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: confirmPassword ? (confirmPassword === password ? 'var(--success)' : 'var(--danger)') : 'var(--muted)', pointerEvents: 'none' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {confirmPassword && (
                  <span style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.74rem', fontWeight: 700, color: confirmPassword === password ? 'var(--success)' : 'var(--danger)' }}>
                    {confirmPassword === password ? 'Match' : 'No match'}
                  </span>
                )}
              </div>
            </div>

            {/* Submit button — gradient */}
            <button
              type="submit" disabled={isLoading}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                padding: '0.6rem 1rem', marginTop: '0.1rem',
                background: isLoading ? 'var(--muted)' : 'linear-gradient(135deg, #e63c1c 0%, #c8280e 100%)',
                border: 'none', borderRadius: '12px',
                fontSize: '0.92rem', fontWeight: 800, color: '#fff',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                boxShadow: isLoading ? 'none' : '0 4px 18px rgba(230,60,28,0.38)',
                transition: 'opacity 0.15s, box-shadow 0.15s',
                opacity: isLoading ? 0.7 : 1, letterSpacing: '0.01em',
              }}
            >
              {isLoading ? (
                <><span className="live-pulse-dot" style={{ background: '#fff', flexShrink: 0 }} />Creating account…</>
              ) : (
                <>Create Free Account<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.5rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>or try a demo</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          {/* Demo login button */}
          <button
            type="button" onClick={handleQuickDemoLogin} disabled={isLoading}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'var(--surface-alt)',
              border: '1.5px solid var(--border)',
              borderRadius: '12px',
              fontSize: '0.84rem', fontWeight: 700, color: 'var(--text)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              transition: 'border-color 0.15s, background 0.15s',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Demo as Kofi Mensah
          </button>

          {/* Sign-in nudge */}
          <p style={{ fontSize: '0.83rem', color: 'var(--muted)', textAlign: 'center', margin: '1rem 0 0 0' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 800, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>{/* end card */}
      </div>{/* end right panel */}
    </div>
    </>
  )
}
