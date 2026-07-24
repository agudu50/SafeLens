import { Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Badge from '../components/ui/Badge'
import { getScanHistory } from '../services/scannerService'

const toneMap = {
  low: 'low',
  medium: 'medium',
  high: 'high',
}

export default function History() {
  const scans = getScanHistory()

  return (
    <PageContainer>
      <section className="scanner-card">
        <div className="section-heading">
          <h1>Recent scan history</h1>
          <p>Review previous safety checks and keep track of your assessments.</p>
        </div>
        <div className="history-list">
          {scans.map((scan) => (
            <Link to={`/results/${scan.id}`} key={scan.id} className="history-item">
              <div>
                <Badge tone={toneMap[scan.riskLevel] || 'neutral'}>{scan.riskLevel.toUpperCase()} RISK</Badge>
                <h3>{scan.summary}</h3>
              </div>
              <div className="history-item__meta">
                <span>{scan.submittedAt}</span>
                <strong>{scan.riskScore}%</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageContainer>
  )
}
