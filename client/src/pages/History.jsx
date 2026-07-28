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
        <div className="stats-grid animate-fade-in">
          <div className="stat-card">
            <h4>Total Scans Done</h4>
            <div className="stat-number">{stats.total}</div>
          </div>
          <div className="stat-card stat-card--accent">
            <h4>Scams Avoided</h4>
            <div className="stat-number" style={{ color: 'var(--danger)' }}>{stats.avoided}</div>
          </div>
          <div className="stat-card">
            <h4>Average Risk Score</h4>
            <div className="stat-number">{stats.avgScore}%</div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="history-toolbar animate-fade-in">
          <div className="history-search-wrap">
            <input
              type="text"
              placeholder="Search content or summaries..."
              className="history-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
          <div className="history-list">
            {filteredScans.map((scan) => (
              <Link to={`/results/${scan.id}`} key={scan.id} className="history-item animate-fade-in" style={{ textDecoration: 'none' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                    <Badge tone={toneMap[scan.riskLevel] || 'neutral'}>{scan.riskLevel.toUpperCase()} RISK</Badge>
                    <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 650, color: 'var(--muted)' }}>
                      {scan.type}
                    </span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text)' }}>{scan.summary}</h3>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.88rem', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '450px' }}>
                    &ldquo;{scan.originalContent}&rdquo;
                  </p>
                </div>
                <div className="history-item__meta" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>{scan.submittedAt}</span>
                  <strong style={{ fontSize: '1.25rem', color: scan.riskLevel === 'high' ? 'var(--danger)' : scan.riskLevel === 'medium' ? 'var(--warning)' : 'var(--success)' }}>
                    {scan.riskScore}%
                  </strong>
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
