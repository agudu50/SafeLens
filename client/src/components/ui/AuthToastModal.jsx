import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AuthToastModal({ modal, onClose }) {
  useEffect(() => {
    if (!modal) return
    const timer = setTimeout(() => {
      onClose()
    }, 2800)
    return () => clearTimeout(timer)
  }, [modal, onClose])

  if (!modal) return null

  const isLogout = modal.type === 'logout'

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          top: '1.2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100000,
          pointerEvents: 'none',
          maxWidth: '90vw',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.95 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            pointerEvents: 'auto',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '999px',
            padding: '0.55rem 1rem 0.55rem 0.75rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.16)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            whiteSpace: 'nowrap',
          }}
        >
          {/* Icon Circle */}
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: isLogout ? 'rgba(100, 116, 139, 0.12)' : 'rgba(16, 185, 129, 0.12)',
              color: isLogout ? 'var(--muted)' : 'var(--success)',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            {isLogout ? (
              <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '13px', height: '13px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H2.25" />
              </svg>
            ) : (
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '13px', height: '13px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            )}
          </div>

          {/* Simple Text */}
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text)' }}>
            {modal.title || (isLogout ? 'Signed Out Successfully' : 'Welcome Back')}
          </span>

          {/* Dismiss Button */}
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--muted)',
              cursor: 'pointer',
              padding: '2px',
              marginLeft: '0.2rem',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
              fontSize: '0.75rem',
            }}
            title="Close"
          >
            ✕
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
