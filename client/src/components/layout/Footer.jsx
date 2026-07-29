import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div className="footer-grid">
          {/* Column 1: Brand details */}
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
              <span className="brand__mark" style={{ width: '1.9rem', height: '1.9rem', fontSize: '0.95rem' }}>S</span>
              <strong style={{ fontSize: '1.15rem', color: 'var(--text)' }}>SafeLens</strong>
            </div>
            <p>Look closer. Stay safer.</p>
            <p style={{ fontSize: '0.82rem', marginTop: '0.4rem' }}>
              We help people in Ghana and beyond scan suspicious texts, check shortcodes, review link threat scores, and report fraudulent Mobile Money schemes.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="footer-col">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/">Home Dashboard</Link></li>
              <li><Link to="/scan">Scan Message</Link></li>
              <li><Link to="/history">Scan Logs</Link></li>
              <li><Link to="/about">Education Center</Link></li>
            </ul>
          </div>

          {/* Column 3: Ghana Security Hotlines */}
          <div className="footer-col">
            <h4>Ghana Hotlines</h4>
            <ul>
              <li>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted)' }}>National CSA Hotline</span>
                <span>Call 292</span>
              </li>
              <li>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted)' }}>MTN Fraud Reporting</span>
                <span>SMS 1917 (Free)</span>
              </li>
              <li>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted)' }}>CSA WhatsApp Support</span>
                <span>050 114 7477</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row: Copyright notice */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} SafeLens. Protecting transaction safety and communications in Ghana.</p>
        </div>
      </div>
    </footer>
  )
}
