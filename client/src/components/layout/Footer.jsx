import { Link } from 'react-router-dom'

export default function Footer({ user }) {
  // Ultra-minimal footer for logged-in user session
  if (user) {
    return (
      <footer className="site-footer site-footer--minimal" style={{ borderTop: '1px solid var(--border)', padding: '1.2rem 0', background: 'var(--surface-alt)' }}>
        <div className="footer-shell" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            
            {/* Left: Compact Logo & Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <img src="/safelens-logo.png" alt="SafeLens" style={{ width: '22px', height: '22px', borderRadius: '6px' }} />
              <span style={{ fontSize: '0.88rem', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.01em' }}>
                SafeLens
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600 }}>
                • Look closer. Stay safer.
              </span>
            </div>

            {/* Center: Minimal Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
              <Link to="/" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textDecoration: 'none' }}>Dashboard</Link>
              <Link to="/scan" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textDecoration: 'none' }}>AI Scanner</Link>
              <Link to="/history" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textDecoration: 'none' }}>Logs</Link>
              <Link to="/safety-tips" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textDecoration: 'none' }}>Safety Tips</Link>
              <a href="tel:292" style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }} />
                CSA 292
              </a>
            </div>

            {/* Right: Copyright & Live Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.74rem', color: 'var(--muted)' }}>
              <span>&copy; {new Date().getFullYear()} SafeLens</span>
              <span style={{ opacity: 0.5 }}>|</span>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', padding: '0.15rem 0.5rem', borderRadius: '999px', color: 'var(--success)', fontWeight: 700, fontSize: '0.68rem' }}>
                <span className="live-pulse-dot" style={{ width: '6px', height: '6px', background: 'var(--success)' }} />
                <span>Systems Normal</span>
              </div>
            </div>

          </div>
        </div>
      </footer>
    )
  }

  // Full landing footer for logged-out visitors
  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div className="footer-main-row">
          {/* Brand & Mission */}
          <div className="footer-brand-block">
            <div className="footer-logo-row">
              <img src="/safelens-logo.png" alt="SafeLens" className="footer-logo-img" />
              <strong className="footer-brand-title">SafeLens</strong>
            </div>
            <p className="footer-tagline">Look closer. Stay safer.</p>
            <p className="footer-desc">
              Empowering people in Ghana and beyond to scan suspicious messages, verify shortcodes, and report scams in real time.
            </p>
          </div>

          {/* Quick Links & Hotlines */}
          <div className="footer-right-block">
            <div className="footer-nav-links">
              <Link to="/" className="footer-nav-link">Home Dashboard</Link>
              <Link to="/login" className="footer-nav-link">Sign In</Link>
              <Link to="/register" className="footer-nav-link">Register</Link>
              <Link to="/safety-tips" className="footer-nav-link">Safety Tips</Link>
              <Link to="/about" className="footer-nav-link">About Us</Link>
            </div>

            <div className="footer-hotline-pills">
              <a href="tel:292" className="hotline-pill hotline-pill--csa" title="Call CSA Ghana Hotline 292">
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem', color: 'var(--primary)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.826-1.47-5.114-3.758-6.584-6.584l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <span>CSA Hotline: <strong>292</strong></span>
              </a>
              <a href="tel:1917" className="hotline-pill hotline-pill--mtn" title="Call MTN Fraud Hotline 1917">
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem', color: 'var(--warning)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
                <span>MTN Fraud: <strong>1917</strong></span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="footer-bottom-row">
          <p>&copy; {new Date().getFullYear()} SafeLens. Protecting transaction safety &amp; communications in Ghana.</p>
          <div className="footer-status-pill">
            <span className="live-pulse-dot" style={{ background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }} />
            <span>Systems Normal</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
