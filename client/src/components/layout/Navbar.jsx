import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { authService } from '../../services/authService'

export default function Navbar({ user, setUser, theme, setTheme }) {
  const [open, setOpen] = useState(false)

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
