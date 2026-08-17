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

const tickerReports = [
  { category: 'Phishing', type: 'Phishing Email Campaign', risk: 'High', time: '2m ago' },
  { category: 'Crypto', type: 'Crypto Investment Scam', risk: 'High', time: '8m ago' },
  { category: 'Payment', type: 'Mobile Money Fraud', risk: 'High', time: '14m ago' },
  { category: 'Careers', type: 'Fake Job Listing', risk: 'Medium', time: '22m ago' },
  { category: 'Support', type: 'Tech Support Impersonation', risk: 'High', time: '35m ago' },
  { category: 'Security', type: 'Suspicious Payment Link', risk: 'High', time: '1h ago' },
]

const WORKFLOW_STEPS = [
  {
    num: '01',
    title: 'Submission & Intake',
    desc: 'Paste suspicious text, forwarded SMS, email content, or upload message screenshots directly into SafeLens.',
    details: 'Our ingestion engine automatically extracts text, redacts sensitive personal identifiers (PII), and parses URLs for immediate evaluation.',
    chips: ['Text Input', 'Screenshots OCR', 'Automatic PII Redaction'],
  },
  {
    num: '02',
    title: 'Multi-Tier AI Analysis',
    desc: 'The threat classifier processes the message across three specialized neural layers in under 800 milliseconds.',
    details: 'Evaluates psychological panic hooks, cross-references embedded domains against phishing databases, and flags MoMo USSD reversal patterns.',
    chips: ['NLP Intent Parsing', 'Domain Reputation', 'MoMo Fraud Heuristics'],
  },
  {
    num: '03',
    title: 'Risk Scoring & Guidance',
    desc: 'SafeLens returns an unambiguous risk verdict (High, Medium, or Low) with step-by-step protective instructions.',
    details: 'You get a clear explanation of why the message is dangerous and exact instructions (e.g. "Do not approve prompt", "Block sender").',
    chips: ['0-100% Risk Score', 'Trigger Breakdown', 'What To Do Guide'],
  },
  {
    num: '04',
    title: 'Official Escalation',
    desc: 'One-click reporting to the Ghana Cyber Security Authority (CSA 292) and telecom fraud desks to block fraudsters.',
    details: 'Neutralized scam signatures are anonymously added to the community threat feed to protect thousands of other mobile users.',
    chips: ['CSA 292 Direct Dial', 'WhatsApp Evidence Drop', 'Threat Intel Feed'],
  },
]

const HOW_IT_WORKS_FAQS = [
  {
    question: 'How does SafeLens recognize Mobile Money fraud?',
    answer: 'SafeLens is trained on localized scam structures common in Ghana—such as fake "wrong transfer" refund demands, spoofed sender IDs, and fraudulent cashout prompts urging users to dial *170# or share OTP codes.',
  },
  {
    question: 'Are my scanned messages stored or read by humans?',
    answer: 'No. Submissions are processed entirely in volatile memory for threat parsing and deleted immediately after the risk verdict is generated. SafeLens enforces strict zero-trust privacy.',
  },
  {
    question: 'Can SafeLens scan images and screenshots?',
    answer: 'Yes. You can upload screenshots of suspicious WhatsApp chats, SMS threads, or emails. SafeLens uses optical character recognition (OCR) to extract the text and analyze it automatically.',
  },
]

export default function HowItWorks({ user }) {
  const [activeFAQ, setActiveFAQ] = useState(null)
  const [activeVector, setActiveVector] = useState('momo')

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

      {/* ═══ HERO SECTION (HOME PAGE DESIGN SYSTEM) ═══ */}
      <section className="home-hero">
        <motion.div className="home-hero__content"
          initial="hidden" animate="visible" variants={staggerContainer}>

          <motion.div variants={fadeUp} custom={0}>
            <span className="home-hero__badge">
              <span className="home-hero__badge-dot" />
              <ShieldIcon size={14} color="var(--primary)" />
              AI DETECTION WORKFLOW
            </span>
          </motion.div>

          <motion.h1 className="home-hero__title" variants={fadeUp} custom={1}>
            How SafeLens <span className="text-highlight">Stops Fraud</span>
          </motion.h1>

          <motion.p className="home-hero__desc" variants={fadeUp} custom={2}>
            From suspicious SMS alerts to fake USSD prompts, explore how our multi-tiered AI pipeline detects and neutralizes digital scams in sub-seconds.
          </motion.p>

          <motion.div className="home-hero__trust-row" variants={fadeUp} custom={3}>
            <span className="home-trust-pill">
              <BoltIcon size={14} color="var(--primary)" />
              &lt; 800ms Scan Speed
            </span>
            <span className="home-trust-pill">
              <ShieldIcon size={14} color="var(--success)" />
              99.4% Detection Accuracy
            </span>
          </motion.div>

          <motion.div className="home-hero__actions" variants={fadeUp} custom={4}>
            {user ? (
              <Button as={Link} to="/scan" variant="primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.6rem', fontSize: '0.95rem' }}>
                Scan a Message Now <ArrowRight />
              </Button>
            ) : (
              <Button as={Link} to="/login" variant="primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.6rem', fontSize: '0.95rem' }}>
                Get Started <ArrowRight />
              </Button>
            )}
            <Button as={Link} to="/safety-tips" variant="secondary">
              Explore Safety Tips
            </Button>
          </motion.div>

          <motion.div className="home-hero-stats" variants={fadeUp} custom={5}>
            <div className="home-hero-stat">
              <span className="home-hero-stat__number">&lt; 800ms</span>
              <span className="home-hero-stat__label">Response Time</span>
            </div>
            <div className="home-hero-stat__divider" />
            <div className="home-hero-stat">
              <span className="home-hero-stat__number">3-Tier</span>
              <span className="home-hero-stat__label">AI Pipeline</span>
            </div>
            <div className="home-hero-stat__divider" />
            <div className="home-hero-stat">
              <span className="home-hero-stat__number">100%</span>
              <span className="home-hero-stat__label">Zero-Trust</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ 4-STEP WORKFLOW TIMELINE ═══ */}
      <motion.section className="home-section"
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={staggerContainer}>

        <motion.div className="home-section__header" variants={fadeUp}>
          <Badge tone="low">STEP-BY-STEP PROCESS</Badge>
          <h2 className="home-section__title">The 4-Step Threat Neutralization Cycle</h2>
          <p style={{ maxWidth: '640px', margin: '0.4rem auto 0 auto', color: 'var(--muted)', fontSize: '0.92rem' }}>
            A transparent breakdown of how messages are parsed, evaluated, and resolved.
          </p>
        </motion.div>

        <div className="home-timeline">
          {WORKFLOW_STEPS.map((step, idx) => (
            <motion.div className="home-timeline__step" key={step.num} variants={fadeUp} custom={idx * 2}>
              <div className="home-timeline__node">
                <span className="home-timeline__node-num">{step.num}</span>
              </div>
              <div className="home-timeline__card">
                <h3 className="home-timeline__title">{step.title}</h3>
                <p className="home-timeline__desc">{step.desc}</p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.5, margin: '0.4rem 0 0.8rem 0' }}>
                  {step.details}
                </p>
                <div className="home-timeline__chips">
                  {step.chips.map((c) => (
                    <span key={c} className="home-timeline__chip">{c}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ═══ DETECTED THREAT VECTORS (HOME GLOW CARDS) ═══ */}
      <motion.section className="home-section"
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={staggerContainer}>

        <motion.div className="home-section__header" variants={fadeUp}>
          <Badge tone="medium">THREAT VECTORS</Badge>
          <h2 className="home-section__title">What SafeLens Detects</h2>
        </motion.div>

        {/* Vector selector tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {[
            { id: 'momo', label: 'MoMo Cashout Fraud' },
            { id: 'phishing', label: 'Credential Phishing' },
            { id: 'impersonation', label: 'Bank Impersonation' },
          ].map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setActiveVector(v.id)}
              className={`home-sandbox__tab ${activeVector === v.id ? 'home-sandbox__tab--active' : ''}`}
            >
              <span className="home-sandbox__tab-dot" style={{ background: activeVector === v.id ? '#fff' : 'var(--primary)' }} />
              {v.label}
            </button>
          ))}
        </div>

        {/* Dynamic Card Display */}
        <motion.div key={activeVector} initial="hidden" animate="visible" variants={fadeScale} style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div className="home-glow-card" style={{ padding: '2rem 1.8rem', borderRadius: '16px' }}>
            {activeVector === 'momo' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '0.74rem', background: 'var(--surface-strong)', color: 'var(--danger)', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                    HIGH RISK ATTACK
                  </span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
                    Fake Transfer &amp; USSD Approval Traps
                  </h3>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
                  Scammers send a fake SMS claiming they sent funds by mistake, then prompt you to enter your 4-digit PIN or approve a USSD prompt on *170# to &ldquo;reverse&rdquo; it. SafeLens detects these keywords and flags them before approval.
                </p>
                <div style={{ background: 'var(--surface-strong)', padding: '0.9rem 1.1rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '0.25rem' }}>
                    Defense Guidance
                  </div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--text)', lineHeight: 1.55 }}>
                    Never send funds back manually or dial USSD codes. Official reversals are handled only by telecom network operators.
                  </div>
                </div>
              </div>
            )}

            {activeVector === 'phishing' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '0.74rem', background: 'var(--surface-strong)', color: 'var(--primary)', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                    CREDENTIAL HARVESTING
                  </span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
                    Deceptive Account Suspension Links
                  </h3>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
                  Urgent emails or SMS claiming your banking, social, or wallet account will be deactivated unless you verify within 24 hours. Links redirect to cloned look-alike login forms.
                </p>
                <div style={{ background: 'var(--surface-strong)', padding: '0.9rem 1.1rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '0.25rem' }}>
                    Defense Guidance
                  </div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--text)', lineHeight: 1.55 }}>
                    Never click links in urgent messages. Go directly to official banking apps or websites.
                  </div>
                </div>
              </div>
            )}

            {activeVector === 'impersonation' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '0.74rem', background: 'var(--surface-strong)', color: 'var(--warning)', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                    SOCIAL ENGINEERING
                  </span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
                    Authority &amp; Recruiter Spoofing
                  </h3>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
                  Fraudsters posing as police officials, telecom support agents, or corporate recruiters demanding processing fees, upfront registration deposits, or security codes.
                </p>
                <div style={{ background: 'var(--surface-strong)', padding: '0.9rem 1.1rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '0.25rem' }}>
                    Defense Guidance
                  </div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--text)', lineHeight: 1.55 }}>
                    Legitimate employers and network providers never demand upfront payment via personal MoMo numbers.
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.section>

      {/* ═══ FAQ SECTION (HOME PAGE ACCORDION PATTERN) ═══ */}
      <motion.section className="home-faq"
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}>

        <motion.div className="home-section__header" variants={fadeUp}>
          <h2 className="home-section__title">Frequently Asked Questions</h2>
        </motion.div>

        <div className="home-faq__container">
          {HOW_IT_WORKS_FAQS.map((faq, i) => (
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

      {/* ═══ CTA BANNER ═══ */}
      <motion.section className="home-cta-banner"
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeScale}>
        <div className="home-cta-banner__pattern" />
        <div className="home-cta-banner__content">
          <h3 className="home-cta-banner__title">Ready to Scan a Suspicious Message?</h3>
          <p className="home-cta-banner__desc">Paste any SMS or email now to get an instant AI risk verdict.</p>
          <Link to={user ? "/scan" : "/login"} className="home-cta-banner__btn">
            {user ? "Scan Message" : "Get Started"} <ArrowRight />
          </Link>
        </div>
      </motion.section>

    </PageContainer>
  )
}
