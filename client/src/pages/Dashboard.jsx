import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'

const graphData = [
  { day: 'Mon', scans: 4, highRisk: 2 },
  { day: 'Tue', scans: 6, highRisk: 3 },
  { day: 'Wed', scans: 3, highRisk: 1 },
  { day: 'Thu', scans: 8, highRisk: 5 },
  { day: 'Fri', scans: 5, highRisk: 2 },
  { day: 'Sat', scans: 7, highRisk: 4 },
  { day: 'Sun', scans: 9, highRisk: 6 },
]

const presets = [
  {
    id: 'momo',
    title: 'MoMo Wrong Transfer',
    description: 'Fake mobile money refund lure',
    category: 'MoMo Fraud',
    riskLevel: 'high',
    riskScore: 92,
    content: 'Hello, I just sent 850 GHS to your number by mistake. Please send it back immediately to 0551234567. God bless you!',
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
    content: 'MTN Customer Care: You won 5,000 GHS in promo! Dial *170# -> option 6 -> option 5 to approve your cashout approval request immediately.',
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
    content: 'WORK FROM HOME! Earn 500 GHS daily by liking videos. Pay only 50 GHS registration fee to join. WhatsApp us now on 0501234567.',
    explanation: 'Classic advance-fee scam. Legitimate companies never charge job applicants registration, training, or onboarding fees.',
    advice: 'Refuse to pay upfront registration fees for jobs. Legit employers pay you; they do not solicit fees.'
  }
]

const tickerReports = [
  { region: 'Accra', type: 'MoMo Refund Fraud', risk: 'High', time: '2 mins ago' },
  { region: 'Kumasi', type: 'Fake Job Agent Fee', risk: 'High', time: '14 mins ago' },
  { region: 'Takoradi', type: 'MTN Cashout Attack', risk: 'High', time: '38 mins ago' },
  { region: 'Tema', type: 'Suspicious Loan App Link', risk: 'Medium', time: '1 hr ago' },
  { region: 'Tamale', type: 'Wrong Transfer SMS', risk: 'High', time: '2 hrs ago' },
]

export default function Dashboard({ user }) {
  const [selectedPreset, setSelectedPreset] = useState(presets[0])
  const [quickScanText, setQuickScanText] = useState('')
  const [quickResult, setQuickResult] = useState(null)
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Never share your 4-digit MoMo PIN with anyone', checked: true },
    { id: 2, text: 'Reject unverified Cash Out prompts on *170#', checked: true },
    { id: 3, text: 'Never pay registration or agent fees for job offers', checked: false },
    { id: 4, text: 'Verify wrong transfer SMS with operator (100) before refunding', checked: true },
  ])

  const toggleChecklist = (id) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item))
  }

  const handleQuickScan = (e) => {
    e.preventDefault()
    if (!quickScanText.trim()) return

    const lower = quickScanText.toLowerCase()
    const isScam = lower.includes('momo') || lower.includes('win') || lower.includes('promo') || lower.includes('refund') || lower.includes('job') || lower.includes('http')
    
    setQuickResult({
      score: isScam ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 15) + 5,
      level: isScam ? 'High Risk' : 'Safe',
      summary: isScam ? 'High probability of phishing or fraud. Do not reply or send money.' : 'Low threat signals detected in this message snippet.'
    })
  }

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
                  REAL-TIME SECURITY DASHBOARD
                </span>
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: '0 0 0.25rem 0', color: 'var(--text)' }}>
                Security Command Center
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', margin: 0 }}>
                Welcome back, {user?.name ? user.name.split(' ')[0] : 'Kofi'}! Monitor threat activity, check system status, and run instant AI scans.
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
              3
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
              2
            </h2>
            <span style={{ fontSize: '0.72rem', color: 'var(--danger)', fontWeight: 700, display: 'block', marginTop: '0.2rem' }}>
              GH₵ 1,350 Saved
            </span>
          </div>

          {/* Card 3: Average Risk Score */}
          <div className="dash-stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Average Risk Score</span>
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--warning)' }}>
                <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
            </div>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 900, margin: 0, color: 'var(--warning)' }}>
              80%
            </h2>
            <span style={{ fontSize: '0.72rem', color: 'var(--warning)', fontWeight: 700, display: 'block', marginTop: '0.2rem' }}>
              High Vulnerability
            </span>
          </div>

          {/* Card 4: MoMo PIN Shield Level */}
          <div className="dash-stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>MoMo PIN Shield</span>
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--success)' }}>
                <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
            </div>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 900, margin: 0, color: 'var(--success)' }}>
              100%
            </h2>
            <span style={{ fontSize: '0.72rem', color: 'var(--success)', fontWeight: 700, display: 'block', marginTop: '0.2rem' }}>
              0 Account Breaches
            </span>
          </div>
        </div>

        {/* Weekly Threat Detection & Scan Volume Graph Section */}
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
              <line x1="0" y1="30" x2="500" y2="30" stroke="var(--border)" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="var(--border)" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="var(--border)" strokeDasharray="4 4" strokeWidth="1" />

              {graphData.map((d, i) => {
                const x = 35 + i * 70
                const totalHeight = d.scans * 12
                const threatHeight = d.highRisk * 12
                const yTotal = 130 - totalHeight
                const yThreat = 130 - threatHeight

                return (
                  <g key={d.day}>
                    <rect x={x} y={yTotal} width="18" height={totalHeight} rx="4" fill="var(--primary)" opacity="0.85" />
                    <rect x={x + 22} y={yThreat} width="18" height={threatHeight} rx="4" fill="var(--danger)" opacity="0.9" />
                    <text x={x + 20} y="152" textAnchor="middle" fill="var(--muted)" fontSize="11" fontWeight="700">{d.day}</text>
                  </g>
                )
              })}
            </svg>
          </div>
        </section>

        {/* FEATURE A & B GRID: Instant Quick Scan Widget & Interactive Self-Defense Checklist */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.4rem', marginBottom: '2rem' }} className="animate-slide-up delay-2">
          {/* FEATURE A: Instant Quick Threat Check Widget */}
          <div className="scanner-card" style={{ padding: '1.5rem', background: 'var(--surface-alt)', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(230, 60, 28, 0.12)', border: '1px solid rgba(230, 60, 28, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--primary)' }}>
                <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0, color: 'var(--text)' }}>Instant Quick Threat Check</h3>
                <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>Paste SMS or lure text below</span>
              </div>
            </div>

            <form onSubmit={handleQuickScan} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <textarea
                rows={3}
                placeholder="Paste SMS e.g. 'I sent 850 GHS by mistake...'"
                value={quickScanText}
                onChange={(e) => setQuickScanText(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '12px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  fontSize: '0.84rem',
                  outline: 'none',
                  resize: 'none',
                  fontFamily: 'inherit'
                }}
              />
              <button
                type="submit"
                className="button-primary"
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: '999px',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  cursor: 'pointer'
                }}
              >
                Analyze Quick Snippet
              </button>
            </form>

            {quickResult && (
              <div style={{ marginTop: '0.9rem', padding: '0.85rem', borderRadius: '12px', background: 'var(--surface)', border: `1px solid ${quickResult.score > 50 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: quickResult.score > 50 ? 'var(--danger)' : 'var(--success)' }}>
                    {quickResult.level} ({quickResult.score}%)
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0, lineHeight: 1.4 }}>
                  {quickResult.summary}
                </p>
              </div>
            )}
          </div>

          {/* FEATURE B: Interactive MoMo Self-Defense Checklist */}
          <div className="scanner-card" style={{ padding: '1.5rem', background: 'var(--surface-alt)', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--success)' }}>
                <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0, color: 'var(--text)' }}>MoMo Self-Defense Checklist</h3>
                <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>Check your daily security habits</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {checklist.map((item) => (
                <label
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    background: 'var(--surface)',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => {}}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--success)' }}
                  />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: item.checked ? 'var(--text)' : 'var(--muted)', textDecoration: item.checked ? 'none' : 'line-through' }}>
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* FEATURE C: Interactive Scam Simulator Preset Section */}
        <section className="scanner-card animate-slide-up delay-3" style={{ padding: '1.8rem 1.4rem', marginBottom: '2rem', background: 'var(--surface-alt)', borderRadius: '20px', border: '1px solid var(--border)' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '0 0 0.3rem 0', color: 'var(--text)' }}>
              Test Threat Intelligence Simulator
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--muted)', margin: 0 }}>
              Select a sample scam message below to simulate how SafeLens AI analyzes risk variables in real-time.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.4rem', marginBottom: '1rem' }}>
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setSelectedPreset(preset)}
                style={{
                  background: selectedPreset.id === preset.id ? 'var(--primary)' : 'var(--surface)',
                  color: selectedPreset.id === preset.id ? '#ffffff' : 'var(--text)',
                  border: selectedPreset.id === preset.id ? '1px solid var(--primary)' : '1px solid var(--border)',
                  padding: '0.45rem 0.95rem',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
              >
                {preset.title}
              </button>
            ))}
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', flexWrap: 'wrap', gap: '0.4rem' }}>
              <strong style={{ fontSize: '0.92rem', color: 'var(--text)' }}>{selectedPreset.title}</strong>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, padding: '0.2rem 0.65rem', borderRadius: '999px', background: selectedPreset.riskLevel === 'high' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: selectedPreset.riskLevel === 'high' ? 'var(--danger)' : 'var(--success)', border: '1px solid ' + (selectedPreset.riskLevel === 'high' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)') }}>
                {selectedPreset.riskScore}% Threat Risk Score
              </span>
            </div>

            <div style={{ background: 'var(--surface-alt)', padding: '0.8rem 0.95rem', borderRadius: '10px', fontSize: '0.86rem', color: 'var(--text)', fontFamily: 'monospace', marginBottom: '0.9rem', lineHeight: 1.5, border: '1px solid var(--border)' }}>
              &ldquo;{selectedPreset.content}&rdquo;
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--muted)', margin: '0 0 0.8rem 0', lineHeight: 1.55 }}>
              {selectedPreset.explanation}
            </p>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.08)', padding: '0.65rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.9rem', height: '0.9rem', color: 'var(--success)', flexShrink: 0, marginTop: '2px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)' }}>
                Recommendation: {selectedPreset.advice}
              </span>
            </div>
          </div>
        </section>

        {/* FEATURE D: Ghana Emergency Helplines Direct Dial Bar */}
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
