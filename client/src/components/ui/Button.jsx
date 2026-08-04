import React from 'react'

export default function Button({
  children,
  variant = 'primary', // primary, secondary, outline, danger, ghost
  size = 'md', // sm, md, lg
  className = '',
  isLoading = false,
  disabled = false,
  type = 'button',
  onClick,
  style = {},
  ...props
}) {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.45rem',
    fontWeight: 800,
    borderRadius: '999px',
    transition: 'all 0.2s ease',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled || isLoading ? 0.65 : 1,
    border: '1px solid transparent',
    textDecoration: 'none',
    whiteSpace: 'nowrap'
  }

  const sizeStyles = {
    sm: { padding: '0.35rem 0.75rem', fontSize: '0.78rem' },
    md: { padding: '0.55rem 1.1rem', fontSize: '0.86rem' },
    lg: { padding: '0.75rem 1.4rem', fontSize: '0.95rem' }
  }

  const variantStyles = {
    primary: {
      background: 'var(--primary)',
      color: '#ffffff',
      boxShadow: '0 4px 14px rgba(230, 60, 28, 0.25)'
    },
    secondary: {
      background: 'var(--surface-alt)',
      color: 'var(--text)',
      border: '1px solid var(--border)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--text)',
      border: '1px solid var(--border)'
    },
    danger: {
      background: 'rgba(239, 68, 68, 0.1)',
      color: 'var(--danger)',
      border: '1px solid rgba(239, 68, 68, 0.25)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text)'
    }
  }

  return (
    <button
      type={type}
      className={`btn ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      style={{
        ...baseStyle,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style
      }}
      {...props}
    >
      {isLoading && (
        <span
          style={{
            width: '14px',
            height: '14px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite'
          }}
        />
      )}
      {children}
    </button>
  )
}
