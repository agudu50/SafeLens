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

const securityChecklist = [
  { id: 1, title: 'MoMo Wallet PIN Protection', status: 'Optimal', iconColor: 'var(--success)' },
  { id: 2, title: 'AI NLP Scam Analyzer Engine', status: 'Online (v2.4)', iconColor: 'var(--primary)' },
  { id: 3, title: 'Ghana Telecom Fraud Gateway (100 / 1917)', status: 'Connected', iconColor: 'var(--success)' },
  { id: 4, title: 'Cyber Security Authority Link (292)', status: 'Active 24/7', iconColor: 'var(--primary)' },
]

export default function Dashboard({ user }) {
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

        {/* NEW FEATURE: System Security Status & Direct History Workspace Launcher */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem', marginBottom: '2rem' }} className="animate-slide-up delay-2">
          {/* Feature 1: Real-time System Security Status Checklist */}
          <div className="scanner-card" style={{ padding: '1.5rem', background: 'var(--surface-alt)', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, margin: '0 0 0.8rem 0', color: 'var(--text)' }}>
              Active Defense Status
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {securityChecklist.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface)', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.95rem', height: '0.95rem', color: item.iconColor }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)' }}>{item.title}</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: item.iconColor, background: 'rgba(16, 185, 129, 0.1)', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Feature 2: Quick History Log Hub Link */}
          <div className="scanner-card" style={{ padding: '1.5rem', background: 'var(--surface-alt)', borderRadius: '20px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--primary)', marginBottom: '0.85rem' }}>
                <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.25rem', height: '1.25rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, margin: '0 0 0.35rem 0', color: 'var(--text)' }}>
                Full Scan History &amp; Filter Logs
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--muted)', margin: 0, lineHeight: 1.55 }}>
                Search, filter by risk level (High/Medium/Low) or type (SMS, Link, Screenshot, Email), and export CSV reports on the dedicated History page.
              </p>
            </div>

            <Link
              to="/history"
              className="button-primary"
              style={{
                marginTop: '1.2rem',
                display: 'inline-flex',
                alignItems: 'center',
                justify: 'center',
                gap: '0.4rem',
                padding: '0.65rem 1.1rem',
                borderRadius: '999px',
                fontWeight: 800,
                fontSize: '0.84rem',
                textDecoration: 'none'
              }}
            >
              <span>View All Records in History</span>
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
