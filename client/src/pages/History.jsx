import { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Spinner from '../components/ui/Spinner'
import { getScanHistory, fetchDbReports } from '../services/scannerService'

export default function History() {
  const navigate = useNavigate()

  // Synchronously initialize from persistent history for zero-flicker frame rendering
  const [scans, setScans] = useState(() => {
    try {
      const cached = localStorage.getItem('safelens_history')
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed) && parsed.length >= 10) return parsed
      }
      return getScanHistory()
    } catch {
      return getScanHistory()
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all') // 'all' | 'message' | 'link' | 'screenshot' | 'email'
  const [filterSeverity, setFilterSeverity] = useState('all') // 'all' | 'high' | 'medium' | 'low'
  const [selectedIncidentForAudit, setSelectedIncidentForAudit] = useState(null)

  // Export CSV Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [presetRange, setPresetRange] = useState('all')

  // Fetch from Neon DB on mount & listen for real-time scans
  useEffect(() => {
    async function syncData() {
      try {
        const dbReports = await fetchDbReports(50)
        if (dbReports && dbReports.length > 0) {
          setScans(dbReports)
        }
      } catch (err) {
        console.warn('[SafeLens] Failed to sync history from DB:', err)
      } finally {
        setIsLoading(false)
      }
    }
    syncData()

    const handleScanCompleted = (e) => {
      const newScan = e.detail
      if (!newScan || !newScan.id) return
      setScans((prev) => {
        if (prev.some((r) => r.id === newScan.id)) return prev
        return [newScan, ...prev]
      })
    }

    const handleStorageChange = (e) => {
      if (e.key === 'safelens_history') {
        const fresh = getScanHistory()
        if (fresh && fresh.length > 0) setScans(fresh)
      }
    }

    window.addEventListener('safelens_scan_completed', handleScanCompleted)
    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('safelens_scan_completed', handleScanCompleted)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Metrics
  const metrics = useMemo(() => {
    const total = scans.length
    const critical = scans.filter((s) => s.riskLevel === 'high').length
    const medium = scans.filter((s) => s.riskLevel === 'medium').length
    const safe = scans.filter((s) => s.riskLevel === 'low').length
    const avgScore = total > 0 ? Math.round(scans.reduce((acc, c) => acc + (c.riskScore || 0), 0) / total) : 0
    return { total, critical, medium, safe, avgScore }
  }, [scans])

  // Filtered Incident Feed
  const filteredScans = useMemo(() => {
    return scans.filter((scan) => {
      const query = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !query ||
        (scan.id && scan.id.toLowerCase().includes(query)) ||
        (scan.summary && scan.summary.toLowerCase().includes(query)) ||
        (scan.originalContent && scan.originalContent.toLowerCase().includes(query)) ||
        (scan.threatCategory && scan.threatCategory.toLowerCase().includes(query)) ||
        (scan.redFlags && scan.redFlags.some((f) => f.toLowerCase().includes(query)))

      const matchesType =
        filterType === 'all' || (scan.type && scan.type.toLowerCase() === filterType.toLowerCase())

      const matchesSeverity =
        filterSeverity === 'all' || (scan.riskLevel && scan.riskLevel.toLowerCase() === filterSeverity.toLowerCase())

      return matchesSearch && matchesType && matchesSeverity
    })
  }, [scans, searchQuery, filterType, filterSeverity])

  // CSV Export Handlers
  const handleOpenExportModal = () => {
    setPresetRange('all')
    setFromDate('')
    setToDate('')
    setIsExportModalOpen(true)
  }

  const handleApplyPreset = (range) => {
    setPresetRange(range)
    const today = new Date()
    const todayStr = today.toISOString().slice(0, 10)

    if (range === 'all') {
      setFromDate('')
      setToDate('')
    } else if (range === '7days') {
      const past = new Date()
      past.setDate(today.getDate() - 7)
      setFromDate(past.toISOString().slice(0, 10))
      setToDate(todayStr)
    } else if (range === '30days') {
      const past = new Date()
      past.setDate(today.getDate() - 30)
      setFromDate(past.toISOString().slice(0, 10))
      setToDate(todayStr)
    }
  }

  const handleConfirmExportCSV = () => {
    const recordsToExport = filteredScans.filter((s) => {
      const recordDate = s.createdAt || new Date().toISOString().slice(0, 10)
      if (fromDate && recordDate < fromDate) return false
      if (toDate && recordDate > toDate) return false
      return true
    })
    if (recordsToExport.length === 0) return

    const headers = 'Scan ID,Channel,Risk Level,Risk Score,Threat Category,Content,Summary,Logged At\n'
    const rows = recordsToExport
      .map((s) => {
        const id = s.id ? s.id.slice(0, 10).toUpperCase() : ''
        const type = s.type || 'message'
        const riskLevel = s.riskLevel || 'high'
        const riskScore = s.riskScore || 0
        const cat = (s.threatCategory || '').replace(/"/g, '""')
        const content = (s.originalContent || '').replace(/"/g, '""')
        const summary = (s.summary || '').replace(/"/g, '""')
        const loggedAt = s.submittedAt || ''
        return `"#${id}","${type}","${riskLevel}",${riskScore},"${cat}","${content}","${summary}","${loggedAt}"`
      })
      .join('\n')

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    const suffix = fromDate && toDate ? `${fromDate}_to_${toDate}` : 'all_time'
    link.setAttribute('download', `safelens_security_incidents_${suffix}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setIsExportModalOpen(false)
  }

  return (
    <PageContainer>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
        <style>{`
          .cyhist-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 1.4rem;
            position: relative;
          }
          .cyhist-table-wrap {
            overflow-x: auto;
            border-radius: 10px;
            border: 1px solid var(--border);
            background: var(--surface-alt);
          }
          .cyhist-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.82rem;
            text-align: left;
          }
          .cyhist-table th {
            padding: 0.85rem 1rem;
            background: var(--surface-alt);
            color: var(--muted);
            font-size: 0.72rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-bottom: 1px solid var(--border);
            white-space: nowrap;
          }
          .cyhist-table td {
            padding: 0.9rem 1rem;
            border-bottom: 1px solid var(--border);
            vertical-align: middle;
          }
          .cyhist-table tbody tr:last-child td {
            border-bottom: none;
          }
          .cyhist-table tbody tr:hover td {
            background: var(--surface);
          }
          .cyhist-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(4px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
          }
          .cyhist-modal-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 14px;
            width: 100%;
            max-width: 680px;
            max-height: 88vh;
            overflow-y: auto;
            box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
            display: flex;
            flex-direction: column;
          }
        `}</style>

        {/* =========================================================================
            HEADER DECK WITH LIVE POSTURE & EXPORT TRIGGER
            ========================================================================= */}
        <div className="cyhist-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.2rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
              <span className="live-pulse-dot" style={{ width: '8px', height: '8px', background: 'var(--primary)' }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                LIVE INCIDENT REGISTRY
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: '0 0 0.35rem 0', color: 'var(--text)' }}>
              Scan History &amp; Threat Intelligence Telemetry
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.84rem', margin: 0 }}>
              Chronological forensic audit logs synchronized in real time with Neon Postgres and Base Sepolia L2.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleOpenExportModal}
              style={{
                background: 'var(--surface-alt)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                padding: '0.55rem 1.05rem',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              <span>Export CSV</span>
            </button>
            <Link to="/scanner" style={{ textDecoration: 'none' }}>
              <button
                style={{
                  background: 'var(--primary)',
                  border: '1px solid var(--primary)',
                  color: '#ffffff',
                  padding: '0.55rem 1.05rem',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}
              >
                <span>+ New AI Scan</span>
              </button>
            </Link>
          </div>
        </div>

        {/* =========================================================================
            3-CARD METRICS TELEMETRY STRIP
            ========================================================================= */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div className="cyhist-card" style={{ padding: '1.2rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>
              Total Audits Synced
            </span>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text)', marginTop: '0.2rem' }}>
              {metrics.total}
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block', marginTop: '0.25rem' }}>
              Direct Neon Serverless Postgres Registry
            </span>
          </div>

          <div className="cyhist-card" style={{ padding: '1.2rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>
              Critical Threats Neutralized
            </span>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--primary)', marginTop: '0.2rem' }}>
              {metrics.critical}
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 800, display: 'block', marginTop: '0.25rem' }}>
              MoMo &amp; Credential Exploits Intercepted
            </span>
          </div>

          <div className="cyhist-card" style={{ padding: '1.2rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>
              Average Exposure Score
            </span>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: metrics.avgScore > 50 ? 'var(--primary)' : '#10b981', marginTop: '0.2rem' }}>
              {metrics.avgScore}%
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block', marginTop: '0.25rem' }}>
              Google Gemma 4 Confidence Index
            </span>
          </div>
        </div>

        {/* =========================================================================
            EXACT INCIDENT FEED & TRIAGE TABLE SPECIFICATION
            ========================================================================= */}
        <section className="cyhist-card" style={{ padding: '1.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 900, margin: 0, color: 'var(--text)' }}>
                  Live Security Incident Feed &amp; Triage
                </h2>
                <span style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '999px' }}>
                  {filteredScans.length} Records
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--muted)', margin: '0.25rem 0 0 0' }}>
                Chronological threat intelligence telemetry synced directly with Neon Postgres
              </p>
            </div>

            {/* Search & Filter Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              {/* Search Bar */}
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search incidents, hashes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    background: 'var(--surface-alt)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    borderRadius: '999px',
                    padding: '0.45rem 0.9rem 0.45rem 2.1rem',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    outline: 'none',
                    width: '230px',
                  }}
                />
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>

              {/* Channel Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{
                  background: 'var(--surface-alt)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  borderRadius: '999px',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  outline: 'none'
                }}
              >
                <option value="all">All Channels</option>
                <option value="message">SMS / WhatsApp</option>
                <option value="link">Phishing URLs</option>
                <option value="screenshot">Screenshots OCR</option>
                <option value="email">Emails</option>
              </select>

              {/* Severity Filter */}
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                style={{
                  background: 'var(--surface-alt)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  borderRadius: '999px',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  outline: 'none'
                }}
              >
                <option value="all">All Severities</option>
                <option value="high">Critical Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="low">Verified Safe</option>
              </select>

              {(searchQuery || filterType !== 'all' || filterSeverity !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setFilterType('all')
                    setFilterSeverity('all')
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Table Container */}
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '3.5rem' }}>
              <Spinner />
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: '0.6rem' }}>
                Synchronizing threat intelligence records...
              </p>
            </div>
          ) : filteredScans.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem', background: 'var(--surface-alt)', borderRadius: '10px', border: '1px dashed var(--border)' }}>
              <p style={{ margin: 0, fontWeight: 700, color: 'var(--muted)' }}>
                No security incidents match your filter query.
              </p>
            </div>
          ) : (
            <div className="cyhist-table-wrap">
              <table className="cyhist-table">
                <thead>
                  <tr>
                    <th>Incident / Hash</th>
                    <th>Channel</th>
                    <th>Threat Classification</th>
                    <th>Risk Assessment</th>
                    <th>Logged At</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredScans.map((item) => {
                    const isHigh = item.riskLevel === 'high'
                    const isMed = item.riskLevel === 'medium'
                    const badgeColor = isHigh ? 'var(--primary)' : isMed ? '#f59e0b' : '#10b981'

                    return (
                      <tr key={item.id}>
                        {/* Incident / Hash + Preview */}
                        <td style={{ minWidth: '240px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            <span style={{ fontFamily: 'monospace', fontWeight: 900, color: 'var(--primary)', fontSize: '0.78rem' }}>
                              #{item.id.slice(0, 10).toUpperCase()}
                            </span>
                            <span style={{ color: 'var(--text)', fontWeight: 600, fontSize: '0.8rem', maxWidth: '340px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.originalContent || item.summary}
                            </span>
                          </div>
                        </td>

                        {/* Channel */}
                        <td>
                          <span style={{ textTransform: 'capitalize', fontWeight: 800, fontSize: '0.76rem', color: 'var(--muted)', background: 'var(--surface)', padding: '0.2rem 0.55rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
                            {item.type || 'message'}
                          </span>
                        </td>

                        {/* Threat Classification */}
                        <td>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)' }}>
                            {item.threatCategory || 'MoMo Transfer Fraud'}
                          </span>
                        </td>

                        {/* Risk Assessment */}
                        <td>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'var(--surface)', color: badgeColor, border: `1px solid ${badgeColor}`, padding: '0.2rem 0.55rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 900 }}>
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: badgeColor }} />
                            {item.riskScore}% {item.riskLevel?.toUpperCase()}
                          </span>
                        </td>

                        {/* Logged At */}
                        <td>
                          <span style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 600 }}>
                            {item.submittedAt || 'Recent'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                            <button
                              onClick={() => setSelectedIncidentForAudit(item)}
                              style={{
                                padding: '0.35rem 0.75rem',
                                fontSize: '0.74rem',
                                fontWeight: 800,
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                                background: 'var(--surface)',
                                color: 'var(--text)',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              Forensic Audit →
                            </button>
                            <Link to={`/results/${item.id}`} style={{ textDecoration: 'none' }}>
                              <button
                                style={{
                                  padding: '0.35rem 0.55rem',
                                  fontSize: '0.74rem',
                                  fontWeight: 800,
                                  borderRadius: '8px',
                                  border: '1px solid var(--border)',
                                  background: 'transparent',
                                  color: 'var(--muted)',
                                  cursor: 'pointer'
                                }}
                                title="Open Dedicated Forensic Report"
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                  <polyline points="15 3 21 3 21 9" />
                                </svg>
                              </button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* =========================================================================
            DEEP AI FORENSIC DRILLDOWN MODAL
            ========================================================================= */}
        {selectedIncidentForAudit && (
          <div className="cyhist-modal-overlay" onClick={() => setSelectedIncidentForAudit(null)}>
            <div className="cyhist-modal-card" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div style={{ padding: '1.2rem 1.4rem', background: 'var(--surface-alt)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--surface)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center', color: 'var(--primary)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: 'var(--text)' }}>
                      Forensic Telemetry Audit #{selectedIncidentForAudit.id?.slice(0, 10).toUpperCase()}
                    </h3>
                    <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600 }}>
                      Google Gemma 4 AI Deep Inspection • Base L2 Sepolia
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedIncidentForAudit(null)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '0.4rem', display: 'grid', placeItems: 'center' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface-alt)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>Classification</span>
                    <div style={{ fontSize: '0.94rem', fontWeight: 900, color: 'var(--text)', marginTop: '2px' }}>
                      {selectedIncidentForAudit.threatCategory || 'MoMo Transfer Fraud'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>Confidence Index</span>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--primary)', marginTop: '2px' }}>
                      {selectedIncidentForAudit.riskScore}% {selectedIncidentForAudit.riskLevel?.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.4rem' }}>
                    Evaluated Payload / Content
                  </span>
                  <div style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.8rem', fontSize: '0.82rem', fontFamily: 'monospace', color: 'var(--text)', lineHeight: 1.45 }}>
                    {selectedIncidentForAudit.originalContent || selectedIncidentForAudit.summary}
                  </div>
                </div>

                {selectedIncidentForAudit.redFlags && selectedIncidentForAudit.redFlags.length > 0 && (
                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.4rem' }}>
                      Identified Attack Vectors &amp; Red Flags
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {selectedIncidentForAudit.redFlags.map((flag, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.78rem', background: 'var(--surface-alt)', padding: '0.45rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />
                          <span style={{ color: 'var(--text)', fontWeight: 700 }}>{flag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedIncidentForAudit.explanation && (
                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.4rem' }}>
                      AI Forensic Rationale
                    </span>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.5, background: 'var(--surface-alt)', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      {selectedIncidentForAudit.explanation}
                    </p>
                  </div>
                )}

                {selectedIncidentForAudit.recommendation && (
                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.4rem' }}>
                      Containment Protocol
                    </span>
                    <div style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.8rem', fontSize: '0.8rem', color: 'var(--text)', lineHeight: 1.45 }}>
                      {selectedIncidentForAudit.recommendation}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={{ padding: '1rem 1.4rem', background: 'var(--surface-alt)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontFamily: 'monospace' }}>
                  Base L2: 0xb0e5...859c
                </span>
                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <button
                    onClick={() => setSelectedIncidentForAudit(null)}
                    style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.45rem 0.95rem', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text)', cursor: 'pointer' }}
                  >
                    Close
                  </button>
                  <Link to={`/results/${selectedIncidentForAudit.id}`} style={{ textDecoration: 'none' }}>
                    <button
                      style={{ background: 'var(--primary)', border: '1px solid var(--primary)', borderRadius: '8px', padding: '0.45rem 0.95rem', fontSize: '0.78rem', fontWeight: 800, color: '#ffffff', cursor: 'pointer' }}
                    >
                      Open Full Page →
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            EXPORT DATE RANGE PRESET MODAL
            ========================================================================= */}
        {isExportModalOpen && (
          <div className="cyhist-modal-overlay" onClick={() => setIsExportModalOpen(false)}>
            <div className="cyhist-modal-card" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ padding: '1.2rem 1.4rem', background: 'var(--surface-alt)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: 'var(--text)' }}>
                  Export Incident Intelligence (CSV)
                </h3>
                <button
                  onClick={() => setIsExportModalOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--muted)' }}>
                  Choose a date window or quick preset to export active threat incident telemetry for compliance and forensic auditing.
                </p>

                {/* Preset Chips */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {[
                    { id: 'all', label: 'All Time' },
                    { id: '7days', label: 'Last 7 Days' },
                    { id: '30days', label: 'Last 30 Days' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleApplyPreset(p.id)}
                      style={{
                        padding: '0.4rem 0.85rem',
                        borderRadius: '999px',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        background: presetRange === p.id ? 'var(--primary)' : 'var(--surface-alt)',
                        color: presetRange === p.id ? '#ffffff' : 'var(--text)',
                        border: `1px solid ${presetRange === p.id ? 'var(--primary)' : 'var(--border)'}`,
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Date Inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                      From Date
                    </label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => {
                        setFromDate(e.target.value)
                        setPresetRange('custom')
                      }}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--text)', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                      To Date
                    </label>
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => {
                        setToDate(e.target.value)
                        setPresetRange('custom')
                      }}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--text)', fontSize: '0.82rem' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ padding: '1rem 1.4rem', background: 'var(--surface-alt)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(false)}
                  style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text)', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmExportCSV}
                  style={{ background: 'var(--primary)', border: '1px solid var(--primary)', borderRadius: '8px', padding: '0.5rem 1.1rem', fontSize: '0.8rem', fontWeight: 800, color: '#ffffff', cursor: 'pointer' }}
                >
                  Download CSV
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
