import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import { createMockScanResult } from '../services/scannerService'

const options = ['Message', 'Screenshot', 'Link', 'Email']

export default function Scanner() {
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = useState('Message')
  const [message, setMessage] = useState('')
  const [fileName, setFileName] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')

  const characterCount = useMemo(() => message.length, [message])

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file such as PNG or JPG.')
      return
    }
    setError('')
    setFileName(file.name)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleAnalyze = () => {
    if (selectedType === 'Message' && message.trim().length < 10) {
      setError('Please enter a message with at least 10 characters.')
      return
    }

    if (selectedType === 'Screenshot' && !previewUrl) {
      setError('Please upload a screenshot before analyzing.')
      return
    }

    setError('')
    setIsAnalyzing(true)

    window.setTimeout(() => {
      const riskLevel = message.toLowerCase().includes('payment') || message.toLowerCase().includes('urgent') ? 'high' : 'medium'
      const result = createMockScanResult({
        type: selectedType.toLowerCase(),
        input: selectedType === 'Message' ? message : fileName,
        riskLevel,
      })
      setIsAnalyzing(false)
      navigate(`/results/${result.id}`)
    }, 1600)
  }

  return (
    <PageContainer>
      <section className="scanner-card">
        <div className="section-heading">
          <h1>Check a suspicious message</h1>
          <p>Share a message or screenshot and SafeLens will walk you through a clear risk review.</p>
        </div>

        <div className="chip-row" role="tablist" aria-label="Content types">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={`chip ${selectedType === option ? 'chip--active' : ''}`}
              onClick={() => setSelectedType(option)}
            >
              {option}
            </button>
          ))}
        </div>

        {error ? <Alert title="Please review" tone="danger">{error}</Alert> : null}

        {selectedType === 'Message' ? (
          <div className="scanner-panel">
            <label className="sr-only" htmlFor="message-input">Suspicious message</label>
            <textarea
              id="message-input"
              className="scanner-textarea"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Paste the suspicious message here..."
            />
            <div className="scanner-toolbar">
              <span>{characterCount} / 5000 characters</span>
              <Button type="button" variant="ghost" onClick={() => setMessage('')}>
                Clear
              </Button>
            </div>
          </div>
        ) : null}

        {selectedType === 'Screenshot' ? (
          <div className="scanner-panel">
            <label className="upload-box">
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <div>
                <strong>Upload a screenshot</strong>
                <p>PNG, JPG, or WEBP up to 5MB.</p>
              </div>
            </label>
            {previewUrl ? (
              <div className="preview-card">
                <img src={previewUrl} alt="Uploaded preview" />
                <div className="preview-meta">
                  <span>{fileName}</span>
                  <Button type="button" variant="ghost" onClick={() => { setFileName(''); setPreviewUrl(''); }}>
                    Remove
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {selectedType !== 'Message' && selectedType !== 'Screenshot' ? (
          <div className="scanner-panel scanner-panel--coming-soon">
            <h3>{selectedType} scanning</h3>
            <p>This option is coming soon. SafeLens will support it in a future release.</p>
          </div>
        ) : null}

        <div className="scanner-actions">
          <Button type="button" onClick={handleAnalyze} disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyzing…' : 'Analyze with SafeLens'}
          </Button>
        </div>

        {isAnalyzing ? (
          <div className="loading-card" aria-live="polite">
            <div className="loading-card__header">
              <h3>SafeLens is taking a closer look…</h3>
              <p>Reading submitted content • Checking suspicious patterns • Preparing your safety report</p>
            </div>
            <div className="loading-steps">
              <span className="step completed">✓ Reading submitted content</span>
              <span className="step completed">✓ Checking suspicious patterns</span>
              <span className="step active">● Analyzing potential red flags</span>
              <span className="step">○ Preparing your safety report</span>
            </div>
          </div>
        ) : null}
      </section>
    </PageContainer>
  )
}
