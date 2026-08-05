import React from 'react'

export default function PageContainer({ children, className = '', style = {} }) {
  return (
    <div
      className={`page-container ${className}`}
      style={{
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '1.5rem 1.25rem 3.5rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        ...style
      }}
    >
      <div style={{ width: '100%', maxWidth: '1200px' }}>
        {children}
      </div>
    </div>
  )
}
