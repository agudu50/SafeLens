import React from 'react'

export default function EmptyState({
  icon = '🔍',
  title = 'No Data Found',
  description = 'There are no items to display at the moment.',
  actionButton,
  className = '',
  style = {}
}) {
  return (
    <div
      className={`empty-state ${className}`}
      style={{
        textAlign: 'center',
        padding: '3rem 1.5rem',
        background: 'var(--surface-alt)',
        borderRadius: '20px',
        border: '1px solid var(--border)',
        ...style
      }}
    >
      <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>{icon}</div>
      <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '1.05rem', fontWeight: 900, color: 'var(--text)' }}>
        {title}
      </h4>
      <p style={{ margin: '0 0 1.2rem 0', fontSize: '0.86rem', color: 'var(--muted)', maxWidth: '380px', marginInline: 'auto' }}>
        {description}
      </p>
      {actionButton}
    </div>
  )
}
