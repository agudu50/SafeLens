import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer({ user }) {
  return (
    <footer className="site-footer" style={{ borderTop: '1px solid var(--border)', background: 'var(--surface-alt)', padding: '1.5rem 0' }}>
      <div className="footer-shell">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <img src="/safelens-logo.png" alt="SafeLens" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
            <strong style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text)' }}>SafeLens</strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--muted)', marginLeft: '0.4rem' }}>
              &copy; {new Date().getFullYear()} SafeLens Guard
            </span>
          </div>

          {/* Clean Navigation Links */}
          <nav style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', flexWrap: 'wrap', fontSize: '0.82rem' }} aria-label="Footer Navigation">
            {user ? (
              <>
                <Link to="/dashboard" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 700 }}>Dashboard</Link>
                <Link to="/scan" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 800 }}>AI Scanner</Link>
                <Link to="/history" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Scan History</Link>
                <Link to="/safety-tips" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Safety Tips</Link>
                <Link to="/settings" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Settings</Link>
              </>
            ) : (
              <>
                <Link to="/" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 700 }}>Home</Link>
                <Link to="/scan" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 800 }}>AI Scanner</Link>
                <Link to="/safety-tips" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Safety Tips</Link>
                <Link to="/about" style={{ color: 'var(--muted)', textDecoration: 'none' }}>About Us</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </footer>
  )
}
