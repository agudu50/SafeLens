import React from 'react'

export default function PageContainer({ children, className = '', style = {} }) {
  return (
    <div
      className={`page-container ${className}`}
      style={{
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '1.5rem 2rem 3.5rem 2rem',
        boxSizing: 'border-box',
        ...style
      }}
    >
      {children}
    </div>
  )
}
