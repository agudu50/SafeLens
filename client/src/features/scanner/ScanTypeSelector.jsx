import React from 'react'

export default function ScanTypeSelector({ activeType, onSelectType }) {
  const types = [
    { id: 'message', label: 'SMS & Text', icon: '💬', available: true },
    { id: 'screenshot', label: 'Screenshots', icon: '🖼️', available: true },
    { id: 'url', label: 'Web Links', icon: '🔗', available: false, badge: 'Coming Soon' },
    { id: 'email', label: 'Email', icon: '✉️', available: false, badge: 'Coming Soon' }
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem', marginBottom: '1.2rem' }}>
      {types.map((type) => (
        <button
          key={type.id}
          type="button"
          disabled={!type.available}
          onClick={() => type.available && onSelectType(type.id)}
          style={{
            padding: '0.75rem 0.6rem',
            borderRadius: '16px',
            border: activeType === type.id ? '2px solid var(--primary)' : '1px solid var(--border)',
            background: activeType === type.id ? 'var(--primary)' : 'var(--surface-alt)',
            color: activeType === type.id ? '#ffffff' : type.available ? 'var(--text)' : 'var(--muted)',
            cursor: type.available ? 'pointer' : 'not-allowed',
            opacity: type.available ? 1 : 0.65,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.35rem',
            transition: 'all 0.2s ease',
            position: 'relative',
            boxShadow: activeType === type.id ? '0 4px 14px rgba(230, 60, 28, 0.3)' : '0 2px 6px rgba(0, 0, 0, 0.02)'
          }}
        >
          <span style={{ fontSize: '1.4rem' }}>{type.icon}</span>
          <strong style={{ fontSize: '0.82rem', fontWeight: 800 }}>{type.label}</strong>
          {type.badge && (
            <span
              style={{
                fontSize: '0.58rem',
                fontWeight: 850,
                color: 'var(--warning)',
                background: 'rgba(245, 158, 11, 0.12)',
                padding: '0.08rem 0.35rem',
                borderRadius: '999px',
                border: '1px solid rgba(245, 158, 11, 0.25)'
              }}
            >
              {type.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
