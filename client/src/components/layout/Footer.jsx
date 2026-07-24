import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div>
          <h3>SafeLens</h3>
          <p>Look closer. Stay safer.</p>
        </div>
        <div className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/scan">Scan</Link>
        </div>
      </div>
    </footer>
  )
}
