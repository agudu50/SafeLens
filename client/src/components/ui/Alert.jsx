import React from 'react'

export default function Alert({
  children,
  type = 'info', // info, danger, warning, success
  title,
  className = '',
  style = {}
}) {
  const typeStyles = {
    danger: {
      background: 'rgba(239, 68, 68, 0.08)',
      border: '1px solid rgba(239, 68, 68, 0.25)',
      color: 'var(--danger)'
    },
    warning: {
      background: 'rgba(245, 158, 11, 0.08)',
      border: '1px solid rgba(245, 158, 11, 0.25)',
      color: 'var(--warning)'
    },
    success: {
      background: 'rgba(16, 185, 129, 0.08)',
      border: '1px solid rgba(16, 185, 129, 0.25)',
      color: 'var(--success)'
    },
    info: {
      background: 'rgba(56, 189, 248, 0.08)',
      border: '1px solid rgba(56, 189, 248, 0.25)',
      color: 'var(--primary)'
    }
  }

  return (
    <div
      className={`alert ${className}`}
      style={{
        padding: '0.9rem 1.1rem',
        borderRadius: '16px',
        fontSize: '0.85rem',
        lineHeight: 1.5,
        ...typeStyles[type],
        ...style
      }}
    >
      {title && <strong style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 800 }}>{title}</strong>}
      {children}
    </div>
  )
}
