const history = [
  {
    id: 'scan-001',
    type: 'message',
    riskLevel: 'high',
    riskScore: 87,
    summary: 'This message contains several characteristics commonly associated with fraudulent job offers.',
    redFlags: ['Requests an upfront payment', 'Creates urgency', 'Promises unrealistic financial rewards', 'Sender identity cannot be verified'],
    explanation: 'The message asks the recipient to make a payment before receiving employment benefits. This is a common pattern in job-related scams.',
    recommendation: 'Do not send money or personal information. Verify the organization through its official website or contact information.',
    originalContent: 'Congratulations! You have been selected for a remote job offer with guaranteed earnings.',
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
    originalContent: 'Your account has been flagged. Click immediately to secure your profile.',
    submittedAt: 'Yesterday',
  },
]

function buildResult({ type = 'message', input = '', riskLevel = 'medium' }) {
  const cleaned = input.trim()
  const riskScore = riskLevel === 'high' ? 87 : riskLevel === 'medium' ? 62 : 24

  return {
    id: `scan-${Math.random().toString(36).slice(2, 8)}`,
    type,
    riskLevel,
    riskScore,
    summary: cleaned.length > 0
      ? 'This content shows several warning signs that are commonly associated with suspicious or fraudulent outreach.'
      : 'This example shows how SafeLens describes suspicious content in a clear, human-friendly way.',
    redFlags: [
      'Creates urgency or fear',
      'Requests money or sensitive information',
      'Uses a sender or contact method that cannot be verified',
    ],
    explanation: cleaned.length > 0
      ? `The message uses pressure and financial incentives to push a quick response. SafeLens highlights these patterns so you can assess the risk before acting.`
      : 'SafeLens evaluates the tone, urgency, and request structure to explain the possible risk level in clear terms.',
    recommendation: 'Do not send money or share personal information until the request is verified through a trusted official channel.',
    originalContent: cleaned || 'Sample suspicious message placeholder',
    submittedAt: 'Just now',
  }
}

export function createMockScanResult(payload) {
  const riskLevel = payload.riskLevel || 'medium'
  const result = buildResult({ type: payload.type, input: payload.input, riskLevel })
  history.unshift(result)
  return result
}

export function getMockScanResult(id) {
  return history.find((item) => item.id === id) || history[0]
}

export function getScanHistory() {
  return history
}
