import React, { useState, useEffect } from 'react'

export default function AnalysisLoader({ isOpen }) {
  const [stepIndex, setStepIndex] = useState(0)

  const steps = [
    'Reading submitted content',
    'Checking suspicious word patterns',
    'Auditing Mobile Money & pressure tactics',
    'Preparing your plain-English safety report'
  ]

  useEffect(() => {
    if (!isOpen) {
      setStepIndex(0)
      return
    }
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev))
    }, 500)
    return () => clearInterval(interval)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 2500,
        padding: '1rem',
        boxSizing: 'border-box'
      }}
    >
      {/* Modal Container - Expanded Max Width for Desktop View */}
      <div
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '24px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.4)',
          padding: '2.2rem 2.4rem',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}
      >
        {/* Animated Radar Pulse Spinner */}
        <div style={{ position: 'relative', width: '60px', height: '60px', margin: '0 auto 1.2rem auto' }}>
          <span
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '4px solid var(--border)',
              borderTopColor: 'var(--primary)',
              animation: 'spin 0.8s linear infinite'
            }}
          />
          <div style={{ display: 'grid', placeItems: 'center', height: '100%', color: 'var(--primary)' }}>
            <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.5rem', height: '1.5rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
        </div>

        {/* Modal Heading & Subtitle */}
        <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.25rem', fontWeight: 900, color: 'var(--text)' }}>
          SafeLens is taking a closer look...
        </h3>
        <p style={{ fontSize: '0.86rem', color: 'var(--muted)', margin: '0 0 1.4rem 0', lineHeight: 1.45 }}>
          Analyzing fraud vectors and scam signals in real time
        </p>

        {/* Step-by-Step Progress Checklist Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left', background: 'var(--surface-alt)', padding: '1.1rem 1.2rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
          {steps.map((text, idx) => {
            const isDone = idx < stepIndex
            const isCurrent = idx === stepIndex
            return (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', fontSize: '0.86rem', color: isDone ? 'var(--success)' : isCurrent ? 'var(--text)' : 'var(--muted)', opacity: isCurrent ? 1 : 0.85, fontWeight: isCurrent ? 800 : 600, lineHeight: 1.4 }}>
                <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  {isDone ? (
                    <svg fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" style={{ width: '0.95rem', height: '0.95rem', color: 'var(--success)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : isCurrent ? (
                    <span className="live-pulse-dot" style={{ width: '9px', height: '9px', background: 'var(--primary)' }} />
                  ) : (
                    <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: 'var(--border)', display: 'inline-block' }} />
                  )}
                </span>
                <span>{text}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
