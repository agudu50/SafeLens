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

export default function About({ user }) {
  const [activeTab, setActiveTab] = useState('mission')

  return (
    <PageContainer>

      {/* ═══ HERO SECTION (SAME HOME PAGE PATTERN) ═══ */}
      <section className="home-hero">
        <motion.div className="home-hero__content"
          initial="hidden" animate="visible" variants={staggerContainer}>

          <motion.div variants={fadeUp} custom={0}>
            <span className="home-hero__badge">
              <span className="home-hero__badge-dot" />
              <ShieldIcon size={14} color="var(--primary)" />
              ABOUT SAFELENS PLATFORM
            </span>
          </motion.div>

          <motion.h1 className="home-hero__title" variants={fadeUp} custom={1}>
            Defending Ghana&apos;s <span className="text-highlight">Digital Wallets</span>
          </motion.h1>

          <motion.p className="home-hero__desc" variants={fadeUp} custom={2}>
            Purpose-built AI threat detection engineered to eliminate Mobile Money fraud, unverified cashout traps, and phishing scams.
          </motion.p>

          <motion.div className="home-hero__trust-row" variants={fadeUp} custom={3}>
            <span className="home-trust-pill">
              <ShieldIcon size={14} color="var(--success)" />
              Ghana CSA 292 Integrated
            </span>
            <span className="home-trust-pill">
              <BoltIcon size={14} color="var(--primary)" />
              Sub-Second AI Detection
            </span>
          </motion.div>

          <motion.div className="home-hero__actions" variants={fadeUp} custom={4}>
            {user ? (
              <Button as={Link} to="/dashboard" variant="primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                Dashboard <ArrowRight />
              </Button>
            ) : (
              <Button as={Link} to="/login" variant="primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.6rem', fontSize: '0.95rem' }}>
                Get Started <ArrowRight />
              </Button>
            )}
            <Button as={Link} to="/safety-tips" variant="secondary">
              Safety Tips
            </Button>
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
              <span className="home-hero-stat__number">GH₵ 120K+</span>
              <span className="home-hero-stat__label">Protected</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ HOW SAFELENS WORKS TIMELINE ═══ */}
      <motion.section className="home-section"
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={staggerContainer}>

        <motion.div className="home-section__header" variants={fadeUp}>
          <Badge tone="low">DEFENSE PIPELINE</Badge>
          <h2 className="home-section__title">How SafeLens Protects You</h2>
        </motion.div>

        <div className="home-timeline">
          {[
            {
              num: '01',
              title: 'Multi-Modal Ingestion',
              desc: 'Analyze suspicious SMS, WhatsApp transcripts, emails, or uploaded screenshot images.',
              chips: ['SMS', 'WhatsApp', 'Screenshots'],
            },
            {
              num: '02',
              title: 'Neural Threat Analysis',
              desc: 'Sub-second NLP pattern recognition checks for fake cashout demands and emotional urgency.',
              chips: ['MoMo Heuristics', 'Phishing Links', 'Spoofed Numbers'],
            },
            {
              num: '03',
              title: 'Plain Guidance & Action',
              desc: 'Receive immediate risk breakdown, clear actionable advice, and one-click CSA 292 dispatch.',
              chips: ['Risk Score', 'What To Do', 'CSA 292 Dispatch'],
            },
          ].map((step, i) => (
            <motion.div className="home-timeline__step" key={step.num} variants={fadeUp} custom={i * 2}>
              <div className="home-timeline__node">
                <span className="home-timeline__node-num">{step.num}</span>
              </div>
              <div className="home-timeline__card">
                <h3 className="home-timeline__title">{step.title}</h3>
                <p className="home-timeline__desc">{step.desc}</p>
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

      {/* ═══ PILLARS & ARCHITECTURE (TABBED HOME GLOW CARDS) ═══ */}
      <motion.section className="home-section"
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={staggerContainer}>

        <motion.div className="home-section__header" variants={fadeUp}>
          <Badge tone="medium">CORE PRINCIPLES</Badge>
          <h2 className="home-section__title">Engineered for Trust</h2>
        </motion.div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {[
            { id: 'mission', label: 'Mission & Story' },
            { id: 'engine', label: 'AI Threat Engine' },
            { id: 'principles', label: 'Zero-Trust Security' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`home-sandbox__tab ${activeTab === tab.id ? 'home-sandbox__tab--active' : ''}`}
            >
              <span className="home-sandbox__tab-dot" style={{ background: activeTab === tab.id ? '#fff' : 'var(--primary)' }} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Cards */}
        {activeTab === 'mission' && (
          <motion.div
            key="mission"
            initial="hidden" animate="visible" variants={fadeScale}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}
          >
            <div className="home-glow-card" style={{ padding: '1.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <ShieldIcon size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
                  Ghana-First Protection
                </h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
                Mobile Money powers daily transactions across Ghana. SafeLens is calibrated specifically to recognize local fraud vectors like accidental reversal traps and unauthorized USSD prompt approvals.
              </p>
            </div>

            <div className="home-glow-card" style={{ padding: '1.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <BoltIcon size={18} color="var(--success)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
                  Plain-Language Clarity
                </h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
                No complex security jargon. SafeLens gives users immediate, unambiguous verdicts with exact steps on how to protect their money and report scammers.
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === 'engine' && (
          <motion.div
            key="engine"
            initial="hidden" animate="visible" variants={fadeScale}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}
          >
            <div className="home-glow-card" style={{ padding: '1.6rem', borderTop: '3px solid var(--primary)' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--primary)' }}>STAGE 01</span>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text)', margin: '0.3rem 0 0.4rem 0' }}>
                NLP Intent Recognition
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>
                Identifies psychological urgency hooks, fake bank alerts, and coercive financial manipulation.
              </p>
            </div>

            <div className="home-glow-card" style={{ padding: '1.6rem', borderTop: '3px solid var(--warning)' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--warning)' }}>STAGE 02</span>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text)', margin: '0.3rem 0 0.4rem 0' }}>
                Domain &amp; URL Verification
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>
                Validates embedded hyperlinks against global threat feeds, phishing registries, and typosquats.
              </p>
            </div>

            <div className="home-glow-card" style={{ padding: '1.6rem', borderTop: '3px solid var(--success)' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--success)' }}>STAGE 03</span>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text)', margin: '0.3rem 0 0.4rem 0' }}>
                MoMo Heuristics Check
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>
                Flags deceptive prompts urging users to share 4-digit PINs, reverse funds, or dial unknown codes.
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === 'principles' && (
          <motion.div
            key="principles"
            initial="hidden" animate="visible" variants={fadeScale}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}
          >
            <div className="home-glow-card" style={{ padding: '1.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <ShieldIcon size={18} color="var(--success)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
                  Zero Data Monetization
                </h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
                Message contents are evaluated in volatile memory solely to assess scam patterns. Your submissions are never sold or shared with commercial entities.
              </p>
            </div>

            <div className="home-glow-card" style={{ padding: '1.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <BoltIcon size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
                  Direct CSA Hotline Escalation
                </h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
                SafeLens is integrated with official incident pathways (National Cyber Security Authority 292), allowing users to report active fraudsters immediately.
              </p>
            </div>
          </motion.div>
        )}
      </motion.section>

      {/* ═══ CTA BANNER (SAME HOME PAGE PATTERN) ═══ */}
      <motion.section className="home-cta-banner"
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeScale}>
        <div className="home-cta-banner__pattern" />
        <div className="home-cta-banner__content">
          <h3 className="home-cta-banner__title">Start Protecting Your Communications</h3>
          <p className="home-cta-banner__desc">Join thousands across Ghana staying protected against fraud.</p>
          <Link to={user ? "/dashboard" : "/login"} className="home-cta-banner__btn">
            {user ? "Go to Dashboard" : "Get Started"} <ArrowRight />
          </Link>
        </div>
      </motion.section>

    </PageContainer>
  )
}
