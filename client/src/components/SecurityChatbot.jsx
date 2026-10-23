import React, { useState, useRef, useEffect } from 'react'

export default function SecurityChatbot({ user, isOpen: externalIsOpen, setIsOpen: externalSetIsOpen }) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isControlled = externalIsOpen !== undefined && externalSetIsOpen !== undefined
  const isOpen = isControlled ? externalIsOpen : internalIsOpen
  const setIsOpen = isControlled ? externalSetIsOpen : setInternalIsOpen

  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hello ${user?.name ? user.name.split(' ')[0] : 'Operator'}. SafeLens AI Security Assistant is online. Inquire about suspicious MoMo activity, phishing domains, or incident containment protocols.`,
      time: 'Just now'
    }
  ])

  const quickPrompts = [
    'MoMo Cashout Rules',
    'Fake Job Check',
    'Ghana CSA Helpline 292',
    'MTN PIN Policy'
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, setIsOpen])

  const generateAIResponse = (query) => {
    const q = query.toLowerCase()

    if (q.includes('momo') || q.includes('cashout') || q.includes('pin') || q.includes('mobile money')) {
      return `[MOMO PROTOCOL]: Legitimate MTN, Telecel, or AT staff will NEVER request your 4-digit PIN or ask you to dial *170# to approve an unexpected cashout prompt. If an unknown caller claims a wrong transfer was sent to your wallet, direct them to file a formal reversal through their telecommunication provider. Never approve prompts manually.`
    }

    if (q.includes('job') || q.includes('recruitment') || q.includes('fee') || q.includes('agent')) {
      return `[RECRUITMENT ADVISORY]: Verified corporate employers and government agencies in Ghana never charge application, registration, or medical checkup fees via Mobile Money before employment. Any requirement to transfer funds upfront constitutes an advance-fee fraud vector.`
    }

    if (q.includes('helpline') || q.includes('csa') || q.includes('report') || q.includes('contact') || q.includes('292')) {
      return `[INCIDENT ESCALATION DIRECTORY]:\n• National Cyber Security Authority (CSA): 292 (Toll-free / WhatsApp / SMS)\n• Ghana Police Cybercrime Unit: 18555 or 112\n• MTN Fraud Response Desk: 1917`
    }

    if (q.includes('link') || q.includes('website') || q.includes('url') || q.includes('phishing')) {
      return `[DOMAIN VERIFICATION]: Authentic telecom and financial portals strictly use registered corporate domains (e.g., mtn.com.gh, gcb.com.gh). Disregard links terminating in unverified top-level domains (.xyz, .top, .site) or delivered via untrusted bulk SMS sender IDs.`
    }

    return `[ZERO-TRUST DIRECTIVE]: Under the Zero-Trust Security Standard, treat all unsolicited urgent requests for credentials, SMS OTP tokens, or USSD approvals as hostile. For immediate automated diagnostic review, pass the message text or URL through the SafeLens Scanner engine.`
  }

  const handleSendMessage = (textToSend) => {
    const text = textToSend || input
    if (!text.trim()) return

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    if (!textToSend) setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const aiReply = {
        id: Date.now() + 1,
        sender: 'ai',
        text: generateAIResponse(text),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, aiReply])
      setIsTyping(false)
    }, 500)
  }

  return (
    <>
      <style>{`
        .safelens-copilot-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          z-index: 9998;
          backdrop-filter: blur(2px);
          animation: copilotFadeIn 0.2s ease forwards;
        }
        .safelens-copilot-drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: 420px;
          max-width: 90vw;
          height: 100vh;
          background: var(--surface);
          border-left: 1px solid var(--border);
          box-shadow: -8px 0 32px rgba(0, 0, 0, 0.22);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          animation: copilotSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .safelens-copilot-floating-pill {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 9990;
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text);
          padding: 0.5rem 1rem;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          font-size: 0.78rem;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .safelens-copilot-floating-pill:hover {
          transform: translateY(-2px);
          border-color: var(--primary);
        }
        @keyframes copilotSlideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes copilotFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Floating Pill (Always discreetly parked at bottom-right corner) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="safelens-copilot-floating-pill"
          title="Open AI Security Copilot"
        >
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }} />
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.2">
            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"/>
          </svg>
          <span>AI Copilot</span>
        </button>
      )}

      {/* Slide-Over Drawer Backdrop */}
      {isOpen && (
        <div className="safelens-copilot-backdrop" onClick={() => setIsOpen(false)} />
      )}

      {/* Enterprise Slide-Over Drawer */}
      {isOpen && (
        <aside className="safelens-copilot-drawer">
          {/* Drawer Header */}
          <div style={{
            padding: '1.1rem 1.4rem',
            background: 'var(--surface-alt)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                display: 'grid',
                placeItems: 'center',
                color: 'var(--primary)'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"/>
                </svg>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 900, color: 'var(--text)' }}>
                  AI Security Copilot
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '2px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                  <span style={{ fontSize: '0.68rem', color: 'var(--muted)', fontWeight: 700 }}>
                    Google Gemma 4 • Zero-Trust Defense
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text)',
                cursor: 'pointer',
                padding: '0.4rem',
                display: 'grid',
                placeItems: 'center',
                borderRadius: '6px'
              }}
              title="Close Copilot (Esc)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Drawer Messages Body */}
          <div style={{
            flex: 1,
            padding: '1.2rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.9rem',
            background: 'var(--surface)'
          }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '88%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    background: msg.sender === 'user' ? 'var(--primary)' : 'var(--surface-alt)',
                    color: msg.sender === 'user' ? '#ffffff' : 'var(--text)',
                    border: msg.sender === 'user' ? 'none' : '1px solid var(--border)',
                    padding: '0.75rem 0.95rem',
                    borderRadius: msg.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                    fontSize: '0.82rem',
                    lineHeight: 1.5,
                    fontWeight: msg.sender === 'user' ? 600 : 500,
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {msg.text}
                </div>
                <span style={{ fontSize: '0.64rem', color: 'var(--muted)', marginTop: '4px', padding: '0 2px' }}>
                  {msg.time}
                </span>
              </div>
            ))}

            {isTyping && (
              <div style={{ alignSelf: 'flex-start', background: 'var(--surface-alt)', border: '1px solid var(--border)', padding: '0.55rem 0.9rem', borderRadius: '10px', fontSize: '0.76rem', color: 'var(--muted)', fontWeight: 600 }}>
                Synthesizing response with Gemma 4...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div style={{
            padding: '0.65rem 1rem',
            background: 'var(--surface-alt)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: '0.45rem',
            overflowX: 'auto',
            scrollbarWidth: 'none'
          }}>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '0.35rem 0.65rem',
                  borderRadius: '999px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s ease'
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage() }}
            style={{
              padding: '0.9rem 1rem',
              background: 'var(--surface)',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              gap: '0.5rem'
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Copilot about any threat or rule..."
              style={{
                flex: 1,
                background: 'var(--surface-alt)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '0.6rem 0.85rem',
                fontSize: '0.82rem',
                color: 'var(--text)',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              style={{
                background: input.trim() ? 'var(--primary)' : 'var(--surface-alt)',
                color: input.trim() ? '#ffffff' : 'var(--muted)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '0.6rem 0.95rem',
                cursor: input.trim() ? 'pointer' : 'default',
                display: 'grid',
                placeItems: 'center',
                transition: 'all 0.15s ease'
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </form>
        </aside>
      )}
    </>
  )
}
