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
    subtitle: 'MoMo, SMS lures & WhatsApp messages',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
  },
  {
    id: 'screenshot',
    label: 'Screenshot OCR',
    subtitle: 'Upload screenshot image of message',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
      </svg>
    ),
  },
  {
    id: 'link',
    label: 'Web Link / URL',
    subtitle: 'Check suspicious promo website',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
  },
  {
    id: 'email',
    label: 'Email Audit',
    subtitle: 'Check suspicious email subject & body',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem' }}>
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

    // Multi-step loading delay for human trust building
    await new Promise((resolve) => setTimeout(resolve, 2200))

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

      {/* Human-Centered Responsive 2-Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.8rem', alignItems: 'start' }}>
        
        {/* Left Column: Primary Scanner Workstation */}
        <section className="scanner-card animate-fade-in" style={{ width: '100%', margin: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <Badge tone="medium">AI THREAT SCANNER</Badge>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 700 }}>
              Ghana Fraud Shield Engine
            </span>
          </div>

          <h1 style={{ fontSize: '1.9rem', fontWeight: 900, margin: '0 0 0.4rem 0', color: 'var(--text)' }}>
            Threat Analysis Workstation
          </h1>
          <p style={{ margin: '0 0 1.4rem 0', fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.5 }}>
            Paste a suspicious SMS, web link, email, or upload a screenshot. SafeLens checks it against known Ghanaian fraud tactics and provides plain-English advice.
          </p>

          {/* Type Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem', marginBottom: '1.4rem' }}>
            {SCAN_TYPES.map((type) => {
              const isActive = activeType === type.id
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleTypeChange(type.id)}
                  style={{
                    padding: '0.75rem 0.6rem',
                    borderRadius: '16px',
                    border: isActive ? '2px solid var(--primary)' : '1px solid var(--border)',
                    background: isActive ? 'var(--primary)' : 'var(--surface-alt)',
                    color: isActive ? '#ffffff' : 'var(--text)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? '0 4px 14px rgba(230, 60, 28, 0.25)' : 'none'
                  }}
                >
                  <span style={{ color: isActive ? '#ffffff' : 'var(--primary)' }}>{type.icon}</span>
                  <strong style={{ fontSize: '0.82rem', fontWeight: 850 }}>{type.label}</strong>
                </button>
              )
            })}
          </div>

          {/* Input Panel */}
          <div className="scanner-panel" style={{ marginBottom: '1.2rem' }}>
            {activeType === 'screenshot' && (
              <div
                className={`upload-box ${isDragging ? 'upload-box--active' : ''}`}
                onDragOver={(event) => { event.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{ cursor: 'pointer', marginBottom: imagePreview ? '1rem' : 0 }}
              >
                {imagePreview ? (
                  <div className="preview-card" style={{ width: '100%' }}>
                    <img src={imagePreview} alt="Screenshot preview" style={{ maxHeight: '180px', objectFit: 'contain' }} />
                    <div className="preview-meta" style={{ marginTop: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 700 }}>Image loaded for analysis</span>
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
                    <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ width: '2.2rem', height: '2.2rem', color: 'var(--primary)', marginBottom: '0.3rem' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                    </svg>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text)' }}>Click to upload screenshot image</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>PNG or JPG, up to 10MB</span>
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

            <div style={{ position: 'relative' }}>
              <textarea
                className="scanner-textarea"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={PLACEHOLDERS[activeType]}
                style={{ minHeight: activeType === 'screenshot' ? '100px' : '150px', fontSize: '0.9rem', lineHeight: 1.5 }}
              />

              {/* Convenience Toolbar Inside Input */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.76rem', color: 'var(--muted)' }}>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button
                    type="button"
                    onClick={handlePasteClipboard}
                    style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '6px', padding: '0.2rem 0.55rem', color: 'var(--text)', fontWeight: 700, cursor: 'pointer', fontSize: '0.74rem' }}
                  >
                    Paste Clipboard
                  </button>
                  {input && (
                    <button
                      type="button"
                      onClick={() => setInput('')}
                      style={{ background: 'none', border: 'none', color: 'var(--danger)', fontWeight: 700, cursor: 'pointer', fontSize: '0.74rem' }}
                    >
                      Clear Text
                    </button>
                  )}
                </div>
                <span>{input.length} characters</span>
              </div>
            </div>
          </div>

          {error && (
            <Alert type="danger" style={{ marginBottom: '1rem' }}>
              {error}
            </Alert>
          )}

          <Button
            variant="primary"
            size="lg"
            onClick={handleScan}
            disabled={!canSubmit || isScanning}
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem 1.2rem', fontSize: '0.95rem', fontWeight: 850 }}
          >
            {isScanning ? 'Analyzing Threat Signals…' : 'Analyze Content for Threats'}
          </Button>

          <p style={{ marginTop: '0.8rem', fontSize: '0.74rem', color: 'var(--muted)', textAlign: 'center', margin: '0.8rem 0 0 0' }}>
            🔒 SafeLens never stores or shares your private messages. Analysis is executed securely.
          </p>
        </section>

        {/* Right Column: Human-Centered AI Transparency & Guidance Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          {/* Preset Threat Samples */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '1.4rem', boxShadow: 'var(--shadow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 900 }}>⚡</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text)', fontWeight: 850 }}>
                Try Sample Threats
              </strong>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: '0 0 1rem 0', lineHeight: 1.45 }}>
              Click any sample below to load realistic Ghanaian fraud content into the workstation:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {SAMPLE_CONTENT[activeType].map((sample) => (
                <button
                  key={sample.label}
                  type="button"
                  onClick={() => { setInput(sample.text); setError('') }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    padding: '0.65rem 0.85rem',
                    background: 'var(--surface-alt)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    color: 'var(--text)',
                    fontSize: '0.82rem',
                    fontWeight: 750
                  }}
                >
                  <span>{sample.label}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 800 }}>Load &rarr;</span>
                </button>
              ))}
            </div>
          </div>

          {/* Human-Centered AI Transparency Principles */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '1.4rem', boxShadow: 'var(--shadow)' }}>
            <strong style={{ fontSize: '0.95rem', color: 'var(--text)', fontWeight: 850, display: 'block', marginBottom: '0.6rem' }}>
              How SafeLens Protects You
            </strong>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--success)', fontWeight: 900 }}>✓</span>
                <div>
                  <strong style={{ color: 'var(--text)', display: 'block', fontSize: '0.82rem' }}>Ghana MoMo Pattern Match</strong>
                  Evaluates USSD code lures (*170#), cashout approvals, wrong transfer scams, and telco spoofing.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--success)', fontWeight: 900 }}>✓</span>
                <div>
                  <strong style={{ color: 'var(--text)', display: 'block', fontSize: '0.82rem' }}>Plain-English Risk Rating</strong>
                  Gives you clear risk scores (0–100%) and actionable advice without confusing technical jargon.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--success)', fontWeight: 900 }}>✓</span>
                <div>
                  <strong style={{ color: 'var(--text)', display: 'block', fontSize: '0.82rem' }}>100% Privacy Guaranteed</strong>
                  Your messages are analyzed in real-time and never sold or shared with third parties.
                </div>
              </div>
            </div>
          </div>

          {/* Immediate Action Checklist */}
          <div style={{ background: 'rgba(230, 60, 28, 0.05)', border: '1px solid rgba(230, 60, 28, 0.2)', borderRadius: '20px', padding: '1.2rem' }}>
            <strong style={{ fontSize: '0.86rem', color: 'var(--primary)', fontWeight: 850, display: 'block', marginBottom: '0.4rem' }}>
              Golden Safety Rules
            </strong>
            <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.78rem', color: 'var(--text)', lineHeight: 1.5 }}>
              <li>Never approve a MoMo cashout request from a caller.</li>
              <li>Telco operators handle wrong transfers directly—never refund manually.</li>
              <li>Official operators will never ask for your 4-digit PIN.</li>
            </ul>
          </div>

        </div>

      </div>
    </PageContainer>
  )
}
