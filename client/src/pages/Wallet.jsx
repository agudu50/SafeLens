import React from 'react'
import PageContainer from '../components/layout/PageContainer'
import WalletCard from '../features/wallet/WalletCard'
import Alert from '../components/ui/Alert'

export default function Wallet() {
  return (
    <PageContainer>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text)', margin: '0 0 0.4rem 0' }}>
            Web3 Wallet &amp; Report Verification
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)', margin: 0 }}>
            Connect your Ethereum wallet to verify cryptographic scam report signatures on-chain.
          </p>
        </div>

        <Alert type="info" style={{ marginBottom: '1.5rem' }}>
          💡 <strong>SafeLens Philosophy:</strong> Blockchain operates behind the scenes to verify report integrity. You do not need a crypto wallet to analyze scams or use SafeLens.
        </Alert>

        <WalletCard />
      </div>
    </PageContainer>
  )
}
