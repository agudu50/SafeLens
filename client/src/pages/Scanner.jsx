import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Alert from '../components/ui/Alert'
import AnalysisLoader from '../features/scanner/AnalysisLoader'
import { createMockScanResult } from '../services/scannerService'

const SCAN_TYPES = [
  {
    id: 'message',
    label: 'SMS & Text',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
  },
  {
    id: 'screenshot',
    label: 'Screenshot OCR',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
      </svg>
    ),
  },
  {
    id: 'link',
    label: 'Web Link / URL',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
  },
  {
    id: 'email',
    label: 'Email Audit',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
]

const PLACEHOLDERS = {
  message: 'Paste the suspicious SMS, WhatsApp message, or MoMo refund text here...\nExample: "Dear customer, your account has been credited GHS 500 in error, please refund via *170# immediately..."',
  screenshot: 'Upload an image screenshot or type out any key text visible in the image for SafeLens AI verification...',
  link: 'Paste the suspicious URL link here...\nExample: http://mtn-promo-claim-cashout.xyz/verify',
  email: 'Paste the full email subject and body text here...',
}

const SAMPLE_CONTENT = {
  message: [
    {
      label: 'MoMo Wrong Transfer',
      text: 'Dear customer, your account has been credited GHS 500 in error, please refund via *170# immediately or your MoMo wallet will be suspended within 24 hours.',
    },
    {
      label: 'Fake Job Offer',
      text: 'Congratulations! You have been selected for a remote job offer with guaranteed earnings of GHS 2,000/week. Send a GHS 50 registration fee to proceed.',
    },
    {
      label: 'Prize Promo Cashout',
      text: 'CONGRATULATIONS! Your number has WON GHS 5,000 in the MTN promo giveaway. Reply with your full name and dial *170# to claim before it expires today!',
    },
  ],
  screenshot: [
    {
      label: 'Account Flagged Alert',
      text: 'Screenshot shows: "Your account has been flagged for unusual activity. Click the link below immediately to verify your identity and secure your profile before suspension."',
    },
    {
      label: 'Fake Delivery Notice',
      text: 'Screenshot shows: "Your package could not be delivered. Pay a GHS 15 customs clearance fee via the link below to reschedule delivery today."',
    },
  ],
  link: [
    { label: 'MoMo Phishing URL', text: 'http://mtn-gh-promo.xyz/claim-cashout' },
    { label: 'Fake Bank Verification', text: 'http://gh-secure-banking.top/login-verify' },
    { label: 'Legitimate Official Link', text: 'https://www.mtn.com.gh/support' },
  ],
  email: [
    {
      label: 'Urgent Account Suspension',
      text: 'Subject: URGENT - Account Suspension Notice\n\nDear Customer, we detected unusual activity on your account. Your account will be suspended in 24 hours unless you verify your login credentials and PIN immediately by replying to this email.',
    },
    {
      label: 'Advance Fee Inheritance',
      text: 'Subject: Confidential Business Proposal\n\nDear Beneficiary, I am a bank official and I have an unclaimed inheritance fund of $2,500,000 for you. Please send a small processing fee and your banking details to claim your prize.',
    },
  ],
}

export default function Scanner() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [activeType, setActiveType] = useState('message')
  const [input, setInput] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState('')

  const handleTypeChange = (typeId) => {
    setActiveType(typeId)
    setError('')
    if (typeId !== 'screenshot') {
      setImagePreview(null)
    }
  }

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG or JPG).')
      return
    }
    setError('')
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    handleFile(event.dataTransfer.files?.[0])
  }

  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText()
        if (text) {
          setInput(text)
          setError('')
        }
      }
    } catch (err) {
      console.warn('Clipboard read permission denied', err)
    }
  }

  const canSubmit = activeType === 'screenshot' ? (imagePreview || input.trim()) : input.trim().length > 0

  const handleScan = async () => {
    if (!canSubmit || isScanning) return
    setIsScanning(true)
    setError('')

    // Visual multi-step loading delay for human trust building
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const content = activeType === 'screenshot' && !input.trim()
      ? 'Screenshot uploaded for OCR analysis (no additional text provided).'
      : input.trim()

    const result = createMockScanResult({ type: activeType, input: content })
    setIsScanning(false)
    navigate(`/results/${result.id}`)
  }

  return (
    <PageContainer>
      <AnalysisLoader isOpen={isScanning} />

      {/* Sleek Modern Central Scanner Workstation Card */}
      <div style={{ maxWidth: '880px', margin: '0 auto' }}>
        <section className="scanner-workstation-card animate-fade-in">
          {/* Header */}
          <div className="scanner-workstation-header">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <Badge tone="medium">
                <span className="live-pulse-dot" style={{ width: '6px', height: '6px', background: 'var(--primary)', marginRight: '0.35rem' }} />
                AI THREAT SCANNER
              </Badge>
            </div>
            <h1 className="scanner-workstation-title">
              Scan Messages &amp; Fraud Lures
            </h1>
            <p className="scanner-workstation-desc">
              Paste suspicious SMS text, web links, or upload screenshots to get an instant AI risk score tailored for Ghana mobile security.
            </p>
          </div>

          {/* Segmented Type Switcher Tabs */}
          <div className="scanner-tabs-switcher">
            {SCAN_TYPES.map((type) => {
              const isActive = activeType === type.id
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleTypeChange(type.id)}
                  className={`scanner-tab-button ${isActive ? 'scanner-tab-button--active' : 'scanner-tab-button--inactive'}`}
                >
                  <span style={{ color: isActive ? '#ffffff' : 'var(--primary)', display: 'flex', alignItems: 'center' }}>
                    {type.icon}
                  </span>
                  <span>{type.label}</span>
                </button>
              )
            })}
          </div>

          {/* Inline Sample Lure Chips */}
          <div style={{ marginBottom: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 800 }}>
                Try 1-Click Sample Threat:
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700 }}>
                Instant Ghanaian Lure Presets
              </span>
            </div>

            <div className="scanner-presets-chips-row">
              {SAMPLE_CONTENT[activeType].map((sample) => (
                <button
                  key={sample.label}
                  type="button"
                  onClick={() => { setInput(sample.text); setError('') }}
                  className="scanner-preset-chip"
                >
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />
                  <span>{sample.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Input Workstation Box */}
          <div className="scanner-workstation-box">
            {activeType === 'screenshot' && (
              <div
                className={`upload-box ${isDragging ? 'upload-box--active' : ''}`}
                onDragOver={(event) => { event.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  cursor: 'pointer',
                  marginBottom: imagePreview ? '1rem' : '1rem',
                  background: 'var(--surface)',
                  border: '2px dashed var(--border)',
                  borderRadius: '16px',
                  padding: '1.2rem 1rem',
                  textAlign: 'center'
                }}
              >
                {imagePreview ? (
                  <div className="preview-card" style={{ width: '100%' }}>
                    <img src={imagePreview} alt="Screenshot preview" style={{ maxHeight: '180px', objectFit: 'contain', borderRadius: '8px' }} />
                    <div style={{ marginTop: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 800 }}>✓ Screenshot loaded</span>
                      <button
                        type="button"
                        onClick={(event) => { event.stopPropagation(); setImagePreview(null) }}
                        style={{ fontSize: '0.78rem', color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 800 }}
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <svg fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" style={{ width: '2rem', height: '2rem', color: 'var(--primary)', marginBottom: '0.3rem' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                    </svg>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--text)', display: 'block' }}>Drag &amp; drop screenshot or click to upload</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Supports PNG or JPG images</span>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleFile(event.target.files?.[0])}
                  style={{ display: 'none' }}
                />
              </div>
            )}

            <textarea
              className="scanner-textarea-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={PLACEHOLDERS[activeType]}
              style={{
                minHeight: activeType === 'screenshot' ? '90px' : '140px',
              }}
            />

            {/* Workstation Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem', fontSize: '0.78rem', color: 'var(--muted)', flexWrap: 'wrap', gap: '0.4rem' }}>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={handlePasteClipboard}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '0.35rem 0.7rem',
                    color: 'var(--primary)',
                    fontWeight: 800,
                    cursor: 'pointer',
                    fontSize: '0.76rem'
                  }}
                >
                  Paste Clipboard
                </button>
                {input && (
                  <button
                    type="button"
                    onClick={() => setInput('')}
                    style={{ background: 'none', border: 'none', color: 'var(--danger)', fontWeight: 800, cursor: 'pointer', fontSize: '0.76rem' }}
                  >
                    Clear Text
                  </button>
                )}
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.75rem' }}>{input.length} characters</span>
            </div>
          </div>

          {error && (
            <Alert type="danger" style={{ marginBottom: '1.2rem' }}>
              {error}
            </Alert>
          )}

          {/* Action Button */}
          <Button
            variant="primary"
            size="lg"
            onClick={handleScan}
            disabled={!canSubmit || isScanning}
            className="scanner-submit-btn"
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem 1.2rem', fontWeight: 850, borderRadius: '16px', boxShadow: '0 6px 20px rgba(230, 60, 28, 0.25)' }}
          >
            {isScanning ? 'Analyzing Threat Signals…' : 'Analyze Content for Threats'}
          </Button>

          {/* Trust Footnote */}
          <div className="scanner-trust-row">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem', color: 'var(--success)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              100% Private Analysis
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem', color: 'var(--success)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Ghana MoMo Vector Check
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.85rem', height: '0.85rem', color: 'var(--success)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Instant Risk Score Report
            </span>
          </div>
        </section>
      </div>
    </PageContainer>
  )
}
