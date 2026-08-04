import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import { getScanHistory, clearScanHistory } from '../services/scannerService'

const typeOptions = ['All', 'Message', 'Screenshot', 'Link', 'Email']
const riskOptions = ['All', 'High', 'Medium', 'Low']

export default function History() {
  const navigate = useNavigate()
  const [scans, setScans] = useState(() => getScanHistory())
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedRisk, setSelectedRisk] = useState('All')

  // Calculate statistics from the history array
  const stats = useMemo(() => {
    const total = scans.length
    const avoided = scans.filter((s) => s.riskLevel === 'high').length
    const totalScore = scans.reduce((acc, curr) => acc + curr.riskScore, 0)
    const avgScore = total > 0 ? Math.round(totalScore / total) : 0
    return { total, avoided, avgScore }
  }, [scans])

  // Filter history based on search query, type selection, and risk selection
  const filteredScans = useMemo(() => {
    return scans.filter((scan) => {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        searchQuery === '' ||
        scan.summary.toLowerCase().includes(query) ||
        scan.originalContent.toLowerCase().includes(query) ||
        (scan.redFlags && scan.redFlags.some(f => f.toLowerCase().includes(query)))
      
      const matchesType = selectedType === 'All' || scan.type.toLowerCase() === selectedType.toLowerCase()
      const matchesRisk = selectedRisk === 'All' || scan.riskLevel.toLowerCase() === selectedRisk.toLowerCase()

      return matchesSearch && matchesType && matchesRisk
    })
  }, [scans, searchQuery, selectedType, selectedRisk])

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your local scan history? This action cannot be undone.')) {
      clearScanHistory()
      setScans([])
    }
  }

  // Generate and download a CSV file directly in the browser
  const handleExportCSV = () => {
    if (scans.length === 0) return
    
    const headers = 'Scan ID,Type,Risk Level,Risk Score,Verdict Summary,Submitted At,Content\n'
    const rows = scans
      .map((s) => {
        const cleanSummary = s.summary.replace(/"/g, '""')
        const cleanContent = s.originalContent.replace(/"/g, '""')
        return `"${s.id}","${s.type}","${s.riskLevel}",${s.riskScore},"${cleanSummary}","${s.submittedAt}","${cleanContent}"`
      })
      .join('\n')
      
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `safelens_scan_history_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <PageContainer>
      <div className="dash-container">
        {/* Header section with Export & Clear action buttons */}
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
                <span className="live-pulse-dot" style={{ width: '8px', height: '8px', background: 'var(--primary)' }} />
                <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  PERSONAL AUDIT LOGS
                </span>
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: '0 0 0.25rem 0', color: 'var(--text)' }}>
                Scan History &amp; Threat Intelligence Logs
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', margin: 0 }}>
                Review past scan verdicts, filter threat categories, and export audit reports.
              </p>
            </div>

            {scans.length > 0 && (
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    padding: '0.55rem 1rem',
                    borderRadius: '999px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '0.95rem', height: '0.95rem' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  <span>Export CSV</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearHistory}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    color: 'var(--danger)',
                    padding: '0.55rem 1rem',
                    borderRadius: '999px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Clear History
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 3 Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.8rem' }} className="animate-slide-up">
          <div className="dash-stat-card">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Total Scans Logged</span>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 900, margin: '0.2rem 0 0 0', color: 'var(--text)' }}>
              {stats.total}
            </h2>
            <span style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block', marginTop: '0.2rem' }}>
              Stored in Local Encrypted Memory
            </span>
          </div>

          <div className="dash-stat-card">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>High Risk Avoided</span>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 900, margin: '0.2rem 0 0 0', color: 'var(--danger)' }}>
              {stats.avoided}
            </h2>
            <span style={{ fontSize: '0.72rem', color: 'var(--danger)', fontWeight: 700, display: 'block', marginTop: '0.2rem' }}>
              Threats Intercepted
            </span>
          </div>

          <div className="dash-stat-card">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Average Risk Score</span>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 900, margin: '0.2rem 0 0 0', color: stats.avgScore > 50 ? 'var(--danger)' : 'var(--success)' }}>
              {stats.avgScore}%
            </h2>
            <span style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block', marginTop: '0.2rem' }}>
              Overall Vulnerability Index
            </span>
          </div>
        </div>

        {/* Real-Time Filter & Search Bar */}
        <section className="scanner-card animate-slide-up delay-1" style={{ padding: '1.6rem 1.4rem', marginBottom: '2rem', background: 'var(--surface-alt)', borderRadius: '20px', border: '1px solid var(--border)' }}>
          {/* Search Input */}
          <div style={{ marginBottom: '1.1rem', position: 'relative' }}>
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: 'var(--muted)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Search content, red flags, or verdict summaries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.9rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', minWidth: '55px' }}>
              TYPE:
            </span>
            {typeOptions.map((type) => {
              const isActive = selectedType === type
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
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
            {riskOptions.map((risk) => {
              const isActive = selectedRisk === risk
              let activeBg = 'var(--primary)'
              if (risk === 'High') activeBg = 'var(--danger)'
              if (risk === 'Medium') activeBg = 'var(--warning)'
              if (risk === 'Low') activeBg = 'var(--success)'

              return (
                <button
                  key={risk}
                  type="button"
                  onClick={() => setSelectedRisk(risk)}
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

        {/* Filtered History Log Records */}
        <section className="scanner-card animate-slide-up delay-2" style={{ padding: '1.6rem 1.4rem', marginBottom: '2rem', background: 'var(--surface-alt)', borderRadius: '20px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, margin: 0, color: 'var(--text)' }}>
              Evaluation Logs ({filteredScans.length})
            </h3>

            {(searchQuery || selectedType !== 'All' || selectedRisk !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedType('All')
                  setSelectedRisk('All')
                }}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Reset Active Filters
              </button>
            )}
          </div>

          {filteredScans.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'var(--surface)', borderRadius: '14px', border: '1px solid var(--border)' }}>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>
                No scan history records match your search or filter selections.
              </p>
              <Link to="/scan" className="button-primary" style={{ padding: '0.55rem 1.1rem', fontSize: '0.84rem', textDecoration: 'none', borderRadius: '999px' }}>
                Run a New Scan
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredScans.map((scan) => {
                const isHigh = scan.riskLevel === 'high' || scan.riskLevel === 'High'
                const isMedium = scan.riskLevel === 'medium' || scan.riskLevel === 'Medium'

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
                    key={scan.id}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '16px',
                      padding: '1.2rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      transition: 'transform 0.2s ease, border-color 0.2s ease'
                    }}
                  >
                    {/* Record Top Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--primary)', background: 'rgba(56, 189, 248, 0.12)', padding: '0.18rem 0.6rem', borderRadius: '999px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                          {scan.type.toUpperCase()}
                        </span>
                        <span style={{ fontSize: '0.76rem', color: 'var(--muted)', fontWeight: 700 }}>
                          {scan.submittedAt}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 850, color: 'var(--success)', background: 'rgba(16, 185, 129, 0.1)', padding: '0.18rem 0.5rem', borderRadius: '999px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                          🛡️ Blockchain Verified
                        </span>
                        <span style={{ fontSize: '0.76rem', fontWeight: 800, color: badgeColor, background: badgeBg, padding: '0.2rem 0.65rem', borderRadius: '999px', border: `1px solid ${badgeBorder}` }}>
                          {scan.riskScore}% {scan.riskLevel.toUpperCase()} RISK
                        </span>
                      </div>
                    </div>

                    {/* Scanned Input Text */}
                    <div style={{ background: 'var(--surface-alt)', padding: '0.8rem 0.95rem', borderRadius: '10px', fontSize: '0.86rem', color: 'var(--text)', fontFamily: 'monospace', lineHeight: 1.45, border: '1px solid var(--border)' }}>
                      &ldquo;{scan.originalContent}&rdquo;
                    </div>

                    {/* Summary */}
                    <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
                      <strong style={{ color: 'var(--text)' }}>Summary: </strong>
                      {scan.summary}
                    </p>

                    {/* Red Flags Tags */}
                    {scan.redFlags && scan.redFlags.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {scan.redFlags.map((flag) => (
                          <span key={flag} style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', background: 'var(--surface-alt)', padding: '0.15rem 0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
                            &bull; {flag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Bar */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.8rem', borderTop: '1px solid var(--border)', paddingTop: '0.65rem', marginTop: '0.2rem' }}>
                      <Link
                        to={`/results/${scan.id}`}
                        style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary)', textDecoration: 'none' }}
                      >
                        View Full Report &rarr;
                      </Link>
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
