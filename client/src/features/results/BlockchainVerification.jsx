import React, { useState } from 'react'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

function formatTimestamp(unixSeconds) {
  if (!unixSeconds) return 'Unknown'
  return new Date(unixSeconds * 1000).toLocaleString()
}

function shortenAddress(address) {
  if (!address) return 'Unknown'
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export default function BlockchainVerification({ verificationDetails }) {
  const [showModal, setShowModal] = useState(false)

  const {
    network = 'Base Sepolia Testnet (L2)',
    reportHash,
    txHash,
    reporter,
    timestamp,
    explorerUrl,
    contractAddress,
    alreadyRegistered,
  } = verificationDetails || {}

  const txExplorerUrl = txHash ? `https://sepolia.basescan.org/tx/${txHash}` : explorerUrl

  return (
    <>
      <div style={{ padding: '1rem 1.25rem', background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem', marginTop: '1.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--primary)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <div>
            <strong style={{ fontSize: '0.88rem', color: 'var(--text)', display: 'block', fontWeight: 800 }}>
              Base Layer 2 Verification
            </strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
              {alreadyRegistered ? 'Report hash was already anchored on Base L2' : 'Report hash anchored on Base L2 blockchain'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Badge variant="success" size="sm">
            Base L2 Verified
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setShowModal(true)}>
            View Verification
          </Button>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Base Layer 2 Report Verification">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <p style={{ fontSize: '0.86rem', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
            SafeLens anchors cryptographic scam evidence hashes on the Base Layer 2 network for near-zero transaction fees and instant tamper-proof verification.
          </p>

          <div style={{ background: 'var(--surface-alt)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>Layer 2 Network:</span>
              <strong style={{ color: 'var(--text)' }}>{network}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', gap: '0.2rem' }}>
              <span style={{ color: 'var(--muted)' }}>Report Evidence Hash:</span>
              <strong style={{ color: 'var(--text)', fontFamily: 'monospace', fontSize: '0.74rem', wordBreak: 'break-all' }}>
                {reportHash || 'Unavailable'}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>Anchored By:</span>
              <strong style={{ color: 'var(--text)', fontFamily: 'monospace' }}>{shortenAddress(reporter)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>Anchored At:</span>
              <strong style={{ color: 'var(--text)' }}>{formatTimestamp(timestamp)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>Verification Status:</span>
              <span style={{ color: 'var(--success)', fontWeight: 800 }}>✓ Base L2 Verified</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}>
              <span style={{ color: 'var(--muted)' }}>Basescan Explorer:</span>
              <a
                href={txExplorerUrl || `https://sepolia.basescan.org/address/${contractAddress || ''}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--primary)', fontWeight: 800, textDecoration: 'none' }}
              >
                View on Basescan ↗
              </a>
            </div>
          </div>

          <div style={{ padding: '0.8rem', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.25)', fontSize: '0.78rem', color: 'var(--primary)' }}>
            Connected with Base Layer 2 network (Chain 8453 / 84532). SafeLens anchors high-risk scam logs directly onto Base.
          </div>
        </div>
      </Modal>
    </>
  )
}
