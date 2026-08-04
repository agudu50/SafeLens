import React from 'react'

export default function Badge({
  children,
  variant = 'danger', // danger, warning, success, info, neutral
  size = 'md',
  className = '',
  style = {}
}) {
  const variantStyles = {
    danger: {
      background: 'rgba(239, 68, 68, 0.12)',
      color: 'var(--danger)',
      border: '1px solid rgba(239, 68, 68, 0.25)'
    },
    warning: {
      background: 'rgba(245, 158, 11, 0.12)',
      color: 'var(--warning)',
      border: '1px solid rgba(245, 158, 11, 0.25)'
    },
    success: {
      background: 'rgba(16, 185, 129, 0.12)',
      color: 'var(--success)',
      border: '1px solid rgba(16, 185, 129, 0.25)'
    },
    info: {
      background: 'rgba(56, 189, 248, 0.12)',
      color: 'var(--primary)',
      border: '1px solid rgba(56, 189, 248, 0.25)'
    },
    neutral: {
      background: 'var(--surface)',
      color: 'var(--muted)',
      border: '1px solid var(--border)'
    }
  }

  const sizeStyles = {
    sm: { fontSize: '0.62rem', padding: '0.1rem 0.4rem' },
    md: { fontSize: '0.72rem', padding: '0.15rem 0.55rem' },
    lg: { fontSize: '0.8rem', padding: '0.25rem 0.75rem' }
  }

  return (
    <span
      className={`badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        fontWeight: 850,
        borderRadius: '999px',
        whiteSpace: 'nowrap',
        letterSpacing: '0.02em',
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style
      }}
    >
      {children}
    </span>
  )
}
