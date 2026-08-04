import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import { getMockScanResult } from '../services/scannerService'

export default function Results() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [copiedAlert, setCopiedAlert] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isSubmittedToBlacklist, setIsSubmittedToBlacklist] = useState(false)
  
  const result = getMockScanResult(id)

  // Reset copied indicators after 2 seconds
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
          <p style={{ marginTop: '1rem' }}>Loading your safety report…</p>
        </div>
      </PageContainer>
    )
  }

  const copyReport = async () => {
    await navigator.clipboard.writeText(
      `[SafeLens Scan Report]\nRisk Level: ${result.riskLevel.toUpperCase()} (${result.riskScore}% Risk)\n\nSummary: ${result.summary}\n\nOriginal Text: "${result.originalContent}"`
    )
    setCopied(true)
  }

  // Pre-compiled share text optimized for Ghanaian users sharing on WhatsApp
  const shareText = `[Scam Alert] I checked this suspicious message on SafeLens and it has a ${result.riskScore}% scam risk:\n\n"${result.originalContent.length > 80 ? result.originalContent.slice(0, 80) + '...' : result.originalContent}"\n\nBe careful! Do not send money or click links. Check suspicious texts with SafeLens.`

  const copyShareText = async () => {
    await navigator.clipboard.writeText(shareText)
    setCopiedAlert(true)
  }

  // Determine individual metric indicators based on overall risk
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
  const themeBg = isHigh ? 'rgba(239, 68, 68, 0.1)' : isMedium ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)'
  const themeBorder = isHigh ? 'rgba(239, 68, 68, 0.25)' : isMedium ? 'rgba(245, 158, 11, 0.25)' : 'rgba(16, 185, 129, 0.25)'

  return (
    <PageContainer>
      <section className="results-card" style={{ width: '100%' }}>
        
        {/* Hero Score & Header */}
        <div 
          className="scanner-card animate-fade-in"
          style={{
            padding: '1.8rem',
            background: 'var(--surface-alt)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            marginBottom: '1.6rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.4rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  color: themeColor,
                  background: themeBg,
                  border: `1px solid ${themeBorder}`,
                  padding: '0.2rem 0.65rem',
                  borderRadius: '999px',
                  letterSpacing: '0.04em'
                }}>
                  {result.riskLevel.toUpperCase()} RISK
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 650 }}>
                  SafeLens AI Threat Engine
                </span>
              </div>

              <h1 style={{ fontSize: '2.4rem', fontWeight: 900, margin: '0 0 0.3rem 0', color: 'var(--text)', lineHeight: 1.1 }}>
                {result.riskScore}% Scam Risk
              </h1>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 500 }}>
                SafeLens evaluated risk signals, urgency hooks, and vector patterns.
              </p>
            </div>

            {/* Score Ring */}
            <div style={{
              width: '94px',
              height: '94px',
              borderRadius: '50%',
              background: themeBg,
              border: `3px solid ${themeColor}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 24px ${themeBg}`,
              flexShrink: 0
            }}>
              <span style={{ color: themeColor, fontSize: '1.85rem', fontWeight: 900, lineHeight: 1 }}>
                {result.riskScore}%
              </span>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', marginTop: '2px' }}>
                Threat Index
              </span>
            </div>
          </div>
        </div>

        {/* 4 Core Analysis Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', marginBottom: '1.6rem' }}>
          
          {/* Card 1: Safety Check Result */}
          <div className="dash-stat-card" style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '18px', padding: '1.3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--primary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 850, color: 'var(--text)' }}>
                Safety Check Result
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.5, fontWeight: 500 }}>
              {result.summary}
            </p>
          </div>

          {/* Card 2: Warning Signs */}
          <div className="dash-stat-card" style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '18px', padding: '1.3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--danger)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 850, color: 'var(--text)' }}>
                Warning Signs
              </h3>
            </div>
            <ul style={{ paddingLeft: '1rem', margin: 0, fontSize: '0.83rem', color: 'var(--muted)', lineHeight: 1.45 }}>
              {result.redFlags.map((flag) => (
                <li key={flag} style={{ marginBottom: '0.3rem', fontWeight: 500 }}>{flag}</li>
              ))}
            </ul>
          </div>

          {/* Card 3: Why This Is a Scam */}
          <div className="dash-stat-card" style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '18px', padding: '1.3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--warning)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" strokeLinecap="round" />
                  <circle cx="12" cy="8" r="1" fill="currentColor" />
                </svg>
              </div>
              <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 850, color: 'var(--text)' }}>
                Why This Is a Scam
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.5, fontWeight: 500 }}>
              {result.explanation}
            </p>
          </div>

          {/* Card 4: What You Should Do */}
          <div className="dash-stat-card" style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '18px', padding: '1.3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--success)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" />
                </svg>
              </div>
              <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 850, color: 'var(--text)' }}>
                What You Should Do
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.5, fontWeight: 700 }}>
              {result.recommendation}
            </p>
          </div>

        </div>

        {/* Risk Indicator Breakdown */}
        <div style={{ padding: '1.4rem', background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '20px', marginBottom: '1.6rem' }}>
          <h3 style={{ margin: '0 0 0.9rem 0', fontSize: '1.05rem', fontWeight: 850, color: 'var(--text)' }}>
            Risk Indicator Breakdown
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.9rem' }}>
            
            <div style={{ background: 'var(--surface)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>
                Pressure Level
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color: metrics.urgency === 'High' ? 'var(--danger)' : metrics.urgency === 'Medium' ? 'var(--warning)' : 'var(--success)' }}>
                {metrics.urgency}
              </span>
            </div>

            <div style={{ background: 'var(--surface)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>
                Money Requested
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color: metrics.finance === 'High' ? 'var(--danger)' : metrics.finance === 'Medium' ? 'var(--warning)' : 'var(--success)' }}>
                {metrics.finance}
              </span>
            </div>

            <div style={{ background: 'var(--surface)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>
                Sender Check
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color: metrics.sender === 'Unverified' ? 'var(--danger)' : metrics.sender === 'Suspicious' ? 'var(--warning)' : 'var(--success)' }}>
                {metrics.sender}
              </span>
            </div>

          </div>
        </div>

        {/* Scam Category Likelihood */}
        {result.vectorBreakdown && result.vectorBreakdown.length > 0 && (
          <div style={{ padding: '1.5rem', background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '20px', marginBottom: '1.6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text)', fontWeight: 900 }}>
                Scam Category Likelihood
              </h3>
              <span style={{ fontSize: '0.74rem', fontWeight: 850, color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.12)', padding: '0.2rem 0.65rem', borderRadius: '999px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                {result.threatCategory || 'Mobile Money Scam'}
              </span>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: '0 0 1rem 0', lineHeight: 1.45 }}>
              SafeLens AI matched your message against common scam types in Ghana:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {result.vectorBreakdown.map((vec) => (
                <div key={vec.name} style={{ background: 'var(--surface)', padding: '0.75rem 0.9rem', borderRadius: '12px', border: vec.match ? '1px solid var(--primary)' : '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', fontSize: '0.82rem', fontWeight: 750 }}>
                    <span style={{ color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {vec.match && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--danger)' }} />}
                      {vec.name}
                    </span>
                    <span style={{ color: vec.match ? 'var(--danger)' : 'var(--muted)', fontWeight: 850 }}>
                      {vec.percentage}% Likelihood {vec.match ? '(Primary Match)' : ''}
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '7px', background: 'var(--surface-alt)', borderRadius: '999px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <div style={{ width: `${vec.percentage}%`, height: '100%', background: vec.match ? 'var(--danger)' : vec.color || 'var(--primary)', borderRadius: '999px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WhatsApp & Community Protection Alert Builder */}
        <div style={{ padding: '1.5rem', background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '20px', marginBottom: '1.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ color: '#25D366' }}>
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: 'var(--text)' }}>
              Share with Family &amp; Friends
            </h3>
          </div>
          <p style={{ margin: '0 0 0.8rem 0', fontSize: '0.84rem', color: 'var(--muted)' }}>
            Scammers often target multiple contacts in Ghana. Alert your friends on WhatsApp so they stay protected.
          </p>

          <div style={{ background: 'var(--surface)', padding: '0.85rem 1rem', borderRadius: '12px', fontSize: '0.84rem', border: '1px solid var(--border)', fontFamily: 'monospace', whiteSpace: 'pre-wrap', color: 'var(--text)', marginBottom: '1rem', lineHeight: 1.45 }}>
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
                fontSize: '0.84rem',
                padding: '0.6rem 1.2rem',
                borderRadius: '10px',
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
                fontSize: '0.84rem',
                fontWeight: 800,
                padding: '0.6rem 1.1rem',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
            >
              {copiedAlert ? 'Copied alert text!' : 'Copy Alert Text'}
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '1.6rem' }}>
          <Button onClick={() => navigate('/scan')} style={{ padding: '0.65rem 1.3rem', fontSize: '0.88rem' }}>
            Scan Another Message
          </Button>
          <Button variant="secondary" onClick={() => setIsReportModalOpen(true)} style={{ padding: '0.65rem 1.3rem', fontSize: '0.88rem' }}>
            Report This Scam (CSA 292)
          </Button>
          <Button variant="ghost" onClick={copyReport} style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.65rem 1.1rem', fontSize: '0.88rem' }}>
            {copied ? 'Report Copied!' : 'Copy Full Report'}
          </Button>
        </div>

        {/* Analyzed Source Box */}
        <div style={{ padding: '1.2rem 1.4rem', background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '16px' }}>
          <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '0.82rem', color: 'var(--muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Analyzed Content Source
          </h4>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text)', fontWeight: 650, fontStyle: 'italic', wordBreak: 'break-word', lineHeight: 1.45 }}>
            &ldquo;{result.originalContent}&rdquo;
          </p>
        </div>

      </section>

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
                    <p style={{ marginBottom: '0.6rem' }}>Flag this phone number / link in SafeLens system so other users in Ghana get warning matches.</p>
                    <Button variant="primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => setIsSubmittedToBlacklist(true)}>
                      Catalog Scam Content
                    </Button>
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
