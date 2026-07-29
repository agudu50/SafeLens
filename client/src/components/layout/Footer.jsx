import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div className="footer-main-row">
          {/* Brand & Mission */}
          <div className="footer-brand-block">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <img src="/safelens-logo.png" alt="SafeLens" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%', border: '1px solid var(--border)' }} />
              <strong style={{ fontSize: '1.15rem', color: 'var(--text)', fontWeight: 800 }}>SafeLens</strong>
            </div>
            <p className="footer-tagline">Look closer. Stay safer.</p>
            <p className="footer-desc">
              Empowering people in Ghana and beyond to scan suspicious messages, verify shortcodes, and report scams in real time.
            </p>
          </div>

          {/* Quick Links & Hotlines */}
          <div className="footer-right-block">
            <div className="footer-nav-links">
              <Link to="/">Home Dashboard</Link>
              <Link to="/scan">Scan Message</Link>
              <Link to="/history">Scan Logs</Link>
              <Link to="/about">Education Center</Link>
            </div>

            <div className="footer-hotline-pills">
              <span className="hotline-pill">
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.8rem', height: '0.8rem', color: 'var(--primary)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.826-1.47-5.114-3.758-6.584-6.584l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                CSA Hotline: <strong>292</strong>
              </span>
              <span className="hotline-pill">
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.8rem', height: '0.8rem', color: 'var(--primary)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
                MTN Fraud: <strong>1917</strong>
              </span>
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
