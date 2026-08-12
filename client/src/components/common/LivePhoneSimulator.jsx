import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

// Animated Phone Demos Data - Realistic Scams & Phishing Links
export const ANIMATED_DEMOS = [
  {
    id: 1,
    shortName: 'MoMo Refund Fraud',
    senderNumber: '+233 54 981 0293',
    incomingMsg: 'Dear customer, your account has been credited GHS 650.00 in error by Kwabena. Please refund via *170# immediately or your MoMo wallet will be suspended within 2 hours.',
    outgoingMsg: 'Nice try! I just checked my real balance via *170# and no funds were added. Official MTNMoMo messages do not come from regular mobile numbers. Reporting this to 1917.',
    shieldRule: 'Rule Verified: Always check balance via *170# or *110# before sending any refund.',
  },
  {
    id: 2,
    shortName: 'WhatsApp Free Data Link',
    senderNumber: 'WhatsApp Group Admin',
    incomingMsg: 'MTN 50th Anniversary Giveaway! Claim your Free 10GB Data & 500 GHS airtime voucher now. Click here to activate: http://mtn-free-promo-gh.xyz/claim',
    outgoingMsg: 'I scanned this link with SafeLens AI and it leads to a phishing site (.xyz). Official network promos only use mtn.com.gh. Blocked!',
    shieldRule: 'Rule Verified: Never click .xyz or .top promo links. Always scan with SafeLens first.',
  },
  {
    id: 3,
    shortName: 'Remote Job Upfront Fee',
    senderNumber: 'HR_Global_Recruiter',
    incomingMsg: 'Congratulations! You have been selected for a Data Entry Remote Job paying GHS 3,500 monthly. Send GHS 80 via MoMo for your staff ID card to begin.',
    outgoingMsg: 'Legitimate companies pay their staff — they never demand Mobile Money payments for job interviews or ID cards. Reporting to 292.',
    shieldRule: 'Rule Verified: Never pay money to get a job offer in Ghana.',
  },
  {
    id: 4,
    shortName: 'Bank Account Suspension Link',
    senderNumber: '+233 20 449 1102',
    incomingMsg: 'Bank Security Alert: Your bank account will be frozen within 24hrs due to missing Ghana Card KYC. Update your account PIN now at http://ecobank-kyc-update.top',
    outgoingMsg: 'Ghanaian banks never ask customers to type account PINs on external links. I am calling my branch manager directly.',
    shieldRule: 'Rule Verified: Never type banking PINs or credentials on third-party link forms.',
  },
  {
    id: 5,
    shortName: 'Online Marketplace Deposit Scam',
    senderNumber: 'Tonaton_Seller_Accra',
    incomingMsg: 'iPhone 14 Pro for sale in East Legon for GHS 2,800! Send GHS 300 MoMo dispatch fee before delivery rider leaves shop.',
    outgoingMsg: 'Pay-on-delivery or physical inspection in public only. I do not pay upfront Mobile Money deposits to unverified online sellers.',
    shieldRule: 'Rule Verified: Always inspect marketplace items in person before sending money.',
  },
  {
    id: 6,
    shortName: 'Emergency Hospital Call Panic',
    senderNumber: '+233 24 109 8831',
    incomingMsg: 'URGENT: Your family member was involved in an accident near Korle Bu. Send GHS 1,500 MoMo immediately to Dr. Mensah for emergency surgery.',
    outgoingMsg: 'Taking a breath first. Calling my family member directly on their known personal phone number to confirm their safety.',
    shieldRule: 'Rule Verified: Hang up and call your relative directly on their private number.',
  }
]

export default function LivePhoneSimulator() {
  const [selectedDemoIdx, setSelectedDemoIdx] = useState(0)
  const [animStep, setAnimStep] = useState(0) // 0: ring, 1: fake msg, 2: typing, 3: safe reply sent & shield verified
  const [isAnimPlaying, setIsAnimPlaying] = useState(true)
  const chatBoxRef = useRef(null)

  const activeDemo = ANIMATED_DEMOS[selectedDemoIdx]

  // Auto-scroll chat box when new messages pop in
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }
  }, [animStep, selectedDemoIdx])

  // Animation timeline control - Auto-cycles through all 6 scam demos
  useEffect(() => {
    if (!isAnimPlaying) return

    let timer
    if (animStep === 0) {
      timer = setTimeout(() => setAnimStep(1), 700)
    } else if (animStep === 1) {
      timer = setTimeout(() => setAnimStep(2), 2200)
    } else if (animStep === 2) {
      timer = setTimeout(() => setAnimStep(3), 1600)
    } else if (animStep === 3) {
      timer = setTimeout(() => {
        setAnimStep(0)
        setSelectedDemoIdx((prev) => (prev + 1) % ANIMATED_DEMOS.length)
      }, 4500)
    }

    return () => clearTimeout(timer)
  }, [animStep, isAnimPlaying, selectedDemoIdx])

  return (
    <section id="demo" style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '24px', padding: '1.8rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 1.6rem auto' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 850, color: 'var(--primary)', background: 'rgba(230, 60, 28, 0.12)', padding: '0.18rem 0.6rem', borderRadius: '999px' }}>
          LIVE MOBILE PHONE SIMULATION
        </span>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0.35rem 0 0.25rem 0', color: 'var(--text)' }}>
          Watch Fake Messages Arrive &amp; Safe Responses Sent
        </h2>
        <p style={{ fontSize: '0.86rem', color: 'var(--muted)', margin: 0 }}>
          See how a scam lure is received on a phone and watch the safe human defense response sent back.
        </p>
      </div>

      {/* Demo Selector Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.6rem' }}>
        {ANIMATED_DEMOS.map((demo, idx) => (
          <button
            key={demo.id}
            type="button"
            onClick={() => {
              setSelectedDemoIdx(idx)
              setAnimStep(0)
            }}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: selectedDemoIdx === idx ? 850 : 700,
              cursor: 'pointer',
              border: selectedDemoIdx === idx ? '1px solid var(--primary)' : '1px solid var(--border)',
              background: selectedDemoIdx === idx ? 'var(--primary)' : 'var(--surface)',
              color: selectedDemoIdx === idx ? '#ffffff' : 'var(--text)',
              transition: 'all 0.15s ease'
            }}
          >
            Demo #{idx + 1}: {demo.shortName}
          </button>
        ))}
      </div>

      {/* Phone Frame and Controls Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.6rem', alignItems: 'stretch' }}>
        
        {/* Fixed-Height Phone Container Frame */}
        <div
          style={{
            background: '#0f172a',
            border: '4px solid #334155',
            borderRadius: '32px',
            padding: '1.2rem',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
            maxWidth: '380px',
            height: '470px',
            margin: '0 auto',
            width: '100%',
            color: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            boxSizing: 'border-box'
          }}
          className={animStep === 0 ? 'animate-phone-ring' : ''}
        >
          <div>
            {/* Notch */}
            <div style={{ width: '120px', height: '16px', background: '#334155', borderRadius: '0 0 12px 12px', margin: '-1.2rem auto 0.8rem auto' }} />

            {/* Status Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 800 }}>MTN GH 5G</span>
              <span>10:42 AM</span>
              <span>100%</span>
            </div>

            {/* Sender Info Bar */}
            <div style={{ background: '#1e293b', padding: '0.55rem 0.8rem', borderRadius: '10px', marginBottom: '0.75rem', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.66rem', fontWeight: 800, color: 'var(--danger)', textTransform: 'uppercase', display: 'block' }}>
                  UNVERIFIED SENDER
                </span>
                <strong style={{ fontSize: '0.84rem', color: '#ffffff' }}>
                  {activeDemo.senderNumber}
                </strong>
              </div>
              <span style={{ fontSize: '0.68rem', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '0.12rem 0.45rem', borderRadius: '999px', fontWeight: 800 }}>
                SUSPECTED SCAM
              </span>
            </div>

            {/* Chat Conversation Box with Fixed Height Scroll */}
            <div ref={chatBoxRef} style={{ height: '310px', overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: '0.65rem', paddingRight: '0.2rem' }}>
              
              {/* Step 0: Incoming Ringing */}
              {animStep === 0 && (
                <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#94a3b8', fontSize: '0.8rem' }}>
                  Incoming message alert arriving...
                </div>
              )}

              {/* Step >= 1: Fake Message Bubble */}
              {animStep >= 1 && (
                <div className="animate-bubble-pop" style={{ background: '#1e293b', border: '1px solid #334155', padding: '0.75rem 0.85rem', borderRadius: '12px 12px 12px 2px', maxWidth: '90%', alignSelf: 'flex-start' }}>
                  <span style={{ fontSize: '0.66rem', color: '#f87171', fontWeight: 800, display: 'block', marginBottom: '0.15rem' }}>
                    INCOMING FAKE SCAM SMS:
                  </span>
                  <p style={{ fontSize: '0.78rem', color: '#f8fafc', margin: 0, fontFamily: 'monospace', lineHeight: 1.45 }}>
                    &ldquo;{activeDemo.incomingMsg}&rdquo;
                  </p>
                </div>
              )}

              {/* Step 2: Typing Response Indicator */}
              {animStep === 2 && (
                <div className="animate-bubble-pop" style={{ background: 'var(--primary)', padding: '0.5rem 0.8rem', borderRadius: '12px 12px 2px 12px', alignSelf: 'flex-end', fontSize: '0.74rem', color: '#ffffff', fontWeight: 700 }}>
                  Typing safe human response...
                </div>
              )}

              {/* Step 3: Outgoing Safe Response Bubble */}
              {animStep === 3 && (
                <div className="animate-bubble-pop" style={{ background: 'var(--primary)', padding: '0.75rem 0.85rem', borderRadius: '12px 12px 2px 12px', maxWidth: '90%', alignSelf: 'flex-end' }}>
                  <span style={{ fontSize: '0.66rem', color: '#ffffff', fontWeight: 850, opacity: 0.9, display: 'block', marginBottom: '0.15rem' }}>
                    ✓ YOUR SAFE DEFENSE RESPONSE:
                  </span>
                  <p style={{ fontSize: '0.78rem', color: '#ffffff', margin: 0, lineHeight: 1.45, fontWeight: 600 }}>
                    &ldquo;{activeDemo.outgoingMsg}&rdquo;
                  </p>
                </div>
              )}

              {/* Step 3 Verification Notice Banner */}
              {animStep === 3 && (
                <div className="animate-shield-pulse" style={{ background: 'rgba(16, 185, 129, 0.18)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '0.6rem 0.75rem', borderRadius: '10px', textAlign: 'center', marginTop: '0.4rem', boxSizing: 'border-box' }}>
                  <strong style={{ display: 'block', fontSize: '0.76rem', color: '#34d399', marginBottom: '2px' }}>
                    SAFE HUMAN DEFENSE CONFIRMED
                  </strong>
                  <span style={{ fontSize: '0.7rem', color: '#f8fafc', lineHeight: 1.35, display: 'block' }}>
                    {activeDemo.shieldRule}
                  </span>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Right Side: Demo Breakdown & Timeline */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '1.4rem', minHeight: '470px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', background: 'rgba(230, 60, 28, 0.12)', padding: '0.15rem 0.55rem', borderRadius: '999px' }}>
                ANIMATION STEP {animStep + 1} OF 4
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 850, margin: '0.3rem 0 0.2rem 0', color: 'var(--text)' }}>
                {activeDemo.shortName}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
                Watch the timeline above to see how fraudsters attempt lures and how to respond safely.
              </p>
            </div>

            {/* Timeline Progress Bar */}
            <div style={{ background: 'var(--surface-alt)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--border)', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.4rem' }}>
                <span>1. Fake SMS Received</span>
                <span>2. Type Response</span>
                <span>3. Safe Reply Sent</span>
              </div>
              <div style={{ width: '100%', height: '5px', background: 'var(--border)', borderRadius: '999px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: 'var(--primary)',
                    width: animStep === 0 ? '15%' : animStep === 1 ? '45%' : animStep === 2 ? '75%' : '100%',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>
            </div>

            {/* Dynamic Step Breakdown Educational Box */}
            <div style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.9rem', marginBottom: '1rem' }}>
              <strong style={{ display: 'block', fontSize: '0.76rem', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.3rem', letterSpacing: '0.04em' }}>
                {animStep === 0 && 'Step 1: Incoming Scam Lure'}
                {animStep === 1 && 'Step 2: Spotting the Threat'}
                {animStep === 2 && 'Step 3: Verification Protocol'}
                {animStep === 3 && 'Step 4: Safe Defense Action'}
              </strong>

              <p style={{ fontSize: '0.82rem', color: 'var(--text)', margin: '0 0 0.6rem 0', lineHeight: 1.5 }}>
                {animStep === 0 && 'Scammers send crafted messages to induce panic so you act quickly without checking details.'}
                {animStep === 1 && 'Notice the sender is an unverified 10-digit phone number, not an official operator header like MTNMoMo.'}
                {animStep === 2 && 'Before responding, pause and verify your actual balance directly via USSD (*170# or *110#).'}
                {animStep === 3 && 'Send a firm, clear refusal confirming you verified your balance and report the phone number.'}
              </p>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--muted)', display: 'block', lineHeight: 1.4 }}>
                  • <strong>Why this works:</strong> Taking 30 seconds to verify breaks the scammer&rsquo;s high-pressure psychological trap.
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--muted)', display: 'block', lineHeight: 1.4 }}>
                  • <strong>Official Standard:</strong> Telecom agents never ask for money transfers or PINs over a phone call.
                </span>
              </div>
            </div>
          </div>

          {/* Controls and Quick Scanner Link */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => setIsAnimPlaying(!isAnimPlaying)}
                style={{
                  flex: 1,
                  padding: '0.55rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-alt)',
                  color: 'var(--text)',
                  fontWeight: 750,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                {isAnimPlaying ? 'Pause Demo' : 'Play Demo'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setAnimStep(0)
                  setSelectedDemoIdx((prev) => (prev + 1) % ANIMATED_DEMOS.length)
                }}
                style={{
                  padding: '0.55rem 0.9rem',
                  borderRadius: '8px',
                  border: '1px solid var(--primary)',
                  background: 'var(--primary)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Next Scam Demo &rarr;
              </button>
            </div>

            <Link
              to="/scanner"
              style={{
                display: 'block',
                textAlign: 'center',
                fontSize: '0.78rem',
                fontWeight: 800,
                color: 'var(--primary)',
                textDecoration: 'none',
                padding: '0.55rem',
                borderRadius: '8px',
                background: 'rgba(230, 60, 28, 0.08)',
                border: '1px solid rgba(230, 60, 28, 0.25)'
              }}
            >
              Got a suspicious SMS? Scan with SafeLens AI &rarr;
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
