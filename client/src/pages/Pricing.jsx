import React from 'react'
import { Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { MOCK_PROTECTION_PLANS } from '../data/mockPlans'

export default function Pricing() {
  return (
    <PageContainer>
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text)', margin: '0 0 0.4rem 0' }}>
          Affordable Digital Safety Plans
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
          Simple, low-cost protection plans designed for everyday Ghanaian mobile money users and job seekers.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', maxWidth: '1080px', margin: '0 auto' }}>
        {MOCK_PROTECTION_PLANS.map((plan) => (
          <Card
            key={plan.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              border: plan.popular ? '2px solid var(--primary)' : '1px solid var(--border)',
              background: plan.popular ? 'rgba(230, 60, 28, 0.03)' : 'var(--surface-alt)'
            }}
          >
            {plan.popular && (
              <div style={{ position: 'absolute', top: '-12px', right: '20px' }}>
                <Badge variant="info" size="sm">MOST POPULAR</Badge>
              </div>
            )}

            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text)', margin: '0 0 0.5rem 0' }}>
                {plan.name}
              </h3>
              <div style={{ marginBottom: '1.2rem' }}>
                <strong style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)' }}>
                  GH₵ {plan.priceGhs}
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--muted)', marginLeft: '0.3rem' }}>
                  /{plan.period}
                </span>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 850, color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.6rem' }}>
                  INCLUDED FEATURES
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {plan.features.map((feat) => (
                    <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', color: 'var(--text)' }}>
                      <span style={{ color: 'var(--success)' }}>✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Link to="/billing" style={{ textDecoration: 'none' }}>
              <Button variant={plan.popular ? 'primary' : 'outline'} style={{ width: '100%' }}>
                {plan.ctaText}
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </PageContainer>
  )
}
