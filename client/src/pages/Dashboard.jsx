import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import SecurityChatbot from '../components/SecurityChatbot'
import { getScanHistory } from '../services/scannerService'
import ProtectionPlan from '../features/protection/ProtectionPlan'
import Button from '../components/ui/Button'

const graphData = [
  { day: 'Mon', scans: 4, highRisk: 2 },
  { day: 'Tue', scans: 6, highRisk: 3 },
  { day: 'Wed', scans: 3, highRisk: 1 },
  { day: 'Thu', scans: 8, highRisk: 5 },
  { day: 'Fri', scans: 5, highRisk: 2 },
  { day: 'Sat', scans: 7, highRisk: 4 },
  { day: 'Sun', scans: 9, highRisk: 6 },
]

const threatVectors = [
  { name: 'MoMo Transfer & Cashout Fraud', percentage: 54, count: '142 Flagged', color: 'var(--danger)' },
  { name: 'Fake Job & Recruitment Lures', percentage: 24, count: '63 Flagged', color: 'var(--warning)' },
  { name: 'Phishing Links & Spoofed Websites', percentage: 14, count: '38 Flagged', color: 'var(--primary)' },
  { name: 'Impersonation & Advance Fee Scams', percentage: 8, count: '21 Flagged', color: 'var(--success)' },
]

const defaultAuditTrail = [
  { id: 'scan-003', type: 'link', riskLevel: 'high', riskScore: 94, threatCategory: 'Phishing Links & Spoofed Websites', originalContent: 'http://mtn-gh-promo.xyz/claim-cashout', submittedAt: '12 mins ago' },
  { id: 'scan-001', type: 'message', riskLevel: 'high', riskScore: 89, threatCategory: 'Fake Job & Recruitment Lures', originalContent: 'Congratulations! You have been selected for a remote job offer...', submittedAt: '2 hours ago' },
  { id: 'scan-002', type: 'screenshot', riskLevel: 'medium', riskScore: 62, threatCategory: 'Impersonation & Advance Fee Scams', originalContent: 'Your account has been flagged. Click immediately to secure profile.', submittedAt: 'Yesterday' },
  { id: 'scan-004', type: 'email', riskLevel: 'high', riskScore: 92, threatCategory: 'MoMo Transfer & Cashout Fraud', originalContent: 'Urgent notice: MoMo wallet transaction reversal approval required.', submittedAt: '2 days ago' },
]

const tickerReports = [
  { prompt: 'Never share your MoMo 4-digit PIN with callers claiming to be MTN agents.', priority: 'CRITICAL', time: 'Just now' },
  { prompt: 'Do not disclose 6-digit SMS OTP codes over phone calls under any circumstances.', priority: 'CRITICAL', time: '5 mins ago' },
  { prompt: 'Verify banking website URLs carefully before entering GCB or bank passwords.', priority: 'HIGH', time: '18 mins ago' },
  { prompt: 'Never approve unsolicited *170# USSD cashout prompt requests on your phone.', priority: 'CRITICAL', time: '35 mins ago' },
  { prompt: 'Report suspicious SIM swap callers immediately to Cyber Security Authority (CSA 292).', priority: 'HIGH', time: '1 hr ago' },
  { prompt: 'Ignore remote job offers requiring upfront registration fee payments before interview.', priority: 'HIGH', time: '2 hrs ago' },
  { prompt: 'Never refund money from SMS alerts without verifying your official MoMo balance.', priority: 'HIGH', time: '3 hrs ago' },
  { prompt: 'Telco & Bank customer service will NEVER ask for your secret password or PIN.', priority: 'CRITICAL', time: '4 hrs ago' },
]

export default function Dashboard({ user }) {
  const [scanAuditTrail, setScanAuditTrail] = useState(defaultAuditTrail)
  const [chartView, setChartView] = useState('donut') // 'donut' or 'bars'
  const [hoveredSlice, setHoveredSlice] = useState(null)
  const [hoveredBar, setHoveredBar] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all') // 'all', 'link', 'screenshot', 'message', 'email'
  const [auditPage, setAuditPage] = useState(1)
  const AUDIT_ITEMS_PER_PAGE = 3
  const [currentTickerIdx, setCurrentTickerIdx] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Interactive Security Checklist state
  const [checklist, setChecklist] = useState([
    { id: 'whatsapp2fa', label: 'WhatsApp 2-Step Verification', weight: 25, checked: true, desc: 'Protects chat credentials and OTPs' },
    { id: 'pinshield', label: 'MTN & Telco PIN Shield', weight: 25, checked: true, desc: 'Blocks unauthorized USSD cashout attempts' },
    { id: 'urlscan', label: 'Domain Extension Checker', weight: 25, checked: false, desc: 'Auto-flags unverified TLDs (.xyz, .top)' },
    { id: 'hotline', label: 'Saved emergency contact CSA 292', weight: 25, checked: false, desc: 'Immediate direct fraud escalation line' },
  ])

  useEffect(() => {
    const historyData = getScanHistory()
    if (historyData && historyData.length > 0) {
      setScanAuditTrail(historyData.slice(0, 8))
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTickerIdx((prev) => (prev + 1) % tickerReports.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const clockTimer = setInterval(() => {
      setCurrentTime(new Date())
    }, 10000)
    return () => clearInterval(clockTimer)
  }, [])

  // Dynamic Time-of-day greeting calculation
  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  // Format live date and time
  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })

  const formattedTimeStr = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })

  // Calculate dynamic security metrics
  const readinessScore = checklist.reduce((acc, item) => item.checked ? acc + item.weight : acc, 0)
  const vulnerabilityScore = 100 - readinessScore
  const scamsAvoided = checklist.filter(item => item.checked).length + 2

  const handleCheckboxToggle = (id) => {
    setChecklist(prev => prev.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ))
  }

  // Filter scan history
  const filteredScans = scanAuditTrail.filter(item => {
    if (activeFilter === 'all') return true
    return item.type.toLowerCase() === activeFilter.toLowerCase()
  })

  // SVG Pie (Donut) Chart variables
  const radius = 55
  const circumference = 2 * Math.PI * radius // ~345.575
  
  // Slices: MoMo (54%), Fake Job (24%), Phishing (14%), Impersonation (8%)
  const slices = [
    { name: 'MoMo Transfer & Cashout Fraud', percentage: 54, count: '142 Flagged', color: 'var(--danger)', strokeDasharray: `${(54/100) * circumference} ${circumference}`, strokeDashoffset: '0' },
    { name: 'Fake Job & Recruitment Lures', percentage: 24, count: '63 Flagged', color: 'var(--warning)', strokeDasharray: `${(24/100) * circumference} ${circumference}`, strokeDashoffset: `-${(54/100) * circumference}` },
    { name: 'Phishing Links & Spoofed Websites', percentage: 14, count: '38 Flagged', color: 'var(--primary)', strokeDasharray: `${(14/100) * circumference} ${circumference}`, strokeDashoffset: `-${((54+24)/100) * circumference}` },
    { name: 'Impersonation & Advance Fee Scams', percentage: 8, count: '21 Flagged', color: 'var(--success)', strokeDasharray: `${(8/100) * circumference} ${circumference}`, strokeDashoffset: `-${((54+24+14)/100) * circumference}` }
  ]

  const activeSliceInfo = hoveredSlice !== null ? slices[hoveredSlice] : slices[0]

  const locationIcon = (
    <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.9rem', height: '0.9rem', marginRight: '0.2rem', verticalAlign: 'middle', display: 'inline-block' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )

  return (
    <PageContainer>
      <div className="dash-container">
        {/* Keyframe Animations Injection & Mobile Overrides */}
        <style>{`
          @keyframes radarSweep {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes radarPulse {
            0% { transform: scale(0.9); opacity: 0.2; }
            50% { transform: scale(1.15); opacity: 0.65; }
            100% { transform: scale(0.9); opacity: 0.2; }
          }
          @keyframes alertPulseGlow {
            0%, 100% { transform: scale(1); filter: drop-shadow(0 0 1px var(--danger)); }
            50% { transform: scale(1.05); filter: drop-shadow(0 0 6px var(--danger)); }
          }
          .radar-sweep-line {
            transform-origin: 22px 22px;
            animation: radarSweep 3s linear infinite;
          }
          .radar-pulse-ring {
            transform-origin: 22px 22px;
            animation: radarPulse 2s ease-in-out infinite;
          }

          @media (max-width: 640px) {
            .dash-hero-card {
              padding: 1.2rem 1rem !important;
            }
            .dash-hero-title {
              font-size: 1.45rem !important;
            }
            .dash-hero-btn {
              width: 100% !important;
              justify-content: center !important;
              margin-top: 0.4rem !important;
            }
            .ticker-top-bar {
              padding: 0.55rem 0.85rem !important;
            }
            .ticker-row-responsive {
              padding: 0.75rem 0.85rem !important;
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 0.75rem !important;
            }
            .ticker-right-controls {
              width: 100% !important;
              justify-content: space-between !important;
            }
            .ticker-badge-text {
              font-size: 0.68rem !important;
              padding: 0.35rem 0.65rem !important;
            }
          }
        `}</style>

        {/* Live Threat Radar Sweep HUD Card */}
        <div 
          className="animate-slide-up" 
          style={{ 
            marginBottom: '1.4rem', 
            background: 'var(--surface-alt)', 
            border: '1px solid var(--border)',
            borderRadius: '18px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
          }}
        >
          {/* ── Safety Header Bar ── */}
          <div className="ticker-top-bar" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            padding: '0.65rem 1rem',
            background: 'rgba(220, 38, 38, 0.04)',
            borderBottom: '1px solid rgba(220, 38, 38, 0.1)',
            flexWrap: 'wrap'
          }}>
            {/* Left: Shield icon + label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--danger)', flexShrink: 0 }}>
                <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(220,38,38,0.08)"/>
                <polyline points="9 12 11 14 15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontSize: '0.72rem', fontWeight: 850, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                SafeLens Active Monitoring
              </span>
            </div>

            {/* Right: Stats pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--muted)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '0.18rem 0.5rem', whiteSpace: 'nowrap' }}>
                264 Scans Today
              </span>
              <span style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--success)', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)', borderRadius: '6px', padding: '0.18rem 0.5rem', whiteSpace: 'nowrap' }}>
                4 Shields Active
              </span>
            </div>
          </div>

          {/* ── Ticker Main Body ── */}
          <div style={{ padding: '0.9rem 1rem' }}>
            {/* Top row: Priority badge on Left | Timestamp + Nav on Right */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span 
                key={`badge-${currentTickerIdx}`}
                className="animate-fade-in"
                style={{
                  background: tickerReports[currentTickerIdx].priority === 'CRITICAL' 
                    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
                    : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#ffffff',
                  padding: '0.28rem 0.7rem',
                  borderRadius: '6px',
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  whiteSpace: 'nowrap',
                  boxShadow: tickerReports[currentTickerIdx].priority === 'CRITICAL' 
                    ? '0 2px 8px rgba(239, 68, 68, 0.3)' 
                    : '0 2px 8px rgba(245, 158, 11, 0.3)'
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(255,255,255,0.2)"/>
                  <line x1="12" y1="9" x2="12" y2="13" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round"/>
                  <circle cx="12" cy="17" r="1" fill="#ffffff"/>
                </svg>
                {tickerReports[currentTickerIdx].priority} ADVISORY
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 650, whiteSpace: 'nowrap' }}>
                  {tickerReports[currentTickerIdx].time}
                </span>

                {/* Prev / Next controls */}
                <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1px' }}>
                  <button 
                    onClick={() => setCurrentTickerIdx(prev => (prev - 1 + tickerReports.length) % tickerReports.length)}
                    style={{ border: 'none', background: 'transparent', color: 'var(--text)', width: '28px', height: '28px', display: 'grid', placeItems: 'center', cursor: 'pointer', borderRadius: '5px', transition: 'background 0.15s ease' }}
                    title="Previous Intercept"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button 
                    onClick={() => setCurrentTickerIdx(prev => (prev + 1) % tickerReports.length)}
                    style={{ border: 'none', background: 'transparent', color: 'var(--text)', width: '28px', height: '28px', display: 'grid', placeItems: 'center', cursor: 'pointer', borderRadius: '5px', transition: 'background 0.15s ease' }}
                    title="Next Intercept"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <polyline points="9 18 15 12 9 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Prompt text box - beautifully structured */}
            <div 
              key={currentTickerIdx} 
              className="animate-fade-in" 
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '0.8rem 1rem'
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--danger)', display: 'inline-block' }} className="live-pulse-dot" />
                <span style={{ fontSize: '0.68rem', fontWeight: 850, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  IMPORTANT SECURITY PROMPT
                </span>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text)', fontWeight: 750, margin: 0, lineHeight: 1.45 }}>
                {tickerReports[currentTickerIdx].prompt}
              </p>
          </div>
        </div>
      </div>

        {/* Dashboard Header Bar */}
        <section
          className="dash-hero-card animate-fade-in"
          style={{
            background: 'var(--surface-alt)',
            padding: '1.8rem 1.6rem',
            marginBottom: '1.5rem',
            borderRadius: '20px',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.2rem' }}>
            <div>
              {/* Status indicator + Live Clock badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.45rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span className="live-pulse-dot" style={{ width: '8px', height: '8px', background: 'var(--success)' }} />
                  <span style={{ fontSize: '0.74rem', fontWeight: 850, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    REAL-TIME SECURITY COMMAND CENTER
                  </span>
                </div>
                <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>•</span>
                {/* Live Clock Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  padding: '0.2rem 0.6rem',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: 'var(--text)'
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--primary)', flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>{formattedDate}</span>
                  <span style={{ color: 'var(--muted)', opacity: 0.6 }}>|</span>
                  <span style={{ color: 'var(--primary)' }}>{formattedTimeStr}</span>
                </div>
              </div>

              {/* Main Heading with Time-based Greeting & User Name */}
              <h1 className="dash-hero-title" style={{ fontSize: '1.85rem', fontWeight: 900, margin: '0 0 0.35rem 0', color: 'var(--text)', lineHeight: 1.2 }}>
                {getGreeting()}, <span style={{ color: 'var(--primary)' }}>{user?.name ? user.name.split(' ')[0] : 'Kofi'}</span>
              </h1>

              {/* Subtitle */}
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5, maxWidth: '640px' }}>
                Welcome back to your security command center. Monitor threat activity, check vulnerability status, and run instant AI audits.
              </p>
            </div>

            <Link
              to="/history"
              className="button-primary dash-hero-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.7rem 1.3rem',
                borderRadius: '999px',
                fontWeight: 800,
                fontSize: '0.88rem',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(230, 60, 28, 0.25)',
                whiteSpace: 'nowrap'
              }}
            >
              <span>View Scan History</span>
            </Link>
          </div>
        </section>

        {/* Protection Plan Quota Overview */}
        <ProtectionPlan />

        {/* Quick Actions Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem', marginBottom: '1.8rem' }}>
          <Link to="/scan" style={{ textDecoration: 'none' }}>
            <Button variant="primary" style={{ width: '100%', justifyContent: 'center' }}>
              🔍 New AI Scan
            </Button>
          </Link>

          <Link to="/history" style={{ textDecoration: 'none' }}>
            <Button variant="secondary" style={{ width: '100%', justifyContent: 'center' }}>
              View Scan History
            </Button>
          </Link>

          <Link to="/safety-tips" style={{ textDecoration: 'none' }}>
            <Button variant="secondary" style={{ width: '100%', justifyContent: 'center' }}>
              🛡️ View Safety Tips
            </Button>
          </Link>
        </div>

        {/* 4 Core Overview Metrics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.2rem', marginBottom: '1.8rem' }} className="animate-slide-up">
          
          {/* Card 1: Total Scans */}
          <div className="dash-stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 850, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Scans
              </span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--primary)' }}>
                <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 900, margin: 0, color: 'var(--text)', lineHeight: 1 }}>
                {scanAuditTrail.length}
              </h2>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)' }}>Audits</span>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', background: 'rgba(56, 189, 248, 0.1)', padding: '0.2rem 0.55rem', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              100% Analysis Accuracy
            </span>
          </div>

          {/* Card 2: Scams Avoided */}
          <div className="dash-stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 850, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Scams Avoided
              </span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--danger)' }}>
                <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 900, margin: 0, color: 'var(--danger)', lineHeight: 1 }}>
                {scamsAvoided}
              </h2>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--danger)' }}>Threats Intercepted</span>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', fontWeight: 850, color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', padding: '0.2rem 0.55rem', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" stroke="currentColor" strokeWidth="2.5" fill="rgba(239, 68, 68, 0.2)"/>
              </svg>
              GH₵ {scamsAvoided * 450} Saved
            </span>
          </div>

          {/* Card 3: Vulnerability Score */}
          <div className="dash-stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 850, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Vulnerability Score
              </span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--warning)' }}>
                <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 900, margin: 0, color: 'var(--warning)', lineHeight: 1 }}>
                {vulnerabilityScore}%
              </h2>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--warning)' }}>Risk Level</span>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', fontWeight: 850, color: 'var(--warning)', background: 'rgba(245, 158, 11, 0.1)', padding: '0.2rem 0.55rem', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5"/>
                <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="1" fill="currentColor"/>
              </svg>
              {vulnerabilityScore >= 50 ? 'Moderate Exposure' : 'Secured Core'}
            </span>
          </div>

          {/* Card 4: Defense Readiness */}
          <div className="dash-stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 850, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Defense Readiness
              </span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--success)' }}>
                <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 900, margin: 0, color: 'var(--success)', lineHeight: 1 }}>
                {readinessScore}%
              </h2>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--success)' }}>Shield Capacity</span>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', fontWeight: 850, color: 'var(--success)', background: 'rgba(16, 185, 129, 0.1)', padding: '0.2rem 0.55rem', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {readinessScore === 100 ? 'Fully Shielded' : 'Action Required'}
            </span>
          </div>

        </div>

        {/* FEATURE 1 GRID: Weekly Graph & Interactive Diagnostics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.4rem', marginBottom: '2rem' }} className="animate-slide-up delay-1">
          {/* Card A: Weekly Graph */}
          <section className="scanner-card" style={{ padding: '1.5rem', background: 'var(--surface-alt)', borderRadius: '20px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justify: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.6rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 900, margin: '0 0 0.2rem 0', color: 'var(--text)' }}>
                    Weekly Threat Detection &amp; Scan Volume
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>
                    Visual analytics tracking scan frequency vs flagged scam attempts.
                  </p>
                </div>

                {/* Chart Legend Pills */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.72rem', fontWeight: 800 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text)' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', display: 'inline-block' }} />
                    Total Scans
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text)' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--danger)', display: 'inline-block' }} />
                    Flagged Scams
                  </span>
                </div>
              </div>

              {/* Dynamic Tooltip / Daily Details Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', minHeight: '38px', background: 'var(--surface)', padding: '0.55rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
                {hoveredBar !== null ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.78rem', width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--text)', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--primary)', flexShrink: 0 }}>
                        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      {{ Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' }[graphData[hoveredBar].day]}
                    </span>
                    <span style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                      <span style={{ color: 'var(--primary)', fontWeight: 800 }}>
                        Total Scans: {graphData[hoveredBar].scans}
                      </span>
                      <span style={{ color: 'var(--danger)', fontWeight: 800 }}>
                        Flagged Scams: {graphData[hoveredBar].highRisk}
                      </span>
                      <span style={{ color: 'var(--muted)', fontWeight: 700 }}>
                        Threat Ratio: {Math.round((graphData[hoveredBar].highRisk / graphData[hoveredBar].scans) * 100)}%
                      </span>
                    </span>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem', color: 'var(--primary)', flexShrink: 0 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.083 1.083l-.04.02a.75.75 0 01-1.084-1.083zM12 21a9 9 0 100-18 9 9 0 000 18z" />
                    </svg>
                    <span>Hover over any chart column for dynamic daily breakdown statistics.</span>
                  </div>
                )}
              </div>

              {/* SVG Animated Chart */}
              <div style={{ width: '100%', height: '170px', position: 'relative', overflow: 'visible' }}>
                <svg viewBox="0 0 500 160" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  {/* Grid Lines */}
                  <line x1="30" y1="30" x2="480" y2="30" stroke="var(--border)" strokeDasharray="4 4" strokeWidth="1" />
                  <line x1="30" y1="75" x2="480" y2="75" stroke="var(--border)" strokeDasharray="4 4" strokeWidth="1" />
                  <line x1="30" y1="120" x2="480" y2="120" stroke="var(--border)" strokeDasharray="4 4" strokeWidth="1" />

                  {/* Y Axis Numeric Labels */}
                  <text x="22" y="34" textAnchor="end" fill="var(--muted)" fontSize="10" fontWeight="700">10</text>
                  <text x="22" y="79" textAnchor="end" fill="var(--muted)" fontSize="10" fontWeight="700">5</text>
                  <text x="22" y="124" textAnchor="end" fill="var(--muted)" fontSize="10" fontWeight="700">0</text>

                  {graphData.map((d, i) => {
                    const xStart = 45 + i * 62
                    const totalHeight = d.scans * 11
                    const threatHeight = d.highRisk * 11
                    const yTotal = 130 - totalHeight
                    const yThreat = 130 - threatHeight

                    const isHovered = hoveredBar === i

                    return (
                      <g 
                        key={d.day}
                        onMouseEnter={() => setHoveredBar(i)}
                        onMouseLeave={() => setHoveredBar(null)}
                        style={{ cursor: 'pointer' }}
                      >
                        {/* Background transparent hit area for easier hover selection */}
                        <rect x={xStart - 5} y="10" width="46" height="135" fill="transparent" />

                        {/* Total Scans Bar */}
                        <rect 
                          x={xStart} 
                          y={yTotal} 
                          width="16" 
                          height={totalHeight} 
                          rx="4" 
                          fill="var(--primary)" 
                          opacity={hoveredBar === null ? 0.85 : isHovered ? 1 : 0.4} 
                          style={{ transition: 'all 0.2s ease', transformOrigin: `${xStart + 8}px 130px` }}
                        >
                          <animate attributeName="height" from="0" to={totalHeight} dur="0.5s" fill="freeze" />
                          <animate attributeName="y" from="130" to={yTotal} dur="0.5s" fill="freeze" />
                        </rect>

                        {/* High Risk Threats Bar */}
                        <rect 
                          x={xStart + 18} 
                          y={yThreat} 
                          width="16" 
                          height={threatHeight} 
                          rx="4" 
                          fill="var(--danger)" 
                          opacity={hoveredBar === null ? 0.95 : isHovered ? 1 : 0.4} 
                          style={{ transition: 'all 0.2s ease', transformOrigin: `${xStart + 26}px 130px` }}
                        >
                          <animate attributeName="height" from="0" to={threatHeight} dur="0.5s" fill="freeze" />
                          <animate attributeName="y" from="130" to={yThreat} dur="0.5s" fill="freeze" />
                        </rect>

                        {/* X Axis Label */}
                        <text 
                          x={xStart + 17} 
                          y="150" 
                          textAnchor="middle" 
                          fill={isHovered ? 'var(--text)' : 'var(--muted)'} 
                          fontSize="11" 
                          fontWeight={isHovered ? '900' : '700'}
                          style={{ transition: 'fill 0.2s ease' }}
                        >
                          {d.day}
                        </text>
                      </g>
                    )
                  })}
                </svg>
              </div>
            </div>

            {/* AI Warning Callout Banner (No Emojis, pure SVG) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', background: 'rgba(220, 38, 38, 0.08)', border: '1px solid rgba(220, 38, 38, 0.18)', padding: '0.65rem 0.9rem', borderRadius: '12px', marginTop: '0.9rem', width: '100%' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--danger)', flexShrink: 0 }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(220,38,38,0.15)"/>
                <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                <circle cx="12" cy="17" r="1" fill="currentColor"/>
              </svg>
              <span style={{ fontSize: '0.76rem', color: 'var(--danger)', fontWeight: 700, lineHeight: 1.4 }}>
                <strong>AI Threat Indicator:</strong> Fraudulent cashout spikes by 80% on weekends. Remain alert on Saturdays &amp; Sundays.
              </span>
            </div>
          </section>

          {/* Card B: Interactive Diagnostics Checkup */}
          <section className="scanner-card" style={{ padding: '1.5rem', background: 'var(--surface-alt)', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 900, margin: 0, color: 'var(--text)' }}>
                AI Defensive Diagnostics Checkup
              </h2>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: readinessScore >= 75 ? 'var(--success)' : 'var(--warning)', background: readinessScore >= 75 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                {readinessScore}% SHIELDED
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: '0 0 1rem 0' }}>
              Toggle security configurations to dynamically check and protect your status:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleCheckboxToggle(item.id)}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '0.75rem 0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: item.checked ? '0 0 8px rgba(16, 185, 129, 0.08)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      border: `2px solid ${item.checked ? 'var(--success)' : 'var(--muted)'}`,
                      background: item.checked ? 'var(--success)' : 'transparent',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#fff',
                      fontSize: '0.75rem',
                      fontWeight: 900
                    }}>
                      {item.checked && '✓'}
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.84rem', color: 'var(--text)', display: 'block' }}>{item.label}</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{item.desc}</span>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    color: item.checked ? 'var(--success)' : 'var(--muted)',
                    background: item.checked ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                    padding: '0.18rem 0.5rem',
                    borderRadius: '999px'
                  }}>
                    {item.checked ? 'Active' : 'Offline'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* FEATURE 2 GRID: Scam Type Donut / Pie Chart & Recent Audit Trail */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.4rem', marginBottom: '2rem' }} className="animate-slide-up delay-2">
          {/* Card A: Scam Type distribution with Donut Pie Chart option */}
          <div className="scanner-card" style={{ padding: '1.5rem', background: 'var(--surface-alt)', borderRadius: '20px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, margin: 0, color: 'var(--text)' }}>
                  AI Detected Scam &amp; Threat Vectors in Ghana
                </h3>
                
                {/* Toggler button group */}
                <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '2px' }}>
                  <button 
                    onClick={() => setChartView('bars')}
                    style={{
                      border: 'none',
                      background: chartView === 'bars' ? 'var(--primary)' : 'transparent',
                      color: chartView === 'bars' ? '#fff' : 'var(--text)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    List
                  </button>
                  <button 
                    onClick={() => setChartView('donut')}
                    style={{
                      border: 'none',
                      background: chartView === 'donut' ? 'var(--primary)' : 'transparent',
                      color: chartView === 'donut' ? '#fff' : 'var(--text)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    Pie
                  </button>
                </div>
              </div>

              <p style={{ fontSize: '0.78rem', color: 'var(--muted)', margin: '0 0 0.8rem 0', lineHeight: 1.4 }}>
                Scam threat distribution analysis from submitted links, emails, and screenshots:
              </p>

              {/* Sub-header metric readout pill */}
              <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary)', background: 'rgba(56, 189, 248, 0.1)', padding: '0.25rem 0.6rem', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                  Total Cataloged Scams: 264
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', padding: '0.25rem 0.6rem', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  Top Vector: MoMo Cashout (54%)
                </span>
              </div>

              {chartView === 'bars' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {slices.map((vec, idx) => {
                    const isHovered = hoveredSlice === idx
                    return (
                      <div 
                        key={vec.name}
                        onMouseEnter={() => setHoveredSlice(idx)}
                        onMouseLeave={() => setHoveredSlice(null)}
                        style={{ 
                          background: isHovered ? 'var(--surface)' : 'var(--surface-alt)',
                          border: `1px solid ${isHovered ? vec.color : 'var(--border)'}`,
                          padding: '0.75rem 0.95rem',
                          borderRadius: '14px',
                          opacity: hoveredSlice !== null && !isHovered ? 0.45 : 1,
                          transform: isHovered ? 'translateY(-2px)' : 'none',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          cursor: 'pointer',
                          boxShadow: isHovered ? `0 4px 14px rgba(0,0,0,0.06)` : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                          <span style={{ color: 'var(--text)', fontSize: '0.84rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: vec.color, flexShrink: 0 }} />
                            {vec.name}
                          </span>
                          <span style={{ fontSize: '0.78rem', fontWeight: 850, color: vec.color, background: 'var(--surface)', padding: '0.15rem 0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
                            {vec.percentage}% ({vec.count})
                          </span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: 'var(--surface)', borderRadius: '999px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                          <div style={{ width: `${vec.percentage}%`, height: '100%', background: vec.color, borderRadius: '999px', transition: 'width 0.6s ease' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '1.4rem', padding: '0.4rem 0' }}>
                  {/* SVG Interactive Donut/Pie Chart */}
                  <div style={{ position: 'relative', width: '165px', height: '165px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg viewBox="0 0 130 130" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%', overflow: 'visible' }}>
                      {slices.map((slice, idx) => {
                        const isHovered = hoveredSlice === idx
                        return (
                          <circle
                            key={slice.name}
                            cx="65"
                            cy="65"
                            r={radius}
                            fill="transparent"
                            stroke={slice.color}
                            strokeWidth={isHovered ? 14 : 10}
                            strokeDasharray={slice.strokeDasharray}
                            strokeDashoffset={slice.strokeDashoffset}
                            style={{
                              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                              cursor: 'pointer',
                              filter: isHovered ? `drop-shadow(0 0 6px ${slice.color})` : 'none'
                            }}
                            onMouseEnter={() => setHoveredSlice(idx)}
                            onMouseLeave={() => setHoveredSlice(null)}
                          >
                            <animate attributeName="stroke-dasharray" from={`0 ${circumference}`} to={slice.strokeDasharray} dur="0.6s" fill="freeze" />
                          </circle>
                        )
                      })}
                    </svg>
                    
                    {/* Dynamic Donut Center Details HUD */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      pointerEvents: 'none',
                      width: '92px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--text)', lineHeight: 1 }}>
                        {activeSliceInfo.percentage}%
                      </span>
                      <span style={{
                        fontSize: '0.64rem',
                        fontWeight: 850,
                        color: activeSliceInfo.color,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        marginTop: '3px',
                        background: 'var(--surface)',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '4px',
                        border: `1px solid ${activeSliceInfo.color}`,
                        lineHeight: 1.1,
                        whiteSpace: 'nowrap'
                      }}>
                        {{
                          'MoMo Transfer & Cashout Fraud': 'MoMo Fraud',
                          'Fake Job & Recruitment Lures': 'Fake Jobs',
                          'Phishing Links & Spoofed Websites': 'Phishing',
                          'Impersonation & Advance Fee Scams': 'Scams'
                        }[activeSliceInfo.name] || 'Scams'}
                      </span>
                      <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--muted)', marginTop: '3px' }}>
                        {activeSliceInfo.count.split(' ')[0]} Flags
                      </span>
                    </div>
                  </div>

                  {/* Human-Centered Donut Legend Cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1, minWidth: '190px' }}>
                    {slices.map((slice, idx) => {
                      const isHovered = hoveredSlice === idx
                      return (
                        <div 
                          key={slice.name}
                          onMouseEnter={() => setHoveredSlice(idx)}
                          onMouseLeave={() => setHoveredSlice(null)}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            gap: '0.6rem',
                            padding: '0.6rem 0.8rem',
                            background: isHovered ? 'var(--surface)' : 'rgba(0,0,0,0.015)',
                            border: `1px solid ${isHovered ? slice.color : 'var(--border)'}`,
                            borderRadius: '12px',
                            opacity: hoveredSlice !== null && !isHovered ? 0.4 : 1,
                            transform: isHovered ? 'translateX(4px)' : 'none',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: slice.color, display: 'inline-block', flexShrink: 0 }} />
                            <span style={{ color: 'var(--text)', fontSize: '0.78rem', fontWeight: 750 }}>
                              {slice.name}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.74rem', fontWeight: 850, color: slice.color, whiteSpace: 'nowrap', background: 'var(--surface)', padding: '0.1rem 0.45rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
                            {slice.percentage}% ({slice.count.split(' ')[0]})
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Human-Centered Scam Insight Callout */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: '12px',
              padding: '0.7rem 0.95rem',
              marginTop: '1rem'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--primary)', flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="8" r="1" fill="currentColor"/>
              </svg>
              <span style={{ fontSize: '0.76rem', color: 'var(--text)', fontWeight: 700, lineHeight: 1.35 }}>
                <strong style={{ color: 'var(--primary)' }}>Human Insight:</strong> MoMo &amp; Mobile Money scams constitute over 54% of all threat reports in Ghana. Never share your 4-digit PIN with anyone.
              </span>
            </div>
          </div>

          {/* Card B: Recent AI Scan Audit Trail with Dynamic Filter Tabs */}
          <div className="scanner-card" style={{ padding: '1.5rem', background: 'var(--surface-alt)', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, margin: 0, color: 'var(--text)' }}>
                Recent AI Scan Audit Trail
              </h3>
              <Link to="/history" style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--primary)', textDecoration: 'none', background: 'rgba(56, 189, 248, 0.12)', padding: '0.2rem 0.65rem', borderRadius: '999px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                VIEW ALL LOGS →
              </Link>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--muted)', margin: '0 0 0.8rem 0', lineHeight: 1.4 }}>
              Latest automated threat analyses across submitted inputs:
            </p>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', marginBottom: '0.8rem', paddingBottom: '4px' }}>
              {['all', 'link', 'message', 'screenshot', 'email'].map(type => (
                <button
                  key={type}
                  onClick={() => {
                    setActiveFilter(type)
                    setAuditPage(1)
                  }}
                  style={{
                    border: 'none',
                    background: activeFilter === type ? 'var(--primary)' : 'var(--surface)',
                    color: activeFilter === type ? '#fff' : 'var(--muted)',
                    border: '1px solid var(--border)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.25rem 0.6rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Audit Trail List (Max 3 items per page) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredScans.length > 0 ? (
                filteredScans
                  .slice((auditPage - 1) * AUDIT_ITEMS_PER_PAGE, auditPage * AUDIT_ITEMS_PER_PAGE)
                  .map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '14px',
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.55rem'
                    }}
                  >
                    {/* Scanned text content - fully visible with clean line-height and word break */}
                    <Link
                      to="/history"
                      style={{
                        textDecoration: 'none',
                        margin: 0,
                        fontSize: '0.88rem',
                        fontWeight: 750,
                        color: 'var(--text)',
                        lineHeight: 1.5,
                        wordBreak: 'break-word'
                      }}
                    >
                      &ldquo;{item.originalContent}&rdquo;
                    </Link>

                    {/* Metadata row: Category, timestamp, risk badge, audit link to history */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.4rem', borderTop: '1px dashed var(--border)' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text)', fontWeight: 700 }}>
                          {item.threatCategory || 'MoMo Transfer & Cashout Fraud'}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>•</span>
                        <span style={{ fontSize: '0.73rem', color: 'var(--muted)', fontWeight: 600 }}>{item.submittedAt || 'Recently'}</span>
                      </div>

                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 850,
                            color: item.riskLevel === 'high' ? 'var(--danger)' : item.riskLevel === 'medium' ? 'var(--warning)' : 'var(--success)',
                            background: item.riskLevel === 'high' ? 'rgba(239, 68, 68, 0.12)' : item.riskLevel === 'medium' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                            border: `1px solid ${item.riskLevel === 'high' ? 'rgba(239, 68, 68, 0.25)' : item.riskLevel === 'medium' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`,
                            padding: '0.2rem 0.6rem',
                            borderRadius: '8px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {item.riskLevel ? item.riskLevel.toUpperCase() : 'HIGH'} RISK ({item.riskScore || 85}%)
                        </span>
                        <Link
                          to="/history"
                          style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 850, textDecoration: 'none' }}
                        >
                          Audit &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', color: 'var(--muted)' }}>
                  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ width: '2.5rem', height: '2.5rem', margin: '0 auto 0.6rem', display: 'block', opacity: 0.5 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <p style={{ fontSize: '0.84rem', fontWeight: 600, margin: '0 0 0.4rem 0' }}>No {activeFilter} scans recorded</p>
                  <Link to="/history" style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 800, textDecoration: 'none' }}>View scan history &rarr;</Link>
                </div>
              )}
            </div>

            {/* Pagination Controls Footer */}
            {filteredScans.length > AUDIT_ITEMS_PER_PAGE && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.8rem', borderTop: '1px dashed var(--border)', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 650 }}>
                  Showing {(auditPage - 1) * AUDIT_ITEMS_PER_PAGE + 1}–{Math.min(auditPage * AUDIT_ITEMS_PER_PAGE, filteredScans.length)} of {filteredScans.length} logs
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <button
                    disabled={auditPage === 1}
                    onClick={() => setAuditPage(prev => Math.max(prev - 1, 1))}
                    style={{
                      border: '1px solid var(--border)',
                      background: 'var(--surface)',
                      color: auditPage === 1 ? 'var(--muted)' : 'var(--text)',
                      fontSize: '0.72rem',
                      fontWeight: 750,
                      padding: '0.25rem 0.55rem',
                      borderRadius: '6px',
                      cursor: auditPage === 1 ? 'default' : 'pointer',
                      opacity: auditPage === 1 ? 0.5 : 1
                    }}
                  >
                    &larr; Prev
                  </button>

                  {Array.from({ length: Math.ceil(filteredScans.length / AUDIT_ITEMS_PER_PAGE) }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setAuditPage(p)}
                      style={{
                        border: '1px solid var(--border)',
                        background: auditPage === p ? 'var(--primary)' : 'var(--surface)',
                        color: auditPage === p ? '#ffffff' : 'var(--text)',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'grid',
                        placeItems: 'center'
                      }}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    disabled={auditPage === Math.ceil(filteredScans.length / AUDIT_ITEMS_PER_PAGE)}
                    onClick={() => setAuditPage(prev => Math.min(prev + 1, Math.ceil(filteredScans.length / AUDIT_ITEMS_PER_PAGE)))}
                    style={{
                      border: '1px solid var(--border)',
                      background: 'var(--surface)',
                      color: auditPage === Math.ceil(filteredScans.length / AUDIT_ITEMS_PER_PAGE) ? 'var(--muted)' : 'var(--text)',
                      fontSize: '0.72rem',
                      fontWeight: 750,
                      padding: '0.25rem 0.55rem',
                      borderRadius: '6px',
                      cursor: auditPage === Math.ceil(filteredScans.length / AUDIT_ITEMS_PER_PAGE) ? 'default' : 'pointer',
                      opacity: auditPage === Math.ceil(filteredScans.length / AUDIT_ITEMS_PER_PAGE) ? 0.5 : 1
                    }}
                  >
                    Next &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ghana Emergency Helplines Direct Dial Bar */}
        <section className="scanner-card" style={{ padding: '1.4rem', background: 'var(--surface-alt)', borderRadius: '20px', border: '1px solid var(--border)', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: '0 0 0.4rem 0', color: 'var(--text)' }}>
            Ghana Emergency Anti-Scam Helplines
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--muted)', margin: '0 0 1rem 0' }}>
            If you suspect an active wallet compromise or fraud attempt, dial support immediately:
          </p>

          <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:292" style={{ textDecoration: 'none', background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.5rem 1rem', borderRadius: '999px', color: 'var(--text)', fontSize: '0.84rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ color: 'var(--primary)' }}>CSA Hotline:</span> 292
            </a>
            <a href="tel:1917" style={{ textDecoration: 'none', background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.5rem 1rem', borderRadius: '999px', color: 'var(--text)', fontSize: '0.84rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ color: 'var(--danger)' }}>MTN Fraud:</span> 1917
            </a>
            <a href="tel:100" style={{ textDecoration: 'none', background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.5rem 1rem', borderRadius: '999px', color: 'var(--text)', fontSize: '0.84rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ color: 'var(--success)' }}>Telecel / AT:</span> 100
            </a>
          </div>
        </section>
      </div>
      <SecurityChatbot user={user} />
    </PageContainer>
  )
}
