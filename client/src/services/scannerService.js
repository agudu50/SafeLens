const defaultHistory = [
  {
    id: 'scan-001',
    type: 'message',
    riskLevel: 'high',
    riskScore: 87,
    summary: 'This message contains several characteristics commonly associated with fraudulent job offers.',
    redFlags: ['Requests an upfront payment', 'Creates urgency', 'Promises unrealistic financial rewards', 'Sender identity cannot be verified'],
    explanation: 'The message asks the recipient to make a payment before receiving employment benefits. This is a common pattern in job-related scams in Ghana.',
    recommendation: 'Do not send money or personal information. Verify the organization through its official website or contact information.',
    threatCategory: 'Fake Job & Recruitment Lures',
    vectorBreakdown: [
      { name: 'Fake Job & Recruitment Lures', percentage: 89, match: true, color: 'var(--danger)' },
      { name: 'Impersonation & Advance Fee Scams', percentage: 18, match: false, color: 'var(--warning)' },
      { name: 'MoMo Transfer & Cashout Fraud', percentage: 8, match: false, color: 'var(--primary)' },
      { name: 'Phishing Links & Spoofed Websites', percentage: 2, match: false, color: 'var(--success)' },
    ],
    originalContent: 'Congratulations! You have been selected for a remote job offer with guaranteed earnings. Send 50 GHS registration fee to proceed.',
    submittedAt: '2 hours ago',
  },
  {
    id: 'scan-002',
    type: 'screenshot',
    riskLevel: 'medium',
    riskScore: 62,
    summary: 'The screenshot shows a high-pressure payment request and a sender that cannot be verified.',
    redFlags: ['Uses pressure tactics', 'Asks for personal details', 'Suggests immediate action'],
    explanation: 'The message uses urgency to push quick decisions, which is a common tactic in scam communication.',
    recommendation: 'Pause before responding and confirm the request through a trusted official channel.',
    threatCategory: 'Impersonation & Advance Fee Scams',
    vectorBreakdown: [
      { name: 'Impersonation & Advance Fee Scams', percentage: 82, match: true, color: 'var(--danger)' },
      { name: 'MoMo Transfer & Cashout Fraud', percentage: 22, match: false, color: 'var(--warning)' },
      { name: 'Phishing Links & Spoofed Websites', percentage: 10, match: false, color: 'var(--primary)' },
      { name: 'Fake Job & Recruitment Lures', percentage: 4, match: false, color: 'var(--success)' },
    ],
    originalContent: 'Your account has been flagged. Click immediately to secure your profile.',
    submittedAt: 'Yesterday',
  },
  {
    id: 'scan-003',
    type: 'link',
    riskLevel: 'high',
    riskScore: 92,
    summary: 'This link leads to an unverified domain mimicking a prominent telecommunication portal.',
    redFlags: ['Uses insecure HTTP protocol', 'Domain spoofing attempt', 'Asks for MoMo PIN entry'],
    explanation: 'The link utilizes a domain containing spelling variations (e.g., mtn-gh-promo.xyz) intended to look like a legitimate site to steal customer credentials.',
    recommendation: 'Do not open the link or log in. Avoid entering Mobile Money PINs or credit card information on non-official websites.',
    threatCategory: 'Phishing Links & Spoofed Websites',
    vectorBreakdown: [
      { name: 'Phishing Links & Spoofed Websites', percentage: 94, match: true, color: 'var(--danger)' },
      { name: 'MoMo Transfer & Cashout Fraud', percentage: 14, match: false, color: 'var(--warning)' },
      { name: 'Fake Job & Recruitment Lures', percentage: 8, match: false, color: 'var(--primary)' },
      { name: 'Impersonation & Advance Fee Scams', percentage: 4, match: false, color: 'var(--success)' },
    ],
    originalContent: 'http://mtn-gh-promo.xyz/claim-cashout',
    submittedAt: '3 days ago',
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
  }
}

export function createMockScanResult(payload) {
  const riskLevel = payload.riskLevel || ''
  const result = buildResult({ type: payload.type, input: payload.input, riskLevel })
  history.unshift(result)
  saveHistory()
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

export function clearScanHistory() {
  history = []
  saveHistory()
}
