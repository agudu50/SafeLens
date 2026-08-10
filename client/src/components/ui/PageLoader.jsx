export default function PageLoader() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '65vh',
        width: '100%',
        padding: '2rem 1rem',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '56px',
          height: '56px',
          display: 'grid',
          placeItems: 'center',
          marginBottom: '1.2rem',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px solid rgba(230, 60, 28, 0.15)',
            borderTopColor: 'var(--primary)',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          viewBox="0 0 24 24"
          style={{ width: '1.4rem', height: '1.4rem', color: 'var(--primary)' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
      </div>

      <div
        style={{
          fontSize: '0.84rem',
          fontWeight: 800,
          color: 'var(--text)',
          letterSpacing: '0.04em',
          marginBottom: '0.4rem',
        }}
      >
        SAFELENS PROTECTION
      </div>

      <div
        style={{
          width: '120px',
          height: '3px',
          background: 'var(--surface-alt)',
          borderRadius: '999px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '40%',
            background: 'var(--primary)',
            borderRadius: '999px',
            animation: 'loaderSweep 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
          }}
        />
      </div>
    </div>
  )
}
