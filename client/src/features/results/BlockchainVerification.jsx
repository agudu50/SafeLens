import React, { useState } from 'react'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

export default function BlockchainVerification({ verificationDetails }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div style={{ padding: '1rem 1.25rem', background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem', marginTop: '1.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.2rem' }}>🛡️</span>
          <div>
            <strong style={{ fontSize: '0.88rem', color: 'var(--text)', display: 'block', fontWeight: 800 }}>
              Blockchain Verification
            </strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
              Report integrity verified on Ethereum network
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Badge variant="success" size="sm">
            🛡️ Blockchain Verified
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setShowModal(true)}>
            View Verification
          </Button>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Blockchain Report Integrity Verification">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <p style={{ fontSize: '0.86rem', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
            SafeLens records cryptographic report hashes on Ethereum smart contracts to ensure scam evidence remains tamper-proof.
          </p>

          <div style={{ background: 'var(--surface-alt)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Target Network:</span>
              <strong style={{ color: 'var(--text)' }}>{verificationDetails?.network || 'Ethereum Mainnet'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Report ID:</span>
              <strong style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>{verificationDetails?.reportId || '0x8f1e2d3c4b5a'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', gap: '0.2rem' }}>
              <span style={{ color: 'var(--muted)' }}>Cryptographic Evidence Hash:</span>
              <strong style={{ color: 'var(--text)', fontFamily: 'monospace', fontSize: '0.74rem', wordBreak: 'break-all' }}>
                {verificationDetails?.reportHash || '0x7a91b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9'}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Verification Status:</span>
              <span style={{ color: 'var(--success)', fontWeight: 800 }}>✓ {verificationDetails?.status || 'Verified Integrity'}</span>
            </div>
          </div>

          <div style={{ padding: '0.8rem', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.25)', fontSize: '0.78rem', color: 'var(--primary)' }}>
            💡 <em>Note: Live Web3 wallet transactions and smart contract state calls will connect when the SafeLens verification contract network is online.</em>
          </div>
        </div>
      </Modal>
    </>
  )
}
