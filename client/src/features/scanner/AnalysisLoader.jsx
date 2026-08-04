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
    }, 600)
    return () => clearInterval(interval)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 2000
        }}
      />
      <div
        className="animate-fade-in"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '440px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '24px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.3)',
          padding: '2rem',
          textAlign: 'center',
          zIndex: 2100
        }}
      >
        <div style={{ position: 'relative', width: '64px', height: '64px', margin: '0 auto 1.2rem auto' }}>
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
          <span style={{ fontSize: '1.8rem', display: 'grid', placeItems: 'center', height: '100%' }}>🛡️</span>
        </div>

        <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.2rem', fontWeight: 900, color: 'var(--text)' }}>
          SafeLens is taking a closer look...
        </h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--muted)', margin: '0 0 1.5rem 0' }}>
          Analyzing fraud vectors and scam signals in real time
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', textAlign: 'left', background: 'var(--surface-alt)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
          {steps.map((text, idx) => {
            const isDone = idx < stepIndex
            const isCurrent = idx === stepIndex
            return (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.84rem', color: isDone || isCurrent ? 'var(--text)' : 'var(--muted)', fontWeight: isCurrent ? 800 : 600 }}>
                <span>
                  {isDone ? '✓' : isCurrent ? '●' : '○'}
                </span>
                <span>{text}</span>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
