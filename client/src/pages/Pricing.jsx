import React, { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import { MOCK_PROTECTION_PLANS } from '../data/mockPlans'
import { subscriptionService } from '../services/subscriptionService'
import { authService } from '../services/authService'

/* ── Plan tier icon SVGs ── */
const PlanIcon = ({ tier }) => {
  if (tier === 'plan-starter') return (
    <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  )
  if (tier === 'plan-safe') return (
    <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  )
  return (
    <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  )
}

const CheckIcon = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '14px', height: '14px', flexShrink: 0 }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
)

const planAccentColors = {
  'plan-starter': { bg: 'rgba(100, 116, 139, 0.08)', border: 'rgba(100, 116, 139, 0.18)', icon: '#64748b', gradient: 'linear-gradient(135deg, #64748b, #94a3b8)' },
  'plan-safe': { bg: 'rgba(230, 60, 28, 0.06)', border: 'rgba(230, 60, 28, 0.22)', icon: 'var(--primary)', gradient: 'linear-gradient(135deg, #e63c1c, #f97316)' },
  'plan-shield': { bg: 'rgba(99, 102, 241, 0.06)', border: 'rgba(99, 102, 241, 0.22)', icon: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
}

export default function Pricing({ user, setUser }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [submittingPlanId, setSubmittingPlanId] = useState(null)
  const [hoveredPlan, setHoveredPlan] = useState(null)

  const isSelectingPlan = searchParams.get('selectPlan') === 'true' || (user && !user.hasSelectedPlan)

  const handleChoosePlan = async (planId) => {
    setSubmittingPlanId(planId)
    try {
      await subscriptionService.upgradePlan(planId)
      const currentSession = authService.getCurrentUser() || user
      if (currentSession) {
        const updatedUser = authService.setStoredUser({
          ...currentSession,
          hasSelectedPlan: true,
          selectedPlan: planId,
        })
        if (setUser) setUser(updatedUser)
      }
      navigate('/dashboard')
    } catch {
      setSubmittingPlanId(null)
      navigate('/dashboard')
    }
  }

  return (
    <PageContainer>
      {/* Inline styles for animations */}
      <style>{`
        @keyframes pricingCardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmerBadge {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulseRing {
          0%, 100% { box-shadow: 0 0 0 0 rgba(230, 60, 28, 0.18); }
          50% { box-shadow: 0 0 0 8px rgba(230, 60, 28, 0); }
        }
        .pricing-plan-card {
          animation: pricingCardIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .pricing-plan-card:nth-child(1) { animation-delay: 0.08s; }
        .pricing-plan-card:nth-child(2) { animation-delay: 0.18s; }
        .pricing-plan-card:nth-child(3) { animation-delay: 0.28s; }
        .popular-badge-shimmer {
          background: linear-gradient(90deg, var(--primary), #f97316, var(--primary));
          background-size: 200% 100%;
          animation: shimmerBadge 3s ease-in-out infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* ── Page Header ── */}
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.8rem auto' }}>
        {/* Decorative label badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'rgba(230, 60, 28, 0.06)',
          border: '1px solid rgba(230, 60, 28, 0.15)',
          borderRadius: '999px',
          padding: '0.3rem 0.85rem',
          marginBottom: '1rem',
        }}>
          <svg fill="none" stroke="var(--primary)" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '13px', height: '13px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
          <span style={{ fontSize: '0.72rem', fontWeight: 850, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Protection Plans
          </span>
        </div>

        <h1 style={{
          fontSize: '2.2rem',
          fontWeight: 900,
          color: 'var(--text)',
          margin: '0 0 0.6rem 0',
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
        }}>
          {isSelectingPlan ? 'Select Your Protection Plan' : 'Affordable Digital Safety Plans'}
        </h1>
        <p style={{
          fontSize: '0.95rem',
          color: 'var(--muted)',
          margin: 0,
          lineHeight: 1.6,
          maxWidth: '520px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          Simple, low-cost protection plans designed for everyday Ghanaian mobile money users and job seekers.
        </p>
      </div>

      {/* ── Plan Cards Grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.4rem',
        maxWidth: '1080px',
        margin: '0 auto',
        alignItems: 'stretch',
      }}>
        {MOCK_PROTECTION_PLANS.map((plan) => {
          const accent = planAccentColors[plan.id] || planAccentColors['plan-starter']
          const isHovered = hoveredPlan === plan.id
          const isPopular = plan.popular

          return (
            <div
              key={plan.id}
              className="pricing-plan-card"
              onMouseEnter={() => setHoveredPlan(plan.id)}
              onMouseLeave={() => setHoveredPlan(null)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                background: 'var(--surface)',
                border: isPopular
                  ? '2px solid var(--primary)'
                  : `1px solid ${isHovered ? accent.border : 'var(--border)'}`,
                borderRadius: '24px',
                padding: '1.8rem 1.6rem 1.6rem',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                boxShadow: isPopular
                  ? (isHovered
                    ? '0 24px 60px rgba(230, 60, 28, 0.14), 0 0 0 1px rgba(230, 60, 28, 0.08)'
                    : '0 12px 36px rgba(230, 60, 28, 0.08)')
                  : (isHovered
                    ? '0 20px 50px rgba(0, 0, 0, 0.08)'
                    : '0 4px 20px rgba(0, 0, 0, 0.03)'),
                cursor: 'default',
                overflow: 'hidden',
              }}
            >

              {/* Plan header: icon + name + badge */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                    {/* Plan icon circle */}
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '14px',
                      background: accent.bg,
                      border: `1px solid ${accent.border}`,
                      display: 'grid',
                      placeItems: 'center',
                      padding: '9px',
                      color: accent.icon,
                      transition: 'all 0.3s ease',
                      transform: isHovered ? 'scale(1.08) rotate(-3deg)' : 'scale(1)',
                    }}>
                      <PlanIcon tier={plan.id} />
                    </div>
                    <div>
                      <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: 900,
                        color: 'var(--text)',
                        margin: 0,
                        lineHeight: 1.2,
                      }}>
                        {plan.name}
                      </h3>
                    </div>
                  </div>

                  {isPopular && (
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 900,
                      color: '#fff',
                      background: accent.gradient,
                      padding: '0.25rem 0.7rem',
                      borderRadius: '999px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      whiteSpace: 'nowrap',
                      animation: isHovered ? 'pulseRing 1.5s ease-in-out infinite' : 'none',
                    }}>
                      Most Popular
                    </span>
                  )}
                </div>

                {/* Price block */}
                <div style={{ marginBottom: '1.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
                    <span style={{
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: 'var(--muted)',
                      marginRight: '0.1rem',
                    }}>
                      GH₵
                    </span>
                    <span style={{
                      fontSize: '2.6rem',
                      fontWeight: 900,
                      color: 'var(--text)',
                      lineHeight: 1,
                      letterSpacing: '-0.03em',
                    }}>
                      {plan.priceGhs}
                    </span>
                    <span style={{
                      fontSize: '0.82rem',
                      color: 'var(--muted)',
                      fontWeight: 700,
                      marginLeft: '0.25rem',
                    }}>
                      /{plan.period}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div style={{
                  height: '1px',
                  background: 'var(--border)',
                  marginBottom: '1.2rem',
                }} />

                {/* Feature list */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  marginBottom: '1.6rem',
                }}>
                  {plan.features.map((feat) => (
                    <div
                      key={feat}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.6rem',
                        fontSize: '0.86rem',
                        color: 'var(--text)',
                        fontWeight: 600,
                        lineHeight: 1.4,
                      }}
                    >
                      <span style={{
                        color: isPopular ? 'var(--primary)' : 'var(--success)',
                        marginTop: '2px',
                      }}>
                        <CheckIcon />
                      </span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <button
                type="button"
                disabled={submittingPlanId === plan.id}
                onClick={() => handleChoosePlan(plan.id)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1.2rem',
                  borderRadius: '14px',
                  fontSize: '0.88rem',
                  fontWeight: 850,
                  cursor: submittingPlanId === plan.id ? 'wait' : 'pointer',
                  border: isPopular ? 'none' : '1.5px solid var(--border)',
                  background: isPopular ? accent.gradient : 'transparent',
                  color: isPopular ? '#ffffff' : 'var(--text)',
                  boxShadow: isPopular
                    ? '0 6px 20px rgba(230, 60, 28, 0.22)'
                    : 'none',
                  transition: 'all 0.25s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  opacity: submittingPlanId === plan.id ? 0.7 : 1,
                }}
              >
                {submittingPlanId === plan.id ? (
                  <>
                    <svg style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" />
                    </svg>
                    Activating…
                  </>
                ) : (
                  <>
                    {isSelectingPlan ? `Select ${plan.name}` : plan.ctaText}
                    <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '14px', height: '14px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )
        })}
      </div>

      {/* ── Bottom trust badge row ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.8rem',
        marginTop: '3rem',
        flexWrap: 'wrap',
      }}>
        {[
          { icon: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z', label: 'Secure Payments' },
          { icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Cancel Anytime' },
          { icon: 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.826-1.47-5.114-3.758-6.584-6.584l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z', label: 'Ghana Support' },
        ].map((badge) => (
          <div
            key={badge.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.78rem',
              fontWeight: 750,
              color: 'var(--muted)',
            }}
          >
            <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" style={{ width: '16px', height: '16px', opacity: 0.7 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d={badge.icon} />
            </svg>
            <span>{badge.label}</span>
          </div>
        ))}
      </div>
    </PageContainer>
  )
}
