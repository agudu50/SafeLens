import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

const presets = [
  {
    title: 'MoMo Wrong Transfer',
    content: 'Hello, I just sent 850 GHS to your number by mistake. Please send it back immediately to 0551234567. God bless you!',
    riskLevel: 'high',
    riskScore: 92,
    explanation: 'Requests immediate MoMo refund transfers to a different phone number. Legitimate wrong transactions are reversed by dialing telecom networks directly, not transferring back manually.',
  },
  {
    title: 'Fake Promotion Cashout',
    content: 'MTN Ghana Customer Care: You have won 5,000 GHS in the MTN 50th Anniversary Promo. Dial *170# -> option 6 -> option 5 to approve your cashout.',
    riskLevel: 'high',
    riskScore: 97,
    explanation: 'Attempts to trick you into authorizing a "Cash Out" request on your Mobile Money wallet. Telecom operators never ask you to authorize withdrawals to receive rewards.',
  },
  {
    title: 'Unrealistic Job Offer',
    content: 'WORK FROM HOME! Earn 500 GHS daily by liking social media videos. Pay only 50 GHS registration fee to join. WhatsApp us now.',
    riskLevel: 'high',
    riskScore: 89,
    explanation: 'Requires an upfront registration fee for remote employment. Legit employers will never charge applicants money to apply or work.',
  },
  {
    title: 'Safe Message',
    content: 'Hey Ama, are we still meeting at the Accra Mall food court by 4:00 PM today? Let me know so I can order.',
    riskLevel: 'low',
    riskScore: 12,
    explanation: 'Contains routine conversational patterns with no financial instructions, urgency, or credential solicitations.',
  },
]

const FAQs = [
  {
    question: 'How does SafeLens identify scams?',
    answer: 'SafeLens scans text and images for common scam language patterns (such as wrong-transaction MoMo codes, unverified promotional URLs, cashout directives) and rates threat variables like pressure tactics, financial threats, and sender verification scores.',
  },
  {
    question: 'Can SafeLens scan images or screenshots?',
    answer: 'Yes! Under the "Scan" tab, select "Screenshot" to upload images of WhatsApp chats, SMS alerts, or email threads. SafeLens runs text extraction to analyze screenshot messages.',
  },
  {
    question: 'How do I report a MoMo scam in Ghana?',
    answer: 'If you identify a Mobile Money scam, report it to your network provider. For MTN, forward the SMS or number to 1917 for free. You can also contact the Cyber Security Authority (CSA) by dialing 292 or sending a WhatsApp to 0501147477.',
  },
]

const tickerReports = [
  { region: 'Accra', type: 'MoMo Refund Fraud', risk: 'High', time: '2 mins ago' },
  { region: 'Kumasi', type: 'Fake Job Agent Fee', risk: 'High', time: '14 mins ago' },
  { region: 'Takoradi', type: 'MTN Cashout Attack', risk: 'High', time: '38 mins ago' },
  { region: 'Tema', type: 'Suspicious Loan App Link', risk: 'Medium', time: '1 hr ago' },
  { region: 'Tamale', type: 'Wrong Transfer SMS', risk: 'High', time: '2 hrs ago' },
]

export default function Home() {
  const [selectedPreset, setSelectedPreset] = useState(presets[0])
  const [activeFAQ, setActiveFAQ] = useState(null)
  const [tickerIndex, setTickerIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerReports.length)
    }, 4500)
    return () => clearInterval(interval)
  }, [])

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index)
  }

  const toneMap = {
    low: 'low',
    medium: 'medium',
    high: 'high',
  }

  return (
    <PageContainer>
      {/* Live Scam Ticker */}
      <div className="ticker-container">
        <span className="ticker-label">Live Tracker</span>
        <div className="ticker-wrap">
          <div className="ticker-content">
            {tickerReports.map((report, idx) => (
              <span className="ticker-item" key={idx}>
                📍 <strong>{report.region}</strong>: {report.type} (
                <span style={{ color: report.risk === 'High' ? 'var(--danger)' : 'var(--warning)', fontWeight: 'bold' }}>
                  {report.risk} Risk
                </span>
                )<span className="ticker-time">{report.time}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="hero-card">
        <div className="hero-copy">
          <Badge tone="neutral">AI-powered scam awareness</Badge>
          <h1>Not sure if it&apos;s a scam?</h1>
          <p className="hero-text">Let SafeLens take a closer look. We help people in Ghana and beyond review suspicious messages, links, and emails before they act.</p>
          <div className="hero-actions">
            <Button as={Link} to="/scan" variant="primary">Scan a Message</Button>
            <Button as={Link} to="/about" variant="secondary">Learn How It Works</Button>
          </div>
        </div>
        <div className="hero-panel">
          <div className="hero-panel__card animate-fade-in" key={tickerIndex}>
            <p className="hero-panel__label">Live local threat</p>
            <h3>📍 {tickerReports[tickerIndex].region}</h3>
            <p>{tickerReports[tickerIndex].type} reported. Risk level is high; remain vigilant.</p>
          </div>
        </div>
      </section>

      {/* Interactive Sandbox Simulator */}
      <section className="section-block">
        <div className="section-heading">
          <Badge tone="medium">Try SafeLens Now</Badge>
          <h2>Instant Scan Sandbox</h2>
          <p className="hero-text" style={{ marginTop: '0.4rem' }}>Click a preset scam message below to see how SafeLens analyzes warning flags immediately.</p>
        </div>

        <div className="sandbox-container">
          <div className="sandbox-presets">
            {presets.map((preset) => (
              <button
                key={preset.title}
                type="button"
                className={`sandbox-btn ${selectedPreset.title === preset.title ? 'sandbox-btn--active' : ''}`}
                onClick={() => setSelectedPreset(preset)}
              >
                {preset.title}
              </button>
            ))}
          </div>

          <div className="sandbox-preview animate-fade-in" key={selectedPreset.title}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <Badge tone={toneMap[selectedPreset.riskLevel]}>{selectedPreset.riskLevel.toUpperCase()} RISK</Badge>
              <strong style={{ fontSize: '1.25rem', color: 'var(--text)' }}>{selectedPreset.riskScore}% Scam Risk</strong>
            </div>
            <div style={{ fontStyle: 'italic', color: 'var(--muted)', background: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '0.8rem', fontSize: '0.9rem', borderLeft: '3px solid var(--border)' }}>
              &ldquo;{selectedPreset.content}&rdquo;
            </div>
            <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: '1.4' }}>
              <strong>SafeLens analysis:</strong> {selectedPreset.explanation}
            </p>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="section-block">
        <div className="section-heading">
          <Badge tone="low">How SafeLens works</Badge>
          <h2>Simple steps to stay safer</h2>
        </div>
        <div className="steps-grid">
          <div className="info-card">
            <div className="step-number">01</div>
            <h3>Submit</h3>
            <p>Paste a message, copy a link, or upload a conversation screenshot.</p>
          </div>
          <div className="info-card">
            <div className="step-number">02</div>
            <h3>Analyze</h3>
            <p>SafeLens scans for indicators of transaction tricks, urgency, and identity spoofing.</p>
          </div>
          <div className="info-card">
            <div className="step-number">03</div>
            <h3>Protect</h3>
            <p>Receive clear score breakdowns and steps to report scams safely.</p>
          </div>
        </div>
      </section>

      {/* Ghanaian User Testimonials */}
      <section className="section-block testimonials-section">
        <div className="section-heading">
          <Badge tone="neutral">Testimonials</Badge>
          <h2>Safeguarding Ghanaian Wallets</h2>
        </div>
        <div className="feature-grid">
          <div className="info-card testimonial-card">
            <p>&ldquo;SafeLens flagged a wrong transfer SMS I got. Saved me from sending 500 GHS back to a scammer. Brilliant app!&rdquo;</p>
            <div className="testimonial-user">
              <div className="testimonial-avatar">EK</div>
              <div>
                <strong>Emmanuel K.</strong>
                <p style={{ margin: 0, fontSize: '0.8rem' }}>Accra, Ghana</p>
              </div>
            </div>
          </div>
          <div className="info-card testimonial-card">
            <p>&ldquo;I uploaded a screenshot of a remote job offer charging registration fees. SafeLens showed me 89% risk. Extremely helpful.&rdquo;</p>
            <div className="testimonial-user">
              <div className="testimonial-avatar">AA</div>
              <div>
                <strong>Abena A.</strong>
                <p style={{ margin: 0, fontSize: '0.8rem' }}>Kumasi, Ghana</p>
              </div>
            </div>
          </div>
          <div className="info-card testimonial-card">
            <p>&ldquo;The link scanning told me a promotional raffle was fake before I logged in. SafeLens is a must-have tool for everyone.&rdquo;</p>
            <div className="testimonial-user">
              <div className="testimonial-avatar">KB</div>
              <div>
                <strong>Kofi B.</strong>
                <p style={{ margin: 0, fontSize: '0.8rem' }}>Takoradi, Ghana</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="faq-container">
        <div className="section-heading">
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="faq-list">
          {FAQs.map((faq, index) => (
            <div className="faq-item" key={index}>
              <button className="faq-question" onClick={() => toggleFAQ(index)}>
                <span>{faq.question}</span>
                <span>{activeFAQ === index ? '−' : '+'}</span>
              </button>
              {activeFAQ === index && (
                <div className="faq-answer animate-fade-in">
                  <p style={{ margin: 0 }}>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </PageContainer>
  )
}
