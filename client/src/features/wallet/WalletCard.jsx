import React, { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'
import { walletService } from '../../services/walletService'

export default function WalletCard({ onConnected, onDisconnected, onContinue, continueLabel }) {
  const [wallet, setWallet] = useState(null)
  const [loading, setLoading] = useState(false)
  const [targetNetwork, setTargetNetwork] = useState('sepolia')

  const refreshStatus = () => {
    walletService.getWalletStatus().then(setWallet)
  }

  useEffect(() => {
    refreshStatus()

    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = () => refreshStatus()
      const handleChainChanged = () => refreshStatus()

      window.ethereum.on?.('accountsChanged', handleAccountsChanged)
      window.ethereum.on?.('chainChanged', handleChainChanged)

      return () => {
        window.ethereum.removeListener?.('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener?.('chainChanged', handleChainChanged)
      }
    }
  }, [])

  const handleConnect = async () => {
    setLoading(true)
    const res = await walletService.connectWallet(targetNetwork)
    if (res.wallet) {
      setWallet(res.wallet)
      onConnected?.(res.wallet)
    }
    setLoading(false)
  }

  const handleSwitchNetwork = async (netKey) => {
    setTargetNetwork(netKey)
    setLoading(true)
    await walletService.switchToBase(netKey)
    refreshStatus()
    setLoading(false)
  }

  const handleDisconnect = async () => {
    setLoading(true)
    const res = await walletService.disconnectWallet()
    setWallet(res.wallet)
    onDisconnected?.(res.wallet)
    setLoading(false)
  }

  const explorerUrl = wallet?.chainId === '0x2105'
    ? `https://basescan.org/address/${wallet?.address}`
    : `https://sepolia.basescan.org/address/${wallet?.address}`

  return (
    <Card style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', display: 'grid', placeItems: 'center', color: '#ffffff', flexShrink: 0 }}>
            <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1.1rem', height: '1.1rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
          </div>
          <div>
            <strong style={{ fontSize: '1.05rem', color: 'var(--text)', display: 'block', fontWeight: 900 }}>
              Base Layer 2 Wallet Integration
            </strong>
            <span style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>
              Coinbase Base L2 • Low Fees &amp; Fast Settlement
            </span>
          </div>
        </div>

        {wallet?.isConnected ? (
          <Badge variant="success" size="md">
            <span className="live-pulse-dot" style={{ width: '5px', height: '5px', background: 'var(--success)' }} />
            Base Connected
          </Badge>
        ) : (
          <Badge variant="neutral" size="md">
            Not Connected
          </Badge>
        )}
      </div>

      {/* Target Base Network Switcher selector */}
      <div style={{ marginBottom: '1.2rem', padding: '0.8rem 1rem', background: 'var(--surface)', borderRadius: '14px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.6rem' }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--text)', fontWeight: 800 }}>
          Target Base L2 Network:
        </span>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            type="button"
            onClick={() => handleSwitchNetwork('sepolia')}
            style={{
              padding: '0.3rem 0.75rem',
              borderRadius: '999px',
              border: targetNetwork === 'sepolia' ? '1px solid var(--primary)' : '1px solid var(--border)',
              background: targetNetwork === 'sepolia' ? 'rgba(56, 189, 248, 0.12)' : 'var(--surface-alt)',
              color: targetNetwork === 'sepolia' ? 'var(--primary)' : 'var(--text)',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Base Sepolia Testnet
          </button>
          <button
            type="button"
            onClick={() => handleSwitchNetwork('mainnet')}
            style={{
              padding: '0.3rem 0.75rem',
              borderRadius: '999px',
              border: targetNetwork === 'mainnet' ? '1px solid var(--primary)' : '1px solid var(--border)',
              background: targetNetwork === 'mainnet' ? 'rgba(56, 189, 248, 0.12)' : 'var(--surface-alt)',
              color: targetNetwork === 'mainnet' ? 'var(--primary)' : 'var(--text)',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Base Mainnet
          </button>
        </div>
      </div>

      {wallet?.isConnected ? (
        <div style={{ background: 'var(--surface)', padding: '1.1rem', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.84rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--muted)' }}>Wallet Address:</span>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--primary)', fontWeight: 800, fontFamily: 'monospace', textDecoration: 'none' }}
              title="View on Base Explorer"
            >
              {wallet.address ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : '0x8f23...0f1'}
            </a>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--muted)' }}>Active Network:</span>
            <strong style={{ color: 'var(--text)' }}>{wallet.network}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--muted)' }}>Base L2 ETH Balance:</span>
            <strong style={{ color: 'var(--success)', fontWeight: 850 }}>{wallet.balanceEth}</strong>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem' }}>
            <span style={{ color: 'var(--muted)' }}>Report Verification State:</span>
            <span style={{ color: 'var(--primary)', fontWeight: 850 }}>Base On-Chain Anchor Ready</span>
          </div>
        </div>
      ) : (
        <Alert type="info" style={{ marginBottom: '1.2rem' }}>
          <strong>Base Security Anchor:</strong> Connect your MetaMask or Coinbase Wallet to automatically switch to the Base Layer 2 network for near-zero transaction fees on report verifications.
        </Alert>
      )}

      <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
        {wallet?.isConnected ? (
          <>
            {onContinue ? (
              <Button variant="primary" size="md" onClick={() => onContinue(wallet)}>
                {continueLabel || 'Continue with Wallet'}
              </Button>
            ) : null}
            <Button variant="danger" size="md" isLoading={loading} onClick={handleDisconnect}>
              Disconnect Wallet
            </Button>
          </>
        ) : (
          <Button variant="primary" size="md" isLoading={loading} onClick={handleConnect}>
            <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem', marginRight: '0.3rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Connect Base L2 Wallet
          </Button>
        )}
      </div>
    </Card>
  )
}
