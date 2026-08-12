import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'

// Animated Phone Demos Data - Realistic Ghanaian Scams & Phishing Links
const ANIMATED_DEMOS = [
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

// Core Safety Rules - Simple, clear advice for everyday life in Ghana
const CORE_SAFETY_RULES = [
  {
    id: 'pin',
    title: 'Keep Your MoMo PIN Private',
    subtitle: 'Rule #1 for Mobile Money Users',
    description: 'No official agent from MTN, Telecel, or AT will ever ask for your 4-digit MoMo PIN over a phone call. If anyone asks for your PIN, end the call immediately.',
    actionText: 'Never share your PIN with anyone',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1.3rem', height: '1.3rem', color: 'var(--danger)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 00-2.25 2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    )
  },
  {
    id: 'balance',
    title: 'Verify Your Balance First',
    subtitle: 'Avoid Fake Refund Traps',
    description: 'Scammers send SMS text messages that look like official cash deposits, then call asking for a refund. Always dial *170# or *110# to confirm your balance before sending money.',
    actionText: 'Check balance via USSD before transferring',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1.3rem', height: '1.3rem', color: 'var(--warning)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    )
  },
  {
    id: 'lock',
    title: 'Lock Your WhatsApp Account',
    subtitle: 'Prevent Account Hijacking',
    description: 'Turn on 2-Step Verification inside WhatsApp Settings. Never forward or read out 6-digit SMS verification codes to anyone requesting them on the phone.',
    actionText: 'Enable 2-Step PIN in WhatsApp Settings',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1.3rem', height: '1.3rem', color: 'var(--primary)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    )
  },
  {
    id: 'links',
    title: 'Scan Links Before Tapping',
    subtitle: 'Protect Yourself from Phishing',
    description: 'Be cautious of WhatsApp links offering free 10GB data, anniversary gifts, or government grants. Official offers will only appear on official corporate websites.',
    actionText: 'Paste links into SafeLens Scanner',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1.3rem', height: '1.3rem', color: 'var(--success)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    )
  }
]

// Common Scams & Human Counter-Measures
const COMMON_SCAMS = [
  {
    id: 'momo-refund',
    category: 'Mobile Money',
    title: 'Fake Transfer Refund SMS',
    scamTactic: 'You get an SMS saying money was sent in error, followed by a frantic phone call asking you to refund it immediately.',
    humanSolution: 'Do not panic or send money back right away. Dial *170# (MTN) or *110# (Telecel/AT) to check your real account balance first.',
  },
  {
    id: 'job-fee',
    category: 'Job Offers',
    title: 'Upfront Registration Fee for Remote Jobs',
    scamTactic: 'A recruiter on WhatsApp offers a high-paying job but asks for GHS 50 - 200 via MoMo for "staff ID forms" or "medical checks".',
    humanSolution: 'Legitimate employers will never ask candidates to pay money via Mobile Money to get a job offer.',
  },
  {
    id: 'emergency-call',
    category: 'Impersonation',
    title: 'Urgent Hospital or Police Emergency Call',
    scamTactic: 'Someone calls claiming your child, sibling, or parent had an accident and urgently needs a deposit sent to a doctor.',
    humanSolution: 'Take a breath and call your family member directly on their personal phone number to confirm their safety first.',
  },
  {
    id: 'free-data',
    category: 'Web Links',
    title: 'WhatsApp Broadcast Free Data & Grant Links',
    scamTactic: 'Messages promising "MTN Anniversary Free 10GB Data" or "Youth Relief Grants" asking you to fill out your details.',
    humanSolution: 'Official telecom promotions only happen on official websites like mtn.com.gh. Unofficial `.xyz` or `.top` links are fake.',
  }
]

export default function SafetyTips({ user }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const chatBoxRef = useRef(null)

  // Animation Demo State
  const [selectedDemoIdx, setSelectedDemoIdx] = useState(0)
  const [animStep, setAnimStep] = useState(0) // 0: reset/ring, 1: fake msg, 2: typing, 3: safe reply sent & shield verified
  const [isAnimPlaying, setIsAnimPlaying] = useState(true)

  const activeDemo = ANIMATED_DEMOS[selectedDemoIdx]

  // Auto-scroll chat box when new messages pop in
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }
  }, [animStep, selectedDemoIdx])

  // Animation timeline control
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
      timer = setTimeout(() => setAnimStep(0), 4500)
    }

    return () => clearTimeout(timer)
  }, [animStep, isAnimPlaying, selectedDemoIdx])

  const filteredScams = activeCategory === 'All'
    ? COMMON_SCAMS
    : COMMON_SCAMS.filter(s => s.category === activeCategory)

  return (
    <PageContainer>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.2rem' }}>
        
        {/* Simple, Clean Hero Header */}
        <section
          style={{
            background: 'var(--surface-alt)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '2.5rem 1.8rem',
            textAlign: 'center'
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              SAFETY &amp; FRAUD PREVENTION GUIDE
            </span>
          </div>

          <h1 style={{ fontSize: '2.1rem', fontWeight: 900, margin: '0 0 0.6rem 0', color: 'var(--text)' }}>
            Stay Safe Online with Simple Daily Habits
          </h1>

          <p style={{ color: 'var(--muted)', fontSize: '0.96rem', maxWidth: '640px', margin: '0 auto 1.6rem auto', lineHeight: 1.6 }}>
            Cybersecurity doesn&rsquo;t need to be complicated. Learn how to protect your mobile money wallet, spot scam messages, and keep your family safe in Ghana.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
            <Button as={Link} to="/scanner" variant="primary" style={{ padding: '0.65rem 1.3rem', fontSize: '0.9rem' }}>
              Scan a Suspicious Message
            </Button>
            <Button as="a" href="#demo" variant="secondary" style={{ padding: '0.65rem 1.3rem', fontSize: '0.9rem' }}>
              Watch Live Phone Demo &darr;
            </Button>
          </div>
        </section>

        {/* Animated Mobile Phone Demo Section */}
        <section id="demo" style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '20px', padding: '1.8rem' }}>
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
                  <span>100% 🔋</span>
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

                  {/* Step 3 Verification Notice Banner (Flows naturally in chat) */}
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
                <div style={{ display: 'flex', gap: '0.5rem' }}>
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
                    onClick={() => setAnimStep(0)}
                    style={{
                      padding: '0.55rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid var(--primary)',
                      background: 'var(--primary)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    Replay Demo
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
                    padding: '0.45rem',
                    borderRadius: '8px',
                    background: 'rgba(230, 60, 28, 0.08)',
                    border: '1px solid rgba(230, 60, 28, 0.2)'
                  }}
                >
                  Got a suspicious SMS? Scan with SafeLens AI &rarr;
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* 4 Core Safety Rules Grid */}
        <section>
          <div style={{ marginBottom: '1.2rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 0 0.2rem 0', color: 'var(--text)' }}>
              4 Essential Safety Rules
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--muted)', margin: 0 }}>
              Simple habits to keep your accounts and funds secure every day.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.1rem' }}>
            {CORE_SAFETY_RULES.map((rule) => (
              <div
                key={rule.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '1.3rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--surface-alt)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      {rule.icon}
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)' }}>
                        {rule.subtitle}
                      </span>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text)' }}>
                        {rule.title}
                      </h3>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.86rem', color: 'var(--muted)', lineHeight: 1.55, margin: '0 0 1rem 0' }}>
                    {rule.description}
                  </p>
                </div>

                <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 750, color: 'var(--primary)' }}>
                    ✓ {rule.actionText}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Common Scams & How to Respond */}
        <section style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '20px', padding: '1.8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1.4rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 0 0.2rem 0', color: 'var(--text)' }}>
                Common Scams &amp; How to Respond
              </h2>
              <p style={{ fontSize: '0.86rem', color: 'var(--muted)', margin: 0 }}>
                Recognize common scam tactics and know the exact steps to take.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {['All', 'Mobile Money', 'Job Offers', 'Impersonation', 'Web Links'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '0.35rem 0.8rem',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                    fontWeight: activeCategory === cat ? 800 : 700,
                    cursor: 'pointer',
                    border: activeCategory === cat ? '1px solid var(--primary)' : '1px solid var(--border)',
                    background: activeCategory === cat ? 'var(--primary)' : 'var(--surface)',
                    color: activeCategory === cat ? '#ffffff' : 'var(--text)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.1rem' }}>
            {filteredScams.map((scam) => (
              <div
                key={scam.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '1.3rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary)', background: 'rgba(56, 189, 248, 0.12)', padding: '0.15rem 0.55rem', borderRadius: '6px', display: 'inline-block', marginBottom: '0.6rem' }}>
                    {scam.category}
                  </span>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 850, margin: '0 0 0.5rem 0', color: 'var(--text)' }}>
                    {scam.title}
                  </h3>

                  <div style={{ marginBottom: '0.9rem' }}>
                    <strong style={{ display: 'block', fontSize: '0.76rem', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                      The Scam Tactic:
                    </strong>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text)', margin: 0, lineHeight: 1.5 }}>
                      {scam.scamTactic}
                    </p>
                  </div>
                </div>

                <div style={{ background: 'var(--surface-alt)', padding: '0.75rem 0.9rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  <strong style={{ display: 'block', fontSize: '0.74rem', color: 'var(--success)', textTransform: 'uppercase', marginBottom: '0.15rem' }}>
                    Recommended Action:
                  </strong>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.45, fontWeight: 700 }}>
                    {scam.humanSolution}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Clean Emergency Helplines Section */}
        <section style={{ textAlign: 'center', padding: '1.8rem 1.4rem', background: 'var(--surface-alt)', borderRadius: '20px', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1.2rem', fontWeight: 900, color: 'var(--text)' }}>
            Official Fraud &amp; Emergency Helplines
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--muted)', margin: '0 0 1.2rem 0' }}>
            If you suspect you are currently targeted by a scam, call official support lines immediately:
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a href="tel:292" style={{ textDecoration: 'none', background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.6rem 1.1rem', borderRadius: '999px', fontSize: '0.84rem', fontWeight: 800, color: 'var(--text)', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
              <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '0.9rem', height: '0.9rem', color: 'var(--primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.826-1.47-5.114-3.758-6.584-6.584l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <span>Cyber Security Authority: <strong style={{ color: 'var(--primary)' }}>292</strong></span>
            </a>

            <a href="tel:1917" style={{ textDecoration: 'none', background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.6rem 1.1rem', borderRadius: '999px', fontSize: '0.84rem', fontWeight: 800, color: 'var(--warning)' }}>
              <span>MTN Ghana Fraud Hotline: <strong>1917</strong></span>
            </a>

            <a href="tel:100" style={{ textDecoration: 'none', background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.6rem 1.1rem', borderRadius: '999px', fontSize: '0.84rem', fontWeight: 800, color: 'var(--success)' }}>
              <span>Telecel Cash: <strong>100</strong></span>
            </a>

            <a href="tel:100" style={{ textDecoration: 'none', background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.6rem 1.1rem', borderRadius: '999px', fontSize: '0.84rem', fontWeight: 800, color: 'var(--primary)' }}>
              <span>AT Money: <strong>100</strong></span>
            </a>
          </div>
        </section>

      </div>
    </PageContainer>
  )
}
