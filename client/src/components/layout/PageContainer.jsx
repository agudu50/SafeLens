import React from 'react'

export default function PageContainer({ children, className = '', style = {} }) {
  return (
    <main
      className={`page-container ${className}`}
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1.25rem 4rem 1.25rem',
        minHeight: 'calc(100vh - 80px)',
        ...style
      }}
    >
      {children}
    </main>
  )
}
