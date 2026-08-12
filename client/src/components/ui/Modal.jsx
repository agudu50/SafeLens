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
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        padding: '5.5rem 1.2rem 2rem 1.2rem',
        boxSizing: 'border-box',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth,
          maxHeight: 'calc(100vh - 7.5rem)',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '24px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
          padding: '1.6rem',
          boxSizing: 'border-box',
          overflowY: 'auto',
          position: 'relative',
          margin: '0 auto',
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
              padding: '0.2rem',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
