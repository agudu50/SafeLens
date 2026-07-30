import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { authService } from '../../services/authService'

export default function Navbar({ user, setUser, theme, setTheme }) {
  const [open, setOpen] = useState(false)
  const [showHelpline, setShowHelpline] = useState(false)

  const links = [
    { to: '/', label: 'Home' },
    ...(user
      ? [
          { to: '/scan', label: 'Scan' },
          { to: '/history', label: 'History' },
        ]
      : []),
    { to: '/about', label: 'About' },
  ]

  const handleSignOut = () => {
    authService.logout()
    setUser(null)
    setOpen(false)
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <header className="site-header">
      <div className="nav-shell">
        <Link to="/" className="brand" onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <img src="/safelens-logo.png" alt="SafeLens" style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '50%', border: '1px solid var(--border)' }} />
          <strong className="brand__text" style={{ fontSize: '1.25rem', color: 'var(--text)', fontWeight: 800 }}>SafeLens</strong>
        </Link>

        <button
          className={`nav-toggle ${open ? 'nav-toggle--open' : ''}`}
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links ${open ? 'nav-links--open' : ''}`} aria-label="Primary navigation">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}

          <div className="helpline-dropdown-wrapper" style={{ position: 'relative' }}>
            <button
              type="button"
              className="helpline-badge-btn"
              onClick={() => setShowHelpline((prev) => !prev)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(220, 38, 38, 0.1)',
                color: 'var(--danger)',
                border: '1px solid rgba(220, 38, 38, 0.3)',
                padding: '0.35rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 700,
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              title="Official Ghana Scam Helplines"
            >
              <span className="live-pulse-dot" style={{ background: 'var(--danger)', width: '6px', height: '6px' }} />
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.826-1.47-5.114-3.758-6.584-6.584l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <span>Helpline: 292 / 1917</span>
            </button>

            {showHelpline && (
              <>
                <div
                  className="helpline-backdrop-overlay"
                  onClick={() => setShowHelpline(false)}
                />
                <div
                  className="helpline-modal-popover animate-fade-in"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '340px',
                    maxHeight: '460px',
                    overflowY: 'auto',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    boxShadow: 'var(--shadow)',
                    padding: '1rem',
                    zIndex: 1000,
                  }}
                >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <strong style={{ fontSize: '0.92rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem', color: 'var(--danger)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    Official Ghana Scam Helplines
                  </strong>
                  <button
                    type="button"
                    onClick={() => setShowHelpline(false)}
                    aria-label="Close helplines popover"
                    style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                  >
                    <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--muted)', margin: '0 0 0.8rem 0', lineHeight: 1.4 }}>
                  Facing a scam or wrong MoMo transfer attempt in Ghana? Contact your network or cyber authority immediately:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {/* Cyber Security Authority (CSA) */}
                  <a
                    href="tel:292"
                    className="helpline-item-link"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem', color: 'var(--primary)', flexShrink: 0 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                      <div>
                        <strong style={{ fontSize: '0.82rem', display: 'block' }}>Cyber Security Authority (CSA)</strong>
                        <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>National Incident Toll-Free Hotline</span>
                      </div>
                    </div>
                    <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.85rem', background: 'rgba(230,60,28,0.1)', padding: '0.2rem 0.5rem', borderRadius: '6px', flexShrink: 0 }}>292</span>
                  </a>

                  {/* MTN MoMo Fraud */}
                  <a
                    href="tel:1917"
                    className="helpline-item-link"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem', color: 'var(--warning)', flexShrink: 0 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                      </svg>
                      <div>
                        <strong style={{ fontSize: '0.82rem', display: 'block' }}>MTN Ghana MoMo Fraud</strong>
                        <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Free SMS / Call Toll-Free</span>
                      </div>
                    </div>
                    <span style={{ fontWeight: 800, color: 'var(--warning)', fontSize: '0.85rem', background: 'rgba(245,158,11,0.1)', padding: '0.2rem 0.5rem', borderRadius: '6px', flexShrink: 0 }}>1917</span>
                  </a>

                  {/* Telecel Cash (Vodafone) */}
                  <a
                    href="tel:100"
                    className="helpline-item-link"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem', color: 'var(--danger)', flexShrink: 0 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.826-1.47-5.114-3.758-6.584-6.584l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                      <div>
                        <strong style={{ fontSize: '0.82rem', display: 'block' }}>Telecel Cash (Vodafone)</strong>
                        <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Fraud & Support Helpline</span>
                      </div>
                    </div>
                    <span style={{ fontWeight: 800, color: 'var(--danger)', fontSize: '0.85rem', background: 'rgba(220,38,38,0.1)', padding: '0.2rem 0.5rem', borderRadius: '6px', flexShrink: 0 }}>100</span>
                  </a>

                  {/* AT (AirtelTigo Cash) */}
                  <a
                    href="tel:100"
                    className="helpline-item-link"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem', color: '#0284c7', flexShrink: 0 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v.958" />
                      </svg>
                      <div>
                        <strong style={{ fontSize: '0.82rem', display: 'block' }}>AT (AirtelTigo Money)</strong>
                        <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>AT Money Support Line</span>
                      </div>
                    </div>
                    <span style={{ fontWeight: 800, color: '#0284c7', fontSize: '0.85rem', background: 'rgba(2,132,199,0.1)', padding: '0.2rem 0.5rem', borderRadius: '6px', flexShrink: 0 }}>100</span>
                  </a>

                  {/* CSA Official WhatsApp Evidence Line */}
                  <a
                    href="https://wa.me/233501147477"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="helpline-item-link"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem', color: 'var(--success)', flexShrink: 0 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.596.596 0 01-.774-.774c.22-.52.417-1.077.56-1.642A8.136 8.136 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                      </svg>
                      <div>
                        <strong style={{ fontSize: '0.82rem', display: 'block' }}>CSA WhatsApp Line</strong>
                        <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Send chat evidence / screenshots</span>
                      </div>
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.76rem', background: 'rgba(15,157,115,0.1)', padding: '0.2rem 0.5rem', borderRadius: '6px', flexShrink: 0 }}>0501147477</span>
                  </a>
                </div>
              </div>
            </>
          )}
          </div>

          <button
            type="button"
            className="theme-toggle"
            aria-label="Toggle Theme"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1.25rem', height: '1.25rem' }}>
                <circle cx="12" cy="12" r="5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42m12.72-12.72l1.42-1.42" />
              </svg>
            ) : (
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1.25rem', height: '1.25rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
            <span className="theme-toggle-label">Switch Theme</span>
          </button>
          
          <div className="nav-actions" style={{ marginLeft: '0.5rem' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }} className="nav-user-container">
                <Link
                  to="/profile"
                  className="nav-link"
                  onClick={() => setOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                >
                  <span style={{ width: '1.9rem', height: '1.9rem', borderRadius: '50%', background: 'var(--surface-strong)', color: 'var(--primary)', display: 'grid', placeItems: 'center', fontSize: '0.82rem', fontWeight: 800, border: '1px solid var(--border)' }}>
                    {user.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                  </span>
                  <span className="nav-user-name">{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="nav-action"
                  style={{ background: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)', padding: '0.4rem 0.9rem', borderRadius: '999px', fontWeight: 600 }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/login" className="nav-link" onClick={() => setOpen(false)}>
                  Sign In
                </Link>
                <Link to="/register" className="nav-action" onClick={() => setOpen(false)}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
