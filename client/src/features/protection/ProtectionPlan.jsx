import React from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import ProgressBar from '../../components/ui/ProgressBar'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

export default function ProtectionPlan({ subscription }) {
  const scansUsed = subscription?.scansUsed || 23
  const scanLimit = subscription?.scanLimit || 50
  const resetDays = subscription?.resetDaysRemaining || 18

  return (
    <Card style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.3rem' }}>🛡️</span>
          <div>
            <strong style={{ fontSize: '1rem', color: 'var(--text)', display: 'block', fontWeight: 900 }}>
              {subscription?.planName || 'Safe Protection Plan'}
            </strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
              GH₵ {subscription?.priceGhs || 5}/month • Active Protection
            </span>
          </div>
        </div>

        <Badge variant="success" size="md">
          <span className="live-pulse-dot" style={{ width: '5px', height: '5px', background: 'var(--success)' }} />
          Active
        </Badge>
      </div>

      <div style={{ marginBottom: '0.8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 800, marginBottom: '0.35rem' }}>
          <span style={{ color: 'var(--text)' }}>Scans Used This Period</span>
          <span style={{ color: 'var(--primary)' }}>{scansUsed} / {scanLimit} scans</span>
        </div>
        <ProgressBar value={scansUsed} max={scanLimit} color="var(--primary)" height="10px" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
        <span style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>
          🔄 Quota resets in <strong>{resetDays} days</strong>
        </span>

        <Link to="/billing" style={{ textDecoration: 'none' }}>
          <Button variant="outline" size="sm">
            Manage Plan
          </Button>
        </Link>
      </div>
    </Card>
  )
}
