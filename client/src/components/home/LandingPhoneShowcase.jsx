import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const LANDING_SCENARIOS = [
  {
    id: 'momo',
    title: 'Mobile Money Scam',
    riskScore: 94,
    riskLevel: 'CRITICAL',
    sender: '+233 54 981 0293',
    incomingMsg: 'Dear customer, your account was credited GHS 650.00 in error. Refund via *170# immediately or your wallet will be blocked.',
    detectedTriggers: ['Fake Deposit SMS', 'Urgency Pressure', 'Unverified Sender'],
    aiAnalysis: 'The sender uses an unverified mobile number to fake a deposit text, attempting to induce panic before you check your USSD balance.',
    recommendedAction: 'Do not send money. Dial *170# to verify your balance directly.',
  },
  {
    id: 'link',
    title: 'Phishing Link Broadcast',
    riskScore: 98,
    riskLevel: 'HIGH THREAT',
    sender: 'WhatsApp Broadcast Admin',
    incomingMsg: '🎉 MTN 50th Anniversary Giveaway! Claim Free 10GB Data & 500 GHS voucher: http://mtn-free-promo-gh.xyz/claim',
    detectedTriggers: ['Spoofed Domain (.xyz)', 'Unusual Offer', 'Credential Harvesting'],
    aiAnalysis: 'SafeLens AI detected a malicious domain extension (.xyz). Official network promos only use mtn.com.gh.',
    recommendedAction: 'Never click .xyz links. Block the sender immediately.',
  },
  {
    id: 'job',
    title: 'Fake Remote Job Recruiter',
    riskScore: 91,
    riskLevel: 'HIGH THREAT',
    sender: 'HR_Global_Recruiter',
    incomingMsg: 'Selected for Data Entry Job paying GHS 3,500 monthly! Send GHS 80 via MoMo for your staff ID card to begin.',
    detectedTriggers: ['Upfront Fee Demand', 'Unverified Employer', 'Advance-Fee Scam'],
    aiAnalysis: 'Legitimate employers pay employees — they never request Mobile Money transfers for job forms or staff cards.',
    recommendedAction: 'Report recruiter to Cyber Security Authority (292).',
  }
]

export default function LandingPhoneShowcase() {
  const navigate = useNavigate()
  const [activeIdx, setActiveIdx] = useState(0)
  const [isScanning, setIsScanning] = useState(false)
  const activeScenario = LANDING_SCENARIOS[activeIdx]

  useEffect(() => {
    setIsScanning(true)
    const t = setTimeout(() => setIsScanning(false), 900)
    return () => clearTimeout(t)
  }, [activeIdx])

  return (
    <section style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '24px', padding: '2rem 1.6rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 1.8rem auto' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 850, color: 'var(--primary)', background: 'rgba(230, 60, 28, 0.12)', padding: '0.18rem 0.6rem', borderRadius: '999px', border: '1px solid rgba(230, 60, 28, 0.25)' }}>
          🛡️ SAFELENS AI THREAT DEFENSE DEMO
        </span>
        <h2 style={{ fontSize: '1.65rem', fontWeight: 900, margin: '0.4rem 0 0.3rem 0', color: 'var(--text)' }}>
          Watch AI Scan Messages in Real-Time
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--muted)', margin: 0, lineHeight: 1.55 }}>
          Experience how SafeLens AI analyzes incoming SMS, detects hidden threat vectors, and protects your wallet on mobile.
        </p>
      </div>

      {/* Preset Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.8rem' }}>
        {LANDING_SCENARIOS.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveIdx(idx)}
            style={{
              padding: '0.45rem 0.95rem',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: activeIdx === idx ? 850 : 700,
              cursor: 'pointer',
              border: activeIdx === idx ? '1px solid var(--primary)' : '1px solid var(--border)',
              background: activeIdx === idx ? 'var(--primary)' : 'var(--surface)',
              color: activeIdx === idx ? '#ffffff' : 'var(--text)',
              transition: 'all 0.15s ease'
            }}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Phone Frame Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.8rem', alignItems: 'stretch' }}>
        
        {/* Mobile Phone Mockup */}
        <div style={{ background: '#0f172a', border: '4px solid #334155', borderRadius: '32px', padding: '1.2rem', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)', maxWidth: '380px', height: '470px', margin: '0 auto', width: '100%', color: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box', position: 'relative' }}>
          
          <div>
            {/* Notch */}
            <div style={{ width: '120px', height: '16px', background: '#334155', borderRadius: '0 0 12px 12px', margin: '-1.2rem auto 0.8rem auto' }} />

            {/* Status Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 800 }}>MTN GH 5G</span>
              <span>10:42 AM</span>
              <span>100% 🔋</span>
            </div>

            {/* AI Scan Header */}
            <div style={{ background: '#1e293b', padding: '0.6rem 0.85rem', borderRadius: '12px', marginBottom: '0.85rem', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>
                  INCOMING SMS FROM
                </span>
                <strong style={{ fontSize: '0.84rem', color: '#ffffff' }}>
                  {activeScenario.sender}
                </strong>
              </div>
              <span style={{ fontSize: '0.68rem', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: 800 }}>
                {activeScenario.riskLevel}
              </span>
            </div>

            {/* Message Card */}
            <div style={{ background: '#1e293b', border: '1px solid #334155', padding: '0.85rem 0.95rem', borderRadius: '12px', marginBottom: '0.85rem', position: 'relative', overflow: 'hidden' }}>
              
              {/* Scanning Beam Overlay */}
              {isScanning && (
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent, rgba(230, 60, 28, 0.35), transparent)', animation: 'pulseShield 0.8s ease-in-out infinite' }} />
              )}

              <span style={{ fontSize: '0.66rem', color: '#f87171', fontWeight: 800, display: 'block', marginBottom: '0.2rem' }}>
                SUSPECTED LURE TEXT:
              </span>
              <p style={{ fontSize: '0.8rem', color: '#f8fafc', margin: 0, fontFamily: 'monospace', lineHeight: 1.45 }}>
                &ldquo;{activeScenario.incomingMsg}&rdquo;
              </p>
            </div>
          </div>

          {/* AI Verdict Card inside Phone */}
          <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.35)', padding: '0.8rem 0.9rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 850, color: '#f87171', textTransform: 'uppercase' }}>
                SAFELENS VERDICT
              </span>
              <strong style={{ fontSize: '0.9rem', fontWeight: 900, color: '#f87171' }}>
                {activeScenario.riskScore}% RISK
              </strong>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {activeScenario.detectedTriggers.map((t) => (
                <span key={t} style={{ fontSize: '0.66rem', background: '#1e293b', color: '#f8fafc', padding: '0.12rem 0.45rem', borderRadius: '4px', border: '1px solid #334155', fontWeight: 700 }}>
                  ⚠️ {t}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: AI Analysis Breakdown */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '1.5rem', minHeight: '470px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
          <div>
            <div style={{ marginBottom: '1.1rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 850, color: 'var(--primary)', background: 'rgba(230, 60, 28, 0.12)', padding: '0.15rem 0.55rem', borderRadius: '999px' }}>
                SCENARIO ANALYZED
              </span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 850, margin: '0.35rem 0 0.2rem 0', color: 'var(--text)' }}>
                {activeScenario.title}
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
                See how SafeLens AI identifies threat vectors before you respond.
              </p>
            </div>

            {/* Breakdown Card */}
            <div style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1rem', marginBottom: '1.2rem' }}>
              <strong style={{ display: 'block', fontSize: '0.76rem', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.35rem', letterSpacing: '0.04em' }}>
                AI Threat Analysis Explanation
              </strong>
              <p style={{ fontSize: '0.84rem', color: 'var(--text)', margin: '0 0 0.8rem 0', lineHeight: 1.55 }}>
                {activeScenario.aiAnalysis}
              </p>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.6rem' }}>
                <strong style={{ display: 'block', fontSize: '0.74rem', color: 'var(--success)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                  Recommended Action:
                </strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--text)', fontWeight: 750, lineHeight: 1.45 }}>
                  {activeScenario.recommendedAction}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'instant' })
              navigate('/scanner')
            }}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'center',
              fontSize: '0.86rem',
              fontWeight: 850,
              color: '#ffffff',
              background: 'var(--primary)',
              border: '1px solid var(--primary)',
              padding: '0.7rem',
              borderRadius: '10px',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(230, 60, 28, 0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            Try SafeLens Scanner Now &rarr;
          </button>
        </div>

      </div>
    </section>
  )
}
