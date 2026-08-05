import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import Badge from '../components/ui/Badge'
import { getMockScanResult } from '../services/scannerService'
import { anchorReport } from '../services/blockchainService'
import BlockchainVerification from '../features/results/BlockchainVerification'

export default function Results() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [copiedAlert, setCopiedAlert] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isSubmittedToBlacklist, setIsSubmittedToBlacklist] = useState(false)
  const [isAnchoring, setIsAnchoring] = useState(false)
  const [anchorError, setAnchorError] = useState('')
  const [verification, setVerification] = useState(null)

  const result = getMockScanResult(id)

  useEffect(() => {
    if (copied) {
      const t = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(t)
    }
  }, [copied])

  useEffect(() => {
    if (copiedAlert) {
      const t = setTimeout(() => setCopiedAlert(false), 2000)
      return () => clearTimeout(t)
    }
  }, [copiedAlert])

  if (!result) {
    return (
      <PageContainer>
        <div className="loading-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Spinner />
          <p style={{ marginTop: '1rem' }}>Loading threat security report…</p>
        </div>
      </PageContainer>
    )
  }

  const copyReport = async () => {
    await navigator.clipboard.writeText(
      `SAFE LENS SCAN REPORT\nRisk Level: ${result.riskLevel.toUpperCase()} (${result.riskScore}% Risk)\n\nSummary: ${result.summary}\n\nOriginal Text: "${result.originalContent}"`
    )
    setCopied(true)
  }

  const shareText = `SAFE LENS SECURITY ALERT: I checked this suspicious message on SafeLens and it has a ${result.riskScore}% scam risk:\n\n"${result.originalContent.length > 80 ? result.originalContent.slice(0, 80) + '...' : result.originalContent}"\n\nBe careful! Do not send money or click links. Check suspicious texts with SafeLens.`

  const copyShareText = async () => {
    await navigator.clipboard.writeText(shareText)
    setCopiedAlert(true)
  }

  const catalogScamContent = async () => {
    setIsAnchoring(true)
    setAnchorError('')
    try {
      const data = await anchorReport({
        id: result.id,
        content: result.originalContent,
        riskLevel: result.riskLevel,
        riskScore: result.riskScore,
      })
      setVerification(data)
      setIsSubmittedToBlacklist(true)
    } catch (err) {
      setAnchorError(err.message || 'Failed to anchor this report on Base L2. Please try again.')
    } finally {
      setIsAnchoring(false)
    }
  }

  const getSubMetrics = () => {
    if (result.riskLevel === 'high') {
      return { urgency: 'High', finance: 'High', sender: 'Unverified' }
    }
    if (result.riskLevel === 'medium') {
      return { urgency: 'Medium', finance: 'Medium', sender: 'Suspicious' }
    }
    return { urgency: 'Low', finance: 'Low', sender: 'Safe' }
  }

  const metrics = getSubMetrics()

  const isHigh = result.riskLevel === 'high'
  const isMedium = result.riskLevel === 'medium'
  const themeColor = isHigh ? 'var(--danger)' : isMedium ? 'var(--warning)' : 'var(--success)'
  const themeBg = isHigh ? 'rgba(239, 68, 68, 0.12)' : isMedium ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)'
  const themeBorder = isHigh ? 'rgba(239, 68, 68, 0.3)' : isMedium ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'

  // Generate Conic Gradient for Pie / Donut Chart
  const vectorList = result.vectorBreakdown || []
  const totalPercentage = vectorList.reduce((acc, v) => acc + v.percentage, 0) || 100
  let cumulative = 0
  const colorMap = ['#ef4444', '#f59e0b', '#38bdf8', '#10b981', '#a855f7']
  
  const conicStops = vectorList.map((vec, idx) => {
    const start = (cumulative / totalPercentage) * 100
    cumulative += vec.percentage
    const end = (cumulative / totalPercentage) * 100
    const color = vec.match ? '#ef4444' : colorMap[idx % colorMap.length]
    return `${color} ${start.toFixed(1)}% ${end.toFixed(1)}%`
  }).join(', ')

  const primaryVector = vectorList.find(v => v.match) || vectorList[0]

  return (
    <PageContainer>
      <div className="animate-fade-in" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
        
        {/* Step 1: Enhanced Modern Breadcrumb Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Link
              to="/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                color: 'var(--text)',
                textDecoration: 'none',
                fontWeight: 800,
                fontSize: '0.84rem',
                background: 'var(--surface-alt)',
                border: '1px solid var(--border)',
                padding: '0.4rem 0.9rem',
                borderRadius: '999px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Dashboard
            </Link>

            <span style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600 }}>/</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface)', padding: '0.35rem 0.8rem', borderRadius: '999px', border: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text)', fontWeight: 800, fontSize: '0.84rem' }}>Scan Audit Report</span>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--muted)' }} />
              <span style={{ fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 900, fontSize: '0.82rem' }}>
                #{result.id ? result.id.slice(0, 8).toUpperCase() : 'SCAN-P79'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <Button
              variant="secondary"
              onClick={() => setIsReportModalOpen(true)}
              style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem', fontWeight: 800 }}
            >
              Report Scam (CSA 292)
            </Button>
            <Button
              variant="ghost"
              onClick={copyReport}
              style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', padding: '0.45rem 0.95rem', fontSize: '0.82rem', fontWeight: 800 }}
            >
              {copied ? 'Copied!' : 'Copy Report'}
            </Button>
          </div>
        </div>

        {/* Step 2: Hero Threat Security Banner */}
        <div
          style={{
            padding: '1.8rem 2.2rem',
            background: 'var(--surface-alt)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.4rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <span
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 900,
                    color: themeColor,
                    background: themeBg,
                    border: `1px solid ${themeBorder}`,
                    padding: '0.22rem 0.75rem',
                    borderRadius: '999px',
                    letterSpacing: '0.04em'
                  }}
                >
                  {result.riskLevel.toUpperCase()} RISK DETECTED
                </span>
                <span style={{ fontSize: '0.76rem', color: 'var(--muted)', fontWeight: 700 }}>
                  SafeLens AI Threat Engine
                </span>
              </div>

              <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: '0 0 0.4rem 0', color: 'var(--text)', lineHeight: 1.1 }}>
                {result.riskScore}% Threat Risk Index
              </h1>
              <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--muted)', fontWeight: 500, maxWidth: '720px', lineHeight: 1.5 }}>
                {result.summary}
              </p>
            </div>

            {/* Threat Gauge */}
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: themeBg,
                border: `3px solid ${themeColor}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 24px ${themeBg}`,
                flexShrink: 0
              }}
            >
              <span style={{ color: themeColor, fontSize: '1.9rem', fontWeight: 900, lineHeight: 1 }}>
                {result.riskScore}%
              </span>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', marginTop: '3px' }}>
                Risk Score
              </span>
            </div>
          </div>

          {/* Integrated Risk Indicator Pills Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', paddingTop: '1.2rem', borderTop: '1px solid var(--border)' }}>
            <div style={{ background: 'var(--surface)', padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--muted)', fontWeight: 750 }}>Pressure Level</span>
              <strong style={{ fontSize: '0.9rem', fontWeight: 900, color: metrics.urgency === 'High' ? 'var(--danger)' : metrics.urgency === 'Medium' ? 'var(--warning)' : 'var(--success)' }}>
                {metrics.urgency}
              </strong>
            </div>

            <div style={{ background: 'var(--surface)', padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--muted)', fontWeight: 750 }}>Money Requested</span>
              <strong style={{ fontSize: '0.9rem', fontWeight: 900, color: metrics.finance === 'High' ? 'var(--danger)' : metrics.finance === 'Medium' ? 'var(--warning)' : 'var(--success)' }}>
                {metrics.finance}
              </strong>
            </div>

            <div style={{ background: 'var(--surface)', padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--muted)', fontWeight: 750 }}>Sender Check</span>
              <strong style={{ fontSize: '0.9rem', fontWeight: 900, color: metrics.sender === 'Unverified' ? 'var(--danger)' : metrics.sender === 'Suspicious' ? 'var(--warning)' : 'var(--success)' }}>
                {metrics.sender}
              </strong>
            </div>
          </div>
        </div>

        {/* Step 3: Analyzed Content Source Card */}
        <div
          style={{
            padding: '1.3rem 1.6rem',
            background: 'var(--surface-alt)',
            border: '1px solid var(--border)',
            borderRadius: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Analyzed Message Source
              </span>
              <Badge tone="medium" size="sm">
                {result.type ? result.type.toUpperCase() : 'SMS / TEXT'}
              </Badge>
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 700 }}>
              {result.originalContent ? result.originalContent.length : 0} characters
            </span>
          </div>

          <div
            style={{
              padding: '1rem 1.2rem',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              fontFamily: 'monospace',
              fontSize: '0.88rem',
              color: 'var(--text)',
              lineHeight: 1.5,
              wordBreak: 'break-word'
            }}
          >
            &ldquo;{result.originalContent}&rdquo;
          </div>
        </div>

        {/* Step 4: Top 3 Security Analysis Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.4rem' }}>
          
          {/* Card 1: Safety Check Verdict */}
          <div style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '20px', padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 850, color: 'var(--text)' }}>
                  Safety Check Verdict
                </h3>
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary)', background: 'rgba(56, 189, 248, 0.1)', padding: '0.15rem 0.5rem', borderRadius: '999px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                AI Verdict
              </span>
            </div>

            <p style={{ margin: '0 0 1rem 0', fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.55, fontWeight: 500, flex: 1 }}>
              {result.summary}
            </p>

            <div style={{ paddingTop: '0.8rem', borderTop: '1px solid var(--border)', fontSize: '0.76rem', color: 'var(--text)', fontWeight: 750, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Pattern Confidence:</span>
              <span style={{ color: themeColor, fontWeight: 900 }}>94% Match</span>
            </div>
          </div>

          {/* Card 2: Identified Warning Signs */}
          <div style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '20px', padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--danger)', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 850, color: 'var(--text)' }}>
                  Warning Signs &amp; Risk Flags
                </h3>
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', padding: '0.15rem 0.5rem', borderRadius: '999px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                {result.redFlags.length} Triggered Flags
              </span>
            </div>

            <ul style={{ paddingLeft: '1.2rem', margin: '0 0 1rem 0', fontSize: '0.86rem', color: 'var(--muted)', lineHeight: 1.5, flex: 1 }}>
              {result.redFlags.map((flag) => (
                <li key={flag} style={{ marginBottom: '0.35rem', fontWeight: 500 }}>{flag}</li>
              ))}
            </ul>

            <div style={{ paddingTop: '0.8rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.12)', padding: '0.15rem 0.45rem', borderRadius: '6px', fontWeight: 800 }}>
                Urgency Lure
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--warning)', background: 'rgba(245, 158, 11, 0.12)', padding: '0.15rem 0.45rem', borderRadius: '6px', fontWeight: 800 }}>
                MoMo / Financial Request
              </span>
            </div>
          </div>

          {/* Card 3: Fraud Mechanism */}
          <div style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '20px', padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--warning)', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" strokeLinecap="round" />
                    <circle cx="12" cy="8" r="1" fill="currentColor" />
                  </svg>
                </div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 850, color: 'var(--text)' }}>
                  Fraud Mechanism &amp; Strategy
                </h3>
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--warning)', background: 'rgba(245, 158, 11, 0.1)', padding: '0.15rem 0.5rem', borderRadius: '999px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                Tactic Breakdown
              </span>
            </div>

            <p style={{ margin: '0 0 1rem 0', fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.55, fontWeight: 500, flex: 1 }}>
              {result.explanation}
            </p>

            <div style={{ paddingTop: '0.8rem', borderTop: '1px solid var(--border)', fontSize: '0.76rem', color: 'var(--muted)', fontWeight: 700 }}>
              Ghana Mobile Money (MoMo) Vector Pattern
            </div>
          </div>

        </div>

        {/* Step 5: Scam Category Likelihood (INTERACTIVE PIE / DONUT CHART VISUALIZATION) */}
        {vectorList.length > 0 && (
          <div style={{ padding: '1.8rem 2.2rem', background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '24px', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.2rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text)', fontWeight: 900 }}>
                  Scam Category Likelihood
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 650 }}>
                  SafeLens AI matched your message against common scam types in Ghana:
                </span>
              </div>
              <span style={{ fontSize: '0.74rem', fontWeight: 850, color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.12)', padding: '0.22rem 0.75rem', borderRadius: '999px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                Primary Match: {result.threatCategory || 'Mobile Money Scam'}
              </span>
            </div>

            {/* Split Donut Chart & Legend Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
              
              {/* Left Side: SVG / Conic Donut Pie Chart */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem 0' }}>
                <div
                  style={{
                    width: '190px',
                    height: '190px',
                    borderRadius: '50%',
                    background: `conic-gradient(${conicStops})`,
                    display: 'grid',
                    placeItems: 'center',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                    position: 'relative'
                  }}
                >
                  {/* Center Donut Hole */}
                  <div
                    style={{
                      width: '124px',
                      height: '124px',
                      borderRadius: '50%',
                      background: 'var(--surface-alt)',
                      border: '2px solid var(--border)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      padding: '0.5rem'
                    }}
                  >
                    <span style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--danger)', lineHeight: 1 }}>
                      {primaryVector ? primaryVector.percentage : 92}%
                    </span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', marginTop: '3px' }}>
                      Primary Match
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: Detailed Pie Slice Breakdown Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {vectorList.map((vec, idx) => {
                  const sliceColor = vec.match ? '#ef4444' : colorMap[idx % colorMap.length]
                  return (
                    <div
                      key={vec.name}
                      style={{
                        background: 'var(--surface)',
                        padding: '0.85rem 1.1rem',
                        borderRadius: '14px',
                        border: vec.match ? '1px solid var(--danger)' : '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'space-between',
                        gap: '0.8rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: sliceColor,
                            flexShrink: 0,
                            boxShadow: `0 0 8px ${sliceColor}40`
                          }}
                        />
                        <span style={{ fontSize: '0.86rem', color: 'var(--text)', fontWeight: 800 }}>
                          {vec.name}
                        </span>
                      </div>

                      <span
                        style={{
                          fontSize: '0.84rem',
                          fontWeight: 900,
                          color: vec.match ? 'var(--danger)' : 'var(--text)',
                          background: vec.match ? 'rgba(239, 68, 68, 0.12)' : 'var(--surface-alt)',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '8px',
                          border: vec.match ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid var(--border)'
                        }}
                      >
                        {vec.percentage}% {vec.match ? '(Primary Match)' : ''}
                      </span>
                    </div>
                  )
                })}
              </div>

            </div>
          </div>
        )}

        {/* Step 6: FULL-WIDTH HIGHLIGHT CARD — Recommended Action Steps & Protection Guide */}
        <div
          style={{
            padding: '1.8rem 2.2rem',
            background: 'var(--surface-alt)',
            border: '2px solid var(--success)',
            borderRadius: '24px',
            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.08)',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'grid', placeItems: 'center', color: 'var(--success)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" />
                </svg>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: 'var(--text)' }}>
                  Recommended Action Steps &amp; Emergency Protection Guide
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 650 }}>
                  Immediate safety instructions and telco safeguards
                </span>
              </div>
            </div>
            <span style={{ fontSize: '0.74rem', fontWeight: 850, color: 'var(--success)', background: 'rgba(16, 185, 129, 0.15)', padding: '0.25rem 0.75rem', borderRadius: '999px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              Protection Guide Active
            </span>
          </div>

          {/* 3 Structured Columns Inside Full-Width Recommendation Banner */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem', marginBottom: '1.4rem' }}>
            
            {/* 1. Immediate Directives */}
            <div style={{ background: 'var(--surface)', padding: '1.2rem 1.4rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <strong style={{ fontSize: '0.86rem', color: 'var(--success)', textTransform: 'uppercase', display: 'block', marginBottom: '0.45rem', fontWeight: 900 }}>
                1. Immediate Directives
              </strong>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.55, fontWeight: 700 }}>
                Do not send money, code approvals, or passwords. Block the sender and contact your service provider directly.
              </p>
            </div>

            {/* 2. Sender Identity & Header Check */}
            <div style={{ background: 'var(--surface)', padding: '1.2rem 1.4rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <strong style={{ fontSize: '0.86rem', color: '#a855f7', textTransform: 'uppercase', display: 'block', marginBottom: '0.45rem', fontWeight: 900 }}>
                2. Sender Identity &amp; Header Check
              </strong>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.55, fontWeight: 500 }}>
                Sender identity unverified: Uses spoofed header or untrusted contact format.
              </p>
            </div>

            {/* 3. Victim Impact & Wallet Safeguard */}
            <div style={{ background: 'var(--surface)', padding: '1.2rem 1.4rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <strong style={{ fontSize: '0.86rem', color: 'var(--danger)', textTransform: 'uppercase', display: 'block', marginBottom: '0.45rem', fontWeight: 900 }}>
                3. Victim Impact &amp; Wallet Safeguard
              </strong>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.55, fontWeight: 500 }}>
                If you already shared your PIN or approved a MoMo cashout, dial *170# immediately to change your PIN or contact your operator to freeze transactions.
              </p>
            </div>

          </div>

          {/* Emergency Hotlines Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', paddingTop: '1.1rem', borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 800 }}>Quick Emergency Hotlines:</span>
            <a
              href="tel:1917"
              style={{
                fontSize: '0.8rem',
                fontWeight: 850,
                color: 'var(--warning)',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '8px',
                padding: '0.35rem 0.8rem',
                textDecoration: 'none'
              }}
            >
              MTN Fraud Helpline (1917)
            </a>
            <a
              href="tel:292"
              style={{
                fontSize: '0.8rem',
                fontWeight: 850,
                color: 'var(--primary)',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '8px',
                padding: '0.35rem 0.8rem',
                textDecoration: 'none'
              }}
            >
              CSA Cyber Hotline (292)
            </a>
            <a
              href="tel:*170#"
              style={{
                fontSize: '0.8rem',
                fontWeight: 850,
                color: 'var(--danger)',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '0.35rem 0.8rem',
                textDecoration: 'none'
              }}
            >
              Dial *170# (Reset PIN)
            </a>
          </div>
        </div>

        {/* Step 7: WhatsApp Alert & Share Card (FULL WIDTH) */}
        <div style={{ padding: '1.8rem 2.2rem', background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '24px', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ color: '#25D366' }}>
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: 'var(--text)' }}>
              Share with Family &amp; Friends
            </h3>
          </div>
          <p style={{ margin: '0 0 0.8rem 0', fontSize: '0.86rem', color: 'var(--muted)' }}>
            Scammers often target multiple contacts in Ghana. Alert your friends on WhatsApp so they stay protected.
          </p>

          <div style={{ background: 'var(--surface)', padding: '1rem 1.2rem', borderRadius: '14px', fontSize: '0.86rem', border: '1px solid var(--border)', fontFamily: 'monospace', whiteSpace: 'pre-wrap', color: 'var(--text)', marginBottom: '1.1rem', lineHeight: 1.5 }}>
            {shareText}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                background: '#25D366',
                color: '#ffffff',
                fontWeight: 850,
                fontSize: '0.86rem',
                padding: '0.65rem 1.3rem',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.25)'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.301-.15-1.785-.881-2.062-.982-.276-.101-.477-.15-.678.15-.2.301-.777.982-.953 1.183-.175.201-.351.226-.652.075-1.832-.917-3.037-1.633-4.242-3.702-.321-.552.322-.513.921-1.712.1-.201.05-.376-.025-.526-.075-.15-.678-1.631-.93-2.238-.244-.588-.493-.508-.678-.517-.175-.008-.376-.01-.576-.01-.201 0-.527.075-.803.376-.276.301-1.054 1.03-1.054 2.513 0 1.483 1.079 2.912 1.229 3.113.15.201 2.124 3.243 5.144 4.551 2.551 1.106 3.072.885 3.624.835.552-.05 1.784-.728 2.035-1.432.251-.703.251-1.306.176-1.432-.075-.126-.276-.201-.577-.352z"/>
              </svg>
              Send on WhatsApp
            </a>

            <button
              onClick={copyShareText}
              style={{
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text)',
                fontSize: '0.86rem',
                fontWeight: 800,
                padding: '0.65rem 1.2rem',
                borderRadius: '12px',
                cursor: 'pointer'
              }}
            >
              {copiedAlert ? 'Copied alert text!' : 'Copy Alert Text'}
            </button>
          </div>
        </div>

        {/* Base L2 Blockchain Verification Certificate */}
        {verification && <BlockchainVerification verificationDetails={verification} />}

      </div>

      {/* Ghana Scam Reporting Modal Wizard */}
      {isReportModalOpen && (
        <div className="modal-overlay" onClick={() => setIsReportModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Report Scam (Ghana Protocol)</h2>
              <button className="modal-close" onClick={() => setIsReportModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--muted)' }}>
                Reporting scam contacts helps telecom providers and local cyber police block numbers and warn other citizens.
              </p>

              <div className="modal-action-box">
                <strong style={{ color: 'var(--primary)' }}>1. MTN MoMo Scam Reporting (Free)</strong>
                <p>Forward the scam message or the caller number to <strong>1917</strong> via SMS. Alternatively, dial <strong>*170#</strong>, select option 6 (My Wallet), option 5 (Report Fraud), and submit details.</p>
              </div>

              <div className="modal-action-box">
                <strong style={{ color: '#1d4ed8' }}>2. National Cyber Security Authority (CSA)</strong>
                <p>Call the national cybersecurity hotline at <strong>292</strong>, or send screenshots directly via WhatsApp to <strong>0501147477</strong>.</p>
              </div>

              <div className="modal-action-box">
                <strong style={{ color: 'var(--success)' }}>3. Submit to SafeLens Registry</strong>
                {isSubmittedToBlacklist ? (
                  <p style={{ color: 'var(--success)', fontWeight: 'bold', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <svg fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem', display: 'inline-block' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Thank you! This scam has been cataloged in the local database.
                  </p>
                ) : (
                  <div>
                    <p style={{ marginBottom: '0.6rem' }}>Flag this phone number / link in SafeLens system so other users in Ghana get warning matches. This anchors a tamper-proof hash of this report on the Base L2 blockchain.</p>
                    <Button
                      variant="primary"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                      onClick={catalogScamContent}
                      disabled={isAnchoring}
                    >
                      {isAnchoring ? 'Anchoring on Base L2…' : 'Catalog Scam Content'}
                    </Button>
                    {anchorError && (
                      <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.5rem' }}>{anchorError}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="ghost" onClick={() => setIsReportModalOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  )
}
