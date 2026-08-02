import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import { getScanHistory } from '../services/scannerService'

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
  { region: 'Accra', type: 'MoMo Refund Fraud', risk: 'High', time: '2 mins ago' },
  { region: 'Kumasi', type: 'Fake Job Agent Fee', risk: 'High', time: '14 mins ago' },
  { region: 'Takoradi', type: 'MTN Cashout Attack', risk: 'High', time: '38 mins ago' },
  { region: 'Tema', type: 'Suspicious Loan App Link', risk: 'Medium', time: '1 hr ago' },
  { region: 'Tamale', type: 'Wrong Transfer SMS', risk: 'High', time: '2 hrs ago' },
]

export default function Dashboard({ user }) {
  const [scanAuditTrail, setScanAuditTrail] = useState(defaultAuditTrail)
  const [chartView, setChartView] = useState('donut') // 'donut' or 'bars'
  const [hoveredSlice, setHoveredSlice] = useState(null)
  const [hoveredBar, setHoveredBar] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all') // 'all', 'link', 'screenshot', 'message', 'email'

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
        {/* Live Scam Ticker Marquee */}
        <div className="ticker-container animate-slide-up" style={{ marginBottom: '1.4rem' }}>
          <span className="ticker-label">Live Tracker</span>
          <div className="ticker-wrap">
            <div className="ticker-content">
              {tickerReports.map((report, idx) => (
                <span className="ticker-item" key={`dash-ticker-${idx}`}>
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

        {/* Dashboard Header Bar */}
        <section
          className="dash-hero-card animate-fade-in"
          style={{
            background: 'var(--surface-alt)',
            padding: '1.6rem 1.4rem',
            marginBottom: '1.5rem',
            borderRadius: '20px',
            border: '1px solid var(--border)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                <span className="live-pulse-dot" style={{ width: '8px', height: '8px', background: 'var(--success)' }} />
                <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  REAL-TIME SECURITY COMMAND CENTER
                </span>
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: '0 0 0.25rem 0', color: 'var(--text)' }}>
                Security Command Center
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', margin: 0 }}>
                Welcome back, {user?.name ? user.name.split(' ')[0] : 'Kofi'}! Monitor threat activity, check vulnerability status, and run instant AI audits.
              </p>
            </div>

            <Link
              to="/scan"
              className="button-primary"
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
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <span>Full AI Scanner</span>
            </Link>
          </div>
        </section>

        {/* 4 Core Overview Metrics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.8rem' }} className="animate-slide-up">
          {/* Card 1: Total Scans Done */}
          <div className="dash-stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Total Scans</span>
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--primary)' }}>
                <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
            </div>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 900, margin: 0, color: 'var(--text)' }}>
              {scanAuditTrail.length}
            </h2>
            <span style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block', marginTop: '0.2rem' }}>
              100% Analysis Accuracy
            </span>
          </div>

          {/* Card 2: Scams Avoided */}
          <div className="dash-stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Scams Avoided</span>
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--danger)' }}>
                <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
            </div>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 900, margin: 0, color: 'var(--danger)' }}>
              {scamsAvoided}
            </h2>
            <span style={{ fontSize: '0.72rem', color: 'var(--danger)', fontWeight: 700, display: 'block', marginTop: '0.2rem' }}>
              GH₵ {scamsAvoided * 450} Saved
            </span>
          </div>

          {/* Card 3: Vulnerability Exposure */}
          <div className="dash-stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Vulnerability Score</span>
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--warning)' }}>
                <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
            </div>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 900, margin: 0, color: 'var(--warning)' }}>
              {vulnerabilityScore}%
            </h2>
            <span style={{ fontSize: '0.72rem', color: 'var(--warning)', fontWeight: 700, display: 'block', marginTop: '0.2rem' }}>
              {vulnerabilityScore >= 50 ? 'Moderate Exposure' : 'Secured Core'}
            </span>
          </div>

          {/* Card 4: Defense Readiness */}
          <div className="dash-stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Defense Readiness</span>
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--success)' }}>
                <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 900, margin: 0, color: 'var(--success)' }}>
              {readinessScore}%
            </h2>
            <span style={{ fontSize: '0.72rem', color: 'var(--success)', fontWeight: 700, display: 'block', marginTop: '0.2rem' }}>
              {readinessScore === 100 ? 'Fully Shielded' : 'Action Required'}
            </span>
          </div>
        </div>

        {/* FEATURE 1 GRID: Weekly Graph & Interactive Diagnostics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.4rem', marginBottom: '2rem' }} className="animate-slide-up delay-1">
          {/* Card A: Weekly Graph */}
          <section className="scanner-card" style={{ padding: '1.5rem', background: 'var(--surface-alt)', borderRadius: '20px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justify: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 900, margin: '0 0 0.2rem 0', color: 'var(--text)' }}>
                    Weekly Threat Detection &amp; Scan Volume
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>
                    Visual analytics tracking scan frequency vs flagged scam attempts.
                  </p>
                </div>
              </div>

              {/* Dynamic Tooltip / Daily Details Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', minHeight: '38px', background: 'var(--surface)', padding: '0.5rem 0.8rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
                {hoveredBar !== null ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.78rem', width: '100%', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text)', fontWeight: 800 }}>
                      📅 {{ Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' }[graphData[hoveredBar].day]}
                    </span>
                    <span style={{ display: 'flex', gap: '0.8rem' }}>
                      <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
                        Total Scans: {graphData[hoveredBar].scans}
                      </span>
                      <span style={{ color: 'var(--danger)', fontWeight: 700 }}>
                        Flagged Scams: {graphData[hoveredBar].highRisk}
                      </span>
                      <span style={{ color: 'var(--muted)' }}>
                        Ratio: {Math.round((graphData[hoveredBar].highRisk / graphData[hoveredBar].scans) * 100)}%
                      </span>
                    </span>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem', color: 'var(--primary)' }}>
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

            {/* AI Warning Callout Banner */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: 'rgba(220, 38, 38, 0.08)', border: '1px solid rgba(220, 38, 38, 0.15)', padding: '0.6rem 0.85rem', borderRadius: '12px', marginTop: '0.8rem', width: '100%' }}>
              <span style={{ fontSize: '1.1rem', color: 'var(--danger)', flexShrink: 0 }}>⚠️</span>
              <span style={{ fontSize: '0.74rem', color: 'var(--danger)', fontWeight: 700, lineHeight: 1.35 }}>
                AI Threat Indicator: Fraudulent cashout spikes by 80% on weekends. Remain alert on Saturdays &amp; Sundays.
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
          <div className="scanner-card" style={{ padding: '1.5rem', background: 'var(--surface-alt)', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
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

            <p style={{ fontSize: '0.78rem', color: 'var(--muted)', margin: '0 0 1rem 0', lineHeight: 1.4 }}>
              Scam threat distribution analysis from submitted links, emails, and screenshots:
            </p>

            {chartView === 'bars' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {slices.map((vec, idx) => (
                  <div 
                    key={vec.name}
                    onMouseEnter={() => setHoveredSlice(idx)}
                    onMouseLeave={() => setHoveredSlice(null)}
                    style={{ 
                      opacity: hoveredSlice !== null && hoveredSlice !== idx ? 0.5 : 1,
                      transition: 'opacity 0.2s ease',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem', fontSize: '0.8rem', fontWeight: 700 }}>
                      <span style={{ color: 'var(--text)' }}>{vec.name}</span>
                      <span style={{ color: 'var(--muted)' }}>{vec.percentage}% ({vec.count})</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--surface)', borderRadius: '999px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                      <div style={{ width: `${vec.percentage}%`, height: '100%', background: vec.color, borderRadius: '999px', transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '1.2rem', padding: '0.5rem 0' }}>
                {/* SVG Interactive Donut/Pie Chart */}
                <div style={{ position: 'relative', width: '130px', height: '130px' }}>
                  <svg viewBox="0 0 130 130" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                    {slices.map((slice, idx) => (
                      <circle
                        key={slice.name}
                        cx="65"
                        cy="65"
                        r={radius}
                        fill="transparent"
                        stroke={slice.color}
                        strokeWidth={hoveredSlice === idx ? 12 : 8}
                        strokeDasharray={slice.strokeDasharray}
                        strokeDashoffset={slice.strokeDashoffset}
                        style={{
                          transition: 'all 0.25s ease',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={() => setHoveredSlice(idx)}
                        onMouseLeave={() => setHoveredSlice(null)}
                      />
                    ))}
                  </svg>
                  
                  {/* Dynamic center detail */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    pointerEvents: 'none',
                    width: '78px'
                  }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text)', lineHeight: 1.1 }}>
                      {activeSliceInfo.percentage}%
                    </div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginTop: '1px', lineHeight: 1 }}>
                      {activeSliceInfo.name.split(' ')[0]}
                    </div>
                  </div>
                </div>

                {/* Donut Legend */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', flex: 1, minWidth: '150px' }}>
                  {slices.map((slice, idx) => (
                    <div 
                      key={slice.name}
                      onMouseEnter={() => setHoveredSlice(idx)}
                      onMouseLeave={() => setHoveredSlice(null)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        gap: '0.45rem',
                        opacity: hoveredSlice !== null && hoveredSlice !== idx ? 0.4 : 1,
                        transition: 'opacity 0.2s ease',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: slice.color, display: 'inline-block', flexShrink: 0, marginTop: '3px' }} />
                      <div style={{ fontSize: '0.74rem', lineHeight: 1.25 }}>
                        <span style={{ color: 'var(--text)', fontWeight: 700, display: 'block' }}>{slice.name}</span>
                        <span style={{ color: 'var(--muted)', fontSize: '0.7rem' }}>{slice.percentage}% ({slice.count})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                  onClick={() => setActiveFilter(type)}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredScans.length > 0 ? (
                filteredScans.map((item) => (
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
                    {/* Scanned text content - readable with multi-line clamp & word break */}
                    <Link
                      to="/history"
                      style={{
                        textDecoration: 'none',
                        margin: 0,
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        color: 'var(--text)',
                        lineHeight: 1.45,
                        wordBreak: 'break-word',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      &ldquo;{item.originalContent}&rdquo;
                    </Link>

                    {/* Metadata row: Category, timestamp, risk badge, audit link to history */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.35rem', borderTop: '1px dashed var(--border)' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 600 }}>
                          {item.threatCategory || 'MoMo Transfer & Cashout Fraud'}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>•</span>
                        <span style={{ fontSize: '0.73rem', color: 'var(--muted)' }}>{item.submittedAt || 'Recently'}</span>
                      </div>

                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            color: item.riskLevel === 'high' ? 'var(--danger)' : item.riskLevel === 'medium' ? 'var(--warning)' : 'var(--success)',
                            background: item.riskLevel === 'high' ? 'rgba(239, 68, 68, 0.12)' : item.riskLevel === 'medium' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '999px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {item.riskLevel ? item.riskLevel.toUpperCase() : 'HIGH'} RISK ({item.riskScore || 85}%)
                        </span>
                        <Link
                          to="/history"
                          style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 800, textDecoration: 'none' }}
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
                  <Link to="/scan" style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 800, textDecoration: 'none' }}>Scan something now &rarr;</Link>
                </div>
              )}
            </div>
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
    </PageContainer>
  )
}
