import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { ethers } from 'ethers'
import {
  readOnlyContract,
  getWritableContract,
  hashReportPayload,
  CONTRACT_ADDRESS_VALUE,
  EXPLORER_BASE_URL,
} from './contract.js'

dotenv.config()

const app = express()
app.use(express.json())

const allowedOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
  })
)

app.get('/api/health', (req, res) => {
  res.json({ ok: true, contract: CONTRACT_ADDRESS_VALUE })
})

// Registers a scam report's hash on-chain, using the backend service wallet
// so end users never need a wallet of their own to submit a report.
app.post('/api/reports/anchor', async (req, res) => {
  const { id, content, riskLevel, riskScore } = req.body || {}

  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: 'Request body must include a non-empty "content" string.' })
  }

  const reportHash = hashReportPayload({ id, content, riskLevel, riskScore })

  try {
    const alreadyRegistered = await readOnlyContract.isReportRegistered(reportHash)

    if (alreadyRegistered) {
      const [isRegistered, reporter, timestamp] = await readOnlyContract.verifyReport(reportHash)
      return res.json({
        reportHash,
        alreadyRegistered: true,
        isRegistered,
        reporter,
        timestamp: Number(timestamp),
        network: 'Base Sepolia (L2)',
        contractAddress: CONTRACT_ADDRESS_VALUE,
        explorerUrl: `${EXPLORER_BASE_URL}/address/${CONTRACT_ADDRESS_VALUE}`,
      })
    }

    const contract = getWritableContract()
    const tx = await contract.registerReport(reportHash)
    const receipt = await tx.wait()

    return res.json({
      reportHash,
      alreadyRegistered: false,
      isRegistered: true,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      network: 'Base Sepolia (L2)',
      contractAddress: CONTRACT_ADDRESS_VALUE,
      explorerUrl: `${EXPLORER_BASE_URL}/tx/${receipt.hash}`,
    })
  } catch (err) {
    console.error('Failed to anchor report on-chain', err)
    const message = err?.shortMessage || err?.message || 'Failed to anchor report on-chain.'
    return res.status(500).json({ error: message })
  }
})

// Read-only check for whether a given report hash is anchored on-chain.
app.get('/api/reports/verify/:hash', async (req, res) => {
  const { hash } = req.params

  if (!ethers.isHexString(hash, 32)) {
    return res.status(400).json({ error: 'hash must be a 0x-prefixed 32-byte hex string.' })
  }

  try {
    const [isRegistered, reporter, timestamp] = await readOnlyContract.verifyReport(hash)
    res.json({
      reportHash: hash,
      isRegistered,
      reporter,
      timestamp: Number(timestamp),
      network: 'Base Sepolia (L2)',
      contractAddress: CONTRACT_ADDRESS_VALUE,
      explorerUrl: `${EXPLORER_BASE_URL}/address/${CONTRACT_ADDRESS_VALUE}`,
    })
  } catch (err) {
    console.error('Failed to verify report on-chain', err)
    const message = err?.shortMessage || err?.message || 'Failed to verify report on-chain.'
    res.status(500).json({ error: message })
  }
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`SafeLens API listening on http://localhost:${PORT}`)
  console.log(`Anchoring reports to SafeLensRegistry at ${CONTRACT_ADDRESS_VALUE} (Base Sepolia)`)
})
