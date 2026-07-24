import { useState } from 'react'
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
  const result = getMockScanResult(id)

  const copyReport = async () => {
    if (!result) return
    await navigator.clipboard.writeText(`${result.summary}\n\nRisk: ${result.riskLevel.toUpperCase()}\n${result.recommendation}`)
    setCopied(true)
  }

  if (!result) {
    return (
      <PageContainer>
        <div className="loading-card">
          <Spinner />
          <p>Loading your report…</p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <section className="results-card">
        <div className="results-card__header">
          <div>
            <Badge tone={toneMap[result.riskLevel] || 'neutral'}>{result.riskLevel.toUpperCase()} RISK</Badge>
            <h1>{result.riskScore}% scam risk</h1>
            <p className="hero-text">SafeLens highlights the warning signs and explains what they mean in everyday language.</p>
          </div>
          <div className="score-ring">
            <span>{result.riskScore}</span>
          </div>
        </div>

        <div className="results-grid">
          <article className="info-card">
            <h3>Summary</h3>
            <p>{result.summary}</p>
          </article>
          <article className="info-card">
            <h3>Red flags</h3>
            <ul className="bullet-list">
              {result.redFlags.map((flag) => (
                <li key={flag}>{flag}</li>
              ))}
            </ul>
          </article>
          <article className="info-card">
            <h3>Why we think this</h3>
            <p>{result.explanation}</p>
          </article>
          <article className="info-card">
            <h3>What you should do</h3>
            <p>{result.recommendation}</p>
          </article>
        </div>

        <div className="actions-row">
          <Button onClick={() => navigate('/scan')}>Scan Another Message</Button>
          <Button variant="secondary" onClick={() => setCopied(true)}>Report This Scam</Button>
          <Button variant="ghost" onClick={copyReport}>{copied ? 'Copied' : 'Copy Report'}</Button>
        </div>

        <div className="info-card original-content-card">
          <h3>Original content</h3>
          <p>{result.originalContent}</p>
        </div>
      </section>
    </PageContainer>
  )
}
