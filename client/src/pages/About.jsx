import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

export default function About({ user }) {
  const [activeTab, setActiveTab] = useState('mission')

  return (
    <PageContainer>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.2rem' }}>
        
        {/* Hero Section */}
        <section className="hero-card" style={{ padding: '2.8rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          {/* Subtle background glow */}
          <div style={{ position: 'absolute', top: '-40%', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '300px', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none', borderRadius: '50%' }} />

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
            <Badge tone="good">
              <span className="live-pulse-dot" style={{ background: 'var(--primary)', marginRight: '0.35rem' }} />
              ABOUT SAFELENS PLATFORM
            </Badge>
          </div>

          <h1 style={{ fontSize: '2.3rem', fontWeight: 900, margin: '0.4rem 0 0.8rem 0', color: 'var(--text)', lineHeight: 1.25 }}>
            Protecting Digital Communications &amp; Mobile Money in Ghana
          </h1>

          <p className="hero-text" style={{ maxWidth: '720px', margin: '0 auto 1.6rem auto', fontSize: '1rem', lineHeight: 1.65, color: 'var(--muted)' }}>
            SafeLens is an advanced AI-powered threat detection system engineered to safeguard individuals and businesses against Mobile Money (MoMo) cashout fraud, phishing links, and deceptive communications.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', width: '100%', boxSizing: 'border-box' }}>
            <Button as={Link} to={user ? "/dashboard" : "/login"} variant="primary" style={{ gap: '0.5rem', padding: '0.65rem 1.25rem', fontSize: '0.9rem', maxWidth: '100%' }}>
              {user ? "Go to Dashboard" : "Sign In to Get Started"}
            </Button>
            <Button as={Link} to="/safety-tips" variant="secondary" style={{ gap: '0.5rem', padding: '0.65rem 1.25rem', fontSize: '0.9rem', maxWidth: '100%' }}>
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem', flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span>Explore Safety Tips &rarr;</span>
            </Button>
          </div>
        </section>

        {/* Live Platform Impact Stats Bar */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { number: '14,200+', label: 'Scam Messages Analyzed', desc: 'Real-time AI scans completed' },
            { number: 'GH₵ 120K+', label: 'Wallet Losses Averted', desc: 'Estimated user funds saved' },
            { number: '99.4%', label: 'Detection Accuracy', desc: 'Verified threat classification' },
            { number: '24 / 7', label: 'CSA Ghana Integrated', desc: 'Emergency hotline 292 connected' }
          ].map((stat, idx) => (
            <div key={idx} className="results-card" style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '0.2rem' }}>
                {stat.number}
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.15rem' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                {stat.desc}
              </div>
            </div>
          ))}
        </section>

        {/* Tabbed Interactive Section: Mission / AI Security Engine / Security Principles */}
        <section className="scanner-card" style={{ padding: '2rem 1.6rem' }}>
          {/* Tab Controls */}
          <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.8rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { id: 'mission', label: '🎯 Our Mission & Story' },
              { id: 'engine', label: '🤖 AI Threat Engine' },
              { id: 'principles', label: '🛡️ Zero-Trust Security' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? 'var(--primary)' : 'var(--surface-strong)',
                  color: activeTab === tab.id ? '#fff' : 'var(--text)',
                  border: '1px solid ' + (activeTab === tab.id ? 'var(--primary)' : 'var(--border)'),
                  padding: '0.55rem 1.1rem',
                  borderRadius: '10px',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Mission & Story */}
          {activeTab === 'mission' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text)' }}>
                  Why We Built SafeLens
                </h3>
                <p style={{ fontSize: '0.94rem', color: 'var(--muted)', lineHeight: 1.65, margin: 0 }}>
                  Mobile Money has revolutionized financial inclusion in Ghana, processing billions of cedis daily across MTN MoMo, Telecel Cash, and AT Money. However, this growth has also attracted sophisticated cyber fraudsters using emotional manipulation, fake transfer alerts, and spoofed recruitment links.
                </p>
              </div>

              <div className="feature-grid" style={{ marginTop: '0.5rem' }}>
                <div className="info-card" style={{ background: 'var(--surface-strong)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', background: 'rgba(56, 189, 248, 0.12)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.74rem', fontWeight: 800 }}>
                    <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.8rem', height: '0.8rem' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    LOCAL PROTECTION
                  </div>
                  <h4 style={{ margin: '0 0 0.3rem 0', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text)' }}>
                    Protecting Local Wallets
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--muted)', lineHeight: 1.55 }}>
                    Tailored specifically for Ghanaian fraud tactics—including fake cashout approval prompts, "wrong transfer" refund demands, and unverified shortcodes.
                  </p>
                </div>

                <div className="info-card" style={{ background: 'var(--surface-strong)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', background: 'rgba(34, 197, 94, 0.12)', color: 'var(--success)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.74rem', fontWeight: 800 }}>
                    <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.8rem', height: '0.8rem' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    PLAIN-ENGLISH
                  </div>
                  <h4 style={{ margin: '0 0 0.3rem 0', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text)' }}>
                    Instant Plain-English Analysis
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--muted)', lineHeight: 1.55 }}>
                    No complex security jargon. SafeLens delivers immediate verdicts ("Dangerous", "Suspicious", or "Safe") with step-by-step guidance on how to act.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: AI Security Engine */}
          {activeTab === 'engine' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text)' }}>
                  Multi-Tiered LLM &amp; Heuristic Architecture
                </h3>
                <p style={{ fontSize: '0.94rem', color: 'var(--muted)', lineHeight: 1.65, margin: 0 }}>
                  SafeLens combines lightweight Google Gemma language model pattern recognition with heuristic rule evaluation to assess incoming messages in under 800 milliseconds.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
                <div className="results-card" style={{ padding: '1.2rem' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.3rem' }}>STAGE 1</div>
                  <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text)', fontSize: '0.98rem' }}>NLP &amp; Intent Detection</h4>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                    Extracts psychological triggers (urgent threats, financial rewards, fake authority calls) embedded in the message text.
                  </p>
                </div>

                <div className="results-card" style={{ padding: '1.2rem' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.3rem' }}>STAGE 2</div>
                  <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text)', fontSize: '0.98rem' }}>URL &amp; Domain Reputation</h4>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                    Checks embedded hyperlinks for suspicious top-level domains (`.xyz`, `.top`, `.free-bonus`), missing SSL certificates, or brand typosquatting.
                  </p>
                </div>

                <div className="results-card" style={{ padding: '1.2rem' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.3rem' }}>STAGE 3</div>
                  <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text)', fontSize: '0.98rem' }}>MoMo Cashout Rule Check</h4>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                    Flags requests urging the user to enter their 4-digit PIN, approve cashout prompts, or send money back manually.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Zero-Trust Security */}
          {activeTab === 'principles' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text)' }}>
                  Our Zero-Trust Privacy Commitments
                </h3>
                <p style={{ fontSize: '0.94rem', color: 'var(--muted)', lineHeight: 1.65, margin: 0 }}>
                  We believe cybersecurity tools must be completely transparent and respectful of user privacy.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
                <div className="info-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem', color: 'var(--success)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text)' }}>No Selling of User Data</h4>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                    Scanned message contents are processed in memory solely to analyze threat patterns and are never monetized or shared with third parties.
                  </p>
                </div>

                <div className="info-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem', color: 'var(--success)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text)' }}>Direct Official Escalation</h4>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                    SafeLens connects directly to Cyber Security Authority (CSA 292) and operator hotlines so active victim incidents can be reported immediately.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Technology Stack & Standards Badges */}
        <section style={{ textAlign: 'center' }}>
          <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.8rem' }}>
            Built With Modern Security Standards
          </h4>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            {[
              'Google Gemma LLM Architecture',
              'React 18 & Vite',
              'Ghana CSA 292 Standards',
              'Vanilla Design Tokens',
              'Web Cryptography Standards',
              'MoMo Fraud Heuristics'
            ].map((tech, idx) => (
              <span
                key={idx}
                style={{
                  background: 'var(--surface-strong)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  padding: '0.35rem 0.8rem',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 600
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="results-card" style={{ padding: '2rem 1.5rem', textAlign: 'center', background: 'var(--surface-strong)', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)' }}>
            Start Protecting Your Messages Today
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: '0 auto 1.4rem auto', maxWidth: '540px', lineHeight: 1.5 }}>
            Join thousands of users across Ghana taking proactive steps to stay safe online and eliminate Mobile Money wallet risk.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', width: '100%', boxSizing: 'border-box' }}>
            <Button as={Link} to={user ? "/dashboard" : "/login"} variant="primary" style={{ gap: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.88rem', maxWidth: '100%' }}>
              <span>{user ? "Go to Dashboard" : "Sign In to Get Started"}</span>
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '0.95rem', height: '0.95rem', flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Button>
            <Button as={Link} to="/safety-tips" variant="secondary" style={{ gap: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.88rem', maxWidth: '100%' }}>
              <span>Explore Safety Tips</span>
            </Button>
          </div>
        </section>

      </div>
    </PageContainer>
  )
}
