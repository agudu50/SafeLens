import React, { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { walletService } from '../../services/walletService'

export default function WalletCard() {
  const [wallet, setWallet] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    walletService.getWalletStatus().then(setWallet)
  }, [])

  const handleConnect = async () => {
    setLoading(true)
    const res = await walletService.connectWallet()
    setWallet(res.wallet)
    setLoading(false)
  }

  const handleDisconnect = async () => {
    setLoading(true)
    const res = await walletService.disconnectWallet()
    setWallet(res.wallet)
    setLoading(false)
  }

  return (
    <Card style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.4rem' }}>🔗</span>
          <div>
            <strong style={{ fontSize: '1.05rem', color: 'var(--text)', display: 'block', fontWeight: 900 }}>
              Blockchain Wallet
            </strong>
            <span style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>
              Ethereum Web3 Verification Network
            </span>
          </div>
        </div>

        {wallet?.isConnected ? (
          <Badge variant="success" size="md">
            <span className="live-pulse-dot" style={{ width: '5px', height: '5px', background: 'var(--success)' }} />
            Wallet Connected
          </Badge>
        ) : (
          <Badge variant="neutral" size="md">
            Not Connected
          </Badge>
        )}
      </div>

      {wallet?.isConnected ? (
        <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.84rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--muted)' }}>Connected Address:</span>
            <strong style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>
              {wallet.address ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : '0x7a91...8d21'}
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--muted)' }}>Network:</span>
            <strong style={{ color: 'var(--text)' }}>{wallet.network}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--muted)' }}>Balance:</span>
            <strong style={{ color: 'var(--text)' }}>{wallet.balanceEth}</strong>
          </div>
        </div>
      ) : (
        <p style={{ fontSize: '0.84rem', color: 'var(--muted)', margin: '0 0 1.2rem 0', lineHeight: 1.5 }}>
          Connecting a Web3 wallet will eventually allow you to anchor verified scam reports directly to Ethereum smart contracts for decentralized tamper-proof evidence.
        </p>
      )}

      <div>
        {wallet?.isConnected ? (
          <Button variant="danger" size="md" isLoading={loading} onClick={handleDisconnect}>
            Disconnect Wallet
          </Button>
        ) : (
          <Button variant="primary" size="md" isLoading={loading} onClick={handleConnect}>
            Connect Wallet
          </Button>
        )}
      </div>
    </Card>
  )
}
