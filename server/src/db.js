import dotenv from 'dotenv'
import { neon } from '@neondatabase/serverless'

dotenv.config()

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  console.warn('[Neon DB] DATABASE_URL is not set.')
}

export const sql = databaseUrl ? neon(databaseUrl) : null

/**
 * Initializes required database tables in Neon Postgres.
 */
export async function initDb() {
  if (!sql) {
    console.warn('[Neon DB] Skipping init: DATABASE_URL not set.')
    return false
  }

  try {
    // Test basic connectivity
    const [test] = await sql`SELECT NOW() AS current_time, current_database() AS db_name;`
    console.log(`[Neon DB] Connected successfully to database: ${test.db_name} at ${test.current_time}`)

    // Create reports table
    await sql`
      CREATE TABLE IF NOT EXISTS reports (
        id VARCHAR(64) PRIMARY KEY,
        type VARCHAR(32) NOT NULL,
        risk_level VARCHAR(16) NOT NULL,
        risk_score INTEGER NOT NULL,
        summary TEXT NOT NULL,
        red_flags JSONB DEFAULT '[]'::jsonb,
        explanation TEXT NOT NULL,
        recommendation TEXT NOT NULL,
        threat_category VARCHAR(128),
        vector_breakdown JSONB DEFAULT '[]'::jsonb,
        original_content TEXT NOT NULL,
        model_used VARCHAR(128),
        submitted_at VARCHAR(64),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Create anchors table
    await sql`
      CREATE TABLE IF NOT EXISTS anchors (
        id SERIAL PRIMARY KEY,
        report_id VARCHAR(64),
        report_hash VARCHAR(66) NOT NULL,
        tx_hash VARCHAR(66),
        block_number INTEGER,
        is_registered BOOLEAN DEFAULT TRUE,
        network VARCHAR(64) DEFAULT 'Base Sepolia (L2)',
        contract_address VARCHAR(42),
        explorer_url TEXT,
        anchored_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `

    console.log('[Neon DB] Tables "reports" and "anchors" initialized successfully.')
    return true
  } catch (err) {
    console.error('[Neon DB] Initialization error:', err)
    return false
  }
}

/**
 * Saves a scan report to Neon Postgres.
 */
export async function saveReport(report) {
  if (!sql) return null
  try {
    const [inserted] = await sql`
      INSERT INTO reports (
        id, type, risk_level, risk_score, summary, red_flags, explanation,
        recommendation, threat_category, vector_breakdown, original_content,
        model_used, submitted_at, created_at
      ) VALUES (
        ${report.id},
        ${report.type},
        ${report.riskLevel},
        ${report.riskScore},
        ${report.summary},
        ${JSON.stringify(report.redFlags || [])},
        ${report.explanation},
        ${report.recommendation},
        ${report.threatCategory},
        ${JSON.stringify(report.vectorBreakdown || [])},
        ${report.originalContent},
        ${report.modelUsed},
        ${report.submittedAt || 'Just now'},
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        risk_level = EXCLUDED.risk_level,
        risk_score = EXCLUDED.risk_score,
        summary = EXCLUDED.summary
      RETURNING *;
    `
    return inserted
  } catch (err) {
    console.error('[Neon DB] Failed to save report:', err)
    return null
  }
}

/**
 * Retrieves a report by ID.
 */
export async function getReportById(id) {
  if (!sql) return null
  try {
    const rows = await sql`SELECT * FROM reports WHERE id = ${id} LIMIT 1;`
    if (rows.length === 0) return null
    const r = rows[0]
    return {
      id: r.id,
      type: r.type,
      riskLevel: r.risk_level,
      riskScore: r.risk_score,
      summary: r.summary,
      redFlags: r.red_flags,
      explanation: r.explanation,
      recommendation: r.recommendation,
      threatCategory: r.threat_category,
      vectorBreakdown: r.vector_breakdown,
      originalContent: r.original_content,
      modelUsed: r.model_used,
      submittedAt: r.submitted_at,
      createdAt: r.created_at,
    }
  } catch (err) {
    console.error('[Neon DB] Failed to fetch report:', err)
    return null
  }
}

/**
 * Retrieves the latest reports for telemetry and history.
 */
export async function getRecentReports(limit = 20) {
  if (!sql) return []
  try {
    const rows = await sql`
      SELECT * FROM reports
      ORDER BY created_at DESC
      LIMIT ${limit};
    `
    return rows.map((r) => ({
      id: r.id,
      type: r.type,
      riskLevel: r.risk_level,
      riskScore: r.risk_score,
      summary: r.summary,
      redFlags: r.red_flags,
      explanation: r.explanation,
      recommendation: r.recommendation,
      threatCategory: r.threat_category,
      vectorBreakdown: r.vector_breakdown,
      originalContent: r.original_content,
      modelUsed: r.model_used,
      submittedAt: r.submitted_at,
      createdAt: r.created_at,
    }))
  } catch (err) {
    console.error('[Neon DB] Failed to fetch recent reports:', err)
    return []
  }
}

/**
 * Saves an on-chain anchor receipt.
 */
export async function saveAnchorReceipt({ reportId, reportHash, txHash, blockNumber, network, contractAddress, explorerUrl }) {
  if (!sql) return null
  try {
    const [inserted] = await sql`
      INSERT INTO anchors (
        report_id, report_hash, tx_hash, block_number, network, contract_address, explorer_url, anchored_at
      ) VALUES (
        ${reportId || null},
        ${reportHash},
        ${txHash || null},
        ${blockNumber || null},
        ${network || 'Base Sepolia (L2)'},
        ${contractAddress || null},
        ${explorerUrl || null},
        NOW()
      )
      RETURNING *;
    `
    return inserted
  } catch (err) {
    console.error('[Neon DB] Failed to save anchor receipt:', err)
    return null
  }
}
