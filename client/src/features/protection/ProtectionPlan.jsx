import React from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import ProgressBar from '../../components/ui/ProgressBar'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

// Redesigned protection plan quota card featuring modern glassmorphism styling and quota progress tracking
export default function ProtectionPlan({ subscription }) {
  const scansUsed = subscription?.scansUsed || 23
  const scanLimit = subscription?.scanLimit || 50
  const resetDays = subscription?.resetDaysRemaining || 18
  const percentage = Math.min(Math.round((scansUsed / scanLimit) * 100), 100)

  return (
    <div 
      style={{
        background: 'linear-gradient(135deg, var(--surface-alt), var(--surface))',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '1.25rem 1.4rem',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background ambient glow accent */}
      <div 
        style={{ 
          position: 'absolute', 
          top: '-20px', 
          right: '-20px', 
          width: '100px', 
          height: '100px', 
          background: 'rgba(230, 60, 28, 0.08)', 
          borderRadius: '50%', 
          filter: 'blur(30px)', 
          pointerEvents: 'none' 
        }} 
      />

      {/* Plan Header: Name, Price, and Active Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Vector Shield Icon replacing emoji */}
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(230, 60, 28, 0.1)', color: 'var(--primary)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div>
            <strong style={{ fontSize: '0.95rem', color: 'var(--text)', display: 'block', fontWeight: 900 }}>
              {subscription?.planName || 'Safe Protection Plan'}
            </strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 650 }}>
              GH₵ {subscription?.priceGhs || 5}/month • Active Protection
            </span>
          </div>
        </div>

        <Badge variant="success" size="md">
          <span className="live-pulse-dot" style={{ width: '5px', height: '5px', background: 'var(--success)' }} />
          Active
        </Badge>
      </div>

      {/* Quota Progress Meter */}
      <div style={{ marginBottom: '0.9rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.35rem' }}>
          <span style={{ color: 'var(--text)' }}>Scans Used This Period</span>
          <span style={{ color: 'var(--primary)' }}>{scansUsed} / {scanLimit} scans ({percentage}%)</span>
        </div>
        <ProgressBar value={scansUsed} max={scanLimit} color="var(--primary)" height="8px" />
      </div>

      {/* Card Footer: Reset countdown with refresh SVG icon and Manage Plan button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem', paddingTop: '0.6rem', borderTop: '1px solid var(--border)' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 650, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          {/* Refresh SVG Icon */}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}>
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
          </svg>
          Quota resets in <strong>{resetDays} days</strong>
        </span>

        {/* Link directing user to Billing page */}
        <Link to="/billing" style={{ textDecoration: 'none' }}>
          <Button variant="outline" size="sm" style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}>
            Manage Plan &rarr;
          </Button>
        </Link>
      </div>
    </div>
  )
}
