import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { authService } from '../../services/authService'

export default function Navbar({ user, setUser, theme, setTheme }) {
  const [open, setOpen] = useState(false)
  const [showHelpline, setShowHelpline] = useState(false)
  const location = useLocation()

  // Determine if user is inside internal App Workspace pages (/scan, /history, /profile, /results)
  const isAppWorkspace = user && ['/scan', '/history', '/profile', '/results'].some(path => location.pathname.startsWith(path))

  // Clean navigation links (No duplicate "My Profile" in center, since Profile pill is on the right)
  const links = isAppWorkspace
    ? [
        {
          to: '/',
          label: 'Home',
          icon: (
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '0.95rem', height: '0.95rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          )
        },
        {
          to: '/scan',
          label: 'AI Scanner',
          isBadge: true,
          icon: (
            <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '0.95rem', height: '0.95rem', color: 'var(--primary)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          )
        },
        {
          to: '/history',
          label: 'Scan History',
          icon: (
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '0.95rem', height: '0.95rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 000 18z" />
            </svg>
          )
        },
        {
          to: '/safety-tips',
          label: 'Safety Tips',
          icon: (
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '0.95rem', height: '0.95rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          )
        }
      ]
    : [
        {
          to: '/',
          label: 'Home',
          icon: (
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '0.95rem', height: '0.95rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          )
        },
        {
          to: '/safety-tips',
          label: 'Safety Tips',
          icon: (
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '0.95rem', height: '0.95rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          )
        },
        {
          to: '/about',
          label: 'About Us',
          icon: (
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '0.95rem', height: '0.95rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          )
        }
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
        <Link to="/" className="brand" onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <img src="/safelens-logo.png" alt="SafeLens" style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '50%', border: '1px solid var(--border)' }} />
          <strong className="brand__text" style={{ fontSize: '1.2rem', color: 'var(--text)', fontWeight: 800 }}>SafeLens</strong>
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
          {/* User Status Bar in Mobile Drawer */}
          {open && user && (
            <div style={{ padding: '0.8rem 1rem', background: 'var(--surface-alt)', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%' }}>
              <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--primary)', display: 'grid', placeItems: 'center', fontSize: '0.82rem', fontWeight: 800, border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                {user.name ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase() : 'U'}
              </span>
              <div>
                <strong style={{ fontSize: '0.86rem', color: 'var(--text)', display: 'block' }}>{user.name}</strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span className="live-pulse-dot" style={{ width: '5px', height: '5px', background: 'var(--success)' }} />
                  Account Unlocked
                </span>
              </div>
            </div>
          )}

          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}
              onClick={() => setOpen(false)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.75rem', fontSize: '0.86rem', whiteSpace: 'nowrap' }}
            >
              {link.icon}
              <span>{link.label}</span>
              {link.isBadge && (
                <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#fff', background: 'var(--primary)', padding: '0.1rem 0.35rem', borderRadius: '999px', textTransform: 'uppercase' }}>
                  AI
                </span>
              )}
            </NavLink>
          ))}

          {/* Ghana Helpline Dropdown */}
          <div className="helpline-dropdown-wrapper" style={{ position: 'relative' }}>
            <button
              type="button"
              className="helpline-badge-btn"
              onClick={() => setShowHelpline((prev) => !prev)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'rgba(220, 38, 38, 0.08)',
                color: 'var(--danger)',
                border: '1px solid rgba(220, 38, 38, 0.25)',
                padding: '0.35rem 0.65rem',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
              title="Official Ghana Scam Helplines"
            >
              <span className="live-pulse-dot" style={{ background: 'var(--danger)', width: '6px', height: '6px' }} />
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.826-1.47-5.114-3.758-6.584-6.584l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <span>Helpline 292</span>
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
                    <a href="tel:292" className="helpline-item-link">
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
                    <a href="tel:1917" className="helpline-item-link">
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

                    {/* Telecel Cash */}
                    <a href="tel:100" className="helpline-item-link">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem', color: 'var(--danger)', flexShrink: 0 }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.826-1.47-5.114-3.758-6.584-6.584l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                        <div>
                          <strong style={{ fontSize: '0.82rem', display: 'block' }}>Telecel Cash (Vodafone)</strong>
                          <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Fraud &amp; Support Helpline</span>
                        </div>
                      </div>
                      <span style={{ fontWeight: 800, color: 'var(--danger)', fontSize: '0.85rem', background: 'rgba(220,38,38,0.1)', padding: '0.2rem 0.5rem', borderRadius: '6px', flexShrink: 0 }}>100</span>
                    </a>

                    {/* AT Money */}
                    <a href="tel:100" className="helpline-item-link">
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
            style={{ width: '32px', height: '32px', padding: 0, display: 'grid', placeItems: 'center', borderRadius: '50%', flexShrink: 0 }}
          >
            {theme === 'dark' ? (
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem' }}>
                <circle cx="12" cy="12" r="5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42m12.72-12.72l1.42-1.42" />
              </svg>
            ) : (
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>
          
          <div className="nav-actions" style={{ marginLeft: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }} className="nav-user-container">
                {/* On Public pages (Home page, Safety tips, About us), show primary "Go to Scanner" CTA button */}
                {!isAppWorkspace && (
                  <Link
                    to="/scan"
                    className="nav-action"
                    onClick={() => setOpen(false)}
                    style={{
                      background: 'var(--primary)',
                      color: '#ffffff',
                      padding: '0.35rem 0.8rem',
                      borderRadius: '999px',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      boxShadow: '0 4px 14px rgba(230, 60, 28, 0.25)',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <span>AI Scanner</span>
                  </Link>
                )}

                {/* Profile Pill - Highlighted active if currently on /profile */}
                <NavLink
                  to="/profile"
                  className={({ isActive }) => (isActive ? 'nav-user-pill nav-user-pill--active' : 'nav-user-pill')}
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.28rem 0.65rem',
                    borderRadius: '999px',
                    background: location.pathname === '/profile' ? 'rgba(56, 189, 248, 0.15)' : 'var(--surface-alt)',
                    border: location.pathname === '/profile' ? '1px solid var(--primary)' : '1px solid var(--border)',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  title="View Profile Settings"
                >
                  <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: '#ffffff', display: 'grid', placeItems: 'center', fontSize: '0.74rem', fontWeight: 800 }}>
                    {user.name ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase() : 'U'}
                  </span>
                  <span className="nav-user-name" style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)' }}>
                    {user.name ? user.name.split(' ')[0] : 'User'}
                  </span>
                  <span className="live-pulse-dot" style={{ width: '5px', height: '5px', background: 'var(--success)' }} />
                </NavLink>

                {/* Sign Out Button */}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="nav-action"
                  style={{
                    background: 'rgba(220, 38, 38, 0.08)',
                    color: 'var(--danger)',
                    border: '1px solid rgba(220, 38, 38, 0.25)',
                    padding: '0.32rem 0.65rem',
                    borderRadius: '999px',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    whiteSpace: 'nowrap'
                  }}
                  title="Sign Out of SafeLens"
                >
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H2.25" />
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link to="/login" className="nav-link" onClick={() => setOpen(false)} style={{ fontSize: '0.84rem', fontWeight: 700, padding: '0.4rem 0.7rem' }}>
                  Sign In
                </Link>
                <Link to="/register" className="nav-action" onClick={() => setOpen(false)} style={{ background: 'var(--primary)', color: '#fff', padding: '0.38rem 0.85rem', borderRadius: '999px', fontWeight: 800, fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
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
