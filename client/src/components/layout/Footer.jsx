import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        background: 'var(--surface)',
        padding: '3rem 1.25rem 2rem 1.25rem',
        color: 'var(--muted)',
        fontSize: '0.84rem'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
            <img src="/safelens-logo.png" alt="SafeLens" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
            <strong style={{ fontSize: '1.1rem', color: 'var(--text)', fontWeight: 900 }}>SafeLens</strong>
          </div>
          <p style={{ lineHeight: 1.5, margin: 0 }}>
            AI-powered scam detection and digital safety guard tailored for Ghana and African digital ecosystems.
          </p>
        </div>

        <div>
          <strong style={{ color: 'var(--text)', display: 'block', marginBottom: '0.8rem', fontWeight: 800 }}>Product</strong>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <Link to="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/scan" style={{ color: 'inherit', textDecoration: 'none' }}>AI Scanner</Link>
            <Link to="/history" style={{ color: 'inherit', textDecoration: 'none' }}>Scan History</Link>
            <Link to="/pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Protection Plans</Link>
          </div>
        </div>

        <div>
          <strong style={{ color: 'var(--text)', display: 'block', marginBottom: '0.8rem', fontWeight: 800 }}>Safety &amp; Support</strong>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <Link to="/safety-tips" style={{ color: 'inherit', textDecoration: 'none' }}>Safety Tips &amp; Rules</Link>
            <Link to="/about" style={{ color: 'inherit', textDecoration: 'none' }}>About SafeLens</Link>
            <a href="tel:292" style={{ color: 'var(--danger)', textDecoration: 'none', fontWeight: 800 }}>CSA Hotline: 292</a>
            <a href="tel:1917" style={{ color: 'var(--warning)', textDecoration: 'none', fontWeight: 800 }}>MTN MoMo Fraud: 1917</a>
          </div>
        </div>

        <div>
          <strong style={{ color: 'var(--text)', display: 'block', marginBottom: '0.8rem', fontWeight: 800 }}>Blockchain Verification</strong>
          <p style={{ lineHeight: 1.5, margin: '0 0 0.6rem 0', fontSize: '0.78rem' }}>
            Scam reports are prepared for Ethereum smart contract integrity verification.
          </p>
          <span style={{ fontSize: '0.72rem', fontWeight: 850, color: 'var(--success)', background: 'rgba(16, 185, 129, 0.1)', padding: '0.2rem 0.55rem', borderRadius: '999px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            🛡️ Network Integrity Ready
          </span>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <span>&copy; {new Date().getFullYear()} SafeLens AI Guard. All rights reserved.</span>
        <span>Tailored for Ghana 🇬🇭 &amp; African Digital Safety</span>
      </div>
    </footer>
  )
}
