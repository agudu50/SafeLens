import React from 'react'

export default function Card({
  children,
  className = '',
  style = {},
  padding = '1.25rem',
  border = '1px solid var(--border)',
  background = 'var(--surface-alt)',
  borderRadius = '20px',
  ...props
}) {
  return (
    <div
      className={`scanner-card ${className}`}
      style={{
        padding,
        background,
        borderRadius,
        border,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.2s ease',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  )
}
