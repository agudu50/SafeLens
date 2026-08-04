import React from 'react'

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '520px'
}) {
  if (!isOpen) return null

  return (
    <>
      <div
        className="helpline-backdrop-overlay"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(4px)',
          zIndex: 1100
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
          maxWidth,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '24px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.25)',
          padding: '1.5rem',
          zIndex: 1200,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: 'var(--text)' }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            type="button"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.2rem',
              color: 'var(--muted)',
              cursor: 'pointer',
              padding: '0.2rem'
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </>
  )
}
