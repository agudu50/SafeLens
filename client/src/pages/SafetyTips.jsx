import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

// Daily tips data tailored for Ghana & West Africa
const DAILY_TIPS = [
  {
    id: 1,
    category: 'MoMo & Money',
    title: 'Never Share Your Mobile Money PIN Under Any Circumstances',
    tag: 'MoMo Rule #1',
    impact: 'HIGH CRITICAL',
    content: 'No official MTN, Telecel, or AT agent will EVER call or text asking for your 4-digit MoMo PIN. If someone claims your wallet is locked or money was sent by mistake and asks for your PIN, end the call immediately.',
    action: 'Report the caller number to 1917 (MTN) or 292 (CSA).',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1.4rem', height: '1.4rem', color: 'var(--danger)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    )
  },
  {
    id: 2,
    category: 'MoMo & Money',
    title: 'The "Wrong Transfer" Refund Trap',
    tag: 'Scam Alert',
    impact: 'HIGH',
    content: 'Scammers send a fake SMS formatted to look like a official MoMo credit message (e.g., "Received GHS 450.00 from..."), then call crying that they sent money to your number by mistake. ALWAYS check your actual MoMo balance via *170# or *110# before sending a single pesewa back!',
    action: 'Do not transfer funds back directly; ask them to contact their telco customer service.',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1.4rem', height: '1.4rem', color: 'var(--warning)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    )
  },
  {
    id: 3,
    category: 'Phishing & Links',
    title: 'Fake 100x Promo & Free Data Links',
    tag: 'Web Phishing',
    impact: 'HIGH',
    content: 'Beware of WhatsApp links promising "MTN 50th Anniversary Free 10GB Data" or "Ghana Govt Youth Grant". Official telco promos use legitimate domains like mtn.com.gh or telecel.com.gh, never `.xyz`, `.top`, `.free-bonus.site`, or WhatsApp broadcast links.',
    action: 'Paste suspicious links into SafeLens AI Scanner before opening.',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1.4rem', height: '1.4rem', color: 'var(--primary)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    )
  },
  {
    id: 4,
    category: 'Fake Jobs & Promo',
    title: 'Upfront Registration Fees for "Remote Jobs"',
    tag: 'Recruitment Fraud',
    impact: 'MEDIUM',
    content: 'Legitimate employers and recruitment agencies will NEVER ask you to pay GHS 50 - GHS 300 via MoMo for "application forms", "medical screening", or "ID badge processing". Any job offer demanding upfront payment on WhatsApp/Telegram is a scam.',
    action: 'Verify job openings directly on official company career pages.',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1.4rem', height: '1.4rem', color: 'var(--primary)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v1.5m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    )
  },
  {
    id: 5,
    category: 'WhatsApp & Calls',
    title: 'Account Takeover OTP Warnings',
    tag: 'Account Security',
    impact: 'HIGH CRITICAL',
    content: 'If you receive an SMS containing a WhatsApp verification code or banking OTP that you did NOT request, someone is attempting to hijack your account. Never forward or read out SMS codes to anyone calling on the phone.',
    action: 'Enable 2-Step Verification in WhatsApp Settings > Account immediately.',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1.4rem', height: '1.4rem', color: 'var(--success)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    )
  }
]

// Educational Self-Defense Guide Slides for all visitors
const DEFENSE_SLIDES = [
  {
    id: 'pin',
    tag: 'WALLET SECURITY',
    title: 'Never Share Your 4-Digit MoMo PIN',
    subtitle: 'MoMo PIN & Banking OTP Shield',
    content: 'No official MTN, Telecel, or AT agent will EVER call or text asking for your 4-digit MoMo PIN or banking OTP on the phone. End suspicious impersonation calls immediately.',
    rule: 'Rule: Never enter or read out your MoMo PIN for anyone calling on the phone.',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.5rem', height: '1.5rem', color: 'var(--danger)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    )
  },
  {
    id: 'balance',
    tag: 'USSD TRAP CHECK',
    title: 'Always Verify Balance via *170# or *110#',
    subtitle: 'Wrong Transfer SMS Trap Check',
    content: 'Scammers send fake SMS formatted to look like official MoMo credit alerts, then call claiming they sent money by mistake. ALWAYS dial *170# or *110# to check actual balance before sending money back.',
    rule: 'Rule: Never refund money based on an unverified SMS notification alone.',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.5rem', height: '1.5rem', color: 'var(--warning)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    )
  },
  {
    id: 'otp',
    tag: 'HIJACK DEFENSE',
    title: 'Enable WhatsApp 2-Step Verification',
    subtitle: 'Account Hijack & Takeover Lock',
    content: 'Set up a 6-digit PIN in WhatsApp Settings > Account > 2-Step Verification. If you receive an SMS verification code you did not request, someone is attempting to hijack your account.',
    rule: 'Rule: Never forward SMS verification codes to anyone requesting them.',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.5rem', height: '1.5rem', color: 'var(--primary)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    )
  },
  {
    id: 'links',
    tag: 'PHISHING SHIELD',
    title: 'Scan Suspicious Links Before Opening',
    subtitle: 'Web Phishing & Fake Promo Shield',
    content: 'Beware of WhatsApp broadcast links promising free 10GB data or youth grants. Fake domains (`.xyz`, `.top`) steal login credentials and mobile money accounts.',
    rule: 'Rule: Paste unverified links into SafeLens AI Scanner before opening.',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.5rem', height: '1.5rem', color: 'var(--primary)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    )
  }
]

export default function SafetyTips({ user }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [currentTipIndex, setCurrentTipIndex] = useState(0)
  const [secretAlertAcknowledged, setSecretAlertAcknowledged] = useState(false)

  // Slideshow carousel state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  // Auto slide effect
  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % DEFENSE_SLIDES.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [isPlaying])

  const filteredTips = activeCategory === 'All'
    ? DAILY_TIPS
    : DAILY_TIPS.filter(t => t.category === activeCategory)

  const currentTip = DAILY_TIPS[currentTipIndex % DAILY_TIPS.length]

  const handleNextTip = () => {
    setCurrentTipIndex(prev => (prev + 1) % DAILY_TIPS.length)
  }

  const activeSlide = DEFENSE_SLIDES[currentSlideIndex]

  return (
    <PageContainer>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
        
        {/* Header Hero */}
        <section className="hero-card" style={{ padding: '2.8rem 1.8rem', textAlign: 'center', position: 'relative', overflow: 'hidden', borderRadius: '20px' }}>
          {/* Subtle glowing mesh backdrop */}
          <div style={{ position: 'absolute', top: '-40%', left: '50%', transform: 'translateX(-50%)', width: '480px', height: '280px', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none', borderRadius: '50%' }} />

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Badge tone="good">
              <span className="live-pulse-dot" style={{ background: 'var(--success)', marginRight: '0.35rem' }} />
              DAILY SCAM PROTECTION TIPS
            </Badge>
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, margin: '0.3rem 0 0.7rem 0', color: 'var(--text)', lineHeight: 1.25 }}>
            Ghana Cyber &amp; MoMo Safety Guide
          </h1>
          
          <p style={{ color: 'var(--muted)', fontSize: '0.98rem', maxWidth: '660px', margin: '0 auto 1.4rem auto', lineHeight: 1.65 }}>
            Learn how to recognize impersonation scams, protect your mobile money wallet, and stay 1 step ahead of cyber fraudsters in Ghana.
          </p>

          {/* Quick Value Chips */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginBottom: '1.6rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)', background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.3rem 0.75rem', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem', color: 'var(--success)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              100% Free Cyber Guidance
            </span>

            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)', background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.3rem 0.75rem', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem', color: 'var(--primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.826-1.47-5.114-3.758-6.584-6.584l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              CSA 292 &amp; Operator Direct
            </span>

            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)', background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.3rem 0.75rem', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem', color: 'var(--warning)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Daily Rotating Tips
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.88rem', flexWrap: 'wrap' }}>
            <Button as={Link} to={user ? "/dashboard" : "/login"} variant="primary" style={{ gap: '0.5rem', padding: '0.65rem 1.3rem', fontSize: '0.92rem' }}>
              {user ? "Go to Dashboard" : "Sign In to Get Started"}
            </Button>
            <Button as="a" href="#daily-tip" variant="secondary" style={{ gap: '0.5rem', padding: '0.65rem 1.3rem', fontSize: '0.92rem' }}>
              <span>View Today's Featured Tip</span>
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.9rem', height: '0.9rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
              </svg>
            </Button>
          </div>
        </section>

        {/* Zero-Trust Secret Protection Alert Prompt Banner */}
        <section
          className="animate-slide-up"
          style={{
            background: secretAlertAcknowledged 
              ? 'rgba(16, 185, 129, 0.05)' 
              : 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(245, 158, 11, 0.06) 100%)',
            border: `1.5px solid ${secretAlertAcknowledged ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
            borderRadius: '20px',
            padding: '1.4rem 1.6rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.03)',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: secretAlertAcknowledged ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${secretAlertAcknowledged ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              display: 'grid',
              placeItems: 'center',
              color: secretAlertAcknowledged ? 'var(--success)' : 'var(--danger)',
              flexShrink: 0
            }}>
              {secretAlertAcknowledged ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(16, 185, 129, 0.15)"/>
                  <polyline points="9 12 11 14 15 10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(239, 68, 68, 0.15)"/>
                  <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                  <circle cx="12" cy="16" r="1.2" fill="currentColor"/>
                </svg>
              )}
            </div>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.15rem' }}>
                <span style={{
                  fontSize: '0.66rem',
                  fontWeight: 850,
                  color: secretAlertAcknowledged ? 'var(--success)' : 'var(--danger)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  background: secretAlertAcknowledged ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '6px'
                }}>
                  {secretAlertAcknowledged ? 'ZERO-TRUST ADVISORY CONFIRMED' : 'CRITICAL SECURITY PROMPT'}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>•</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600 }}>Never Share Secret Credentials</span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 850, margin: 0, color: 'var(--text)' }}>
                {secretAlertAcknowledged 
                  ? 'Credential Safety Commitment Active' 
                  : 'Ensure Your Secret Keys & Credentials Are NEVER Shared!'}
              </h3>
            </div>
          </div>

          {/* Advisory Subtitle */}
          <p style={{ fontSize: '0.86rem', color: 'var(--muted)', margin: '0 0 1.1rem 0', lineHeight: 1.55 }}>
            Impersonators often pose as MTN, Telecel, AT agents, bank officers, or sweepstake managers. <strong style={{ color: 'var(--text)' }}>Legitimate agents will NEVER ask for your secret authorization keys.</strong>
          </p>

          {/* 4 Interactive Secret Protection Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '0.85rem',
            marginBottom: '1.2rem'
          }}>
            {/* Secret 1: MoMo PIN */}
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '0.95rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(220, 38, 38, 0.1)', color: 'var(--danger)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: 'var(--text)' }}>MoMo 4-Digit PIN</h4>
                <p style={{ fontSize: '0.76rem', color: 'var(--muted)', margin: 0, lineHeight: 1.4 }}>
                  Never reveal your 4-digit PIN over the phone or approve unsolicited USSD prompts.
                </p>
              </div>
            </div>

            {/* Secret 2: SMS OTP Codes */}
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '0.95rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 9h.01M12 9h.01M16 9h.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: 'var(--text)' }}>SMS OTP Verification</h4>
                <p style={{ fontSize: '0.76rem', color: 'var(--muted)', margin: 0, lineHeight: 1.4 }}>
                  6-digit OTP codes grant total access. Never read or forward them to caller requests.
                </p>
              </div>
            </div>

            {/* Secret 3: Banking Passwords */}
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '0.95rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--primary)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: 'var(--text)' }}>Banking Passwords</h4>
                <p style={{ fontSize: '0.76rem', color: 'var(--muted)', margin: 0, lineHeight: 1.4 }}>
                  Your mobile app passwords and online login details belong strictly to you.
                </p>
              </div>
            </div>

            {/* Secret 4: Card CVV & Secret Keys */}
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '0.95rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: 'var(--text)' }}>Card CVV & Expiry</h4>
                <p style={{ fontSize: '0.76rem', color: 'var(--muted)', margin: 0, lineHeight: 1.4 }}>
                  The 3-digit code on card backs and expiry dates should never be typed on untrusted forms.
                </p>
              </div>
            </div>
          </div>

          {/* Action Affirmation Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.8rem',
            flexWrap: 'wrap',
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--success)' }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" fill="rgba(16,185,129,0.15)"/>
                <polyline points="9 12 11 14 15 10" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)' }}>
                SafeLens Zero-Trust Protocol Active
              </span>
            </div>

            <button
              onClick={() => setSecretAlertAcknowledged(prev => !prev)}
              className="button-primary"
              style={{
                background: secretAlertAcknowledged 
                  ? 'var(--surface-alt)' 
                  : 'linear-gradient(135deg, var(--danger) 0%, #dc2626 100%)',
                color: secretAlertAcknowledged ? 'var(--success)' : '#ffffff',
                border: secretAlertAcknowledged ? '1px solid rgba(16, 185, 129, 0.3)' : 'none',
                padding: '0.6rem 1.25rem',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.2s ease',
                boxShadow: secretAlertAcknowledged ? 'none' : '0 4px 12px rgba(220, 38, 38, 0.25)'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                {secretAlertAcknowledged ? (
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                ) : (
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                )}
              </svg>
              <span>
                {secretAlertAcknowledged 
                  ? 'Advisory Acknowledged ✓' 
                  : 'I Understand — I Will Never Share My Secrets'}
              </span>
            </button>
          </div>
        </section>

        {/* Feature Spotlight: Tip of the Day */}
        <section id="daily-tip" className="scanner-card" style={{ position: 'relative', background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.6rem' }}>
          <div className="safety-featured-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.15)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                {currentTip.icon}
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  FEATURED DAILY TIP #{currentTip.id}
                </span>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text)' }}>
                  {currentTip.title}
                </h3>
              </div>
            </div>

            <Button onClick={handleNextTip} variant="ghost" className="safety-featured-next-btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}>
              <span>Next Tip</span>
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Button>
          </div>

          <p style={{ color: 'var(--text)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1rem', background: 'var(--surface)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
            {currentTip.content}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.6rem', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success)', fontWeight: 700 }}>
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.95rem', height: '0.95rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Recommended Action: {currentTip.action}</span>
            </div>
            <span style={{ color: 'var(--muted)', fontSize: '0.76rem', fontWeight: 600 }}>
              Category: {currentTip.category}
            </span>
          </div>
        </section>

        {/* Category Filters */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.6rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text)' }}>
              Explore Security Tips
            </h2>
          </div>

          <div className="safety-cat-scroll-row" style={{ marginBottom: '1.2rem' }}>
            {['All', 'MoMo & Money', 'Phishing & Links', 'Fake Jobs & Promo', 'WhatsApp & Calls'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`safety-cat-btn ${activeCategory === cat ? 'safety-cat-btn--active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid of Tips */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.2rem' }}>
            {filteredTips.map(tip => (
              <div
                key={tip.id}
                className="results-card safety-grid-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1.4rem',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                  transition: 'all 0.25s ease'
                }}
              >
                <div>
                  {/* Top Row: Category Pill on Left, Threat Tag on Right */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.9rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--primary)', background: 'rgba(56, 189, 248, 0.12)', padding: '0.22rem 0.65rem', borderRadius: '999px', border: '1px solid rgba(56, 189, 248, 0.2)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span className="live-pulse-dot" style={{ width: '6px', height: '6px', background: 'var(--primary)' }} />
                      {tip.category}
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '999px', background: tip.impact.includes('CRITICAL') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: tip.impact.includes('CRITICAL') ? 'var(--danger)' : 'var(--warning)', border: '1px solid ' + (tip.impact.includes('CRITICAL') ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)') }}>
                      {tip.tag}
                    </span>
                  </div>

                  {/* Title & Icon Block */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.7rem' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--surface-alt)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: '2px' }}>
                      {tip.icon}
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1.35 }}>
                      {tip.title}
                    </h3>
                  </div>

                  {/* Content Text */}
                  <p style={{ fontSize: '0.86rem', color: 'var(--muted)', lineHeight: 1.6, margin: 0, paddingLeft: '0.1rem' }}>
                    {tip.content}
                  </p>
                </div>

                {/* Safety Action Callout Box */}
                <div style={{ marginTop: '1.1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', background: 'var(--surface-alt)', padding: '0.7rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
                    <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.95rem', height: '0.95rem', color: 'var(--success)', flexShrink: 0, marginTop: '2px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div style={{ fontSize: '0.8rem', lineHeight: 1.45 }}>
                      <strong style={{ color: 'var(--success)', display: 'block', marginBottom: '1px' }}>Safety Action:</strong>
                      <span style={{ color: 'var(--text)' }}>{tip.action}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Scam Self-Defense Guide - Educational Auto-Moving Slideshow */}
        <section className="scanner-card safety-guide-section" style={{ background: 'var(--surface-alt)', padding: '1.8rem 1.4rem', position: 'relative', overflow: 'hidden' }}>
          {/* Header Bar with Unified Controls */}
          <div className="safety-guide-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.2rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem', color: 'var(--primary)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, color: 'var(--text)' }}>
                  Daily Scam Self-Defense Guide
                </h3>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.84rem', margin: 0 }}>
                Essential security rules to protect your mobile money wallet, phone, and accounts in Ghana.
              </p>
            </div>

            {/* Unified Control Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--surface)', padding: '0.25rem 0.5rem', borderRadius: '999px', border: '1px solid var(--border)' }}>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text)',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.2rem 0.4rem'
                }}
                title={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
              >
                {isPlaying ? (
                  <>
                    <svg fill="currentColor" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem', color: 'var(--primary)' }}>
                      <path d="M15.75 5.25v13.5m-7.5-13.5v13.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <svg fill="currentColor" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem', color: 'var(--success)' }}>
                      <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
                    </svg>
                    <span>Play</span>
                  </>
                )}
              </button>

              <div style={{ width: '1px', height: '14px', background: 'var(--border)' }} />

              <button
                onClick={() => setCurrentSlideIndex(prev => (prev === 0 ? DEFENSE_SLIDES.length - 1 : prev - 1))}
                style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--surface-alt)', border: 'none', color: 'var(--text)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
                title="Previous Guide"
              >
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              <button
                onClick={() => setCurrentSlideIndex(prev => (prev + 1) % DEFENSE_SLIDES.length)}
                style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--surface-alt)', border: 'none', color: 'var(--text)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
                title="Next Guide"
              >
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>

          {/* Active Educational Slide Card */}
          <div
            key={currentSlideIndex}
            className="animate-fade-in safety-slide-card"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '1.4rem',
              position: 'relative',
              boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
              transition: 'all 0.3s ease'
            }}
          >
            {/* Top Slide Category Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.9rem', flexWrap: 'wrap', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--primary)', background: 'rgba(56, 189, 248, 0.12)', padding: '0.22rem 0.65rem', borderRadius: '999px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                {activeSlide.tag}
              </span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)' }}>
                GUIDE {currentSlideIndex + 1} OF {DEFENSE_SLIDES.length}
              </span>
            </div>

            {/* Slide Body */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.9rem', marginBottom: '0.8rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--surface-alt)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                {activeSlide.icon}
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.2rem 0', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)' }}>
                  {activeSlide.title}
                </h3>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)' }}>
                  {activeSlide.subtitle}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
              {activeSlide.content}
            </p>

            {/* Rule Callout Box */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', background: 'var(--surface-alt)', padding: '0.7rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.95rem', height: '0.95rem', color: 'var(--success)', flexShrink: 0, marginTop: '2px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.45 }}>
                {activeSlide.rule}
              </span>
            </div>
          </div>

          {/* Indicator Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.45rem', marginTop: '1.1rem' }}>
            {DEFENSE_SLIDES.map((slide, idx) => {
              const isActive = currentSlideIndex === idx

              return (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlideIndex(idx)}
                  style={{
                    width: isActive ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '999px',
                    background: isActive ? 'var(--primary)' : 'var(--border)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  title={`Go to Guide ${idx + 1}`}
                />
              )
            })}
          </div>
        </section>

        {/* Official Threat Advisories & Fraud Alerts Section */}
        <section className="scanner-card animate-slide-up" style={{ padding: '1.6rem 1.4rem', marginBottom: '2rem', background: 'var(--surface-alt)', borderRadius: '20px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.4rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '0 0 0.2rem 0', color: 'var(--text)' }}>
                Official Threat Advisories &amp; Fraud Alerts
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: 0 }}>
                Live bulletins issued by Cyber Security Authority (CSA) and Telecom Operators.
              </p>
            </div>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--success)', background: 'rgba(16, 185, 129, 0.12)', padding: '0.2rem 0.6rem', borderRadius: '999px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
              UPDATED TODAY
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Advisory 1 */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1rem 1.1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary)', background: 'rgba(56, 189, 248, 0.12)', padding: '0.15rem 0.55rem', borderRadius: '999px' }}>
                    Telecom Alert
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)' }}>
                    Just Updated
                  </span>
                </div>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.12)', padding: '0.15rem 0.55rem', borderRadius: '999px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                  HIGH RISK
                </span>
              </div>
              <h4 style={{ fontSize: '0.96rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--text)' }}>
                Surge in Fake MoMo Cash Out Prompts (*170#)
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: 0, lineHeight: 1.45 }}>
                Fraudsters are initiating remote Cash Out approval requests. Reject any unexpected cashout PIN prompts immediately.
              </p>
            </div>

            {/* Advisory 2 */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1rem 1.1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary)', background: 'rgba(56, 189, 248, 0.12)', padding: '0.15rem 0.55rem', borderRadius: '999px' }}>
                    Employment Fraud
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)' }}>
                    Today
                  </span>
                </div>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--warning)', background: 'rgba(245, 158, 11, 0.12)', padding: '0.15rem 0.55rem', borderRadius: '999px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                  MEDIUM RISK
                </span>
              </div>
              <h4 style={{ fontSize: '0.96rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--text)' }}>
                Fake Job Agent Upfront Registration Fee Lures
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: 0, lineHeight: 1.45 }}>
                Fake recruiters demanding GHS 50 - 200 mobile money transfers before scheduling online video interviews.
              </p>
            </div>

            {/* Advisory 3 */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1rem 1.1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary)', background: 'rgba(56, 189, 248, 0.12)', padding: '0.15rem 0.55rem', borderRadius: '999px' }}>
                    Cyber Advisory
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)' }}>
                    Yesterday
                  </span>
                </div>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.12)', padding: '0.15rem 0.55rem', borderRadius: '999px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                  CRITICAL
                </span>
              </div>
              <h4 style={{ fontSize: '0.96rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--text)' }}>
                Phishing Domain Targets Ghana Banking Apps
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: 0, lineHeight: 1.45 }}>
                Unverified APK downloads and cloned bank login portals detected on social messaging platforms.
              </p>
            </div>
          </div>
        </section>

        {/* Emergency Hotline Bar */}
        <section style={{ textAlign: 'center', padding: '1.4rem 1.2rem', background: 'var(--surface-alt)', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text)' }}>
            Facing an active scam attempt in Ghana right now?
          </h4>
          <p style={{ fontSize: '0.84rem', color: 'var(--muted)', margin: '0 0 0.9rem 0' }}>
            Call official Ghana cyber security and network fraud emergency helplines:
          </p>
          
          <div className="safety-hotline-grid" style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <a href="tel:292" className="hotline-pill safety-hotline-pill" style={{ padding: '0.55rem 0.95rem', fontSize: '0.84rem', background: 'var(--surface)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '0.9rem', height: '0.9rem', color: 'var(--primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.826-1.47-5.114-3.758-6.584-6.584l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <span>CSA Hotline: <strong>292</strong></span>
            </a>

            <a href="tel:1917" className="hotline-pill safety-hotline-pill" style={{ padding: '0.55rem 0.95rem', fontSize: '0.84rem', background: 'var(--surface)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '0.9rem', height: '0.9rem', color: 'var(--warning)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.826-1.47-5.114-3.758-6.584-6.584l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <span>MTN Fraud: <strong>1917</strong></span>
            </a>

            <a href="tel:100" className="hotline-pill safety-hotline-pill" style={{ padding: '0.55rem 0.95rem', fontSize: '0.84rem', background: 'var(--surface)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '0.9rem', height: '0.9rem', color: 'var(--success)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.826-1.47-5.114-3.758-6.584-6.584l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <span>Telecel Cash: <strong>100</strong></span>
            </a>

            <a href="tel:100" className="hotline-pill safety-hotline-pill" style={{ padding: '0.55rem 0.95rem', fontSize: '0.84rem', background: 'var(--surface)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '0.9rem', height: '0.9rem', color: 'var(--primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.826-1.47-5.114-3.758-6.584-6.584l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <span>AT Money: <strong>100</strong></span>
            </a>
          </div>
        </section>

      </div>
    </PageContainer>
  )
}
