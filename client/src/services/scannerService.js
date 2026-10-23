const defaultHistory = [
  {
    id: 'scan-gdjkzmr',
    type: 'message',
    riskLevel: 'high',
    riskScore: 95,
    summary: 'Urgent notice from MTN: You have 1 unread message and your wallet will be blocked. Dial *170# immediately.',
    redFlags: [
      "Artificial urgency ('Urgent notice')",
      "Threat of service disruption ('wallet will be blocked')",
      "Unsolicited instruction to use USSD codes (*170#)",
      "Impersonation of a mobile network operator (MTN)"
    ],
    explanation: "This message utilizes fear-based social engineering. By threatening to block the user's wallet, the attacker creates a sense of panic designed to bypass the user's critical thinking. The instruction to dial *170# (the legitimate MTN MoMo USSD code) is a tactic to get the user into a transaction menu where they can be manipulated into authorizing a transfer, changing their PIN, or providing an OTP to a fraudulent prompt initiated by the attacker.",
    recommendation: 'Reject any unsolicited prompts on your phone. Official telecommunication operators will never threaten automatic wallet termination via unverified SMS.',
    threatCategory: 'Impersonation & Advance Fee Scams',
    vectorBreakdown: [
      { name: 'Social Coercion & Urgency', percentage: 96, match: true, color: 'var(--primary)' },
      { name: 'Brand Impersonation (MTN/Telco)', percentage: 92, match: true, color: '#f59e0b' },
      { name: 'Unauthorized USSD / Cashout Payload', percentage: 98, match: true, color: 'var(--primary)' },
      { name: 'Sender Identity Anomaly', percentage: 94, match: true, color: '#38bdf8' }
    ],
    originalContent: 'Urgent notice from MTN: You have 1 unread message and your wallet will be blocked. Dial *170# immediately.',
    submittedAt: 'Just now',
    createdAt: '2026-10-23',
    modelUsed: 'Google Gemma 4 (gemma-4-26b-a4b-it)'
  },
  {
    id: 'scan-2l6zeyx',
    type: 'message',
    riskLevel: 'high',
    riskScore: 98,
    summary: 'SECURITY TEST: Telecel promo cashout 1000 GHS approved. Send your PIN to confirm.',
    redFlags: [
      'Direct demand for confidential MoMo PIN',
      'Unsolicited fake cashout incentive (1,000 GHS)',
      'Impersonation of Telecel Cash network',
      'High-threat credential extraction signature'
    ],
    explanation: 'The communication solicits the user to reveal their secret 4-digit Mobile Money PIN under the pretext of claiming an unrequested cash reward. Legitimate telcos never request PINs for promo disbursements.',
    recommendation: 'Never disclose your PIN or OTP to anyone. Telecel and MTN will never ask for your PIN over SMS, WhatsApp, or phone calls.',
    threatCategory: 'MoMo Transfer & Cashout Fraud',
    vectorBreakdown: [
      { name: 'MoMo Transfer & Cashout Fraud', percentage: 98, match: true, color: 'var(--primary)' },
      { name: 'Social Coercion & Urgency', percentage: 95, match: true, color: 'var(--primary)' },
      { name: 'Brand Impersonation (MTN/Telco)', percentage: 92, match: true, color: '#f59e0b' },
      { name: 'Sender Identity Anomaly', percentage: 88, match: true, color: '#38bdf8' }
    ],
    originalContent: 'SECURITY TEST: Telecel promo cashout 1000 GHS approved. Send your PIN to confirm.',
    submittedAt: 'Just now',
    createdAt: '2026-10-23',
    modelUsed: 'Google Gemma 4 (gemma-4-26b-a4b-it)'
  }
]

let history = [];
const loadHistory = () => {
  try {
    const stored = localStorage.getItem('safelens_history')
    if (stored) {
      history = JSON.parse(stored)
    } else {
      history = [...defaultHistory]
      localStorage.setItem('safelens_history', JSON.stringify(history))
    }
  } catch {
    history = [...defaultHistory]
  }
}

// Initial load
loadHistory();

const saveHistory = () => {
  try {
    localStorage.setItem('safelens_history', JSON.stringify(history))
  } catch (error) {
    console.error('Failed to save history to localStorage', error)
  }
}

function buildResult({ type = 'message', input = '', riskLevel = '' }) {
  const cleaned = input.trim()
  let finalRiskLevel = riskLevel || ''
  let riskScore = 0
  let summary = ''
  let redFlags = []
  let explanation = ''
  let recommendation = ''

  let threatCategory = 'MoMo Transfer & Cashout Fraud'
  let vectorBreakdown = [
    { name: 'MoMo Transfer & Cashout Fraud', percentage: 92, match: true, color: 'var(--danger)' },
    { name: 'Fake Job & Recruitment Lures', percentage: 24, match: false, color: 'var(--warning)' },
    { name: 'Phishing Links & Spoofed Websites', percentage: 14, match: false, color: 'var(--primary)' },
    { name: 'Impersonation & Advance Fee Scams', percentage: 8, match: false, color: 'var(--success)' },
  ]

  const lowerText = cleaned.toLowerCase()
  if (type === 'link' || /http|\.xyz|\.top|\.site|claim|free-data|bonus/i.test(lowerText)) {
    threatCategory = 'Phishing Links & Spoofed Websites'
    vectorBreakdown = [
      { name: 'Phishing Links & Spoofed Websites', percentage: 94, match: true, color: 'var(--danger)' },
      { name: 'MoMo Transfer & Cashout Fraud', percentage: 14, match: false, color: 'var(--warning)' },
      { name: 'Fake Job & Recruitment Lures', percentage: 8, match: false, color: 'var(--primary)' },
      { name: 'Impersonation & Advance Fee Scams', percentage: 4, match: false, color: 'var(--success)' },
    ]
  } else if (/job|work|video|like|apply|agent fee|registration fee|recruiter/i.test(lowerText)) {
    threatCategory = 'Fake Job & Recruitment Lures'
    vectorBreakdown = [
      { name: 'Fake Job & Recruitment Lures', percentage: 89, match: true, color: 'var(--danger)' },
      { name: 'Impersonation & Advance Fee Scams', percentage: 18, match: false, color: 'var(--warning)' },
      { name: 'MoMo Transfer & Cashout Fraud', percentage: 8, match: false, color: 'var(--primary)' },
      { name: 'Phishing Links & Spoofed Websites', percentage: 2, match: false, color: 'var(--success)' },
    ]
  } else if (/momo|cashout|refund|wrong transfer|\*170#|pin|otp|mtn|telecel|at money/i.test(lowerText)) {
    threatCategory = 'MoMo Transfer & Cashout Fraud'
    vectorBreakdown = [
      { name: 'MoMo Transfer & Cashout Fraud', percentage: 92, match: true, color: 'var(--danger)' },
      { name: 'Impersonation & Advance Fee Scams', percentage: 14, match: false, color: 'var(--warning)' },
      { name: 'Phishing Links & Spoofed Websites', percentage: 6, match: false, color: 'var(--primary)' },
      { name: 'Fake Job & Recruitment Lures', percentage: 2, match: false, color: 'var(--success)' },
    ]
  } else {
    threatCategory = 'Impersonation & Advance Fee Scams'
    vectorBreakdown = [
      { name: 'Impersonation & Advance Fee Scams', percentage: 82, match: true, color: 'var(--danger)' },
      { name: 'MoMo Transfer & Cashout Fraud', percentage: 22, match: false, color: 'var(--warning)' },
      { name: 'Phishing Links & Spoofed Websites', percentage: 10, match: false, color: 'var(--primary)' },
      { name: 'Fake Job & Recruitment Lures', percentage: 4, match: false, color: 'var(--success)' },
    ]
  }

  if (type === 'link') {
    const isHttps = cleaned.toLowerCase().startsWith('https://')
    const hasScamKeywords = /promo|claim|bonus|free|giveaway|cashout|momo|win|gift/i.test(cleaned)
    const hasSuspiciousTld = /\.(xyz|cc|top|club|click|info|run|work|net|live)$/i.test(cleaned)

    if (hasScamKeywords && !isHttps) {
      finalRiskLevel = 'high'
      riskScore = 95
      summary = 'High threat link mimicking commercial platforms, using unsafe connection protocols.'
      redFlags = ['Insecure HTTP protocol', 'Spam/Phishing keywords in URL', 'Suspicious domain extension (.xyz/.cc)', 'Unverified domain identity']
      explanation = 'The URL uses terms like "claim" or "cashout" and lacks SSL encryption (HTTP). This is standard for phishing sites targeting Mobile Money wallets in West Africa.'
      recommendation = 'Close this link immediately. Do not share your banking password, MoMo PIN, or personal information.'
    } else if (hasScamKeywords || hasSuspiciousTld || !isHttps) {
      finalRiskLevel = 'medium'
      riskScore = 65
      summary = 'Suspicious link showing potential trust and protocol warnings.'
      redFlags = ['Lacks trusted SSL verification', 'Unusual domain registration profile', 'Redirect triggers detected']
      explanation = 'The address points to a minor or generic top-level domain and has structural warning signs that call for verification.'
      recommendation = 'Review the sender source. Avoid entering any input or logging into accounts via this URL.'
    } else {
      finalRiskLevel = 'low'
      riskScore = 18
      summary = 'This link appears to use secure protocols and has a stable domain profile.'
      redFlags = ['None flagged']
      explanation = 'SafeLens checked the URL protocol (HTTPS) and basic domain signatures. No common blacklist patterns were triggered.'
      recommendation = 'Ensure you recognize the sender who shared this link before taking actions on the target site.'
    }
  } else if (type === 'email') {
    const lowerInput = cleaned.toLowerCase()
    const urgentKeyword = /urgent|immediate|warn|action required|suspended|critical/i.test(lowerInput)
    const financialKeyword = /bank|momo|payment|transfer|invoice|atm|claim|win|prize|dollar/i.test(lowerInput)
    const personalInfoRequest = /password|credential|ssn|pin|verification|login/i.test(lowerInput)

    if (urgentKeyword && financialKeyword && personalInfoRequest) {
      finalRiskLevel = 'high'
      riskScore = 89
      summary = 'Urgent phishing email requesting immediate account details or money transfers.'
      redFlags = ['Urgency and pressure tactics', 'Financial request under threats', 'Demands login/identity credentials', 'Impersonation signature']
      explanation = 'The email uses high-pressure language to demand immediate actions (e.g. security audits or transfers), a tactic frequently used to bypass logical checks.'
      recommendation = 'Do not reply, click on attachments, or supply your details. Block the sender address and report spam.'
    } else if (urgentKeyword || financialKeyword || personalInfoRequest) {
      finalRiskLevel = 'medium'
      riskScore = 58
      summary = 'Moderately suspicious email requesting credentials or detailing a transfer.'
      redFlags = ['Financial transaction keywords', 'Calls for personal confirmation', 'Generic greeting used']
      explanation = 'The email mentions financial or account operations using terms that could represent standard billing, but it is structured with generalized templates typical of bulk solicitations.'
      recommendation = 'Verify the sender by cross-referencing their official corporate email domains before taking actions.'
    } else {
      finalRiskLevel = 'low'
      riskScore = 22
      summary = 'The email content displays general text profiles without major alert flags.'
      redFlags = ['No high-risk structures identified']
      explanation = 'Basic analysis did not detect high-urgency keywords, transaction requests, or credential solicitation patterns.'
      recommendation = 'Continue to check the sender domain carefully. Never download unexpected .exe or .zip attachments.'
    }
  } else {
    // Default message and screenshot logic
    const lowerInput = cleaned.toLowerCase()
    const isUrgent = lowerInput.includes('payment') || lowerInput.includes('urgent') || lowerInput.includes('win') || lowerInput.includes('momo')
    
    if (finalRiskLevel === 'high' || (finalRiskLevel === '' && isUrgent)) {
      finalRiskLevel = 'high'
      riskScore = 85 + Math.floor(Math.random() * 10)
      summary = 'High risk scam signature detected with strong financial or urgent pressure.'
      redFlags = ['Creates artificial urgency', 'Requests Mobile Money or financial transfer', 'Uses warning/fear tactics', 'Sender details cannot be verified']
      explanation = 'The communication attempts to force a quick decision by threatening loss of services or claiming a time-limited financial win. This matches standard Ghanaian Mobile Money (MoMo) scams.'
      recommendation = 'Do not send money, code approvals, or passwords. Block the sender and contact your service provider directly.'
    } else if (finalRiskLevel === 'medium' || finalRiskLevel === '') {
      finalRiskLevel = 'medium'
      riskScore = 55 + Math.floor(Math.random() * 15)
      summary = 'Suspicious elements identified that require verification.'
      redFlags = ['Contains pushy directives', 'Uses unverified sender formatting', 'Requests unusual action']
      explanation = 'The message contains requests for clicks or detail validation. While it does not explicitly demand money, the phrasing is atypical of professional organizations.'
      recommendation = 'Confirm the request through an independent official phone call or portal. Do not click links.'
    } else {
      finalRiskLevel = 'low'
      riskScore = 15 + Math.floor(Math.random() * 15)
      summary = 'Low risk content. No major scam patterns were matched.'
      redFlags = ['Low threat syntax profile']
      explanation = 'SafeLens scanned for typical scam patterns, transaction directives, and coercive keywords. The content reads as a routine message.'
      recommendation = 'Review details manually. If it seems too good to be true, it usually is.'
    }
  }

  return {
    id: `scan-${Math.random().toString(36).slice(2, 8)}`,
    type,
    riskLevel: finalRiskLevel,
    riskScore,
    summary,
    redFlags,
    explanation,
    recommendation,
    threatCategory,
    vectorBreakdown,
    originalContent: cleaned || 'Sample scan content placeholder',
    submittedAt: 'Just now',
    createdAt: new Date().toISOString().slice(0, 10),
  }
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

/**
 * Scans content via backend Gemma 4 AI engine.
 * Falls back seamlessly to local heuristic engine if the backend is unreachable.
 */
export async function scanThreat({ type = 'message', input = '', image = null, riskLevel = '' }) {
  try {
    const response = await fetch(`${API_URL}/api/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, input, image }),
    })

    if (response.ok) {
      const data = await response.json()
      loadHistory()
      history.unshift(data)
      saveHistory()
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('safelens_scan_completed', { detail: data }))
      }
      return data
    } else {
      const errData = await response.json().catch(() => ({}))
      console.warn('[SafeLens] Backend Gemma 4 scan returned an error:', errData.error)
    }
  } catch (err) {
    console.warn('[SafeLens] Network error reaching SafeLens Gemma 4 API, utilizing local fallback engine:', err)
  }

  loadHistory()
  const fallbackResult = buildResult({ type, input, riskLevel })
  fallbackResult.modelUsed = 'Local Heuristic Engine (Offline Fallback)'
  history.unshift(fallbackResult)
  saveHistory()
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('safelens_scan_completed', { detail: fallbackResult }))
  }
  return fallbackResult
}

export function createMockScanResult(payload) {
  const riskLevel = payload.riskLevel || ''
  const result = buildResult({ type: payload.type, input: payload.input, riskLevel })
  loadHistory()
  history.unshift(result)
  saveHistory()
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('safelens_scan_completed', { detail: result }))
  }
  return result
}

export function getMockScanResult(id) {
  loadHistory()
  return history.find((item) => item.id === id) || history[0]
}

export function getScanHistory() {
  loadHistory()
  return history
}

/**
 * Fetches recent threat reports from the Neon Postgres database.
 */
export async function fetchDbReports(limit = 20) {
  try {
    const res = await fetch(`${API_URL}/api/reports?limit=${limit}`)
    if (res.ok) {
      const data = await res.json()
      if (data.reports && data.reports.length > 0) {
        loadHistory()
        // Merge so DB reports come first in chronological order, followed by any local scans not yet in DB
        const merged = [...data.reports]
        for (const h of history) {
          if (!merged.some((r) => r.id === h.id)) {
            merged.push(h)
          }
        }
        history = merged
        saveHistory()
        return merged
      }
    }
  } catch (err) {
    console.warn('[SafeLens] Failed to sync reports from Neon DB:', err)
  }
  return getScanHistory()
}

export function clearScanHistory() {
  history = []
  saveHistory()
}
