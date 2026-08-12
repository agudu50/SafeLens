import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

/* ── Data ── */

const testimonials = [
  {
    id: 'emmanuel', avatar: 'EK', name: 'Emmanuel K.', location: 'Accra, Ghana',
    incident: 'Mobile Money Scam Prevented', savings: '$120 Saved', rating: 5,
    quote: 'SafeLens flagged a wrong transfer SMS before I sent money back to a scammer. Incredibly fast and accurate.'
  },
  {
    id: 'sarah', avatar: 'SM', name: 'Sarah M.', location: 'Nairobi, Kenya',
    incident: 'Phishing Email Blocked', savings: 'Account Secured', rating: 5,
    quote: 'Pasted a suspicious bank email into SafeLens — it instantly identified it as a credential phishing attack. Saved my account.'
  },
  {
    id: 'james', avatar: 'JT', name: 'James T.', location: 'London, UK',
    incident: 'Investment Scam Detected', savings: '£2,000 Protected', rating: 5,
    quote: 'A "guaranteed returns" crypto scheme looked legit until SafeLens broke down every red flag. Incredibly grateful.'
  }
]

const presets = [
  {
    id: 'phishing', title: 'Phishing Email', riskLevel: 'high', riskScore: 95,
    threatCategory: 'Credential Phishing',
    vectorBreakdown: [
      { name: 'Phishing', percentage: 95, match: true },
      { name: 'Impersonation', percentage: 22, match: false },
      { name: 'Malware', percentage: 8, match: false },
    ],
    content: 'URGENT: Your bank account has been compromised. Click here to verify your identity immediately or your account will be suspended within 24 hours.',
    threatTags: ['Fake Urgency', 'Credential Harvesting', 'Spoofed Sender'],
    explanation: 'Classic phishing — creates panic to trick you into entering credentials on a fake site.',
    advice: 'Never click links in urgent emails. Go directly to your bank\'s official website or call them.'
  },
  {
    id: 'investment', title: 'Investment Scam', riskLevel: 'high', riskScore: 91,
    threatCategory: 'Financial Fraud',
    vectorBreakdown: [
      { name: 'Investment Fraud', percentage: 91, match: true },
      { name: 'Advance Fee', percentage: 18, match: false },
      { name: 'Impersonation', percentage: 9, match: false },
    ],
    content: 'Join our exclusive crypto trading group! Guaranteed 300% returns in 30 days. Minimum deposit $500. Limited spots available — act now!',
    threatTags: ['Guaranteed Returns', 'High Pressure', 'Unregulated Platform'],
    explanation: 'No legitimate investment guarantees returns. This is a classic Ponzi/advance-fee scheme.',
    advice: 'Reject any investment promising guaranteed returns. Verify platforms with your financial regulator.'
  },
  {
    id: 'momo', title: 'Mobile Money Fraud', riskLevel: 'high', riskScore: 92,
    threatCategory: 'Payment Fraud',
    vectorBreakdown: [
      { name: 'Payment Fraud', percentage: 92, match: true },
      { name: 'Social Engineering', percentage: 16, match: false },
      { name: 'Impersonation', percentage: 7, match: false },
    ],
    content: 'Hello, I just sent 850 GHS to your number by mistake. Please send it back immediately to 0551234567. God bless you!',
    threatTags: ['Financial Demand', 'Urgency', 'Manual Redirect'],
    explanation: 'Tricks victims into sending money under the guise of an accidental transfer.',
    advice: 'Do NOT send money back manually. Contact your payment provider to handle reversals officially.'
  },
  {
    id: 'safe', title: 'Safe Message', riskLevel: 'low', riskScore: 8,
    threatCategory: 'No Threat Detected',
    vectorBreakdown: [
      { name: 'Phishing', percentage: 2, match: false },
      { name: 'Fraud', percentage: 1, match: false },
      { name: 'Spam', percentage: 1, match: false },
    ],
    content: 'Hey, are we still meeting at the mall food court by 4 PM today? Let me know!',
    threatTags: ['Personal Context', 'No Financial Ask', 'No Links'],
    explanation: 'Conversational message with zero threat indicators.',
    advice: 'Message is verified safe. No scam indicators detected.'
  }
]

const FAQs = [
  { question: 'What types of scams can SafeLens detect?', answer: 'SafeLens detects phishing emails, investment fraud, fake job offers, mobile money fraud, tech support scams, impersonation attacks, and more.' },
  { question: 'Can SafeLens scan images and screenshots?', answer: 'Yes! Upload screenshots of suspicious chats, emails, or social media messages. SafeLens extracts and analyzes the text automatically.' },
  { question: 'How accurate is the AI detection?', answer: 'SafeLens achieves 99.4% accuracy across known scam patterns, continuously learning from new fraud techniques reported globally.' },
]

const tickerReports = [
  { category: 'Phishing', type: 'Phishing Email Campaign', risk: 'High', time: '2m ago' },
  { category: 'Crypto', type: 'Crypto Investment Scam', risk: 'High', time: '8m ago' },
  { category: 'Payment', type: 'Mobile Money Fraud', risk: 'High', time: '14m ago' },
  { category: 'Careers', type: 'Fake Job Listing', risk: 'Medium', time: '22m ago' },
  { category: 'Support', type: 'Tech Support Impersonation', risk: 'High', time: '35m ago' },
  { category: 'Security', type: 'Suspicious Payment Link', risk: 'High', time: '1h ago' },
]

const stepImages = {
  submit: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=500&h=350&fit=crop&q=80',
  analyze: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&h=350&fit=crop&q=80',
  protect: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500&h=350&fit=crop&q=80',
}

/* ── Hooks ── */

function useTypewriter(text, speed = 24, trigger = true) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    if (!trigger) { setDisplayed(''); return }
    setDisplayed('')
    let i = 0
    const timer = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(timer)
    }, speed)
    return () => clearInterval(timer)
  }, [text, trigger])
  return displayed
}

function useAnimatedCounter(end, duration = 1400, trigger = true) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!trigger) return
    const startTime = performance.now()
    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1)
      setVal(Math.round((1 - Math.pow(1 - progress, 3)) * end))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [end, trigger])
  return val
}

/* ── Framer Motion Variants ── */

const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
  visible: (i = 0) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }
  })
}

const fadeScale = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }
  })
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
}

/* ── Icons ── */

const ShieldIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: size, height: size }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
)

const BoltIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: size, height: size }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
)

const ArrowRight = ({ size = 15 }) => (
  <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: size, height: size }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
)

const LocationIcon = ({ size = 13 }) => (
  <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: size, height: size }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const StarIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem', color: 'var(--warning)' }}>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
)

/* ── Risk Ring ── */

function RiskRing({ score, isHigh, animate }) {
  const c = 2 * Math.PI * 45
  const offset = c - (score / 100) * c
  const color = isHigh ? 'var(--danger)' : 'var(--success)'
  return (
    <div className="home-risk-ring">
      <svg className="home-risk-ring__svg" viewBox="0 0 100 100">
        <circle className="home-risk-ring__track" cx="50" cy="50" r="45" />
        <circle className={`home-risk-ring__fill ${animate ? 'home-risk-ring__fill--animate' : ''}`}
          cx="50" cy="50" r="45" stroke={color} strokeDasharray={c} strokeDashoffset={animate ? offset : c} />
      </svg>
      <span className="home-risk-ring__label" style={{ color }}>{score}%</span>
    </div>
  )
}

/* ═══════════ COMPONENT ═══════════ */

export default function Home({ user }) {
  const [selectedPreset, setSelectedPreset] = useState(presets[0])
  const [activeFAQ, setActiveFAQ] = useState(null)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [sandboxInView, setSandboxInView] = useState(false)
  const [impactInView, setImpactInView] = useState(false)
  const sandboxRef = useRef(null)
  const impactRef = useRef(null)

  const typewriterText = useTypewriter(selectedPreset.content, 20, sandboxInView)
  const counterScans = useAnimatedCounter(14200, 1600, impactInView)
  const counterAccuracy = useAnimatedCounter(99, 1200, impactInView)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setSandboxInView(true) }, { threshold: 0.2 })
    if (sandboxRef.current) obs.observe(sandboxRef.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setImpactInView(true) }, { threshold: 0.2 })
    if (impactRef.current) obs.observe(impactRef.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 5500)
    return () => clearInterval(timer)
  }, [])

  const t = testimonials[activeTestimonial]
  const isHigh = selectedPreset.riskLevel === 'high'

  return (
    <PageContainer>

      {/* ═══ LIVE TICKER ═══ */}
      <div className="home-ticker">
        <span className="home-ticker__badge"><span className="home-ticker__badge-dot" />LIVE</span>
        <div className="home-ticker__wrap">
          <div className="home-ticker__content">
            {[...tickerReports, ...tickerReports].map((r, i) => (
              <span className="home-ticker__item" key={i}>
                <strong style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--muted)' }}>[{r.category}]</strong>
                <span>{r.type}</span>
                <span className={`home-ticker__risk home-ticker__risk--${r.risk === 'High' ? 'high' : 'medium'}`}>{r.risk}</span>
                <span className="home-ticker__time">{r.time}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ HERO ═══ */}
      <section className="home-hero">
        <div className="home-hero__shapes">
          <div className="home-hero__shape home-hero__shape--1" />
          <div className="home-hero__shape home-hero__shape--2" />
          <div className="home-hero__shape home-hero__shape--3" />
          <div className="home-hero__shape home-hero__shape--4" />
        </div>

        <motion.div className="home-hero__content"
          initial="hidden" animate="visible" variants={staggerContainer}>

          <motion.div variants={fadeUp} custom={0}>
            <span className="home-hero__badge">
              <span className="home-hero__badge-dot" />
              <ShieldIcon size={14} color="var(--primary)" />
              AI-POWERED SCAM DETECTION
            </span>
          </motion.div>

          <motion.h1 className="home-hero__title" variants={fadeUp} custom={1}>
            Not sure if it&apos;s a <span className="text-highlight">scam?</span>
          </motion.h1>

          <motion.p className="home-hero__desc" variants={fadeUp} custom={2}>
            Scan any suspicious message, email, link, or screenshot before you become a victim.
          </motion.p>

          <motion.div className="home-hero__trust-row" variants={fadeUp} custom={3}>
            <span className="home-trust-pill"><BoltIcon size={14} color="var(--primary)" />Instant AI Scan</span>
            <span className="home-trust-pill"><ShieldIcon size={14} color="var(--success)" />99% Detection Rate</span>
          </motion.div>

          <motion.div className="home-hero__actions" variants={fadeUp} custom={4}>
            {user ? (
              <>
                <Button as={Link} to="/dashboard" variant="primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  Dashboard <ArrowRight />
                </Button>
                <Button as={Link} to="/history" variant="secondary">Scan History</Button>
              </>
            ) : (
              <Button as={Link} to="/login" variant="primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.6rem', fontSize: '0.95rem' }}>
                Get Started <ArrowRight />
              </Button>
            )}
            <Button as={Link} to="/about" variant="secondary">How It Works</Button>
          </motion.div>

          <motion.div className="home-hero-stats" variants={fadeUp} custom={5}>
            <div className="home-hero-stat">
              <span className="home-hero-stat__number">14,200+</span>
              <span className="home-hero-stat__label">Scans</span>
            </div>
            <div className="home-hero-stat__divider" />
            <div className="home-hero-stat">
              <span className="home-hero-stat__number">99.4%</span>
              <span className="home-hero-stat__label">Accuracy</span>
            </div>
            <div className="home-hero-stat__divider" />
            <div className="home-hero-stat">
              <span className="home-hero-stat__number">$250K+</span>
              <span className="home-hero-stat__label">Protected</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ SANDBOX ═══ */}
      <motion.section className="home-section" ref={sandboxRef}
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={staggerContainer}>

        <motion.div className="home-section__header" variants={fadeUp}>
          <Badge tone="medium">Try It Now</Badge>
          <h2 className="home-section__title">Instant Threat Scanner</h2>
        </motion.div>

        <motion.div className="home-sandbox__tabs" variants={fadeUp} custom={1}>
          {presets.map((p) => (
            <button key={p.id} type="button" onClick={() => setSelectedPreset(p)}
              className={`home-sandbox__tab ${selectedPreset.id === p.id ? 'home-sandbox__tab--active' : ''}`}>
              <span className="home-sandbox__tab-dot"
                style={{ background: selectedPreset.id === p.id ? '#fff' : (p.riskLevel === 'high' ? 'var(--danger)' : 'var(--success)') }} />
              {p.title}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div className="home-glow-card home-sandbox__body" key={selectedPreset.id}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>

            <div className="home-sandbox__header">
              <div>
                <div className="home-sandbox__verdict">
                  <span className="live-pulse-badge"><span className="live-pulse-dot" />AI VERDICT</span>
                  <span className={`home-sandbox__verdict-badge home-sandbox__verdict-badge--${isHigh ? 'high' : 'low'}`}>
                    {selectedPreset.riskLevel.toUpperCase()}
                  </span>
                </div>
                <h3 style={{ margin: '0.3rem 0 0', fontSize: '1.3rem', fontWeight: 900 }}>{selectedPreset.title}</h3>
              </div>
              <RiskRing score={selectedPreset.riskScore} isHigh={isHigh} animate={sandboxInView} />
            </div>

            <div className="home-sandbox__grid">
              <div className="home-sandbox__cell">
                <span className="home-sandbox__cell-label">Message</span>
                <div className="home-typewriter">
                  &ldquo;{typewriterText}&rdquo;
                  {typewriterText.length < selectedPreset.content.length && <span className="home-typewriter__cursor" />}
                </div>
              </div>
              <div className="home-sandbox__cell">
                <span className="home-sandbox__cell-label">Risk Triggers</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {selectedPreset.threatTags.map(tag => (
                    <span key={tag} className={`home-threat-tag home-threat-tag--${isHigh ? 'high' : 'low'}`}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="home-sandbox__cell" style={{ marginBottom: '1.2rem' }}>
              <span className="home-sandbox__cell-label">Fraud Vectors</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem', marginTop: '0.3rem' }}>
                {selectedPreset.vectorBreakdown.map(v => (
                  <div key={v.name} className="home-vector-bar">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.73rem', fontWeight: 750, color: v.match ? 'var(--danger)' : 'var(--muted)' }}>
                      <span>{v.name}</span><span style={{ fontWeight: 900 }}>{v.percentage}%</span>
                    </div>
                    <div className="home-vector-bar__track">
                      <div className="home-vector-bar__fill" style={{ width: `${v.percentage}%`, background: v.match ? 'var(--danger)' : 'var(--border)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="home-sandbox__explain-grid">
              <div className="home-sandbox__explain-card">
                <div className="home-sandbox__explain-icon">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" strokeLinecap="round" /><circle cx="12" cy="8" r="1" fill="currentColor" /></svg>
                  Why It&apos;s Risky
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.5 }}>{selectedPreset.explanation}</p>
              </div>
              <div className="home-sandbox__explain-card">
                <div className="home-sandbox__explain-icon">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.2"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  What To Do
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.5, fontWeight: 700 }}>{selectedPreset.advice}</p>
              </div>
            </div>

            <div style={{ marginTop: '1.3rem', display: 'flex', justifyContent: 'flex-end' }}>
              <Button as={Link} to={user ? "/dashboard" : "/login"} variant="primary" style={{ fontSize: '0.86rem' }}>
                {user ? "Dashboard" : "Get Started"} →
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.section>

      {/* ═══ HOW IT WORKS ═══ */}
      <motion.section className="home-section"
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}>

        <motion.div className="home-section__header" variants={fadeUp}>
          <Badge tone="low">HOW IT WORKS</Badge>
          <h2 className="home-section__title">Three Simple Steps</h2>
        </motion.div>

        <div className="home-timeline">
          {[
            { num: '01', title: 'Submit', desc: 'Paste any text, email, link, or upload a screenshot.', img: stepImages.submit, chips: ['Emails', 'SMS', 'Links', 'Screenshots'] },
            { num: '02', title: 'Detect', desc: 'AI analyzes for fraud patterns across all scam types.', img: stepImages.analyze, chips: ['Phishing', 'Fraud', 'Social Engineering'] },
            { num: '03', title: 'Protect', desc: 'Get a risk score and clear safety guidance instantly.', img: stepImages.protect, chips: ['Risk Score', 'Safety Steps', 'Report'] },
          ].map((step, i) => (
            <motion.div className="home-timeline__step" key={step.num} variants={fadeUp} custom={i * 2}>
              <div className="home-timeline__node">
                <span className="home-timeline__node-num">{step.num}</span>
              </div>
              <div className="home-timeline__card">
                <div className="home-timeline__img">
                  <img src={step.img} alt={step.title} decoding="async" style={{ objectFit: 'cover' }} />
                </div>
                <h3 className="home-timeline__title">{step.title}</h3>
                <p className="home-timeline__desc">{step.desc}</p>
                <div className="home-timeline__chips">
                  {step.chips.map(c => <span key={c} className="home-timeline__chip">{c}</span>)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ═══ IMPACT STATS ═══ */}
      <motion.div className="home-impact" ref={impactRef}
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeScale}>
        <div className="home-impact__stat">
          <div className="home-impact__icon" style={{ background: 'rgba(230,60,28,0.1)' }}>
            <svg fill="none" stroke="var(--primary)" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: 22, height: 22 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
          </div>
          <span className="home-impact__number">$250K+</span>
          <span className="home-impact__label">Protected</span>
        </div>
        <div className="home-impact__divider" />
        <div className="home-impact__stat">
          <div className="home-impact__icon" style={{ background: 'rgba(59,130,246,0.1)' }}>
            <svg fill="none" stroke="#3b82f6" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: 22, height: 22 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
            </svg>
          </div>
          <span className="home-impact__number">{impactInView ? counterScans.toLocaleString() : '0'}+</span>
          <span className="home-impact__label">Scans</span>
        </div>
        <div className="home-impact__divider" />
        <div className="home-impact__stat">
          <div className="home-impact__icon" style={{ background: 'rgba(16,185,129,0.1)' }}>
            <ShieldIcon size={22} color="var(--success)" />
          </div>
          <span className="home-impact__number">{impactInView ? `${counterAccuracy}.4` : '0'}%</span>
          <span className="home-impact__label">Accuracy</span>
        </div>
      </motion.div>

      {/* ═══ TESTIMONIALS ═══ */}
      <motion.section className="home-testimonials"
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp}>

        <div className="home-section__header">
          <Badge tone="neutral">REVIEWS</Badge>
          <h2 className="home-section__title">Trusted Worldwide</h2>
        </div>

        <AnimatePresence mode="wait">
          <motion.div className="home-glow-card home-testimonial-card" key={t.id}
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>

            <div className="home-testimonial-card__quote-mark">&ldquo;</div>

            <div className="home-testimonial-tags">
              <span className="home-testimonial-tag home-testimonial-tag--verified">✓ VERIFIED</span>
              <span className="home-testimonial-tag home-testimonial-tag--incident">{t.incident}</span>
              <span className="home-testimonial-tag home-testimonial-tag--savings">{t.savings}</span>
            </div>

            <div className="home-testimonial-card__stars">
              {[...Array(t.rating)].map((_, i) => <StarIcon key={i} />)}
            </div>

            <p className="home-testimonial-card__text">&ldquo;{t.quote}&rdquo;</p>

            <div className="home-testimonial-card__user">
              <div className="home-testimonial-card__avatar">{t.avatar}</div>
              <div className="home-testimonial-card__meta">
                <span className="home-testimonial-card__name">{t.name}</span>
                <span className="home-testimonial-card__location"><LocationIcon size={11} />{t.location}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="home-carousel-controls">
          <button type="button" className="home-carousel-btn" onClick={() => setActiveTestimonial(p => p === 0 ? testimonials.length - 1 : p - 1)}>
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          </button>
          <div className="home-carousel-dots">
            {testimonials.map((_, i) => (
              <button key={i} type="button" className={`home-carousel-dot ${activeTestimonial === i ? 'home-carousel-dot--active' : ''}`} onClick={() => setActiveTestimonial(i)} />
            ))}
          </div>
          <button type="button" className="home-carousel-btn" onClick={() => setActiveTestimonial(p => (p + 1) % testimonials.length)}>
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </button>
        </div>
      </motion.section>

      {/* ═══ CTA ═══ */}
      <motion.section className="home-cta-banner"
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeScale}>
        <div className="home-cta-banner__pattern" />
        <div className="home-cta-banner__content">
          <h3 className="home-cta-banner__title">Stay Scam-Smart</h3>
          <p className="home-cta-banner__desc">Daily tips, quizzes, and security checklists.</p>
          <Link to="/safety-tips" className="home-cta-banner__btn">Safety Tips <ArrowRight /></Link>
        </div>
      </motion.section>

      {/* ═══ FAQ ═══ */}
      <motion.section className="home-faq"
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}>

        <motion.div className="home-section__header" variants={fadeUp}>
          <h2 className="home-section__title">FAQ</h2>
        </motion.div>

        <div className="home-faq__container">
          {FAQs.map((faq, i) => (
            <motion.div className="home-faq__item" key={i} variants={fadeUp} custom={i}>
              <button className="home-faq__question" onClick={() => setActiveFAQ(activeFAQ === i ? null : i)}>
                <span>{faq.question}</span>
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                  className={`home-faq__chevron ${activeFAQ === i ? 'home-faq__chevron--open' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              <div className={`home-faq__answer ${activeFAQ === i ? 'home-faq__answer--open' : ''}`}>
                <p>{faq.answer}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

    </PageContainer>
  )
}
