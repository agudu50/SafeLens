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
      {/* Live Scam Ticker */}
      <div className="ticker-container animate-slide-up" style={{ marginBottom: '1.2rem' }}>
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

      {/* Dashboard Welcome Header */}
      <section className="scanner-card animate-fade-in" style={{ background: 'var(--surface-alt)', padding: '1.8rem 1.5rem', marginBottom: '1.5rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <span className="live-pulse-dot" style={{ width: '8px', height: '8px', background: 'var(--success)' }} />
              <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ACTIVE THREAT SHIELD
              </span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0 0 0.35rem 0', color: 'var(--text)', lineHeight: 1.2 }}>
              Welcome to your <span className="text-highlight">Dashboard</span>, {user?.name ? user.name.split(' ')[0] : 'Kofi'} 👋
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.92rem', margin: 0, maxWidth: '560px', lineHeight: 1.55 }}>
              Your SafeLens security command center. Scan incoming MoMo messages, review your detection logs, or dial emergency helplines.
            </p>
          </div>

          {/* Quick Scan Action Button */}
          <Link
            to="/scan"
            className="button-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.4rem',
              borderRadius: '999px',
              fontWeight: 800,
              fontSize: '0.92rem',
              textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(230, 60, 28, 0.3)',
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

      {/* Security Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="scanner-card" style={{ padding: '1.25rem 1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--primary)', flexShrink: 0 }}>
            <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.4rem', height: '1.4rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Total Scans</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0.1rem 0 0 0', color: 'var(--text)' }}>12 Scans</h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--success)', fontWeight: 700 }}>100% Analysis Accuracy</span>
          </div>
        </div>

        <div className="scanner-card" style={{ padding: '1.25rem 1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--danger)', flexShrink: 0 }}>
            <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.4rem', height: '1.4rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Scams Prevented</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0.1rem 0 0 0', color: 'var(--text)' }}>4 Blocked</h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700 }}>GH₵ 1,350 Funds Protected</span>
          </div>
        </div>

        <div className="scanner-card" style={{ padding: '1.25rem 1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--success)', flexShrink: 0 }}>
            <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.4rem', height: '1.4rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>MoMo Defense Level</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0.1rem 0 0 0', color: 'var(--text)' }}>Optimal</h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--success)', fontWeight: 700 }}>PIN &amp; OTP Shield Active</span>
          </div>
        </div>
      </div>

      {/* Quick Tools Grid */}
      <h2 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '1rem', color: 'var(--text)' }}>
        Dashboard Security Features
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem', marginBottom: '2rem' }}>
        {/* Card 1: AI Scanner */}
        <Link to="/scan" className="scanner-card" style={{ padding: '1.4rem', textDecoration: 'none', transition: 'transform 0.2s ease', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(230, 60, 28, 0.12)', border: '1px solid rgba(230, 60, 28, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--primary)', marginBottom: '0.85rem' }}>
              <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.25rem', height: '1.25rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: 'var(--text)' }}>
              AI Message Scanner
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
              Paste suspicious SMS, WhatsApp lures, or upload screenshots to instantly analyze scam risk scores.
            </p>
          </div>
          <div style={{ marginTop: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontSize: '0.84rem', fontWeight: 800 }}>
            <span>Open Scanner</span>
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </Link>

        {/* Card 2: Scan History */}
        <Link to="/history" className="scanner-card" style={{ padding: '1.4rem', textDecoration: 'none', transition: 'transform 0.2s ease', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--primary)', marginBottom: '0.85rem' }}>
              <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.25rem', height: '1.25rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: 'var(--text)' }}>
              Personal Scan History
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
              Review past detection logs, risk tags, and safety recommendations for your previous scans.
            </p>
          </div>
          <div style={{ marginTop: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontSize: '0.84rem', fontWeight: 800 }}>
            <span>View Scan Logs</span>
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </Link>

        {/* Card 3: Safety Self-Defense Guide */}
        <Link to="/safety-tips" className="scanner-card" style={{ padding: '1.4rem', textDecoration: 'none', transition: 'transform 0.2s ease', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--success)', marginBottom: '0.85rem' }}>
              <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.25rem', height: '1.25rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: 'var(--text)' }}>
              Scam Self-Defense Guide
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
              Interactive slideshow rules to protect your 4-digit MoMo PIN, WhatsApp accounts, and banking OTPs.
            </p>
          </div>
          <div style={{ marginTop: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--success)', fontSize: '0.84rem', fontWeight: 800 }}>
            <span>Explore Guides</span>
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Interactive Scam Simulator Preset Section */}
      <section className="scanner-card" style={{ padding: '1.8rem 1.4rem', marginBottom: '1.8rem', background: 'var(--surface-alt)', borderRadius: '20px', border: '1px solid var(--border)' }}>
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '0 0 0.3rem 0', color: 'var(--text)' }}>
            Test Common Threat Simulator
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--muted)', margin: 0 }}>
            Select a sample message below to simulate how SafeLens flags threats in real-time.
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
              {selectedPreset.riskScore}% Risk Score
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
    </PageContainer>
  )
}
