import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'
import LivePhoneSimulator from '../components/common/LivePhoneSimulator'

// Core Safety Rules - Simple, clear advice for everyday life in Ghana
const CORE_SAFETY_RULES = [
  {
    id: 'pin',
    title: 'Keep Your MoMo PIN Private',
    subtitle: 'Rule #1 for Mobile Money Users',
    description: 'No official agent from MTN, Telecel, or AT will ever ask for your 4-digit MoMo PIN over a phone call. If anyone asks for your PIN, end the call immediately.',
    actionText: 'Never share your PIN with anyone',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1.3rem', height: '1.3rem', color: 'var(--danger)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 00-2.25 2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    )
  },
  {
    id: 'balance',
    title: 'Verify Your Balance First',
    subtitle: 'Avoid Fake Refund Traps',
    description: 'Scammers send SMS text messages that look like official cash deposits, then call asking for a refund. Always dial *170# or *110# to confirm your balance before sending money.',
    actionText: 'Check balance via USSD before transferring',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1.3rem', height: '1.3rem', color: 'var(--warning)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    )
  },
  {
    id: 'lock',
    title: 'Lock Your WhatsApp Account',
    subtitle: 'Prevent Account Hijacking',
    description: 'Turn on 2-Step Verification inside WhatsApp Settings. Never forward or read out 6-digit SMS verification codes to anyone requesting them on the phone.',
    actionText: 'Enable 2-Step PIN in WhatsApp Settings',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1.3rem', height: '1.3rem', color: 'var(--primary)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    )
  },
  {
    id: 'links',
    title: 'Scan Links Before Tapping',
    subtitle: 'Protect Yourself from Phishing',
    description: 'Be cautious of WhatsApp links offering free 10GB data, anniversary gifts, or government grants. Official offers will only appear on official corporate websites.',
    actionText: 'Paste links into SafeLens Scanner',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1.3rem', height: '1.3rem', color: 'var(--success)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    )
  }
]

// Common Scams & Human Counter-Measures
const COMMON_SCAMS = [
  {
    id: 'momo-refund',
    category: 'Mobile Money',
    title: 'Fake Transfer Refund SMS',
    scamTactic: 'You get an SMS saying money was sent in error, followed by a frantic phone call asking you to refund it immediately.',
    humanSolution: 'Do not panic or send money back right away. Dial *170# (MTN) or *110# (Telecel/AT) to check your real account balance first.',
  },
  {
    id: 'job-fee',
    category: 'Job Offers',
    title: 'Upfront Registration Fee for Remote Jobs',
    scamTactic: 'A recruiter on WhatsApp offers a high-paying job but asks for GHS 50 - 200 via MoMo for "staff ID forms" or "medical checks".',
    humanSolution: 'Legitimate employers will never ask candidates to pay money via Mobile Money to get a job offer.',
  },
  {
    id: 'emergency-call',
    category: 'Impersonation',
    title: 'Urgent Hospital or Police Emergency Call',
    scamTactic: 'Someone calls claiming your child, sibling, or parent had an accident and urgently needs a deposit sent to a doctor.',
    humanSolution: 'Take a breath and call your family member directly on their personal phone number to confirm their safety first.',
  },
  {
    id: 'free-data',
    category: 'Web Links',
    title: 'WhatsApp Broadcast Free Data & Grant Links',
    scamTactic: 'Messages promising "MTN Anniversary Free 10GB Data" or "Youth Relief Grants" asking you to fill out your details.',
    humanSolution: 'Official telecom promotions only happen on official websites like mtn.com.gh. Unofficial `.xyz` or `.top` links are fake.',
  }
]

export default function SafetyTips({ user }) {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredScams = activeCategory === 'All'
    ? COMMON_SCAMS
    : COMMON_SCAMS.filter(s => s.category === activeCategory)

  return (
    <PageContainer>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.2rem' }}>
        
        {/* Simple, Clean Hero Header */}
        <section
          style={{
            background: 'var(--surface-alt)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '2.5rem 1.8rem',
            textAlign: 'center'
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              SAFETY &amp; FRAUD PREVENTION GUIDE
            </span>
          </div>

          <h1 style={{ fontSize: '2.1rem', fontWeight: 900, margin: '0 0 0.6rem 0', color: 'var(--text)' }}>
            Stay Safe Online with Simple Daily Habits
          </h1>

          <p style={{ color: 'var(--muted)', fontSize: '0.96rem', maxWidth: '640px', margin: '0 auto 1.6rem auto', lineHeight: 1.6 }}>
            Cybersecurity doesn&rsquo;t need to be complicated. Learn how to protect your mobile money wallet, spot scam messages, and keep your family safe in Ghana.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
            <Button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'instant' })
                navigate('/scanner')
              }}
              variant="primary"
              style={{ padding: '0.65rem 1.3rem', fontSize: '0.9rem' }}
            >
              Scan a Suspicious Message
            </Button>
            <Button as="a" href="#demo" variant="secondary" style={{ padding: '0.65rem 1.3rem', fontSize: '0.9rem' }}>
              Watch Live Phone Demo &darr;
            </Button>
          </div>
        </section>

        {/* Animated Mobile Phone Demo Section */}
        <LivePhoneSimulator />

        {/* 4 Core Safety Rules Grid */}
        <section>
          <div style={{ marginBottom: '1.2rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 0 0.2rem 0', color: 'var(--text)' }}>
              4 Essential Safety Rules
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--muted)', margin: 0 }}>
              Simple habits to keep your accounts and funds secure every day.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.1rem' }}>
            {CORE_SAFETY_RULES.map((rule) => (
              <div
                key={rule.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '1.3rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--surface-alt)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      {rule.icon}
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)' }}>
                        {rule.subtitle}
                      </span>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text)' }}>
                        {rule.title}
                      </h3>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.86rem', color: 'var(--muted)', lineHeight: 1.55, margin: '0 0 1rem 0' }}>
                    {rule.description}
                  </p>
                </div>

                <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 750, color: 'var(--primary)' }}>
                    ✓ {rule.actionText}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Common Scams & How to Respond */}
        <section style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '20px', padding: '1.8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1.4rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 0 0.2rem 0', color: 'var(--text)' }}>
                Common Scams &amp; How to Respond
              </h2>
              <p style={{ fontSize: '0.86rem', color: 'var(--muted)', margin: 0 }}>
                Recognize common scam tactics and know the exact steps to take.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {['All', 'Mobile Money', 'Job Offers', 'Impersonation', 'Web Links'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '0.35rem 0.8rem',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                    fontWeight: activeCategory === cat ? 800 : 700,
                    cursor: 'pointer',
                    border: activeCategory === cat ? '1px solid var(--primary)' : '1px solid var(--border)',
                    background: activeCategory === cat ? 'var(--primary)' : 'var(--surface)',
                    color: activeCategory === cat ? '#ffffff' : 'var(--text)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.1rem' }}>
            {filteredScams.map((scam) => (
              <div
                key={scam.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '1.3rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary)', background: 'rgba(56, 189, 248, 0.12)', padding: '0.15rem 0.55rem', borderRadius: '6px', display: 'inline-block', marginBottom: '0.6rem' }}>
                    {scam.category}
                  </span>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 850, margin: '0 0 0.5rem 0', color: 'var(--text)' }}>
                    {scam.title}
                  </h3>

                  <div style={{ marginBottom: '0.9rem' }}>
                    <strong style={{ display: 'block', fontSize: '0.76rem', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                      The Scam Tactic:
                    </strong>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text)', margin: 0, lineHeight: 1.5 }}>
                      {scam.scamTactic}
                    </p>
                  </div>
                </div>

                <div style={{ background: 'var(--surface-alt)', padding: '0.75rem 0.9rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  <strong style={{ display: 'block', fontSize: '0.74rem', color: 'var(--success)', textTransform: 'uppercase', marginBottom: '0.15rem' }}>
                    Recommended Action:
                  </strong>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.45, fontWeight: 700 }}>
                    {scam.humanSolution}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Clean Emergency Helplines Section */}
        <section style={{ textAlign: 'center', padding: '1.8rem 1.4rem', background: 'var(--surface-alt)', borderRadius: '20px', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1.2rem', fontWeight: 900, color: 'var(--text)' }}>
            Official Fraud &amp; Emergency Helplines
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--muted)', margin: '0 0 1.2rem 0' }}>
            If you suspect you are currently targeted by a scam, call official support lines immediately:
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a href="tel:292" style={{ textDecoration: 'none', background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.6rem 1.1rem', borderRadius: '999px', fontSize: '0.84rem', fontWeight: 800, color: 'var(--text)', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
              <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '0.9rem', height: '0.9rem', color: 'var(--primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.826-1.47-5.114-3.758-6.584-6.584l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <span>Cyber Security Authority: <strong style={{ color: 'var(--primary)' }}>292</strong></span>
            </a>

            <a href="tel:1917" style={{ textDecoration: 'none', background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.6rem 1.1rem', borderRadius: '999px', fontSize: '0.84rem', fontWeight: 800, color: 'var(--warning)' }}>
              <span>MTN Ghana Fraud Hotline: <strong>1917</strong></span>
            </a>

            <a href="tel:100" style={{ textDecoration: 'none', background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.6rem 1.1rem', borderRadius: '999px', fontSize: '0.84rem', fontWeight: 800, color: 'var(--success)' }}>
              <span>Telecel Cash: <strong>100</strong></span>
            </a>

            <a href="tel:100" style={{ textDecoration: 'none', background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.6rem 1.1rem', borderRadius: '999px', fontSize: '0.84rem', fontWeight: 800, color: 'var(--primary)' }}>
              <span>AT Money: <strong>100</strong></span>
            </a>
          </div>
        </section>

      </div>
    </PageContainer>
  )
}
