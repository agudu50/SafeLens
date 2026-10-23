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
import { analyzeThreatWithGemma4, getGemmaModelInfo } from './gemmaService.js'
import {
  initDb,
  saveReport,
  getReportById,
  getRecentReports,
  saveAnchorReceipt,
} from './db.js'

dotenv.config()

// Initialize Neon database tables on server start
initDb().catch((err) => console.error('[Neon DB] Startup error:', err))

const app = express()
// Increase JSON limit so screenshot base64 images can be received cleanly
app.use(express.json({ limit: '10mb' }))

// Live Terminal Request Logger
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    const statusColor = res.statusCode >= 500 ? '\x1b[31m' : res.statusCode >= 400 ? '\x1b[33m' : '\x1b[32m'
    const reset = '\x1b[0m'
    const time = new Date().toLocaleTimeString()
    console.log(`[${time}] ${req.method} ${req.originalUrl} -> ${statusColor}${res.statusCode}${reset} (${duration}ms)`)
  })
  next()
})

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
  res.json({
    ok: true,
    contract: CONTRACT_ADDRESS_VALUE,
    ai: getGemmaModelInfo(),
    database: {
      provider: 'Neon Serverless Postgres',
      branch: process.env.NEON_BRANCH || 'production',
      connected: Boolean(process.env.DATABASE_URL),
    },
  })
})

// Retrieve recent scan reports from Neon DB
app.get('/api/reports', async (req, res) => {
  try {
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20))
    const reports = await getRecentReports(limit)
    res.json({ count: reports.length, reports })
  } catch (err) {
    console.error('Failed to retrieve reports from Neon DB:', err)
    res.status(500).json({ error: 'Failed to retrieve reports from database.' })
  }
})

// Retrieve a single report by ID from Neon DB
app.get('/api/reports/:id', async (req, res) => {
  try {
    const report = await getReportById(req.params.id)
    if (!report) {
      return res.status(404).json({ error: 'Report not found in database.' })
    }
    res.json(report)
  } catch (err) {
    console.error('Failed to retrieve report from Neon DB:', err)
    res.status(500).json({ error: 'Failed to retrieve report.' })
  }
})

// Scan content or screenshot images using Google Gemma 4 and save to Neon DB
app.post('/api/scan', async (req, res) => {
  const { type = 'message', input = '', image = null } = req.body || {}

  if (!input && !image) {
    return res.status(400).json({ error: 'Please provide either text content or an image to analyze.' })
  }

  try {
    const scanResult = await analyzeThreatWithGemma4({ type, input, image })
    // Persist scan result to Neon Postgres
    await saveReport(scanResult).catch((dbErr) =>
      console.warn('[Neon DB] Non-blocking report save warning:', dbErr.message)
    )
    res.json(scanResult)
  } catch (err) {
    console.error('Threat scan error with Gemma 4:', err)
    res.status(500).json({
      error: err.message || 'Failed to complete threat analysis with Gemma 4.',
    })
  }
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

    // Persist on-chain anchor receipt to Neon DB
    await saveAnchorReceipt({
      reportId: id,
      reportHash,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      network: 'Base Sepolia (L2)',
      contractAddress: CONTRACT_ADDRESS_VALUE,
      explorerUrl: `${EXPLORER_BASE_URL}/tx/${receipt.hash}`,
    }).catch((dbErr) => console.warn('[Neon DB] Non-blocking anchor save warning:', dbErr.message))

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
