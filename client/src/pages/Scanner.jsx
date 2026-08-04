import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import Badge from '../components/ui/Badge'
import { createMockScanResult } from '../services/scannerService'
import AnalysisLoader from '../features/scanner/AnalysisLoader'

const messageIcon = (
  <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem', marginRight: '0.35rem', verticalAlign: 'middle', display: 'inline-block' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.12 2.9 2.78 2.9h1.12c.38 0 .74.15 1.01.42l1.93 1.93c.35.35.94.1 1.01-.4v-1.95c0-.41.34-.75.75-.75h2.12c1.66 0 2.78-1.3 2.78-2.9v-3c0-1.6-1.12-2.9-2.78-2.9H5.15C3.49 4.3 2.37 5.6 2.37 7.2v3z" />
  </svg>
)

const screenshotIcon = (
  <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem', marginRight: '0.35rem', verticalAlign: 'middle', display: 'inline-block' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
)

const linkIcon = (
  <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem', marginRight: '0.35rem', verticalAlign: 'middle', display: 'inline-block' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
  </svg>
)

const emailIcon = (
  <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem', marginRight: '0.35rem', verticalAlign: 'middle', display: 'inline-block' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
)

const iconMap = {
  Message: messageIcon,
  Screenshot: screenshotIcon,
  Link: linkIcon,
  Email: emailIcon,
}

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

  // Stepper simulation & analysis execution
  useEffect(() => {
    if (!isAnalyzing) return

    let currentPayload = ''
    if (selectedType === 'Message') currentPayload = message
    else if (selectedType === 'Link') currentPayload = linkUrl
    else if (selectedType === 'Email') currentPayload = `Sender: ${emailSender}\n\n${emailContent}`
    else if (selectedType === 'Screenshot') currentPayload = `Screenshot: ${fileName}`

    const timer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= 3) {
          clearInterval(timer)
          
          setTimeout(() => {
            let riskLevel = 'low'
            const checkText = (currentPayload || '').toLowerCase()
            
            if (
              checkText.includes('payment') || 
              checkText.includes('urgent') || 
              checkText.includes('momo') || 
              checkText.includes('cashout') || 
              checkText.includes('promo') ||
              checkText.includes('pin') ||
              checkText.includes('fee') ||
              checkText.includes('claim') ||
              checkText.includes('http://')
            ) {
              riskLevel = 'high'
            } else if (
              checkText.includes('update') || 
              checkText.includes('verify') ||
              checkText.includes('select')
            ) {
              riskLevel = 'medium'
            }

            const result = createMockScanResult({
              type: selectedType.toLowerCase(),
              input: currentPayload || 'Suspicious submission input',
              riskLevel,
            })
            
            setIsAnalyzing(false)
            navigate(`/results/${result.id}`)
          }, 350)

          return 3
        }
        return prev + 1
      })
    }, 450)

    return () => clearInterval(timer)
  }, [isAnalyzing, selectedType, message, linkUrl, emailSender, emailContent, fileName, navigate])

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

  const handleAnalyze = (overridePayload) => {
    let inputPayload = typeof overridePayload === 'string' ? overridePayload : ''
    
    if (!inputPayload) {
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
    }

    setError('')
    setActiveStep(0)
    setIsAnalyzing(true)
  }

  const stepsList = loadingMessages[selectedType.toLowerCase()] || loadingMessages.message

  return (
    <PageContainer>
      <section className="scanner-card">
        <div className="section-heading">
          <div style={{ marginBottom: '0.6rem' }}>
            <Badge tone="neutral">
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem', marginRight: '0.35rem', display: 'inline-block', verticalAlign: 'middle', color: 'var(--primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              AI THREAT SCANNER ENGINE
            </Badge>
          </div>
          <h1>Scan Messages &amp; Digital Threats</h1>
          <p className="hero-text" style={{ marginTop: '0.4rem' }}>Paste suspicious text messages, copy web links, upload chat screenshots, or review email headers. SafeLens evaluates warning signals in seconds.</p>

          {/* Scanner Trust Signals */}
          <div className="hero-trust-grid" style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
            <span className="trust-pill">
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem', color: 'var(--primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              Instant 3-Sec Scan
            </span>
            <span className="trust-pill">
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem', color: 'var(--success)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              100% Private &amp; Anonymous
            </span>
            <span className="trust-pill">
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem', color: 'var(--primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zM12 3v18m-9-9h18" />
              </svg>
              Ghana MoMo &amp; Telecom Protection
            </span>
          </div>
        </div>

        {/* Tab Selection */}
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
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {iconMap[option]}
              <span>{option}</span>
            </button>
          ))}
        </div>

        {error ? <Alert title="Check inputs" tone="danger">{error}</Alert> : null}

        {/* Message Panel */}
        {selectedType === 'Message' && !isAnalyzing ? (
          <div className="scanner-panel animate-fade-in">
            <div className="scanner-input-header">
              <label className="input-label" htmlFor="message-input" style={{ margin: 0 }}>Paste suspicious message text</label>
              <div className="preset-sample-row">
                <span className="preset-sample-title">TRY SAMPLES:</span>
                <button
                  type="button"
                  className="preset-sample-btn"
                  onClick={() => {
                    const text = 'Hello, I just sent 850 GHS to your number by mistake. Please send it back immediately to 0551234567. God bless you!'
                    setMessage(text)
                    handleAnalyze(text)
                  }}
                >
                  MoMo Refund
                </button>
                <button
                  type="button"
                  className="preset-sample-btn"
                  onClick={() => {
                    const text = 'MTN Customer Care: You won 5,000 GHS in promo! Dial *170# -> option 6 -> option 5 to approve your cashout approval request immediately.'
                    setMessage(text)
                    handleAnalyze(text)
                  }}
                >
                  MTN Promo
                </button>
                <button
                  type="button"
                  className="preset-sample-btn"
                  onClick={() => {
                    const text = 'WORK FROM HOME! Earn 500 GHS daily by liking videos. Pay only 50 GHS registration fee to join.'
                    setMessage(text)
                    handleAnalyze(text)
                  }}
                >
                  Job Fee Scam
                </button>
              </div>
            </div>

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
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '2.4rem', height: '2.4rem', color: 'var(--primary)', marginBottom: '0.4rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
              </svg>
              <div>
                <strong style={{ fontSize: '1rem', color: 'var(--text)' }}>Drag and drop conversation screenshot here, or click to upload</strong>
                <p style={{ margin: '0.3rem 0 0', fontSize: '0.82rem', color: 'var(--muted)' }}>PNG, JPG, or WEBP screenshots up to 5MB.</p>
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
            <div className="scanner-input-header">
              <label className="input-label" htmlFor="link-input" style={{ margin: 0 }}>Suspicious link URL</label>
              <div className="preset-sample-row">
                <span className="preset-sample-title">TRY SAMPLE:</span>
                <button
                  type="button"
                  className="preset-sample-btn"
                  onClick={() => {
                    const text = 'http://mtn-bonus-cashout-claim.xyz/verify-momo'
                    setLinkUrl(text)
                    handleAnalyze(text)
                  }}
                >
                  Phishing Link
                </button>
              </div>
            </div>
            <input
              id="link-input"
              type="url"
              className="scanner-input"
              value={linkUrl}
              onChange={(event) => setLinkUrl(event.target.value)}
              placeholder="Paste suspicious website URL (e.g. http://mtn-bonus-claim.xyz)..."
            />
            <p style={{ margin: '0.4rem 0 0.5rem', fontSize: '0.84rem', color: 'var(--muted)' }}>
              SafeLens evaluates secure HTTP protocols (HTTPS), domain registrar profiles, blacklists, and matching phishing strings.
            </p>
          </div>
        ) : null}

        {/* Email Panel */}
        {selectedType === 'Email' && !isAnalyzing ? (
          <div className="scanner-panel animate-fade-in">
            <div className="scanner-input-header">
              <label className="input-label" htmlFor="sender-input" style={{ margin: 0 }}>Sender Email Address (Optional)</label>
              <div className="preset-sample-row">
                <span className="preset-sample-title">TRY SAMPLE:</span>
                <button
                  type="button"
                  className="preset-sample-btn"
                  onClick={() => {
                    const sender = 'security-fidelitybank@gmail.com'
                    const body = 'URGENT: Your Fidelity Bank online access has been flagged due to unverified login attempts. Click the link immediately to verify your PIN and security question.'
                    setEmailSender(sender)
                    setEmailContent(body)
                    handleAnalyze(`Sender: ${sender}\n\nContent:\n${body}`)
                  }}
                >
                  Bank Spoof Email
                </button>
              </div>
            </div>
            <input
              id="sender-input"
              type="text"
              className="scanner-input"
              value={emailSender}
              onChange={(event) => setEmailSender(event.target.value)}
              placeholder="e.g. security-mtn@gmail.com, or support@fidelitybank-gh.xyz"
            />
            
            <label className="input-label" htmlFor="email-body-input" style={{ marginTop: '0.8rem' }}>Email Subject &amp; Body Content</label>
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
            <Button type="button" onClick={handleAnalyze} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.6rem', fontSize: '0.98rem' }}>
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              Analyze with SafeLens
            </Button>
          </div>
        ) : null}

        {/* Active Analysis Stepper Screen */}
        {isAnalyzing ? (
          <div
            className="scanner-card animate-fade-in"
            aria-live="polite"
            style={{
              marginTop: '2rem',
              padding: '1.8rem',
              background: 'var(--surface-alt)',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)'
            }}
          >
            {/* Header with Radar Icon & Step Status */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(230, 60, 28, 0.12)', border: '1px solid rgba(230, 60, 28, 0.25)', display: 'grid', placeItems: 'center', color: 'var(--primary)' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"/>
                    <path d="M12 8v4l3 3" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: 'var(--text)' }}>
                    SafeLens is auditing submissions...
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.84rem', color: 'var(--muted)', fontWeight: 600 }}>
                    Step {activeStep + 1} of 4: <span style={{ color: 'var(--primary)', fontWeight: 750 }}>{stepsList[activeStep].detail}</span>
                  </p>
                </div>
              </div>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--surface)', padding: '0.3rem 0.75rem', borderRadius: '999px', border: '1px solid var(--border)' }}>
                <span className="live-pulse-dot" style={{ background: 'var(--primary)', width: '7px', height: '7px' }} />
                <span style={{ fontSize: '0.78rem', fontWeight: 850, color: 'var(--text)' }}>
                  {(activeStep + 1) * 25}%
                </span>
              </div>
            </div>

            {/* Stepper Progress Bar Track */}
            <div style={{ height: '8px', background: 'var(--surface)', borderRadius: '999px', border: '1px solid var(--border)', overflow: 'hidden', marginBottom: '1.8rem', padding: '1px' }}>
              <div style={{ width: `${(activeStep + 1) * 25}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), #ef4444)', borderRadius: '999px', transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }} />
            </div>
            
            {/* If screenshot, show image with horizontal scanning line overlay */}
            {selectedType === 'Screenshot' && previewUrl ? (
              <div className="ocr-scanner" style={{ maxWidth: '280px', margin: '0 auto 1.6rem', position: 'relative', overflow: 'hidden', borderRadius: '16px', border: '2px solid var(--primary)' }}>
                <div className="ocr-scan-line" />
                <img src={previewUrl} alt="Scanning source" style={{ width: '100%', opacity: 0.6, display: 'block' }} />
              </div>
            ) : null}

            {/* Stepper Process Cards Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stepsList.map((step, idx) => {
                const isCompleted = idx < activeStep
                const isActive = idx === activeStep

                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1.1rem',
                      background: isActive ? 'var(--surface)' : isCompleted ? 'rgba(16, 185, 129, 0.04)' : 'rgba(0,0,0,0.015)',
                      border: `1px solid ${isActive ? 'var(--primary)' : isCompleted ? 'rgba(16, 185, 129, 0.3)' : 'var(--border)'}`,
                      borderRadius: '14px',
                      opacity: !isActive && !isCompleted ? 0.6 : 1,
                      transition: 'all 0.3s ease',
                      transform: isActive ? 'scale(1.01)' : 'none',
                      boxShadow: isActive ? '0 4px 16px rgba(230, 60, 28, 0.12)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      {/* Step Status Badge */}
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '10px',
                          background: isCompleted ? 'rgba(16, 185, 129, 0.15)' : isActive ? 'rgba(230, 60, 28, 0.15)' : 'var(--surface)',
                          border: `1px solid ${isCompleted ? 'rgba(16, 185, 129, 0.3)' : isActive ? 'rgba(230, 60, 28, 0.3)' : 'var(--border)'}`,
                          display: 'grid',
                          placeItems: 'center',
                          flexShrink: 0
                        }}
                      >
                        {isCompleted ? (
                          <svg fill="none" stroke="var(--success)" strokeWidth="3" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem' }}>
                            <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : isActive ? (
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }} />
                        ) : (
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--muted)' }}>{idx + 1}</span>
                        )}
                      </div>

                      {/* Step Details */}
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text)', fontWeight: isActive ? 850 : 750 }}>
                          {step.title}
                        </strong>
                        <span style={{ fontSize: '0.8rem', color: isActive ? 'var(--primary)' : 'var(--muted)', fontWeight: isActive ? 700 : 500 }}>
                          {step.detail}
                        </span>
                      </div>
                    </div>

                    {/* Right Action Badge */}
                    <div>
                      {isCompleted && (
                        <span style={{ fontSize: '0.66rem', fontWeight: 850, color: 'var(--success)', background: 'rgba(16, 185, 129, 0.12)', padding: '0.2rem 0.55rem', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.25)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                          DONE
                        </span>
                      )}
                      {isActive && (
                        <span style={{ fontSize: '0.66rem', fontWeight: 850, color: 'var(--primary)', background: 'rgba(230, 60, 28, 0.12)', padding: '0.2rem 0.55rem', borderRadius: '6px', border: '1px solid rgba(230, 60, 28, 0.25)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                          PROCESSING
                        </span>
                      )}
                      {!isCompleted && !isActive && (
                        <span style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                          QUEUED
                        </span>
                      )}
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
