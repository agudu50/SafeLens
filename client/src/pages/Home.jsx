import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

const testimonials = [
  {
    avatar: 'EK',
    name: 'Emmanuel K.',
    location: 'Accra, Ghana',
    quote: 'SafeLens flagged a wrong transfer SMS I got. Saved me from sending 500 GHS back to a scammer. Brilliant app!'
  },
  {
    avatar: 'AA',
    name: 'Abena A.',
    location: 'Kumasi, Ghana',
    quote: 'I uploaded a screenshot of a remote job offer charging registration fees. SafeLens showed me 89% risk. Extremely helpful.'
  },
  {
    avatar: 'KB',
    name: 'Kofi B.',
    location: 'Takoradi, Ghana',
    quote: 'The link scanning told me a promotional raffle was fake before I logged in. SafeLens is a must-have tool for everyone.'
  }
]

const presets = [
  {
    title: 'MoMo Wrong Transfer',
    description: 'Urgent mobile money refund request',
    content: 'Hello, I just sent 850 GHS to your number by mistake. Please send it back immediately to 0551234567. God bless you!',
    riskLevel: 'high',
    riskScore: 92,
    explanation: 'Requests immediate MoMo refund transfers to a different phone number. Legitimate wrong transactions are reversed by dialing telecom networks directly, not transferring back manually.',
  },
  {
    title: 'Fake Promotion Cashout',
    description: 'Fake MTN cashout authorization trick',
    content: 'MTN Ghana Customer Care: You have won 5,000 GHS in the MTN 50th Anniversary Promo. Dial *170# -> option 6 -> option 5 to approve your cashout.',
    riskLevel: 'high',
    riskScore: 97,
    explanation: 'Attempts to trick you into authorizing a "Cash Out" request on your Mobile Money wallet. Telecom operators never ask you to authorize withdrawals to receive rewards.',
  },
  {
    title: 'Unrealistic Job Offer',
    description: 'Upfront fee request for fake remote work',
    content: 'WORK FROM HOME! Earn 500 GHS daily by liking social media videos. Pay only 50 GHS registration fee to join. WhatsApp us now.',
    riskLevel: 'high',
    riskScore: 89,
    explanation: 'Requires an upfront registration fee for remote employment. Legit employers will never charge applicants money to apply or work.',
  },
  {
    title: 'Safe Message',
    description: 'Routine personal meetup instruction',
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
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerReports.length)
    }, 4500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index)
  }

  const toneMap = {
    low: 'low',
    medium: 'medium',
    high: 'high',
  }

  const locationIcon = (
    <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.9rem', height: '0.9rem', marginRight: '0.2rem', verticalAlign: 'middle', display: 'inline-block' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )

  return (
    <PageContainer>
      {/* Floating safety pulse rings & scam awareness tip chips */}
      <div className="cyber-floating-tips-layer" aria-hidden="true">
        {/* Human-centered safety pulse rings */}
        <div className="cyber-pulse-ring ring-1" />
        <div className="cyber-pulse-ring ring-2" />
        <div className="cyber-pulse-ring ring-3" />
        
        {/* Scam awareness floating safety tip chips with glassmorphic design */}
        <div className="cyber-node node-1"><span className="tip-pulse-dot" /><span className="tip-prefix">TIP</span> Never share OTPs</div>
        <div className="cyber-node node-2"><span className="tip-pulse-dot" /><span className="tip-prefix">TIP</span> MTN won&apos;t ask for PIN</div>
        <div className="cyber-node node-3"><span className="tip-pulse-dot" /><span className="tip-prefix">TIP</span> Dial operator to reverse</div>
        <div className="cyber-node node-4"><span className="tip-pulse-dot" /><span className="tip-prefix">TIP</span> No upfront job fees</div>
        <div className="cyber-node node-5"><span className="tip-pulse-dot" /><span className="tip-prefix">TIP</span> Report scams to 1917</div>
        <div className="cyber-node node-6"><span className="tip-pulse-dot" /><span className="tip-prefix">TIP</span> Verify sender IDs</div>
        <div className="cyber-node node-7"><span className="tip-pulse-dot" /><span className="tip-prefix">TIP</span> Reject cashout prompts</div>
        <div className="cyber-node node-8"><span className="tip-pulse-dot" /><span className="tip-prefix">TIP</span> Report links to 292</div>
      </div>

      {/* Live Scam Ticker */}
      <div className="ticker-container animate-slide-up">
        <span className="ticker-label">Live Tracker</span>
        <div className="ticker-wrap">
          <div className="ticker-content">
            {/* Primary run */}
            {tickerReports.map((report, idx) => (
              <span className="ticker-item" key={`orig-${idx}`}>
                {locationIcon}
                <strong style={{ color: 'var(--text)' }}>{report.region}</strong>
                <span style={{ color: 'var(--muted)' }}>:</span>
                <span>{report.type}</span>
                <span style={{ color: report.risk === 'High' ? 'var(--danger)' : 'var(--warning)', fontWeight: 700, fontSize: '0.78rem', background: report.risk === 'High' ? 'rgba(220, 38, 38, 0.1)' : 'rgba(217, 119, 6, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px', textTransform: 'uppercase', display: 'inline-block' }}>
                  {report.risk} Risk
                </span>
                <span className="ticker-time">{report.time}</span>
              </span>
            ))}
            {/* Cloned run for seamless marquee animation */}
            {tickerReports.map((report, idx) => (
              <span className="ticker-item" key={`clone-${idx}`}>
                {locationIcon}
                <strong style={{ color: 'var(--text)' }}>{report.region}</strong>
                <span style={{ color: 'var(--muted)' }}>:</span>
                <span>{report.type}</span>
                <span style={{ color: report.risk === 'High' ? 'var(--danger)' : 'var(--warning)', fontWeight: 700, fontSize: '0.78rem', background: report.risk === 'High' ? 'rgba(220, 38, 38, 0.1)' : 'rgba(217, 119, 6, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px', textTransform: 'uppercase', display: 'inline-block' }}>
                  {report.risk} Risk
                </span>
                <span className="ticker-time">{report.time}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="hero-card animate-slide-up delay-1">
        <div className="hero-copy">
          <Badge tone="neutral">AI-powered scam awareness</Badge>
          <h1>Not sure if it&apos;s a <span className="text-highlight">scam?</span></h1>
          <p className="hero-text">Let SafeLens take a closer look. We help people in Ghana and beyond review suspicious messages, links, and emails before they act.</p>
          <div className="hero-actions">
            <Button as={Link} to="/scan" variant="primary">Scan a Message</Button>
            <Button as={Link} to="/about" variant="secondary">Learn How It Works</Button>
          </div>
        </div>
        <div className="hero-panel">
          <div className="hero-panel__card animate-fade-in" key={tickerIndex}>
            <p className="hero-panel__label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
              <span className="live-pulse-dot" />
              Live local threat
            </p>
            <h3>{locationIcon} {tickerReports[tickerIndex].region}</h3>
            <p>{tickerReports[tickerIndex].type} reported. Risk level is high; remain vigilant.</p>
          </div>
        </div>
      </section>

      {/* Interactive Sandbox Simulator */}
      <section className="section-block animate-slide-up delay-2">
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
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{preset.title}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.1rem' }}>{preset.description}</span>
              </button>
            ))}
          </div>

          <div className="sandbox-preview animate-fade-in" key={selectedPreset.title}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <Badge tone={toneMap[selectedPreset.riskLevel]}>{selectedPreset.riskLevel.toUpperCase()} RISK</Badge>
              <strong style={{ fontSize: '1.25rem', color: 'var(--text)' }}>{selectedPreset.riskScore}% Scam Risk</strong>
            </div>

            <div className="sandbox-meter-track" style={{ height: '6px', background: 'var(--surface-strong)', borderRadius: '3px', overflow: 'hidden', marginBottom: '1.2rem' }}>
              <div style={{ width: `${selectedPreset.riskScore}%`, height: '100%', background: selectedPreset.riskLevel === 'high' ? 'var(--danger)' : selectedPreset.riskLevel === 'medium' ? 'var(--warning)' : 'var(--success)', transition: 'width 0.4s ease' }} />
            </div>

            <div className="chat-bubble-preview">
              &ldquo;{selectedPreset.content}&rdquo;
            </div>
            
            <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: '1.4' }}>
              <strong>SafeLens analysis:</strong> {selectedPreset.explanation}
            </p>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="section-block animate-slide-up delay-3">
        <div className="section-heading">
          <Badge tone="low">How SafeLens works</Badge>
          <h2>Simple steps to stay safer</h2>
        </div>
        <div className="steps-grid">
          <div className="info-card animate-slide-up delay-4">
            <div className="step-number">01</div>
            <h3>Submit</h3>
            <p>Paste a message, copy a link, or upload a conversation screenshot.</p>
          </div>
          <div className="info-card animate-slide-up delay-5">
            <div className="step-number">02</div>
            <h3>Analyze</h3>
            <p>SafeLens scans for indicators of transaction tricks, urgency, and identity spoofing.</p>
          </div>
          <div className="info-card animate-slide-up delay-6">
            <div className="step-number">03</div>
            <h3>Protect</h3>
            <p>Receive clear score breakdowns and steps to report scams safely.</p>
          </div>
        </div>
      </section>

      {/* Ghanaian User Testimonials */}
      <section className="section-block testimonials-section animate-slide-up delay-4">
        <div className="section-heading">
          <Badge tone="neutral">Testimonials</Badge>
          <h2>Safeguarding Ghanaian Wallets</h2>
        </div>
        
        <div className="testimonial-carousel-container">
          <button 
            type="button" 
            className="carousel-control-btn carousel-control-btn--prev"
            aria-label="Previous testimonial"
            onClick={() => setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
          >
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1.2rem', height: '1.2rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div className="info-card testimonial-card animate-fade-in" key={activeTestimonial} style={{ flex: 1, margin: 0 }}>
            <p>&ldquo;{testimonials[activeTestimonial].quote}&rdquo;</p>
            <div className="testimonial-user">
              <div className="testimonial-avatar">{testimonials[activeTestimonial].avatar}</div>
              <div>
                <strong>{testimonials[activeTestimonial].name}</strong>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)' }}>{testimonials[activeTestimonial].location}</p>
              </div>
            </div>
          </div>

          <button 
            type="button" 
            className="carousel-control-btn carousel-control-btn--next"
            aria-label="Next testimonial"
            onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
          >
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1.2rem', height: '1.2rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        <div className="carousel-indicators">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`carousel-dot ${activeTestimonial === idx ? 'carousel-dot--active' : ''}`}
              aria-label={`Go to testimonial ${idx + 1}`}
              onClick={() => setActiveTestimonial(idx)}
            />
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="faq-container animate-slide-up delay-5">
        <div className="section-heading">
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="faq-list">
          {FAQs.map((faq, index) => (
            <div className="faq-item" key={index}>
              <button className="faq-question" onClick={() => toggleFAQ(index)}>
                <span>{faq.question}</span>
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem', transform: activeFAQ === index ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease', color: activeFAQ === index ? 'var(--primary)' : 'var(--text)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
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
