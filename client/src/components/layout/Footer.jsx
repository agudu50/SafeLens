import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer({ user }) {
  // Compact Streamlined Authenticated Workspace Footer
  if (user) {
    return (
      <footer
        className="site-footer site-footer--workspace"
        style={{
          borderTop: '1px solid var(--border)',
          background: 'var(--surface-alt)',
          padding: '0.9rem 0',
          position: 'relative',
          zIndex: 20
        }}
      >
        <div className="footer-shell">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              flexWrap: 'wrap',
              gap: '0.8rem',
              fontSize: '0.8rem'
            }}
          >
            {/* Left: Brand + Signed-in User */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <img src="/safelens-logo.png" alt="SafeLens Shield" style={{ width: '22px', height: '22px', borderRadius: '50%' }} />
              <span style={{ color: 'var(--muted)' }}>
                Signed in as <strong style={{ color: 'var(--text)' }}>{user.name}</strong>
              </span>
              <span style={{ fontSize: '0.62rem', fontWeight: 850, color: 'var(--success)', background: 'rgba(16, 185, 129, 0.12)', padding: '0.1rem 0.45rem', borderRadius: '999px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                Protected
              </span>
            </div>

            {/* Center: Essential Workspace Links */}
            <nav style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', flexWrap: 'wrap' }} aria-label="Workspace Quick Navigation">
              <Link to="/dashboard" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 800 }}>Dashboard</Link>
              <Link to="/scan" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 700 }}>AI Scanner</Link>
              <Link to="/history" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Scan History</Link>
              <Link to="/settings" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Settings</Link>
            </nav>

            {/* Right: Helplines & Protection Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.75rem', color: 'var(--muted)', flexWrap: 'wrap' }}>
              <span>CSA <strong style={{ color: 'var(--primary)' }}>292</strong> | MTN <strong style={{ color: 'var(--warning)' }}>1917</strong></span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text)', fontWeight: 750, background: 'var(--surface)', padding: '0.2rem 0.55rem', borderRadius: '999px', border: '1px solid var(--border)' }}>
                <span className="live-pulse-dot" style={{ width: '5px', height: '5px', background: 'var(--success)' }} />
                Shield Active
              </span>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  // Public Landing Page Footer
  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div className="footer-main-row">
          <div className="footer-brand-block">
            <div className="footer-logo-row" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <img src="/safelens-logo.png" alt="SafeLens Shield" className="footer-logo-img" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
              <strong className="footer-brand-title" style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text)' }}>SafeLens AI Guard</strong>
            </div>
            <p className="footer-tagline">AI Scam Intelligence &amp; Ghana Fraud Protection Shield</p>
            <p className="footer-desc">
              Protecting mobile money transfers, SMS alerts, and web links against emerging fraud vectors across Ghana and Africa.
            </p>
          </div>

          <div className="footer-right-block">
            <nav className="footer-nav-links" aria-label="Footer navigation">
              <Link to="/">Home</Link>
              <Link to="/scan">AI Scanner</Link>
              <Link to="/history">Scan History</Link>
              <Link to="/safety-tips">Safety Tips</Link>
              <Link to="/about">About Us</Link>
            </nav>

            <div className="footer-hotline-pills">
              <span className="hotline-pill">
                <span style={{ color: 'var(--primary)', fontWeight: 800 }}>CSA Hotline:</span>
                <a href="tel:292" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 800 }}>292</a>
              </span>
              <span className="hotline-pill">
                <span style={{ color: 'var(--warning)', fontWeight: 800 }}>MTN MoMo:</span>
                <a href="tel:1917" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 800 }}>1917</a>
              </span>
              <span className="hotline-pill">
                <span style={{ color: 'var(--danger)', fontWeight: 800 }}>Telecel / AT:</span>
                <a href="tel:100" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 800 }}>100</a>
              </span>
            </div>
          </div>
        </div>

        <div className="footer-bottom-row">
          <p>&copy; {new Date().getFullYear()} SafeLens Security Guard. All rights reserved. Tailored for Ghana &amp; West Africa.</p>
          <div className="footer-status-pill">
            <span className="live-pulse-dot" style={{ width: '6px', height: '6px', background: 'var(--success)' }} />
            <span>Protection Shield Active</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
