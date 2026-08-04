import React, { useState, useEffect } from 'react'
import PageContainer from '../components/layout/PageContainer'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import ProgressBar from '../components/ui/ProgressBar'
import ProtectionPlan from '../features/protection/ProtectionPlan'
import { subscriptionService } from '../services/subscriptionService'

export default function Billing() {
  const [sub, setSub] = useState(null)

  useEffect(() => {
    subscriptionService.getUserSubscription().then(setSub)
  }, [])

  return (
    <PageContainer>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text)', margin: '0 0 0.4rem 0' }}>
            Billing &amp; Protection Plan
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)', margin: 0 }}>
            Manage your SafeLens protection quota, renewal details, and payment methods.
          </p>
        </div>

        {/* Current Active Plan Overview */}
        <ProtectionPlan subscription={sub} />

        {/* Payment Methods */}
        <Card style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text)', margin: '0 0 0.8rem 0' }}>
            Supported Payment Methods
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.8rem', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.3rem' }}>📱</span>
              <div>
                <strong style={{ fontSize: '0.84rem', display: 'block' }}>Mobile Money</strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>MTN, Telecel, AT Money</span>
              </div>
            </div>

            <div style={{ padding: '0.8rem', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.3rem' }}>💳</span>
              <div>
                <strong style={{ fontSize: '0.84rem', display: 'block' }}>Debit / Credit Card</strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Visa, Mastercard</span>
              </div>
            </div>

            <div style={{ padding: '0.8rem', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.3rem' }}>⚡</span>
              <div>
                <strong style={{ fontSize: '0.84rem', display: 'block' }}>Web3 Crypto</strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Ethereum Wallet</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Billing History */}
        <Card>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text)', margin: '0 0 0.8rem 0' }}>
            Billing &amp; Payment History
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {sub?.history?.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '0.84rem' }}>
                <div>
                  <strong style={{ color: 'var(--text)', display: 'block' }}>Safe Protection Plan</strong>
                  <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>{item.date} • {item.method}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ color: 'var(--text)', display: 'block' }}>{item.amount}</strong>
                  <Badge variant="success" size="sm">{item.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageContainer>
  )
}
