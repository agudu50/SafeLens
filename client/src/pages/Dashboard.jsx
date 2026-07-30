import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'

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

const recentActivity = [
  {
    id: 1,
    title: 'MoMo Refund SMS Flagged',
    time: 'Today at 2:14 PM',
    riskScore: 94,
    status: 'Blocked',
    category: 'MoMo Fraud'
  },
  {
    id: 2,
    title: 'WhatsApp Free 50GB Data Link',
    time: 'Yesterday at 5:40 PM',
    riskScore: 88,
    status: 'Phishing',
    category: 'Fake Promo'
  },
  {
    id: 3,
    title: 'MTN Bill Payment Confirmation',
    time: '2 days ago',
    riskScore: 12,
    status: 'Verified Safe',
    category: 'Clean Message'
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

        {/* Futuristic Dashboard Hero Welcome Card */}
        <section className="dash-hero-card animate-fade-in" style={{ marginBottom: '1.8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.2rem', position: 'relative', zIndex: 2 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem', background: 'rgba(16, 185, 129, 0.12)', padding: '0.25rem 0.75rem', borderRadius: '999px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                <span className="live-pulse-dot" style={{ width: '7px', height: '7px', background: 'var(--success)' }} />
                <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  SECURITY SHIELD ACTIVE
                </span>
              </div>
              <h1 style={{ fontSize: '1.9rem', fontWeight: 900, margin: '0 0 0.4rem 0', color: 'var(--text)', lineHeight: 1.25 }}>
                Security Command Center — <span className="text-highlight">{user?.name ? user.name.split(' ')[0] : 'Kofi'}</span>
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '0.92rem', margin: 0, maxWidth: '580px', lineHeight: 1.55 }}>
                Welcome to your personal protection dashboard. Scan suspicious MoMo messages, review threat logs, or learn daily self-defense rules.
              </p>
            </div>

            {/* Quick Action Button */}
            <Link
              to="/scan"
              className="button-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.8rem 1.5rem',
                borderRadius: '999px',
                fontWeight: 800,
                fontSize: '0.92rem',
                textDecoration: 'none',
                boxShadow: '0 6px 22px rgba(230, 60, 28, 0.35)',
                whiteSpace: 'nowrap'
              }}
            >
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <span>Scan Message Now</span>
            </Link>
          </div>
        </section>

        {/* Security Overview Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem', marginBottom: '2rem' }} className="animate-slide-up delay-1">
          <div className="dash-stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Total Scans</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--primary)' }}>
                <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '0 0 0.2rem 0', color: 'var(--text)' }}>12 Scans</h3>
            <span style={{ fontSize: '0.74rem', color: 'var(--success)', fontWeight: 700 }}>100% Analysis Accuracy</span>
          </div>

          <div className="dash-stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Scams Prevented</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--danger)' }}>
                <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '0 0 0.2rem 0', color: 'var(--text)' }}>4 Blocked</h3>
            <span style={{ fontSize: '0.74rem', color: 'var(--primary)', fontWeight: 700 }}>GH₵ 1,350 Funds Saved</span>
          </div>

          <div className="dash-stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>MoMo PIN Shield</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--success)' }}>
                <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '0 0 0.2rem 0', color: 'var(--text)' }}>Protected</h3>
            <span style={{ fontSize: '0.74rem', color: 'var(--success)', fontWeight: 700 }}>0 Account Breaches</span>
          </div>
        </div>

        {/* Dashboard Tools & Features Grid */}
        <h2 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '1.1rem', color: 'var(--text)' }}>
          Security Tools Workspace
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem', marginBottom: '2.2rem' }} className="animate-slide-up delay-2">
          {/* Card 1: AI Scanner */}
          <Link to="/scan" className="dash-tool-card">
            <div>
              <div className="dash-tool-icon" style={{ background: 'rgba(230, 60, 28, 0.12)', border: '1px solid rgba(230, 60, 28, 0.25)', color: 'var(--primary)' }}>
                <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.3rem', height: '1.3rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: 'var(--text)' }}>
                AI Message Scanner
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0, lineHeight: 1.55 }}>
                Analyze suspicious MoMo SMS, WhatsApp messages, or upload screenshots to get an instant AI risk score.
              </p>
            </div>
            <div style={{ marginTop: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 800 }}>
              <span>Launch AI Scanner</span>
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </Link>

          {/* Card 2: Scan History */}
          <Link to="/history" className="dash-tool-card">
            <div>
              <div className="dash-tool-icon" style={{ background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.25)', color: 'var(--primary)' }}>
                <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.3rem', height: '1.3rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: 'var(--text)' }}>
                Personal Scan Logs
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0, lineHeight: 1.55 }}>
                Access all your past scan logs, risk breakdowns, threat tags, and security recommendations.
              </p>
            </div>
            <div style={{ marginTop: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 800 }}>
              <span>Review Scan History</span>
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </Link>

          {/* Card 3: Safety Self-Defense */}
          <Link to="/safety-tips" className="dash-tool-card">
            <div>
              <div className="dash-tool-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', color: 'var(--success)' }}>
                <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.3rem', height: '1.3rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: 'var(--text)' }}>
                Scam Self-Defense Guide
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0, lineHeight: 1.55 }}>
                Learn how to spot impersonation tactics, protect your 4-digit MoMo PIN, and prevent WhatsApp takeovers.
              </p>
            </div>
            <div style={{ marginTop: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--success)', fontSize: '0.85rem', fontWeight: 800 }}>
              <span>Explore Self-Defense Rules</span>
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Recent Threat Detections Timeline */}
        <section className="scanner-card animate-slide-up delay-3" style={{ padding: '1.8rem 1.4rem', marginBottom: '2rem', background: 'var(--surface-alt)', borderRadius: '20px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '0 0 0.2rem 0', color: 'var(--text)' }}>
                Recent Security Scan Activity
              </h2>
              <p style={{ fontSize: '0.84rem', color: 'var(--muted)', margin: 0 }}>
                Log of your recently evaluated messages and threats.
              </p>
            </div>
            <Link to="/history" style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary)', textDecoration: 'none' }}>
              View Full Log →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {recentActivity.map((act) => (
              <div
                key={act.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '0.85rem 1.1rem',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.6rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: act.riskScore > 50 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)', border: '1px solid ' + (act.riskScore > 50 ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)'), display: 'grid', placeItems: 'center', color: act.riskScore > 50 ? 'var(--danger)' : 'var(--success)' }}>
                    {act.riskScore > 50 ? (
                      <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                    ) : (
                      <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--text)', display: 'block' }}>{act.title}</strong>
                    <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>{act.time} &bull; {act.category}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '999px', background: act.riskScore > 50 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: act.riskScore > 50 ? 'var(--danger)' : 'var(--success)' }}>
                    {act.riskScore}% Risk ({act.status})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Scam Simulator Preset Section */}
        <section className="scanner-card" style={{ padding: '1.8rem 1.4rem', marginBottom: '1.8rem', background: 'var(--surface-alt)', borderRadius: '20px', border: '1px solid var(--border)' }}>
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
      </div>
    </PageContainer>
  )
}
