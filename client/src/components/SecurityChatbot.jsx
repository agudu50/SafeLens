import React, { useState, useRef, useEffect } from 'react'

export default function SecurityChatbot({ user }) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hello ${user?.name ? user.name.split(' ')[0] : 'Kofi'}! I'm your SafeLens AI Security Assistant. Ask me anything about suspicious MoMo calls, phishing links, or scam prevention.`,
      time: 'Just now'
    }
  ])

  const quickPrompts = [
    'Detect MoMo cashout fraud',
    'Suspicious job offer text',
    'Ghana CSA helpline 292',
    'Will MTN ask for my PIN?'
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const generateAIResponse = (query) => {
    const q = query.toLowerCase()
    
    if (q.includes('momo') || q.includes('cashout') || q.includes('pin') || q.includes('mobile money')) {
      return `⚠️ **MoMo Security Rule**: Legitimate MTN, Telecel, or AT agents will **NEVER** call to request your 4-digit PIN or ask you to approve a USSD prompt. If someone claims they sent you money by mistake, tell them to contact the network operator directly. Never send funds back yourself.`
    }
    
    if (q.includes('job') || q.includes('recruitment') || q.includes('fee') || q.includes('agent')) {
      return `🚨 **Fake Job Warning**: Legitimate employers in Ghana (or abroad) will **NEVER** ask job applicants to pay registration fees, interview fees, or medical checkup fees via Mobile Money before hiring. This is an advance-fee recruitment scam.`
    }

    if (q.includes('helpline') || q.includes('csa') || q.includes('report') || q.includes('contact') || q.includes('292')) {
      return `📞 **Ghana Anti-Scam Emergency Lines**:\n• Cyber Security Authority (CSA): **292** (Call/SMS/WhatsApp)\n• Police Fraud Unit: **191** or **112**\n• MTN Fraud Desk: **100** or SMS **1515**`
    }

    if (q.includes('link') || q.includes('website') || q.includes('url') || q.includes('phishing')) {
      return `🔗 **Phishing Verification**: Official bank and telco websites use secure domain names (e.g. \`mtn.com.gh\`, \`gcb.com.gh\`). Avoid links ending in \`.xyz\`, \`.top\`, \`.site\`, or sent via unverified SMS blasts.`
    }

    return `🛡️ **SafeLens Security Audit**: Always practice the Zero-Trust Protocol. Never share secret credentials, SMS 6-digit OTPs, or Mobile Money PINs with callers. You can paste any suspicious link or message into our Full AI Scanner to run an immediate threat diagnostic!`
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
    }, 600)
  }

  return (
    <>
      {/* Floating Action Circle Bot Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary) 0%, #dc2626 100%)',
          color: '#ffffff',
          border: 'none',
          display: 'grid',
          placeItems: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(230, 60, 28, 0.45)',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isOpen ? 'scale(0.95)' : 'scale(1)'
        }}
        title="SafeLens AI Security Assistant"
      >
        <div style={{ position: 'relative', display: 'grid', placeItems: 'center' }}>
          {isOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="10" rx="3"/>
              <circle cx="12" cy="5" r="2"/>
              <path d="M12 7v4"/>
              <line x1="8" y1="15" x2="8.01" y2="15" strokeWidth="3"/>
              <line x1="16" y1="15" x2="16.01" y2="15" strokeWidth="3"/>
              <path d="M9 18h6"/>
            </svg>
          )}
          <span className="live-pulse-dot" style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', background: '#10b981' }} />
        </div>
      </button>

      {/* Floating Chat Modal Box */}
      {isOpen && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '5.2rem',
            right: '1.5rem',
            width: 'calc(100vw - 3rem)',
            maxWidth: '380px',
            height: '520px',
            maxHeight: 'calc(100vh - 7rem)',
            background: 'var(--surface-alt)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '0.9rem 1.1rem',
            background: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'rgba(230, 60, 28, 0.12)',
                border: '1px solid rgba(230, 60, 28, 0.25)',
                display: 'grid',
                placeItems: 'center',
                color: 'var(--primary)'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"/>
                </svg>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 850, color: 'var(--text)' }}>
                  SafeLens Security AI
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '1px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                  <span style={{ fontSize: '0.68rem', color: 'var(--muted)', fontWeight: 650 }}>
                    Active • Zero-Trust Guard
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--muted)',
                cursor: 'pointer',
                padding: '0.3rem',
                display: 'grid',
                placeItems: 'center',
                borderRadius: '6px'
              }}
              title="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            padding: '1rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem',
            background: 'rgba(0,0,0,0.015)'
          }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    background: msg.sender === 'user' ? 'var(--primary)' : 'var(--surface)',
                    color: msg.sender === 'user' ? '#ffffff' : 'var(--text)',
                    border: msg.sender === 'user' ? 'none' : '1px solid var(--border)',
                    padding: '0.65rem 0.85rem',
                    borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    fontSize: '0.82rem',
                    lineHeight: 1.45,
                    fontWeight: msg.sender === 'user' ? 600 : 500,
                    whiteSpace: 'pre-wrap',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                >
                  {msg.text}
                </div>
                <span style={{ fontSize: '0.62rem', color: 'var(--muted)', marginTop: '3px', padding: '0 2px' }}>
                  {msg.time}
                </span>
              </div>
            ))}

            {isTyping && (
              <div style={{ alignSelf: 'flex-start', background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.5rem 0.8rem', borderRadius: '12px', fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600 }}>
                SafeLens AI is thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div style={{
            padding: '0.5rem 0.8rem',
            background: 'var(--surface)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: '0.4rem',
            overflowX: 'auto',
            scrollbarWidth: 'none'
          }}>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--surface-alt)',
                  color: 'var(--text)',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '0.3rem 0.6rem',
                  borderRadius: '999px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
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
              padding: '0.75rem 0.8rem',
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
              placeholder="Ask AI security advice..."
              style={{
                flex: 1,
                background: 'var(--surface-alt)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '0.55rem 0.8rem',
                fontSize: '0.82rem',
                color: 'var(--text)',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              style={{
                background: input.trim() ? 'var(--primary)' : 'var(--border)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '0.55rem 0.9rem',
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
        </div>
      )}
    </>
  )
}
