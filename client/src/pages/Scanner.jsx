import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { createMockScanResult } from '../services/scannerService'

const SCAN_TYPES = [
  {
    id: 'message',
    label: 'Message / SMS',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
  },
  {
    id: 'screenshot',
    label: 'Screenshot',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
      </svg>
    ),
  },
  {
    id: 'link',
    label: 'Link / URL',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
  },
  {
    id: 'email',
    label: 'Email',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
]

const PLACEHOLDERS = {
  message: 'Paste the suspicious SMS or MoMo message here, e.g. "Dear customer, your account has been credited GHS 500 in error, please refund via *170# or your account will be suspended..."',
  screenshot: 'Describe or paste the text visible in the screenshot so SafeLens can analyze it (image OCR preview shown below).',
  link: 'Paste the suspicious link here, e.g. http://mtn-gh-promo.xyz/claim-cashout',
  email: 'Paste the full email content (subject + body) here...',
}

// Quick-fill samples so users can test the scanner without typing their own content.
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
      label: 'Prize / Giveaway',
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
    { label: 'MoMo Promo Phishing', text: 'http://mtn-gh-promo.xyz/claim-cashout' },
    { label: 'Fake Bank Login', text: 'http://gh-secure-banking.top/login-verify' },
    { label: 'Legit HTTPS Example', text: 'https://www.mtn.com.gh/support' },
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

  const canSubmit = activeType === 'screenshot' ? (imagePreview || input.trim()) : input.trim().length > 0

  const handleScan = async () => {
    if (!canSubmit || isScanning) return
    setIsScanning(true)
    setError('')

    // Simulate an AI analysis delay so the scan feels like real processing.
    await new Promise((resolve) => setTimeout(resolve, 1400))

    const content = activeType === 'screenshot' && !input.trim()
      ? 'Screenshot uploaded for OCR analysis (no additional text provided).'
      : input.trim()

    const result = createMockScanResult({ type: activeType, input: content })
    setIsScanning(false)
    navigate(`/results/${result.id}`)
  }

  return (
    <PageContainer>
      <section className="scanner-card animate-fade-in" style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <Badge variant="info" size="sm">AI THREAT SCANNER</Badge>
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 900, margin: '0 0 0.4rem 0', color: 'var(--text)' }}>
          Scan for Scams &amp; Fraud
        </h1>
        <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem', color: 'var(--muted)', maxWidth: '640px' }}>
          Paste a suspicious message, link, email, or upload a screenshot. SafeLens AI checks it against common Ghanaian scam patterns and gives you an instant risk report.
        </p>

        {/* Scan Type Tabs */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
          {SCAN_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => handleTypeChange(type.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1rem',
                borderRadius: '999px',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
                border: activeType === type.id ? '1px solid var(--primary)' : '1px solid var(--border)',
                background: activeType === type.id ? 'var(--primary)' : 'var(--surface-alt)',
                color: activeType === type.id ? '#ffffff' : 'var(--muted)',
                transition: 'all 0.2s ease',
              }}
            >
              {type.icon}
              {type.label}
            </button>
          ))}
        </div>

        {/* Sample Content Quick-Fill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
          <span style={{ fontSize: '0.76rem', color: 'var(--muted)', fontWeight: 700 }}>Try a sample:</span>
          {SAMPLE_CONTENT[activeType].map((sample) => (
            <button
              key={sample.label}
              type="button"
              onClick={() => { setInput(sample.text); setError('') }}
              style={{
                fontSize: '0.76rem',
                fontWeight: 750,
                color: 'var(--primary)',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '999px',
                padding: '0.3rem 0.7rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {sample.label}
            </button>
          ))}
        </div>

        {/* Input Panel */}
        <div className="scanner-panel" style={{ marginBottom: '1rem' }}>
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
                  <img src={imagePreview} alt="Screenshot preview" />
                  <div className="preview-meta">
                    <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 700 }}>Screenshot ready for analysis</span>
                    <button
                      type="button"
                      onClick={(event) => { event.stopPropagation(); setImagePreview(null) }}
                      style={{ fontSize: '0.78rem', color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 800 }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ width: '2.2rem', height: '2.2rem', color: 'var(--primary)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                  </svg>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text)' }}>Click to upload or drag and drop</strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>PNG or JPG, up to 10MB</span>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(event) => handleFile(event.target.files?.[0])}
              />
            </div>
          )}

          <textarea
            className="scanner-textarea"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={PLACEHOLDERS[activeType]}
            style={activeType === 'screenshot' ? { minHeight: '90px' } : undefined}
          />

          <div className="scanner-toolbar">
            <span>{input.length} characters</span>
            <span>SafeLens AI Threat Engine · Ghana Fraud Patterns</span>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        <Button
          variant="primary"
          size="lg"
          onClick={handleScan}
          disabled={!canSubmit || isScanning}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          {isScanning ? (
            <>
              <span className="live-pulse-dot" style={{ background: '#fff' }} />
              Analyzing for scam signals…
            </>
          ) : (
            'Scan for Threats'
          )}
        </Button>

        <p style={{ marginTop: '0.9rem', fontSize: '0.76rem', color: 'var(--muted)', textAlign: 'center' }}>
          SafeLens never shares your content. Analysis happens instantly and results are saved to your private scan history.
        </p>
      </section>
    </PageContainer>
  )
}
