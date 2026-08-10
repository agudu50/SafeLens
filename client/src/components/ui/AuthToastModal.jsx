import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const DURATION_MS = 3200

export default function AuthToastModal({ modal, onClose }) {
  useEffect(() => {
    if (!modal) return
    const timer = setTimeout(() => {
      onClose()
    }, DURATION_MS)
    return () => clearTimeout(timer)
  }, [modal, onClose])

  if (!modal) return null

  const isLogout = modal.type === 'logout'

  const themeColors = isLogout
    ? {
        border: 'rgba(239, 68, 68, 0.35)',
        bgTint: 'rgba(239, 68, 68, 0.06)',
        iconBg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        iconShadow: '0 3px 10px rgba(239, 68, 68, 0.35)',
        progressBg: 'linear-gradient(90deg, #ef4444, #f87171)',
        dotColor: '#ef4444',
      }
    : {
        border: 'rgba(16, 185, 129, 0.35)',
        bgTint: 'rgba(16, 185, 129, 0.06)',
        iconBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        iconShadow: '0 3px 10px rgba(16, 185, 129, 0.35)',
        progressBg: 'linear-gradient(90deg, #10b981, #34d399)',
        dotColor: '#10b981',
      }

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
          initial={{ opacity: 0, y: -22, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.94 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{
            pointerEvents: 'auto',
            position: 'relative',
            background: 'var(--surface)',
            border: `1.5px solid ${themeColors.border}`,
            borderRadius: '999px',
            padding: '0.55rem 1rem 0.65rem 0.75rem',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.2), 0 0 0 1px ' + themeColors.bgTint,
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          {/* Vibrant Icon Badge */}
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: themeColors.iconBg,
              boxShadow: themeColors.iconShadow,
              color: '#ffffff',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            {isLogout ? (
              <svg fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24" style={{ width: '13px', height: '13px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H2.25" />
              </svg>
            ) : (
              <svg fill="none" stroke="currentColor" strokeWidth="2.6" viewBox="0 0 24 24" style={{ width: '13px', height: '13px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            )}
          </div>

          {/* Styled Text with Colored Pulse Dot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: themeColors.dotColor,
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: '0.84rem', fontWeight: 850, color: 'var(--text)', letterSpacing: '-0.01em' }}>
              {modal.title || (isLogout ? 'Signed Out Successfully' : 'Welcome Back')}
            </span>
          </div>

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
              marginLeft: '0.25rem',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
              fontSize: '0.75rem',
              opacity: 0.8,
              transition: 'opacity 0.2s ease',
            }}
            title="Close"
          >
            ✕
          </button>

          {/* Colorful Animated Progress Bar */}
          <motion.div
            key={modal.title || 'progress'}
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: DURATION_MS / 1000, ease: 'linear' }}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '3px',
              background: themeColors.progressBg,
              borderRadius: '999px',
            }}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
