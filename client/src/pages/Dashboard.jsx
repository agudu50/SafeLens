import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'

const mockScanRecords = [
  {
    id: 'scan-101',
    type: 'Message',
    content: 'Received GHS 450.00 from 0244123456. Ref: 98127391. Please refund immediately to 0551234567.',
    riskLevel: 'High',
    riskScore: 94,
    category: 'MoMo Fraud',
    summary: 'Fake wrong transfer SMS lure attempt to drain funds.',
    date: '2026-07-30 14:15',
  },
  {
    id: 'scan-102',
    type: 'Link',
    content: 'https://mtn-50th-anniversary.free-data.site/claim?user=ghana',
    riskLevel: 'High',
    riskScore: 98,
    category: 'Phishing',
    summary: 'Malicious domain requesting MoMo credentials for fake promo.',
    date: '2026-07-29 11:30',
  },
  {
    id: 'scan-103',
    type: 'Screenshot',
    content: 'WhatsApp Screenshot: Remote Video Liking Job - GHS 50 Registration Fee',
    riskLevel: 'Medium',
    riskScore: 68,
    category: 'Advance Fee',
    summary: 'Unverified recruiter demanding upfront registration fee.',
    date: '2026-07-28 16:45',
  },
  {
    id: 'scan-104',
    type: 'Email',
    content: 'Urgent Account Suspension Notice - Verify Your Banking Credentials',
    riskLevel: 'High',
    riskScore: 88,
    category: 'Impersonation',
    summary: 'Fake bank support email requesting OTP verification.',
    date: '2026-07-27 09:20',
  },
  {
    id: 'scan-105',
    type: 'Message',
    content: 'Hey Kofi, let us meet at Accra Mall food court by 4:00 PM for lunch.',
    riskLevel: 'Low',
    riskScore: 12,
    category: 'Clean Message',
    summary: 'Routine conversational message with zero threat indicators.',
    date: '2026-07-26 13:10',
  },
]

const graphData = [
  { day: 'Mon', scans: 4, highRisk: 2 },
  { day: 'Tue', scans: 6, highRisk: 3 },
  { day: 'Wed', scans: 3, highRisk: 1 },
  { day: 'Thu', scans: 8, highRisk: 5 },
  { day: 'Fri', scans: 5, highRisk: 2 },
  { day: 'Sat', scans: 7, highRisk: 4 },
  { day: 'Sun', scans: 9, highRisk: 6 },
]

export default function Dashboard({ user }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [filterRisk, setFilterRisk] = useState('All')

  // Filter scan records based on search query, type, and risk level
  const filteredRecords = useMemo(() => {
    return mockScanRecords.filter((item) => {
      const matchesSearch =
        searchTerm === '' ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = filterType === 'All' || item.type.toLowerCase() === filterType.toLowerCase()
      const matchesRisk = filterRisk === 'All' || item.riskLevel.toLowerCase() === filterRisk.toLowerCase()

      return matchesSearch && matchesType && matchesRisk
    })
  }, [searchTerm, filterType, filterRisk])

  // Metric Computations
  const totalScans = 3
  const scamsAvoided = 2
  const avgRiskScore = '80%'

  return (
    <PageContainer>
      <div className="dash-container">
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
                  REAL-TIME SECURITY DASHBOARD
                </span>
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: '0 0 0.25rem 0', color: 'var(--text)' }}>
                Security Command Center
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', margin: 0 }}>
                Welcome back, {user?.name ? user.name.split(' ')[0] : 'Kofi'}! Monitor threat activity, filter scan logs, and run instant AI checks.
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
              <span>Scan New Message</span>
            </Link>
          </div>
        </section>

        {/* 3 Core Overview Stats requested by user */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.8rem' }} className="animate-slide-up">
          {/* Card 1: Total Scans Done */}
          <div className="dash-stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Total Scans Done</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--primary)' }}>
                <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
            </div>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 900, margin: 0, color: 'var(--text)' }}>
              {totalScans}
            </h2>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)', display: 'block', marginTop: '0.2rem' }}>
              Processed by SafeLens AI
            </span>
          </div>

          {/* Card 2: Scams Avoided */}
          <div className="dash-stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Scams Avoided</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--danger)' }}>
                <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
            </div>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 900, margin: 0, color: 'var(--danger)' }}>
              {scamsAvoided}
            </h2>
            <span style={{ fontSize: '0.74rem', color: 'var(--danger)', fontWeight: 700, display: 'block', marginTop: '0.2rem' }}>
              GH₵ 1,350 Funds Protected
            </span>
          </div>

          {/* Card 3: Average Risk Score */}
          <div className="dash-stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Average Risk Score</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--warning)' }}>
                <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
            </div>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 900, margin: 0, color: 'var(--warning)' }}>
              {avgRiskScore}
            </h2>
            <span style={{ fontSize: '0.74rem', color: 'var(--warning)', fontWeight: 700, display: 'block', marginTop: '0.2rem' }}>
              High Vulnerability Detected
            </span>
          </div>
        </div>

        {/* Modern Interactive Threat Trend Graph Section */}
        <section className="scanner-card animate-slide-up delay-1" style={{ padding: '1.6rem 1.4rem', marginBottom: '2rem', background: 'var(--surface-alt)', borderRadius: '20px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 900, margin: '0 0 0.2rem 0', color: 'var(--text)' }}>
                Weekly Threat Detection &amp; Scan Volume Graph
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: 0 }}>
                Visual analytics tracking scan frequency vs flagged scam attempts.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.78rem', fontWeight: 700 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary)' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--primary)' }} />
                Total Scans
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--danger)' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--danger)' }} />
                High Risk Threats
              </span>
            </div>
          </div>

          {/* SVG Animated Chart */}
          <div style={{ width: '100%', height: '180px', position: 'relative' }}>
            <svg viewBox="0 0 500 160" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="var(--border)" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="var(--border)" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="var(--border)" strokeDasharray="4 4" strokeWidth="1" />

              {/* Bar Columns */}
              {graphData.map((d, i) => {
                const x = 35 + i * 70
                const totalHeight = d.scans * 12
                const threatHeight = d.highRisk * 12
                const yTotal = 130 - totalHeight
                const yThreat = 130 - threatHeight

                return (
                  <g key={d.day}>
                    {/* Total Scans Bar */}
                    <rect
                      x={x}
                      y={yTotal}
                      width="18"
                      height={totalHeight}
                      rx="4"
                      fill="var(--primary)"
                      opacity="0.85"
                    />
                    {/* High Risk Threat Bar */}
                    <rect
                      x={x + 22}
                      y={yThreat}
                      width="18"
                      height={threatHeight}
                      rx="4"
                      fill="var(--danger)"
                      opacity="0.9"
                    />
                    {/* Day Label */}
                    <text x={x + 20} y="152" textAnchor="middle" fill="var(--muted)" fontSize="11" fontWeight="700">
                      {d.day}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
        </section>

        {/* Real-Time Filter & Search Toolbar */}
        <section className="scanner-card animate-slide-up delay-2" style={{ padding: '1.6rem 1.4rem', marginBottom: '2rem', background: 'var(--surface-alt)', borderRadius: '20px', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '0 0 1rem 0', color: 'var(--text)' }}>
            Search &amp; Filter Threat Logs
          </h2>

          {/* Search Content Input */}
          <div style={{ marginBottom: '1.1rem', position: 'relative' }}>
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: 'var(--muted)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Search content or summaries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.9rem 0.65rem 2.5rem',
                borderRadius: '12px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />
          </div>

          {/* TYPE Filters Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', minWidth: '55px' }}>
              TYPE:
            </span>
            {['All', 'Message', 'Screenshot', 'Link', 'Email'].map((type) => {
              const isActive = filterType === type
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFilterType(type)}
                  style={{
                    background: isActive ? 'var(--primary)' : 'var(--surface)',
                    color: isActive ? '#ffffff' : 'var(--text)',
                    border: isActive ? '1px solid var(--primary)' : '1px solid var(--border)',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {type}
                </button>
              )
            })}
          </div>

          {/* RISK Filters Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', minWidth: '55px' }}>
              RISK:
            </span>
            {['All', 'High', 'Medium', 'Low'].map((risk) => {
              const isActive = filterRisk === risk

              let activeBg = 'var(--primary)'
              if (risk === 'High') activeBg = 'var(--danger)'
              if (risk === 'Medium') activeBg = 'var(--warning)'
              if (risk === 'Low') activeBg = 'var(--success)'

              return (
                <button
                  key={risk}
                  type="button"
                  onClick={() => setFilterRisk(risk)}
                  style={{
                    background: isActive ? activeBg : 'var(--surface)',
                    color: isActive ? '#ffffff' : 'var(--text)',
                    border: isActive ? `1px solid ${activeBg}` : '1px solid var(--border)',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {risk}
                </button>
              )
            })}
          </div>
        </section>

        {/* Filtered Results Table / Grid */}
        <section className="scanner-card animate-slide-up delay-3" style={{ padding: '1.6rem 1.4rem', marginBottom: '2rem', background: 'var(--surface-alt)', borderRadius: '20px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, margin: 0, color: 'var(--text)' }}>
              Scan Records ({filteredRecords.length})
            </h3>
            {(searchTerm || filterType !== 'All' || filterRisk !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('')
                  setFilterType('All')
                  setFilterRisk('All')
                }}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Reset Filters
              </button>
            )}
          </div>

          {filteredRecords.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--surface)', borderRadius: '14px', border: '1px solid var(--border)' }}>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', margin: 0 }}>
                No scan records match your active search and filter options.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredRecords.map((item) => {
                const isHigh = item.riskLevel === 'High'
                const isMedium = item.riskLevel === 'Medium'

                let badgeColor = 'var(--success)'
                let badgeBg = 'rgba(16, 185, 129, 0.12)'
                let badgeBorder = 'rgba(16, 185, 129, 0.25)'

                if (isHigh) {
                  badgeColor = 'var(--danger)'
                  badgeBg = 'rgba(239, 68, 68, 0.12)'
                  badgeBorder = 'rgba(239, 68, 68, 0.25)'
                } else if (isMedium) {
                  badgeColor = 'var(--warning)'
                  badgeBg = 'rgba(245, 158, 11, 0.12)'
                  badgeBorder = 'rgba(245, 158, 11, 0.25)'
                }

                return (
                  <div
                    key={item.id}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '14px',
                      padding: '1rem 1.1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem'
                    }}
                  >
                    {/* Top Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary)', background: 'rgba(56, 189, 248, 0.12)', padding: '0.15rem 0.55rem', borderRadius: '999px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                          {item.type.toUpperCase()}
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)' }}>
                          {item.date}
                        </span>
                      </div>

                      <span style={{ fontSize: '0.74rem', fontWeight: 800, color: badgeColor, background: badgeBg, padding: '0.18rem 0.6rem', borderRadius: '999px', border: `1px solid ${badgeBorder}` }}>
                        {item.riskScore}% {item.riskLevel.toUpperCase()} RISK
                      </span>
                    </div>

                    {/* Content Snippet */}
                    <div style={{ fontSize: '0.86rem', color: 'var(--text)', fontWeight: 600, lineHeight: 1.45 }}>
                      &ldquo;{item.content}&rdquo;
                    </div>

                    {/* Summary */}
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.4 }}>
                      <strong style={{ color: 'var(--text)' }}>Summary: </strong>
                      {item.summary}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </PageContainer>
  )
}
