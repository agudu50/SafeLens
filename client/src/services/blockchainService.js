const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

/**
 * Anchors a scam report's content hash on the Base L2 SafeLensRegistry contract.
 * The backend signs/pays for the transaction with its own service wallet, so the
 * end user never needs a crypto wallet to submit a report.
 */
export async function anchorReport({ id, content, riskLevel, riskScore }) {
  const response = await fetch(`${API_URL}/api/reports/anchor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, content, riskLevel, riskScore }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data?.error || 'Failed to anchor report on-chain.')
  }
  return data
}

/** Reads the on-chain registration status for a given report hash (read-only, no gas). */
export async function verifyReportHash(reportHash) {
  const response = await fetch(`${API_URL}/api/reports/verify/${reportHash}`)
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data?.error || 'Failed to verify report on-chain.')
  }
  return data
}
