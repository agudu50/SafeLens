import React from 'react'

export default function ProgressBar({
  value = 0,
  max = 100,
  color = 'var(--primary)',
  height = '8px',
  className = '',
  style = {}
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div
      className={`progress-bar-track ${className}`}
      style={{
        width: '100%',
        height,
        background: 'var(--surface)',
        borderRadius: '999px',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        ...style
      }}
    >
      <div
        style={{
          width: `${percentage}%`,
          height: '100%',
          background: color,
          borderRadius: '999px',
          transition: 'width 0.4s ease'
        }}
      />
    </div>
  )
}
