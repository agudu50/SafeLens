import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import { createMockScanResult } from '../services/scannerService'

const options = ['Message', 'Screenshot', 'Link', 'Email']

const loadingMessages = {
  message: [
    { title: 'Reading submitted content', detail: 'Parsing text and characters...' },
    { title: 'Evaluating message urgency', detail: 'Looking for coercion patterns...' },
    { title: 'Checking financial request hooks', detail: 'Reviewing MoMo transfer directions...' },
    { title: 'Structuring safety suggestions', detail: 'Creating custom recommendations...' },
  ],
  screenshot: [
    { title: 'Uploading image file', detail: 'Analyzing dimensions and format...' },
    { title: 'Running text extraction (OCR)', detail: 'Transcribing image content into text...' },
    { title: 'Checking transcribed text signatures', detail: 'Running analysis on scam phrases...' },
    { title: 'Finalizing safety recommendations', detail: 'Assembling risk breakdown report...' },
  ],
  link: [
    { title: 'Parsing link URL structure', detail: 'Deconstructing protocols and subdomains...' },
    { title: 'Checking SSL/TLS safety status', detail: 'Verifying HTTPS certificate flags...' },
    { title: 'Evaluating domain extension reputation', detail: 'Matching against known blacklisted extensions...' },
    { title: 'Computing threat indices', detail: 'Calculating security rating score...' },
  ],
  email: [
    { title: 'Reading email body & metadata', detail: 'Importing header and sender domains...' },
    { title: 'Analyzing domain spoofing indicators', detail: 'Checking sender credibility indices...' },
    { title: 'Scanning for credentials solicitation', detail: 'Reviewing passcode and verification hooks...' },
    { title: 'Drafting safety recommendations', detail: 'Formulating step-by-step defense plan...' },
  ],
}

export default function Scanner() {
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = useState('Message')
  
  // Input states
  const [message, setMessage] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [emailSender, setEmailSender] = useState('')
  const [emailContent, setEmailContent] = useState('')
  
  // Screenshot states
  const [fileName, setFileName] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  // Scanning states
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [activeStep, setActiveStep] = useState(0)

  const characterCount = useMemo(() => message.length, [message])

  // Stepper simulation
  useEffect(() => {
    if (!isAnalyzing) return
    const timer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= 3) {
          clearInterval(timer)
          return 3
        }
        return prev + 1
      })
    }, 500)
    return () => clearInterval(timer)
  }, [isAnalyzing])

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    processFile(file)
  }

  const processFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file such as PNG, JPG, or WEBP.')
      return
    }
    setError('')
    setFileName(file.name)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    processFile(file)
  }

  const handleAnalyze = () => {
    let inputPayload = ''
    
    if (selectedType === 'Message') {
      if (message.trim().length < 10) {
        setError('Please enter a message with at least 10 characters.')
        return
      }
      inputPayload = message
    } else if (selectedType === 'Screenshot') {
      if (!previewUrl) {
        setError('Please upload a screenshot before analyzing.')
        return
      }
      inputPayload = `Screenshot: ${fileName}`
    } else if (selectedType === 'Link') {
      if (linkUrl.trim().length < 5) {
        setError('Please enter a valid link (e.g. http://example.com).')
        return
      }
      inputPayload = linkUrl
    } else if (selectedType === 'Email') {
      if (emailContent.trim().length < 15) {
        setError('Please enter at least 15 characters of email content.')
        return
      }
      inputPayload = `Sender: ${emailSender || 'Unknown'}\n\nContent:\n${emailContent}`
    }

    setError('')
    setIsAnalyzing(true)
    setActiveStep(0)

    window.setTimeout(() => {
      let riskLevel = 'low'
      const checkText = inputPayload.toLowerCase()
      
      if (
        checkText.includes('payment') || 
        checkText.includes('urgent') || 
        checkText.includes('momo') || 
        checkText.includes('cashout') || 
        checkText.includes('promo') ||
        checkText.includes('pin') ||
        checkText.includes('fee') ||
        checkText.includes('claim')
      ) {
        riskLevel = 'high'
      } else if (
        checkText.includes('http://') || 
        checkText.includes('update') || 
        checkText.includes('verify') ||
        checkText.includes('select')
      ) {
        riskLevel = 'medium'
      }

      const result = createMockScanResult({
        type: selectedType.toLowerCase(),
        input: inputPayload,
        riskLevel,
      })
      
      setIsAnalyzing(false)
      navigate(`/results/${result.id}`)
    }, 2100)
  }

  const stepsList = loadingMessages[selectedType.toLowerCase()] || loadingMessages.message

  return (
    <PageContainer>
      <section className="scanner-card">
        <div className="section-heading">
          <h1>Scan for threats</h1>
          <p>Share a message, upload a screenshot, paste a link, or review an email body. SafeLens runs direct checks and details warning indicators.</p>
        </div>

        <div className="chip-row" role="tablist" aria-label="Content types">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={`chip ${selectedType === option ? 'chip--active' : ''}`}
              onClick={() => {
                setSelectedType(option)
                setError('')
              }}
              disabled={isAnalyzing}
            >
              {option}
            </button>
          ))}
        </div>

        {error ? <Alert title="Check inputs" tone="danger">{error}</Alert> : null}

        {/* Message Panel */}
        {selectedType === 'Message' && !isAnalyzing ? (
          <div className="scanner-panel animate-fade-in">
            <label className="input-label" htmlFor="message-input">Paste suspicious message text</label>
            <textarea
              id="message-input"
              className="scanner-textarea"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Paste SMS alerts, WhatsApp chats, or cashout instructions..."
            />
            <div className="scanner-toolbar">
              <span>{characterCount} / 5000 characters</span>
              <Button type="button" variant="ghost" onClick={() => setMessage('')}>
                Clear
              </Button>
            </div>
          </div>
        ) : null}

        {/* Screenshot Panel */}
        {selectedType === 'Screenshot' && !isAnalyzing ? (
          <div className="scanner-panel animate-fade-in">
            <div
              className={`upload-box ${isDragging ? 'upload-box--active' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                cursor: 'pointer',
                borderColor: isDragging ? 'var(--primary)' : 'var(--border)',
                background: isDragging ? 'var(--background)' : 'white',
                transition: 'all 0.2s',
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <div>
                <strong>Drag and drop image here, or click to upload</strong>
                <p>PNG, JPG, or WEBP screenshots up to 5MB.</p>
              </div>
            </div>
            
            {previewUrl ? (
              <div className="preview-card screenshot-container animate-fade-in" style={{ marginTop: '1rem' }}>
                <div className="ocr-scanner">
                  <img src={previewUrl} alt="Uploaded chat preview" />
                </div>
                <div className="preview-meta">
                  <span style={{ fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <circle cx="12" cy="13" r="3" />
                    </svg>
                    {fileName}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      setFileName('')
                      setPreviewUrl('')
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Link Panel */}
        {selectedType === 'Link' && !isAnalyzing ? (
          <div className="scanner-panel animate-fade-in">
            <label className="input-label" htmlFor="link-input">Suspicious link URL</label>
            <input
              id="link-input"
              type="url"
              className="scanner-input"
              value={linkUrl}
              onChange={(event) => setLinkUrl(event.target.value)}
              placeholder="Paste suspicious website URL (e.g. http://mtn-bonus-claim.xyz)..."
            />
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
              We evaluate secure HTTP protocols (HTTPS), domain registrar profiles, and matching phishing strings.
            </p>
          </div>
        ) : null}

        {/* Email Panel */}
        {selectedType === 'Email' && !isAnalyzing ? (
          <div className="scanner-panel animate-fade-in">
            <label className="input-label" htmlFor="sender-input">Sender Email Address (Optional)</label>
            <input
              id="sender-input"
              type="text"
              className="scanner-input"
              value={emailSender}
              onChange={(event) => setEmailSender(event.target.value)}
              placeholder="e.g. security-mtn@gmail.com, or support@fidelitybank-gh.xyz"
            />
            
            <label className="input-label" htmlFor="email-body-input">Email Subject & Body Content</label>
            <textarea
              id="email-body-input"
              className="scanner-textarea"
              value={emailContent}
              onChange={(event) => setEmailContent(event.target.value)}
              placeholder="Paste the email title, sender signature, and body message..."
              style={{ minHeight: '160px' }}
            />
          </div>
        ) : null}

        {!isAnalyzing ? (
          <div className="scanner-actions">
            <Button type="button" onClick={handleAnalyze}>
              Analyze with SafeLens
            </Button>
          </div>
        ) : null}

        {/* Active Analysis Stepper Screen */}
        {isAnalyzing ? (
          <div className="loading-card animate-fade-in" aria-live="polite" style={{ marginTop: '2rem' }}>
            <div className="loading-card__header" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <h3 style={{ margin: '0 0 0.4rem' }}>SafeLens is auditing submissions...</h3>
              <p style={{ margin: 0 }}>Step {activeStep + 1} of 4: {stepsList[activeStep].detail}</p>
            </div>
            
            {/* If screenshot, show image with horizontal scanning line overlay */}
            {selectedType === 'Screenshot' && previewUrl ? (
              <div className="ocr-scanner" style={{ maxWidth: '280px', margin: '0 auto 1.5rem', position: 'relative' }}>
                <div className="ocr-scan-line" />
                <img src={previewUrl} alt="Scanning source" style={{ width: '100%', opacity: 0.6, borderRadius: '0.8rem' }} />
              </div>
            ) : null}

            <div className="loading-steps" style={{ gap: '0.9rem' }}>
              {stepsList.map((step, idx) => {
                let statusClass = 'step'
                let bullet = '○'
                if (idx < activeStep) {
                  statusClass = 'step completed'
                  bullet = '✓'
                } else if (idx === activeStep) {
                  statusClass = 'step active'
                  bullet = '●'
                }
                
                return (
                  <div key={idx} className={statusClass} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.1rem', lineHeight: '1', width: '15px' }}>{bullet}</span>
                    <div>
                      <strong style={{ display: 'block' }}>{step.title}</strong>
                      <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{step.detail}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : null}
      </section>
    </PageContainer>
  )
}
