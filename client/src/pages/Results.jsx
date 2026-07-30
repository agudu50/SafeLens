import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import { getMockScanResult } from '../services/scannerService'

const toneMap = {
  low: 'low',
  medium: 'medium',
  high: 'high',
}

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

  return (
    <PageContainer>
      <section className="results-card">
        <div className="results-card__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <Badge tone={toneMap[result.riskLevel] || 'neutral'}>{result.riskLevel.toUpperCase()} RISK</Badge>
            <h1>{result.riskScore}% scam risk</h1>
            <p className="hero-text" style={{ margin: '0.4rem 0 0' }}>SafeLens analyzed this content and mapped potential danger indices.</p>
          </div>
          <div className="score-ring" style={{ background: result.riskLevel === 'high' ? '#fee2e2' : result.riskLevel === 'medium' ? '#fef3c7' : '#dcfce7' }}>
            <span style={{ color: result.riskLevel === 'high' ? 'var(--danger)' : result.riskLevel === 'medium' ? 'var(--warning)' : 'var(--success)', fontSize: '1.8rem' }}>
              {result.riskScore}%
            </span>
          </div>
        </div>

        <div className="results-grid">
          <article className="info-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '0.6rem' }}>Verdict Summary</h3>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>{result.summary}</p>
          </article>
          
          <article className="info-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '0.6rem' }}>Red Flags</h3>
            <ul className="bullet-list" style={{ paddingLeft: '1.2rem', margin: 0 }}>
              {result.redFlags.map((flag) => (
                <li key={flag} style={{ fontSize: '0.92rem', marginBottom: '0.3rem' }}>{flag}</li>
              ))}
            </ul>
          </article>

          <article className="info-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '0.6rem' }}>Technical Explanation</h3>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>{result.explanation}</p>
          </article>

          <article className="info-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '0.6rem' }}>Actionable Guidance</h3>
            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500 }}>{result.recommendation}</p>
          </article>
        </div>

        {/* Detailed Threat Breakdowns */}
        <div className="breakdown-section animate-fade-in">
          <h3 style={{ margin: '0 0 0.8rem', fontSize: '1.1rem' }}>Threat Assessment Breakdown</h3>
          <div className="breakdown-grid">
            <div className="breakdown-item">
              <div className="breakdown-label">Urgency & Coercion</div>
              <div className="breakdown-value" style={{ color: metrics.urgency === 'High' ? 'var(--danger)' : metrics.urgency === 'Medium' ? 'var(--warning)' : 'var(--success)' }}>
                {metrics.urgency}
              </div>
            </div>
            <div className="breakdown-item">
              <div className="breakdown-label">Financial Demands</div>
              <div className="breakdown-value" style={{ color: metrics.finance === 'High' ? 'var(--danger)' : metrics.finance === 'Medium' ? 'var(--warning)' : 'var(--success)' }}>
                {metrics.finance}
              </div>
            </div>
            <div className="breakdown-item">
              <div className="breakdown-label">Sender Authenticity</div>
              <div className="breakdown-value" style={{ color: metrics.sender === 'Unverified' ? 'var(--danger)' : metrics.sender === 'Suspicious' ? 'var(--warning)' : 'var(--success)' }}>
                {metrics.sender}
              </div>
            </div>
          </div>
        </div>

        {/* Matched Ghana Threat Vector & Category Likelihood Breakdown */}
        {result.vectorBreakdown && result.vectorBreakdown.length > 0 && (
          <div className="info-card animate-fade-in" style={{ marginTop: '1.5rem', border: '1px solid var(--border)', background: 'var(--surface-alt)', padding: '1.4rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.8rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text)', fontWeight: 900 }}>
                Matched Threat Vector Category
              </h3>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.12)', padding: '0.2rem 0.65rem', borderRadius: '999px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                {result.threatCategory || 'MoMo Transfer & Cashout Fraud'}
              </span>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--muted)', margin: '0 0 1rem 0', lineHeight: 1.45 }}>
              SafeLens AI mapped this scanned input against top threat vectors reported in Ghana:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {result.vectorBreakdown.map((vec) => (
                <div key={vec.name} style={{ background: 'var(--surface)', padding: '0.75rem 0.9rem', borderRadius: '12px', border: vec.match ? '1px solid var(--primary)' : '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', fontSize: '0.82rem', fontWeight: 700 }}>
                    <span style={{ color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {vec.match && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--danger)' }} />}
                      {vec.name}
                    </span>
                    <span style={{ color: vec.match ? 'var(--danger)' : 'var(--muted)', fontWeight: 800 }}>
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

        {/* WhatsApp & Family Share Builder */}
        <div className="info-card animate-fade-in" style={{ marginTop: '2rem', border: '1px solid var(--border)', background: 'var(--surface-alt)' }}>
          <h3 style={{ color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: 0, marginBottom: '0.5rem' }}>
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1.15rem', height: '1.15rem', display: 'inline-block' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
            Share with Family & Friends
          </h3>
          <p style={{ margin: '0 0 0.8rem 0', fontSize: '0.9rem', color: 'var(--muted)' }}>
            Scammers often target multiple contacts. Alert your friends on WhatsApp so they do not fall victim.
          </p>
          <div style={{ background: 'var(--surface)', padding: '0.8rem', borderRadius: '0.5rem', fontSize: '0.88rem', border: '1px solid var(--border)', fontFamily: 'monospace', whiteSpace: 'pre-wrap', color: 'var(--text)', marginBottom: '1rem' }}>
            {shareText}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <Button
              as="a"
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              style={{ background: '#25D366', borderColor: '#25D366' }}
            >
              Send on WhatsApp
            </Button>
            <Button variant="ghost" style={{ background: 'white' }} onClick={copyShareText}>
              {copiedAlert ? 'Copied alert text!' : 'Copy alert text'}
            </Button>
          </div>
        </div>

        <div className="actions-row" style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <Button onClick={() => navigate('/scan')}>Scan Another message</Button>
          <Button variant="secondary" onClick={() => setIsReportModalOpen(true)}>Report This Scam</Button>
          <Button variant="ghost" onClick={copyReport}>{copied ? 'Report Copied!' : 'Copy Full Report'}</Button>
        </div>

        <div className="info-card original-content-card animate-fade-in" style={{ marginTop: '2rem', background: '#f8fafc' }}>
          <h3 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--muted)' }}>Analyzed Content Source</h3>
          <p style={{ margin: 0, fontStyle: 'italic', color: '#334155' }}>&ldquo;{result.originalContent}&rdquo;</p>
        </div>
      </section>

      {/* Ghana scam reporting modal wizard */}
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
