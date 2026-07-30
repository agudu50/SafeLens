import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { getScanHistory, clearScanHistory } from '../services/scannerService'

const toneMap = {
  low: 'low',
  medium: 'medium',
  high: 'high',
}

const typeOptions = ['All', 'Message', 'Screenshot', 'Link', 'Email']
const riskOptions = ['All', 'High', 'Medium', 'Low']

export default function History() {
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
      const matchesSearch =
        scan.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scan.originalContent.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesType = selectedType === 'All' || scan.type === selectedType.toLowerCase()
      const matchesRisk = selectedRisk === 'All' || scan.riskLevel === selectedRisk.toLowerCase()

      return matchesSearch && matchesType && matchesRisk
    })
  }, [scans, searchQuery, selectedType, selectedRisk])

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your local scan history? This action cannot be undone.')) {
      clearScanHistory()
      setScans([])
    }
  }

  // Generate and download a real CSV file directly in the browser
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
      <section className="scanner-card">
        <div className="section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.2rem', marginBottom: '1.5rem' }}>
          <div>
            <h1>Recent scan history</h1>
            <p style={{ margin: 0 }}>Review previous safety checks and analyze past threat evaluations.</p>
          </div>
          {scans.length > 0 && (
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <Button variant="ghost" onClick={handleExportCSV}>Export CSV</Button>
              <Button variant="secondary" onClick={handleClearHistory} style={{ background: '#fee2e2', color: '#dc2626' }}>
                Clear All
              </Button>
            </div>
          )}
        </div>

        {/* Statistics Dashboard widgets */}
        <div className="stats-grid animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', marginBottom: '2rem' }}>
          <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', padding: '1.25rem', borderRadius: '1rem', background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Scans Done</h4>
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1.25rem', height: '1.25rem', color: 'var(--muted)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="stat-number" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)' }}>{stats.total}</div>
          </div>

          <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', padding: '1.25rem', borderRadius: '1rem', background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scams Avoided</h4>
              <svg fill="none" stroke="var(--danger)" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1.25rem', height: '1.25rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <div className="stat-number" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--danger)' }}>{stats.avoided}</div>
          </div>

          <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', padding: '1.25rem', borderRadius: '1rem', background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Average Risk Score</h4>
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1.25rem', height: '1.25rem', color: 'var(--muted)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="stat-number" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)' }}>{stats.avgScore}%</div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="history-toolbar animate-fade-in">
          <div className="history-search-wrap">
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1.05rem', height: '1.05rem', position: 'absolute', left: '0.85rem', color: 'var(--muted)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search content or summaries..."
                className="history-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.3rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div className="history-filters">
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', width: '60px' }}>TYPE:</span>
              {typeOptions.map((type) => (
                <button
                  key={type}
                  className={`filter-badge ${selectedType === type ? 'filter-badge--active' : ''}`}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="history-filters">
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', width: '60px' }}>RISK:</span>
              {riskOptions.map((risk) => (
                <button
                  key={risk}
                  className={`filter-badge ${selectedRisk === risk ? 'filter-badge--active' : ''}`}
                  onClick={() => setSelectedRisk(risk)}
                >
                  {risk}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* List of scanned cards */}
        {filteredScans.length > 0 ? (
          <div className="history-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {filteredScans.map((scan) => (
              <Link 
                to={`/results/${scan.id}`} 
                key={scan.id} 
                className="history-item animate-fade-in" 
                style={{ 
                  textDecoration: 'none', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'stretch',
                  padding: '1.25rem',
                  gap: '0.75rem',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '1rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Badge tone={toneMap[scan.riskLevel] || 'neutral'}>{scan.riskLevel.toUpperCase()} RISK</Badge>
                    <span style={{ fontSize: '0.72rem', background: 'var(--surface-strong)', padding: '0.2rem 0.55rem', borderRadius: '6px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      {scan.type === 'message' && (
                        <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.8rem', height: '0.8rem' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.12 2.9 2.78 2.9h1.12c.38 0 .74.15 1.01.42l1.93 1.93c.35.35.94.1 1.01-.4v-1.95c0-.41.34-.75.75-.75h2.12c1.66 0 2.78-1.3 2.78-2.9v-3c0-1.6-1.12-2.9-2.78-2.9H5.15C3.49 4.3 2.37 5.6 2.37 7.2v3z" />
                        </svg>
                      )}
                      {scan.type === 'screenshot' && (
                        <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.8rem', height: '0.8rem' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                        </svg>
                      )}
                      {scan.type === 'link' && (
                        <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.8rem', height: '0.8rem' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                        </svg>
                      )}
                      {scan.type === 'email' && (
                        <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.8rem', height: '0.8rem' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                      )}
                      {scan.type}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{scan.submittedAt}</span>
                </div>

                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text)', fontWeight: 700, lineHeight: '1.4' }}>{scan.summary}</h3>
                  <div style={{ marginTop: '0.55rem', padding: '0.65rem 0.85rem', background: 'var(--surface-strong)', border: '1px solid var(--border)', borderRadius: '10px', fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--muted)', wordBreak: 'break-word' }}>
                    &ldquo;{scan.originalContent}&rdquo;
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.2rem' }}>
                  <div style={{ flex: 1, height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${scan.riskScore}%`, height: '100%', background: scan.riskLevel === 'high' ? 'var(--danger)' : scan.riskLevel === 'medium' ? 'var(--warning)' : 'var(--success)' }} />
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 750, color: 'var(--text)', minWidth: '35px', textAlign: 'right' }}>
                    {scan.riskScore}%
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="history-empty animate-fade-in">
            <h3>No scan records found</h3>
            <p>Try refining your filters or perform a new scan on the Scanner page.</p>
            <Button as={Link} to="/scan" style={{ marginTop: '0.75rem' }}>Scan Now</Button>
          </div>
        )}
      </section>
    </PageContainer>
  )
}
