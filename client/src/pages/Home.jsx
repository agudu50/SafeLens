import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

import heroShieldImg from '../assets/images/hero_shield.png'
import stepSubmitImg from '../assets/images/step_submit.png'
import stepAnalysisImg from '../assets/images/step_analysis.png'
import stepReportImg from '../assets/images/step_report.png'

const testimonials = [
  {
    id: 'emmanuel',
    avatar: 'EK',
    name: 'Emmanuel K.',
    location: 'Accra, Ghana',
    incident: 'MoMo Refund Scam Prevented',
    savings: 'GH₵ 500 Saved',
    rating: 5,
    quote: 'SafeLens flagged a wrong transfer SMS I received. It saved me from sending 500 GHS back to a scammer. Brilliant security tool for everyone in Ghana!'
  },
  {
    id: 'abena',
    avatar: 'AA',
    name: 'Abena A.',
    location: 'Kumasi, Ghana',
    incident: 'Advance Fee Job Scam Flagged',
    savings: '89% Risk Detected',
    rating: 5,
    quote: 'I uploaded a screenshot of a remote job offer charging registration fees. SafeLens immediately showed me an 89% risk score with clear reasons. Extremely helpful!'
  },
  {
    id: 'kofi',
    avatar: 'KB',
    name: 'Kofi B.',
    location: 'Takoradi, Ghana',
    incident: 'Phishing Promo Link Stopped',
    savings: '97% Wallet Risk',
    rating: 5,
    quote: 'The link scanning told me a promotional raffle link was fake before I logged in with my credentials. SafeLens is a must-have tool for mobile money safety.'
  }
]

const presets = [
  {
    id: 'momo',
    title: 'MoMo Wrong Transfer',
    description: 'Fake mobile money refund lure',
    category: 'MoMo Fraud',
    riskLevel: 'high',
    riskScore: 92,
    threatCategory: 'MoMo Transfer & Cashout Fraud',
    vectorBreakdown: [
      { name: 'MoMo Transfer & Cashout Fraud', percentage: 94, match: true, color: 'var(--danger)' },
      { name: 'Impersonation & Advance Fee Scams', percentage: 14, match: false, color: 'var(--warning)' },
      { name: 'Phishing Links & Spoofed Websites', percentage: 6, match: false, color: 'var(--primary)' },
      { name: 'Fake Job & Recruitment Lures', percentage: 2, match: false, color: 'var(--success)' },
    ],
    content: 'Hello, I just sent 850 GHS to your number by mistake. Please send it back immediately to 0551234567. God bless you!',
    threatTags: ['Financial Demand', 'Urgency Pressure', 'Manual Redirect'],
    explanation: 'Tricks victims into sending money to a scammer under the guise of an accidental MoMo transfer. Telecom operators handle reversals directly—you should never send funds back manually.',
    advice: 'Do NOT send money back manually. Advise the sender to dial 100 or contact network support to initiate an official reversal.'
  },
  {
    id: 'promo',
    title: 'Fake Promo Cashout',
    description: 'MTN cashout approval trick',
    category: 'Wallet Exploit',
    riskLevel: 'high',
    riskScore: 97,
    threatCategory: 'MoMo Transfer & Cashout Fraud',
    vectorBreakdown: [
      { name: 'MoMo Transfer & Cashout Fraud', percentage: 97, match: true, color: 'var(--danger)' },
      { name: 'Phishing Links & Spoofed Websites', percentage: 28, match: false, color: 'var(--warning)' },
      { name: 'Impersonation & Advance Fee Scams', percentage: 12, match: false, color: 'var(--primary)' },
      { name: 'Fake Job & Recruitment Lures', percentage: 2, match: false, color: 'var(--success)' },
    ],
    content: 'MTN Customer Care: You won 5,000 GHS in promo! Dial *170# -> option 6 -> option 5 to approve your cashout approval request immediately.',
    threatTags: ['Wallet Authorization', 'Operator Spoofing', 'PIN Prompt'],
    explanation: 'Exploits the MoMo Cash Out feature to drain your wallet. Telecom providers never require customers to approve cashout prompts to receive prize money.',
    advice: 'Never approve cashout requests on *170# for promos. Report the sender number immediately to 1917.'
  },
  {
    id: 'job',
    title: 'Unrealistic Job Offer',
    description: 'Upfront fee remote job scam',
    category: 'Advance Fee',
    riskLevel: 'high',
    riskScore: 89,
    threatCategory: 'Fake Job & Recruitment Lures',
    vectorBreakdown: [
      { name: 'Fake Job & Recruitment Lures', percentage: 89, match: true, color: 'var(--danger)' },
      { name: 'Impersonation & Advance Fee Scams', percentage: 18, match: false, color: 'var(--warning)' },
      { name: 'MoMo Transfer & Cashout Fraud', percentage: 8, match: false, color: 'var(--primary)' },
      { name: 'Phishing Links & Spoofed Websites', percentage: 2, match: false, color: 'var(--success)' },
    ],
    content: 'WORK FROM HOME! Earn 500 GHS daily by liking videos. Pay only 50 GHS registration fee to join. WhatsApp us now on 0501234567.',
    threatTags: ['Upfront Registration Fee', 'Unrealistic Pay', 'Unverified Recruiter'],
    explanation: 'Classic advance-fee scam. Legitimate companies never charge job applicants registration, training, or onboarding fees.',
    advice: 'Refuse to pay upfront registration fees for jobs. Legit employers pay you; they do not solicit fees.'
  },
  {
    id: 'safe',
    title: 'Verified Safe Message',
    description: 'Routine personal conversation',
    category: 'Clean Message',
    riskLevel: 'low',
    riskScore: 12,
    threatCategory: 'Clean Message',
    vectorBreakdown: [
      { name: 'MoMo Transfer & Cashout Fraud', percentage: 2, match: false, color: 'var(--success)' },
      { name: 'Fake Job & Recruitment Lures', percentage: 1, match: false, color: 'var(--success)' },
      { name: 'Phishing Links & Spoofed Websites', percentage: 1, match: false, color: 'var(--success)' },
      { name: 'Impersonation & Advance Fee Scams', percentage: 1, match: false, color: 'var(--success)' },
    ],
    content: 'Hey Ama, are we still meeting at the Accra Mall food court by 4:00 PM today? Let me know so I can order lunch.',
    threatTags: ['Personal Context', 'Zero Financial Directives', 'No Unknown Links'],
    explanation: 'Conversational message with zero threat indicators, financial demands, or suspicious URLs.',
    advice: 'Message is verified safe. No scam indicators detected.'
  }
]

const FAQs = [
  {
    question: 'How does SafeLens identify scams?',
    answer: 'SafeLens scans text and images for common scam language patterns (such as wrong-transaction MoMo codes, unverified promotional URLs, cashout directives) and rates threat variables like pressure tactics, financial threats, and sender verification scores.',
  },
  {
    question: 'Can SafeLens scan images or screenshots?',
    answer: 'Yes! Under the "Scan" tab, select "Screenshot" to upload images of WhatsApp chats, SMS alerts, or email threads. SafeLens runs text extraction to analyze screenshot messages.',
  },
  {
    question: 'How do I report a MoMo scam in Ghana?',
    answer: 'If you identify a Mobile Money scam, report it to your network provider. For MTN, forward the SMS or number to 1917 for free. You can also contact the Cyber Security Authority (CSA) by dialing 292 or sending a WhatsApp to 0501147477.',
  },
]

const tickerReports = [
  { region: 'Accra', type: 'MoMo Refund Fraud', risk: 'High', time: '2 mins ago' },
  { region: 'Kumasi', type: 'Fake Job Agent Fee', risk: 'High', time: '14 mins ago' },
  { region: 'Takoradi', type: 'MTN Cashout Attack', risk: 'High', time: '38 mins ago' },
  { region: 'Tema', type: 'Suspicious Loan App Link', risk: 'Medium', time: '1 hr ago' },
  { region: 'Tamale', type: 'Wrong Transfer SMS', risk: 'High', time: '2 hrs ago' },
]

export default function Home({ user }) {
  const [selectedPreset, setSelectedPreset] = useState(presets[0])
  const [activeFAQ, setActiveFAQ] = useState(null)
  const [tickerIndex, setTickerIndex] = useState(0)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerReports.length)
    }, 4500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index)
  }

  const toneMap = {
    low: 'low',
    medium: 'medium',
    high: 'high',
  }

  const locationIcon = (
    <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.9rem', height: '0.9rem', marginRight: '0.2rem', verticalAlign: 'middle', display: 'inline-block' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )

  return (
    <PageContainer>


      {/* Live Scam Ticker */}
      <div className="ticker-container animate-slide-up">
        <span className="ticker-label">Live Tracker</span>
        <div className="ticker-wrap">
          <div className="ticker-content">
            {/* Primary run */}
            {tickerReports.map((report, idx) => (
              <span className="ticker-item" key={`orig-${idx}`}>
                {locationIcon}
                <strong style={{ color: 'var(--text)' }}>{report.region}</strong>
                <span style={{ color: 'var(--muted)' }}>:</span>
                <span>{report.type}</span>
                <span style={{ color: report.risk === 'High' ? 'var(--danger)' : 'var(--warning)', fontWeight: 700, fontSize: '0.78rem', background: report.risk === 'High' ? 'rgba(220, 38, 38, 0.1)' : 'rgba(217, 119, 6, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px', textTransform: 'uppercase', display: 'inline-block' }}>
                  {report.risk} Risk
                </span>
                <span className="ticker-time">{report.time}</span>
              </span>
            ))}
            {/* Cloned run for seamless marquee animation */}
            {tickerReports.map((report, idx) => (
              <span className="ticker-item" key={`clone-${idx}`}>
                {locationIcon}
                <strong style={{ color: 'var(--text)' }}>{report.region}</strong>
                <span style={{ color: 'var(--muted)' }}>:</span>
                <span>{report.type}</span>
                <span style={{ color: report.risk === 'High' ? 'var(--danger)' : 'var(--warning)', fontWeight: 700, fontSize: '0.78rem', background: report.risk === 'High' ? 'rgba(220, 38, 38, 0.1)' : 'rgba(217, 119, 6, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px', textTransform: 'uppercase', display: 'inline-block' }}>
                  {report.risk} Risk
                </span>
                <span className="ticker-time">{report.time}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="hero-card animate-slide-up delay-1">
        <div className="hero-copy">
          <div style={{ marginBottom: '0.8rem' }}>
            <Badge tone="neutral">
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem', marginRight: '0.35rem', display: 'inline-block', verticalAlign: 'middle', color: 'var(--primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              AI-POWERED SCAM INTELLIGENCE
            </Badge>
          </div>

          <h1>Not sure if it&apos;s a <span className="text-highlight">scam?</span></h1>
          <p className="hero-text">Let SafeLens take a closer look. We help people in Ghana and beyond review suspicious messages, links, and screenshots before taking financial risks.</p>

          {/* Key Trust Signals */}
          <div className="hero-trust-grid">
            <span className="trust-pill">
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem', color: 'var(--primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              Instant AI Scan
            </span>
            <span className="trust-pill">
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem', color: 'var(--success)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              99% Detection
            </span>
            <span className="trust-pill">
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem', color: 'var(--primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zM12 3v18m-9-9h18" />
              </svg>
              Ghana MoMo Protection
            </span>
          </div>

          <div className="hero-actions">
            {user ? (
              <>
                <Button as={Link} to="/scan" variant="primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  Scan a Message
                </Button>
                <Button as={Link} to="/history" variant="secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Scan History
                </Button>
              </>
            ) : (
              <Button as={Link} to="/login" variant="primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H2.25" />
                </svg>
                Sign In to Get Started
              </Button>
            )}
            <Button as={Link} to="/about" variant="secondary">
              Learn How It Works
            </Button>
          </div>
        </div>

        <div className="hero-panel" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '24px', padding: '1.4rem', boxShadow: '0 12px 32px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.2rem', alignItems: 'center' }}>
            
            {/* 3D Shield Image Graphic */}
            <div style={{ background: 'var(--surface-alt)', borderRadius: '18px', padding: '0.6rem', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', height: '170px', borderRadius: '14px', overflow: 'hidden' }}>
                <img src={heroShieldImg} alt="SafeLens Security Engine" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
              </div>
              <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.04em', textTransform: 'uppercase', background: 'var(--surface)', padding: '0.15rem 0.55rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
                  AI SHIELD ENGINE ACTIVE
                </span>
              </div>
            </div>

            {/* Live Threat Ticker Card Content */}
            <div className="animate-fade-in" key={tickerIndex}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span className="live-pulse-badge">
                  <span className="live-pulse-dot" />
                  LIVE THREAT MONITOR
                </span>
                <span className="hero-risk-chip danger">HIGH RISK</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--muted)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                {locationIcon}
                <span>{tickerReports[tickerIndex].region}, Ghana</span>
              </div>

              <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1.15rem', fontWeight: 900, color: 'var(--text)' }}>
                {tickerReports[tickerIndex].type}
              </h3>

              <p style={{ margin: '0 0 0.8rem 0', fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.45, fontWeight: 500 }}>
                Active scam incident reported in this region. Risk level is high; remain vigilant before authorizing transactions.
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: 'var(--muted)', paddingTop: '0.6rem', borderTop: '1px solid var(--border)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: 650 }}>
                  <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.8rem', height: '0.8rem', color: 'var(--primary)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {tickerReports[tickerIndex].time}
                </span>
                <span style={{ fontWeight: 700, color: 'var(--success)' }}>• Verified Feed</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Sandbox Simulator */}
      <section className="section-block animate-slide-up delay-2">
        <div className="section-heading" style={{ textAlign: 'center', marginBottom: '1.6rem' }}>
          <Badge tone="medium">Try SafeLens Now</Badge>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 900, margin: '0.4rem 0 0.3rem' }}>Instant Threat Sandbox</h2>
          <p className="hero-text" style={{ maxWidth: '650px', margin: '0 auto' }}>Select a sample threat below to watch SafeLens evaluate scam signals in real-time.</p>
        </div>

        {/* Preset Selector Pill Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.6rem' }}>
          {presets.map((preset) => {
            const isActive = selectedPreset.id === preset.id
            const isHigh = preset.riskLevel === 'high'
            const badgeColor = isHigh ? 'var(--danger)' : 'var(--success)'
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setSelectedPreset(preset)}
                style={{
                  border: '1px solid ' + (isActive ? 'var(--primary)' : 'var(--border)'),
                  background: isActive ? 'var(--surface-alt)' : 'var(--surface)',
                  color: 'var(--text)',
                  padding: '0.65rem 1.1rem',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  boxShadow: isActive ? '0 4px 14px rgba(230, 60, 28, 0.15)' : 'none',
                  transition: 'all 0.2s ease',
                  transform: isActive ? 'scale(1.03)' : 'none'
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: badgeColor }} />
                <span>{preset.title}</span>
              </button>
            )
          })}
        </div>

        {/* Live Scanner Display HUD Card - Full Width Balanced Layout */}
        <div className="scanner-card animate-fade-in" key={selectedPreset.id} style={{ padding: '1.8rem', background: 'var(--surface-alt)', borderRadius: '24px', border: '1px solid var(--border)', maxWidth: '1050px', margin: '0 auto', boxShadow: '0 8px 32px rgba(0,0,0,0.04)' }}>
          
          {/* Header Bar spanning full width */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                <span className="live-pulse-badge">
                  <span className="live-pulse-dot" />
                  REAL-TIME AI VERDICT
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: 850, color: selectedPreset.riskLevel === 'high' ? 'var(--danger)' : 'var(--success)', background: selectedPreset.riskLevel === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', padding: '0.15rem 0.5rem', borderRadius: '999px', border: `1px solid ${selectedPreset.riskLevel === 'high' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)'}` }}>
                  {selectedPreset.riskLevel.toUpperCase()} RISK
                </span>
              </div>
              <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: 'var(--text)' }}>{selectedPreset.title}</h3>
            </div>

            {/* Score Ring Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'var(--surface)', padding: '0.6rem 1.1rem', borderRadius: '14px', border: '1px solid var(--border)' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.66rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', display: 'block' }}>Threat Index</span>
                <span style={{ fontSize: '0.74rem', fontWeight: 850, color: selectedPreset.riskLevel === 'high' ? 'var(--danger)' : 'var(--success)' }}>
                  {selectedPreset.threatCategory}
                </span>
              </div>
              <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: selectedPreset.riskLevel === 'high' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)', border: `2px solid ${selectedPreset.riskLevel === 'high' ? 'var(--danger)' : 'var(--success)'}`, display: 'grid', placeItems: 'center', fontWeight: 900, color: selectedPreset.riskLevel === 'high' ? 'var(--danger)' : 'var(--success)', fontSize: '1.05rem' }}>
                {selectedPreset.riskScore}%
              </div>
            </div>
          </div>

          {/* Full-Width Grid 1: 3D Graphic Image + Submitted Text + Detected Triggers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem', marginBottom: '1.2rem' }}>
            
            {/* 3D Image Banner Card */}
            <div style={{ background: 'var(--surface)', padding: '0.6rem', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '100%', height: '140px', borderRadius: '12px', overflow: 'hidden', background: 'var(--surface-alt)' }}>
                <img 
                  src={
                    selectedPreset.id === 'momo-refund' ? stepAnalysisImg :
                    selectedPreset.id === 'promo-cashout' ? heroShieldImg :
                    selectedPreset.id === 'fake-job' ? stepSubmitImg : stepReportImg
                  } 
                  alt="AI Threat Scanner Graphic" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '0.4rem', display: 'block' }} 
                />
              </div>
            </div>

            {/* Submitted Snippet Box */}
            <div style={{ background: 'var(--surface)', padding: '1rem 1.2rem', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.04em', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                Submitted Text Snippet
              </span>
              <p style={{ margin: 0, fontSize: '0.92rem', fontWeight: 650, color: 'var(--text)', lineHeight: 1.45, fontStyle: 'italic' }}>
                &ldquo;{selectedPreset.content}&rdquo;
              </p>
            </div>

            {/* Risk Triggers Box */}
            <div style={{ background: 'var(--surface)', padding: '1rem 1.2rem', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.45rem' }}>
                Detected Risk Triggers
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {selectedPreset.threatTags.map((tag) => (
                  <span key={tag} style={{ fontSize: '0.76rem', fontWeight: 800, color: selectedPreset.riskLevel === 'high' ? 'var(--danger)' : 'var(--success)', background: selectedPreset.riskLevel === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', padding: '0.22rem 0.6rem', borderRadius: '8px', border: `1px solid ${selectedPreset.riskLevel === 'high' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Full-Width Grid 2: AI Fraud Vectors (Spans Full Width across all 4 bars) */}
          {selectedPreset.vectorBreakdown && (
            <div style={{ background: 'var(--surface)', padding: '1rem 1.2rem', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '1.2rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.6rem' }}>
                AI Fraud Likelihood Vectors
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem' }}>
                {selectedPreset.vectorBreakdown.map((v) => (
                  <div key={v.name} style={{ background: 'var(--surface-alt)', padding: '0.55rem 0.75rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 750, marginBottom: '0.3rem', color: v.match ? 'var(--danger)' : 'var(--muted)' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.name}</span>
                      <span style={{ fontWeight: 900 }}>{v.percentage}%</span>
                    </div>
                    <div style={{ width: '100%', height: '5px', background: 'var(--surface)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${v.percentage}%`, height: '100%', background: v.match ? 'var(--danger)' : v.color || 'var(--primary)', borderRadius: '999px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full-Width Grid 3: AI Pattern Reason + Actionable Guidance */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.2rem' }}>
            <div style={{ background: 'var(--surface)', padding: '1.1rem 1.25rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <span style={{ background: 'var(--surface-alt)', padding: '0.2rem 0.55rem', borderRadius: '6px', border: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ color: 'var(--primary)' }}>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" strokeLinecap="round" />
                    <circle cx="12" cy="8" r="1" fill="currentColor" />
                  </svg>
                  <strong style={{ fontSize: '0.72rem', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>AI Pattern Reason</strong>
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--muted)', lineHeight: 1.5, fontWeight: 500 }}>
                {selectedPreset.explanation}
              </p>
            </div>

            <div style={{ background: 'var(--surface)', padding: '1.1rem 1.25rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <span style={{ background: 'var(--surface-alt)', padding: '0.2rem 0.55rem', borderRadius: '6px', border: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ color: 'var(--success)' }}>
                    <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <strong style={{ fontSize: '0.72rem', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Actionable Guidance</strong>
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text)', lineHeight: 1.5, fontWeight: 700 }}>
                {selectedPreset.advice}
              </p>
            </div>
          </div>

          <div style={{ marginTop: '1.4rem', display: 'flex', justifyContent: 'flex-end' }}>
            <Button as={Link} to={user ? "/scan" : "/login"} variant="primary" style={{ padding: '0.65rem 1.35rem', fontSize: '0.88rem' }}>
              {user ? "Scan Your Own Message \u2192" : "Sign In to Start Scanning \u2192"}
            </Button>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="section-block animate-slide-up delay-3">
        <div className="section-heading">
          <Badge tone="low">HOW SAFELENS WORKS</Badge>
          <h2>Simple Steps to Stay Safer</h2>
          <p className="hero-text" style={{ marginTop: '0.4rem' }}>Our 3-stage security process helps you evaluate suspicious communications before taking financial risks.</p>
        </div>

        <div className="steps-grid">
          {/* Step 01 */}
          <div className="info-card step-card animate-slide-up delay-4" style={{ overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '165px', borderRadius: '20px', overflow: 'hidden', marginBottom: '1rem', background: 'var(--surface-alt)', padding: '0.4rem' }}>
              <img src={stepSubmitImg} alt="Submit Content" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', borderRadius: '16px' }} />
            </div>

            <div className="step-card__header">
              <span className="step-number">01</span>
              <div className="step-icon-wrapper">
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1.35rem', height: '1.35rem', color: 'var(--primary)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                </svg>
              </div>
            </div>

            <h3 className="step-card__title">Submit Content</h3>
            <p className="step-card__desc">Paste a suspicious SMS message, promotion link, or WhatsApp screenshot.</p>

            <div className="step-features">
              <span className="step-feature-chip">SMS &amp; Text</span>
              <span className="step-feature-chip">Web Links</span>
              <span className="step-feature-chip">Screenshots</span>
            </div>
          </div>

          {/* Step 02 */}
          <div className="info-card step-card animate-slide-up delay-5" style={{ overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '165px', borderRadius: '20px', overflow: 'hidden', marginBottom: '1rem', background: 'var(--surface-alt)', padding: '0.4rem' }}>
              <img src={stepAnalysisImg} alt="AI Pattern Analysis" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', borderRadius: '16px' }} />
            </div>

            <div className="step-card__header">
              <span className="step-number">02</span>
              <div className="step-icon-wrapper">
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1.35rem', height: '1.35rem', color: 'var(--warning)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                </svg>
              </div>
            </div>

            <h3 className="step-card__title">AI Pattern Analysis</h3>
            <div className="step-features">
              <span className="step-feature-chip">MoMo Lure Check</span>
              <span className="step-feature-chip">Urgency Audit</span>
              <span className="step-feature-chip">Domain Safety</span>
            </div>
          </div>

          {/* Step 03 */}
          <div className="info-card step-card animate-slide-up delay-6" style={{ overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '165px', borderRadius: '20px', overflow: 'hidden', marginBottom: '1rem', background: 'var(--surface-alt)', padding: '0.4rem' }}>
              <img src={stepReportImg} alt="Protect & Report" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', borderRadius: '16px' }} />
            </div>

            <div className="step-card__header">
              <span className="step-number">03</span>
              <div className="step-icon-wrapper">
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1.35rem', height: '1.35rem', color: 'var(--success)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
            </div>

            <h3 className="step-card__title">Protect & Report</h3>
            <p className="step-card__desc">Get an instant 0–100% Risk Score breakdown, clear safety advice, and one-tap options to report scams to authorities.</p>

            <div className="step-features">
              <span className="step-feature-chip">Scam Risk Score</span>
              <span className="step-feature-chip">Safety Steps</span>
              <span className="step-feature-chip">CSA / 1917 Report</span>
            </div>
          </div>
        </div>
      </section>

      {/* Ghanaian User Testimonials */}
      <section className="section-block testimonials-section animate-slide-up delay-4">
        <div className="section-heading">
          <Badge tone="neutral">VERIFIED REVIEWS</Badge>
          <h2>Safeguarding Ghanaian Wallets</h2>
          <p className="hero-text" style={{ marginTop: '0.4rem' }}>Real stories from users across Ghana who protected their funds using SafeLens AI scanning.</p>
        </div>

        {/* Live Community Impact Statistics Bar */}
        <div className="impact-stats-bar">
          <div className="impact-stat">
            <span className="impact-stat__number">GH₵ 120K+</span>
            <span className="impact-stat__label">Protected Funds</span>
          </div>
          <div className="impact-stat__divider" />
          <div className="impact-stat">
            <span className="impact-stat__number">14,200+</span>
            <span className="impact-stat__label">Scam Scans Completed</span>
          </div>
          <div className="impact-stat__divider" />
          <div className="impact-stat">
            <span className="impact-stat__number">99.4%</span>
            <span className="impact-stat__label">AI Detection Accuracy</span>
          </div>
        </div>

        <div className="testimonial-carousel-container">
          <button 
            type="button" 
            className="carousel-control-btn carousel-control-btn--prev"
            aria-label="Previous review"
            onClick={() => setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
          >
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1.2rem', height: '1.2rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div className="info-card testimonial-card animate-fade-in" key={testimonials[activeTestimonial].id}>
            <div className="testimonial-card__header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span className="testimonial-verified-badge">
                  <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.75rem', height: '0.75rem', color: 'var(--success)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  VERIFIED USER
                </span>
                <span className="testimonial-tag">{testimonials[activeTestimonial].incident}</span>
              </div>
              <span className="testimonial-savings-pill">{testimonials[activeTestimonial].savings}</span>
            </div>

            {/* Star Rating Icons */}
            <div className="testimonial-rating">
              {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                <svg key={i} fill="currentColor" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem', color: 'var(--warning)' }}>
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>

            <p className="testimonial-quote">&ldquo;{testimonials[activeTestimonial].quote}&rdquo;</p>

            <div className="testimonial-user">
              <div className="testimonial-avatar">{testimonials[activeTestimonial].avatar}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text)' }}>{testimonials[activeTestimonial].name}</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  {locationIcon}
                  {testimonials[activeTestimonial].location}
                </span>
              </div>
            </div>
          </div>

          <button 
            type="button" 
            className="carousel-control-btn carousel-control-btn--next"
            aria-label="Next review"
            onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
          >
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1.2rem', height: '1.2rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        <div className="carousel-indicators">
          {testimonials.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              className={`carousel-dot ${activeTestimonial === idx ? 'carousel-dot--active' : ''}`}
              aria-label={`Go to testimonial ${idx + 1}`}
              onClick={() => setActiveTestimonial(idx)}
            />
          ))}
        </div>
      </section>

      {/* Daily Security Tips Banner CTA */}
      <section className="scanner-card animate-slide-up" style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '16px', marginTop: '2rem', padding: '1.5rem 1.6rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <Badge tone="good">
              <span className="live-pulse-dot" style={{ background: 'var(--success)', marginRight: '0.35rem' }} />
              DAILY SECURITY TIPS &amp; QUIZ
            </Badge>
            <h3 style={{ margin: '0.4rem 0 0.2rem 0', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)' }}>
              Master MoMo &amp; Cyber Fraud Awareness
            </h3>
            <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--muted)' }}>
              Read daily rotating protection tips, test your awareness with interactive quizzes, and download security checklists.
            </p>
          </div>
          <Button as={Link} to="/safety-tips" variant="primary" style={{ gap: '0.4rem', whiteSpace: 'nowrap' }}>
            <span>Explore Safety Tips</span>
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.9rem', height: '0.9rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Button>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="faq-container animate-slide-up delay-5">
        <div className="section-heading">
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="faq-list">
          {FAQs.map((faq, index) => (
            <div className="faq-item" key={index}>
              <button className="faq-question" onClick={() => toggleFAQ(index)}>
                <span>{faq.question}</span>
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem', transform: activeFAQ === index ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease', color: activeFAQ === index ? 'var(--primary)' : 'var(--text)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {activeFAQ === index && (
                <div className="faq-answer animate-fade-in">
                  <p style={{ margin: 0 }}>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </PageContainer>
  )
}
