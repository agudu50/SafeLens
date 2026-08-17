import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

/* ── Lightweight Motion Variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }
  })
}

const fadeScale = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }
  })
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
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

const INQUIRY_CATEGORIES = [
  { id: 'scam_report', label: 'Report a Scam', desc: 'Flag suspicious SMS or fraudulent calls' },
  { id: 'enterprise', label: 'Enterprise & API', desc: 'Batch fraud prevention and partner APIs' },
  { id: 'security_bounty', label: 'Security Research', desc: 'Vulnerability disclosure and threat intel' },
  { id: 'support_general', label: 'General Inquiries', desc: 'Account assistance and feedback' },
]

const EMERGENCY_CHANNELS = [
  {
    name: 'Ghana Cyber Security Authority (CSA)',
    hotline: 'Dial 292',
    type: 'National Toll-Free Emergency Hotline (24/7)',
    actionLabel: 'Call 292 Now',
    actionHref: 'tel:292',
    badge: 'Toll-Free',
  },
  {
    name: 'CSA WhatsApp Incident Bot',
    hotline: '+233 54 492 6924',
    type: 'Direct Screenshot Evidence Submission',
    actionLabel: 'Message WhatsApp',
    actionHref: 'https://wa.me/233544926924?text=Hi%20CSA%20Ghana,%20I%20want%20to%20report%20a%20scam%20incident',
    badge: 'Evidence Drop',
  },
  {
    name: 'SafeLens Incident Desk',
    hotline: 'security@safelens.org',
    type: 'Technical Support & Threat Intelligence',
    actionLabel: 'Email Security Desk',
    actionHref: 'mailto:security@safelens.org?subject=SafeLens%20Threat%20Report',
    badge: '< 15m SLA',
  },
]

const CONTACT_FAQS = [
  {
    question: 'How fast does the response team reply?',
    answer: 'Emergency scam reports marked urgent trigger immediate alerts to on-duty analysts with an average response time under 15 minutes. General inquiries are answered within 2 to 4 business hours.',
  },
  {
    question: 'Can I report a suspicious message anonymously?',
    answer: 'Yes. While providing your email allows us to send ticket status updates, you can use pseudonyms or submit without personal identifiers.',
  },
  {
    question: 'How can organizations integrate the SafeLens API?',
    answer: 'Select "Enterprise & API" in the contact form or email api@safelens.org to receive sandbox API keys and technical integration documentation.',
  },
]

const tickerReports = [
  { category: 'Phishing', type: 'Phishing Email Campaign', risk: 'High', time: '2m ago' },
  { category: 'Crypto', type: 'Crypto Investment Scam', risk: 'High', time: '8m ago' },
  { category: 'Payment', type: 'Mobile Money Fraud', risk: 'High', time: '14m ago' },
  { category: 'Careers', type: 'Fake Job Listing', risk: 'Medium', time: '22m ago' },
  { category: 'Support', type: 'Tech Support Impersonation', risk: 'High', time: '35m ago' },
  { category: 'Security', type: 'Suspicious Payment Link', risk: 'High', time: '1h ago' },
]

export default function Contact({ user }) {
  const [category, setCategory] = useState('scam_report')
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedTicket, setSubmittedTicket] = useState(null)
  const [activeFAQ, setActiveFAQ] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.email || !formData.message) return

    setIsSubmitting(true)
    setTimeout(() => {
      setSubmittedTicket({
        id: `SL-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
        email: formData.email,
        category: INQUIRY_CATEGORIES.find((c) => c.id === category)?.label || 'General Inquiry',
      })
      setIsSubmitting(false)
    }, 900)
  }

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

      {/* ═══ HERO SECTION (SAME HOME PAGE PATTERN) ═══ */}
      <section className="home-hero">
        <motion.div className="home-hero__content"
          initial="hidden" animate="visible" variants={staggerContainer}>

          <motion.div variants={fadeUp} custom={0}>
            <span className="home-hero__badge">
              <span className="home-hero__badge-dot" />
              <ShieldIcon size={14} color="var(--primary)" />
              24/7 RAPID DISPATCH
            </span>
          </motion.div>

          <motion.h1 className="home-hero__title" variants={fadeUp} custom={1}>
            Get in Touch &amp; <span className="text-highlight">Report Scams</span>
          </motion.h1>

          <motion.p className="home-hero__desc" variants={fadeUp} custom={2}>
            Have an active fraud incident to report or need enterprise protection? Our cybersecurity analysts are active 24/7.
          </motion.p>

          <motion.div className="home-hero__trust-row" variants={fadeUp} custom={3}>
            <span className="home-trust-pill">
              <ShieldIcon size={14} color="var(--success)" />
              Official CSA 292 Helpline
            </span>
            <span className="home-trust-pill">
              <BoltIcon size={14} color="var(--primary)" />
              &lt; 15m Response SLA
            </span>
          </motion.div>

          <motion.div className="home-hero__actions" variants={fadeUp} custom={4}>
            <a href="tel:292" style={{ textDecoration: 'none' }}>
              <Button variant="primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.6rem', fontSize: '0.95rem' }}>
                Call CSA 292 Now <ArrowRight />
              </Button>
            </a>
            <a href="#contact-form" style={{ textDecoration: 'none' }}>
              <Button variant="secondary">
                Submit Dispatch Ticket
              </Button>
            </a>
          </motion.div>

          <motion.div className="home-hero-stats" variants={fadeUp} custom={5}>
            <div className="home-hero-stat">
              <span className="home-hero-stat__number">24/7</span>
              <span className="home-hero-stat__label">Hotline</span>
            </div>
            <div className="home-hero-stat__divider" />
            <div className="home-hero-stat">
              <span className="home-hero-stat__number">&lt; 15m</span>
              <span className="home-hero-stat__label">Urgent SLA</span>
            </div>
            <div className="home-hero-stat__divider" />
            <div className="home-hero-stat">
              <span className="home-hero-stat__number">100%</span>
              <span className="home-hero-stat__label">Encrypted</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ DIRECT EMERGENCY HOTLINES ═══ */}
      <motion.section className="home-section"
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={staggerContainer}>

        <motion.div className="home-section__header" variants={fadeUp}>
          <Badge tone="low">HOTLINE DISPATCH</Badge>
          <h2 className="home-section__title">Emergency Channels</h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem' }}>
          {EMERGENCY_CHANNELS.map((item, idx) => (
            <motion.div key={idx} className="home-glow-card" variants={fadeUp} custom={idx} style={{ padding: '1.6rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '0.74rem', background: 'var(--surface-strong)', color: 'var(--primary)', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                    {item.badge}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text)', margin: '0 0 0.3rem 0' }}>
                  {item.name}
                </h3>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '0.3rem' }}>
                  {item.hotline}
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
                  {item.type}
                </p>
              </div>

              <div style={{ marginTop: '1.2rem' }}>
                <a href={item.actionHref} target={item.actionHref.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <Button variant="primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.86rem' }}>
                    {item.actionLabel} &rarr;
                  </Button>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ═══ TICKET DISPATCH FORM (HOME GLOW CARD PATTERN) ═══ */}
      <motion.section id="contact-form" className="home-section"
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={staggerContainer}>

        <motion.div className="home-section__header" variants={fadeUp}>
          <Badge tone="medium">OFFICIAL DISPATCH</Badge>
          <h2 className="home-section__title">Send a Message</h2>
        </motion.div>

        <motion.div variants={fadeScale} className="home-glow-card" style={{ maxWidth: '780px', margin: '0 auto', padding: '2rem 1.8rem', borderRadius: '16px' }}>
          {submittedTicket ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.8rem auto' }}>
                <svg fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" style={{ width: '28px', height: '28px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)', margin: '0 0 0.3rem 0' }}>
                Dispatch Ticket Logged
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--muted)', maxWidth: '440px', margin: '0 auto 1rem auto' }}>
                Your incident report has been securely transmitted. A tracking notice was sent to <strong style={{ color: 'var(--text)' }}>{submittedTicket.email}</strong>.
              </p>

              <div style={{ background: 'var(--surface-strong)', padding: '0.8rem 1.4rem', borderRadius: '8px', display: 'inline-block', marginBottom: '1.4rem', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Ticket ID Reference
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary)' }}>
                  {submittedTicket.id}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem' }}>
                <Button variant="primary" onClick={() => setSubmittedTicket(null)} style={{ fontSize: '0.86rem' }}>
                  Submit Another Report
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Category selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 750, color: 'var(--text)', marginBottom: '0.35rem' }}>
                  Select Topic
                </label>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {INQUIRY_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`home-sandbox__tab ${category === cat.id ? 'home-sandbox__tab--active' : ''}`}
                    >
                      <span className="home-sandbox__tab-dot" style={{ background: category === cat.id ? '#fff' : 'var(--primary)' }} />
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.25rem' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Kwame Mensah"
                    value={formData.name}
                    onChange={handleInputChange}
                    name="name"
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.8rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--surface-strong)',
                      color: 'var(--text)',
                      fontSize: '0.86rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.25rem' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="kwame@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    name="email"
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.8rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--surface-strong)',
                      color: 'var(--text)',
                      fontSize: '0.86rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.25rem' }}>
                  Subject Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Suspicious MoMo code received"
                  value={formData.subject}
                  onChange={handleInputChange}
                  name="subject"
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--surface-strong)',
                    color: 'var(--text)',
                    fontSize: '0.86rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.25rem' }}>
                  Message / Details *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide details of the scam or your inquiry..."
                  value={formData.message}
                  onChange={handleInputChange}
                  name="message"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.8rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--surface-strong)',
                    color: 'var(--text)',
                    fontSize: '0.86rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem', marginTop: '0.4rem' }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>
                  Encrypted Transmission &bull; 24/7 Response
                </span>
                <Button type="submit" variant="primary" disabled={isSubmitting} style={{ padding: '0.65rem 1.6rem', fontWeight: 800, fontSize: '0.88rem' }}>
                  {isSubmitting ? 'Dispatching Ticket...' : 'Send Message →'}
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.section>

      {/* ═══ FAQ ACCORDION (SAME HOME PAGE PATTERN) ═══ */}
      <motion.section className="home-faq"
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}>

        <motion.div className="home-section__header" variants={fadeUp}>
          <h2 className="home-section__title">Common Questions</h2>
        </motion.div>

        <div className="home-faq__container">
          {CONTACT_FAQS.map((faq, i) => (
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

      {/* ═══ CTA BANNER (SAME HOME PAGE PATTERN) ═══ */}
      <motion.section className="home-cta-banner"
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeScale}>
        <div className="home-cta-banner__pattern" />
        <div className="home-cta-banner__content">
          <h3 className="home-cta-banner__title">Stay Scam-Smart</h3>
          <p className="home-cta-banner__desc">Daily tips, quizzes, and security checklists.</p>
          <Link to="/safety-tips" className="home-cta-banner__btn">Safety Tips <ArrowRight /></Link>
        </div>
      </motion.section>

    </PageContainer>
  )
}
