import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'

function getUserInitials(user) {
  if (!user?.name) return '?'
  return user.name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function Navbar({ user, setUser, theme, setTheme }) {
  const [open, setOpen] = useState(false)
  const [showHelpline, setShowHelpline] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Auto-close mobile drawer when window resizes to desktop width (> 700px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 700) {
        setOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Determine if user is inside internal App Workspace pages (/dashboard, /history, /profile, /results, /safety-tips)
  const isAppWorkspace = user && ['/dashboard', '/history', '/profile', '/results', '/safety-tips'].some(path => location.pathname.startsWith(path))

  // Clean navigation links
  const links = isAppWorkspace
    ? [
        {
          to: '/dashboard',
          label: 'Dashboard',
          icon: (
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '0.95rem', height: '0.95rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
          )
        },
        {
          to: '/history',
          label: 'Scan History',
          icon: (
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '0.95rem', height: '0.95rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
    setShowProfileMenu(false)
    setOpen(false)
    navigate('/')
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

        {/* Backdrop overlay for mobile drawer */}
        {open && <div className="nav-backdrop" onClick={() => setOpen(false)} />}

        <nav className={`nav-links ${open ? 'nav-links--open' : ''}`} aria-label="Primary navigation">
          {/* SECTION 1: User Status Header */}
          {open && user && (
            <div className="mobile-drawer-only" style={{ padding: '0.85rem 1rem', background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '16px', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', overflow: 'hidden' }}>
                <span style={{ width: '38px', height: '38px', borderRadius: '50%', background: user.isWalletAuth ? 'linear-gradient(135deg, #0052FF, #38bdf8)' : 'linear-gradient(135deg, var(--primary), #ef4444)', color: '#ffffff', display: 'grid', placeItems: 'center', fontSize: '0.88rem', fontWeight: 900, boxShadow: '0 4px 10px rgba(0,0,0,0.1)', flexShrink: 0 }}>
                  {getUserInitials(user)}
                </span>
                <div style={{ overflow: 'hidden' }}>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--text)', display: 'block', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user.name}
                  </strong>
                  <span style={{ fontSize: '0.7rem', color: user.isWalletAuth ? 'var(--primary)' : 'var(--success)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <span className="live-pulse-dot" style={{ width: '5px', height: '5px', background: user.isWalletAuth ? 'var(--primary)' : 'var(--success)' }} />
                    {user.isWalletAuth ? 'Base L2 Wallet Active' : 'Protection Active'}
                  </span>
                </div>
              </div>
              <button 
                onClick={handleSignOut}
                style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', padding: '0.25rem 0.55rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer', flexShrink: 0 }}
              >
                Sign Out
              </button>
            </div>
          )}

          {open && !user && (
            <div className="mobile-drawer-only" style={{ padding: '0.85rem 1rem', background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '16px', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <img src="/safelens-logo.png" alt="SafeLens" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                <div>
                  <strong style={{ fontSize: '0.86rem', color: 'var(--text)', display: 'block', fontWeight: 800 }}>SafeLens AI Guard</strong>
                  <span style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>Ghana Fraud Shield</span>
                </div>
              </div>
              <Link to="/login" onClick={() => setOpen(false)} style={{ fontSize: '0.72rem', fontWeight: 850, color: '#ffffff', background: 'var(--primary)', padding: '0.3rem 0.75rem', borderRadius: '999px', textDecoration: 'none' }}>
                Sign In
              </Link>
            </div>
          )}

          {/* SECTION 2: Navigation Links */}
          {open && (
            <div className="mobile-drawer-only" style={{ fontSize: '0.65rem', fontWeight: 850, color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0.3rem 0 0.1rem 0.3rem' }}>
              MAIN NAVIGATION
            </div>
          )}

          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}
              onClick={() => setOpen(false)}
            >
              {({ isActive }) => (
                open ? (
                  /* Mobile Drawer Layout */
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ color: isActive ? '#ffffff' : 'var(--primary)', display: 'flex', alignItems: 'center', background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--surface-alt)', padding: '0.35rem', borderRadius: '8px' }}>
                        {link.icon}
                      </span>
                      <span style={{ fontWeight: 750 }}>{link.label}</span>
                    </div>
                    {link.isBadge ? (
                      <span
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 850,
                          color: isActive ? 'var(--primary)' : '#ffffff',
                          background: isActive ? '#ffffff' : 'var(--primary)',
                          padding: '0.1rem 0.45rem',
                          borderRadius: '999px',
                          textTransform: 'uppercase'
                        }}
                      >
                        PRO
                      </span>
                    ) : (
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem', color: isActive ? '#ffffff' : 'var(--muted)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    )}
                  </div>
                ) : (
                  /* Desktop Navigation Bar Layout */
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {link.icon}
                    </span>
                    <span style={{ whiteSpace: 'nowrap', fontWeight: isActive ? 850 : 700 }}>{link.label}</span>
                  </span>
                )
              )}
            </NavLink>
          ))}

          <div className="nav-actions" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            {/* Ghana Helpline Trigger */}
            <div className="helpline-dropdown-wrapper" style={{ position: 'relative' }}>
              <button
                type="button"
                className="helpline-badge-btn"
                onClick={() => {
                  setShowHelpline((prev) => !prev)
                  setShowProfileMenu(false)
                }}
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  width: '38px',
                  height: '38px',
                  padding: 0,
                  background: 'rgba(220, 38, 38, 0.08)',
                  color: 'var(--danger)',
                  border: '1px solid rgba(220, 38, 38, 0.25)',
                  borderRadius: '12px',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
                title="Official Ghana Scam Helplines (292 / 1917 / 100)"
              >
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="live-pulse-dot" style={{ background: 'var(--danger)', width: '6px', height: '6px', position: 'absolute', top: '-2px', right: '-3px' }} />
                  <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.05rem', height: '1.05rem' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.826-1.47-5.114-3.758-6.584-6.584l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
              </button>

              {showHelpline && (
                <>
                  <div className="helpline-backdrop-overlay" onClick={() => setShowHelpline(false)} />
                  <div
                    className="helpline-modal-popover animate-fade-in"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      width: '280px',
                      maxHeight: '380px',
                      overflowY: 'auto',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '16px',
                      boxShadow: 'var(--shadow)',
                      padding: '0.9rem',
                      zIndex: 1000,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong style={{ fontSize: '0.86rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        Ghana Scam Helplines
                      </strong>
                      <button type="button" onClick={() => setShowHelpline(false)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>✕</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      <a href="tel:292" className="helpline-item-link" style={{ textDecoration: 'none', color: 'var(--text)', fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-alt)', padding: '0.4rem 0.6rem', borderRadius: '8px' }}>
                        <span>CSA Hotline</span>
                        <strong style={{ color: 'var(--primary)' }}>292</strong>
                      </a>
                      <a href="tel:1917" className="helpline-item-link" style={{ textDecoration: 'none', color: 'var(--text)', fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-alt)', padding: '0.4rem 0.6rem', borderRadius: '8px' }}>
                        <span>MTN Fraud</span>
                        <strong style={{ color: 'var(--warning)' }}>1917</strong>
                      </a>
                      <a href="tel:100" className="helpline-item-link" style={{ textDecoration: 'none', color: 'var(--text)', fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-alt)', padding: '0.4rem 0.6rem', borderRadius: '8px' }}>
                        <span>Telecel / AT</span>
                        <strong style={{ color: 'var(--danger)' }}>100</strong>
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Icon-Only Theme Toggle Button */}
            <button
              type="button"
              className="theme-toggle"
              aria-label="Toggle Theme"
              onClick={toggleTheme}
              style={{
                width: '38px',
                height: '38px',
                padding: 0,
                display: 'grid',
                placeItems: 'center',
                borderRadius: '12px',
                background: 'var(--surface-alt)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                flexShrink: 0
              }}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.05rem', height: '1.05rem', color: 'var(--warning)' }}>
                  <circle cx="12" cy="12" r="5" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42m12.72-12.72l1.42-1.42" />
                </svg>
              ) : (
                <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.05rem', height: '1.05rem', color: 'var(--primary)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', position: 'relative' }} className="nav-user-container">
                {/* On Public pages, show primary Dashboard CTA */}
                {!isAppWorkspace && (
                  <Link
                    to="/dashboard"
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
                    <span>Dashboard</span>
                  </Link>
                )}

                {/* Profile Avatar Button (Initials Alone e.g. KM) */}
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu((prev) => !prev)
                    setShowHelpline(false)
                  }}
                  className="nav-user-pill"
                  style={{
                    width: '38px',
                    height: '38px',
                    padding: 0,
                    borderRadius: '50%',
                    background: user.isWalletAuth
                      ? 'linear-gradient(135deg, #0052FF, #38bdf8)'
                      : location.pathname === '/profile' || showProfileMenu ? 'linear-gradient(135deg, var(--primary), #ef4444)' : 'var(--primary)',
                    border: '2px solid var(--border)',
                    color: '#ffffff',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: showProfileMenu ? '0 0 0 3px rgba(230, 60, 28, 0.25)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
                    flexShrink: 0
                  }}
                  title={`${user.name} - Profile & Account Settings`}
                >
                  {getUserInitials(user)}
                </button>

                {/* Profile Dropdown Popover */}
                {showProfileMenu && (
                  <>
                    <div
                      className="helpline-backdrop-overlay"
                      onClick={() => setShowProfileMenu(false)}
                    />
                    <div
                      className="animate-fade-in"
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        right: 0,
                        width: '240px',
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: '18px',
                        boxShadow: '0 16px 36px rgba(0, 0, 0, 0.16)',
                        padding: '0.85rem',
                        zIndex: 1000,
                        backdropFilter: 'blur(20px)'
                      }}
                    >
                      {/* User Profile Header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ width: '38px', height: '38px', borderRadius: '50%', background: user.isWalletAuth ? 'linear-gradient(135deg, #0052FF, #38bdf8)' : 'linear-gradient(135deg, var(--primary), #ef4444)', color: '#ffffff', display: 'grid', placeItems: 'center', fontSize: '0.92rem', fontWeight: 900, flexShrink: 0, boxShadow: '0 3px 10px rgba(0,0,0,0.15)' }}>
                          {getUserInitials(user)}
                        </span>
                        <div style={{ overflow: 'hidden', flex: 1 }}>
                          <strong style={{ fontSize: '0.88rem', color: 'var(--text)', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 800 }}>
                            {user.name || 'Kofi Mensah'}
                          </strong>
                          <span style={{ fontSize: '0.7rem', color: 'var(--muted)', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '0.2rem' }}>
                            {user.email || 'kofi@example.com'}
                          </span>
                          <span style={{ fontSize: '0.6rem', fontWeight: 850, color: user.isWalletAuth ? 'var(--primary)' : 'var(--success)', background: user.isWalletAuth ? 'rgba(56, 189, 248, 0.12)' : 'rgba(16, 185, 129, 0.12)', padding: '0.1rem 0.45rem', borderRadius: '999px', border: user.isWalletAuth ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <span className="live-pulse-dot" style={{ width: '4px', height: '4px', background: user.isWalletAuth ? 'var(--primary)' : 'var(--success)' }} />
                            {user.isWalletAuth ? 'BASE L2 AUTHENTICATED' : 'PROTECTED ACCOUNT'}
                          </span>
                        </div>
                      </div>

                      {/* Compact Feature List */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.18rem', marginBottom: '0.65rem' }}>
                        
                        <Link
                          to="/profile"
                          onClick={() => setShowProfileMenu(false)}
                          className="popover-menu-item"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.55rem',
                            padding: '0.42rem 0.55rem',
                            borderRadius: '10px',
                            color: 'var(--text)',
                            fontSize: '0.82rem',
                            fontWeight: 750,
                            textDecoration: 'none',
                            background: location.pathname === '/profile' ? 'var(--surface-alt)' : 'transparent',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
                            <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '0.9rem', height: '0.9rem' }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                          </span>
                          <span>My Profile</span>
                        </Link>

                        <Link
                          to="/profile"
                          onClick={() => setShowProfileMenu(false)}
                          className="popover-menu-item"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.55rem',
                            padding: '0.42rem 0.55rem',
                            borderRadius: '10px',
                            color: 'var(--text)',
                            fontSize: '0.82rem',
                            fontWeight: 750,
                            textDecoration: 'none',
                            background: 'transparent',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center' }}>
                            <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '0.9rem', height: '0.9rem' }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                          </span>
                          <span>Password &amp; Security</span>
                        </Link>

                        <Link
                          to="/profile"
                          onClick={() => setShowProfileMenu(false)}
                          className="popover-menu-item"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.55rem',
                            padding: '0.42rem 0.55rem',
                            borderRadius: '10px',
                            color: 'var(--text)',
                            fontSize: '0.82rem',
                            fontWeight: 750,
                            textDecoration: 'none',
                            background: 'transparent',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center' }}>
                            <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '0.9rem', height: '0.9rem' }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 18H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 12h11.25" />
                            </svg>
                          </span>
                          <span>General Settings</span>
                        </Link>

                        <Link
                          to="/history"
                          onClick={() => setShowProfileMenu(false)}
                          className="popover-menu-item"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.55rem',
                            padding: '0.42rem 0.55rem',
                            borderRadius: '10px',
                            color: 'var(--text)',
                            fontSize: '0.82rem',
                            fontWeight: 750,
                            textDecoration: 'none',
                            background: location.pathname === '/history' ? 'var(--surface-alt)' : 'transparent',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span style={{ color: '#6366f1', display: 'flex', alignItems: 'center' }}>
                            <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '0.9rem', height: '0.9rem' }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                          </span>
                          <span>Scan History</span>
                        </Link>
                      </div>

                      {/* Sign Out Button */}
                      <div style={{ paddingTop: '0.55rem', borderTop: '1px solid var(--border)' }}>
                        <button
                          type="button"
                          onClick={handleSignOut}
                          style={{
                            width: '100%',
                            background: 'rgba(239, 68, 68, 0.08)',
                            color: 'var(--danger)',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            padding: '0.45rem 0.75rem',
                            borderRadius: '10px',
                            fontWeight: 800,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H2.25" />
                          </svg>
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
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
