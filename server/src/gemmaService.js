import dotenv from 'dotenv'
dotenv.config()

const GEMMA_MODELS = [
  process.env.GEMMA_MODEL || 'gemma-4-26b-a4b-it',
  'gemma-4-31b-it',
]

export function getGemmaModelInfo() {
  const model = process.env.GEMMA_MODEL || 'gemma-4-26b-a4b-it'
  const hasKey = Boolean(process.env.GEMINI_API_KEY)
  return {
    activeModel: model,
    availableModels: GEMMA_MODELS,
    hasApiKey: hasKey,
    provider: 'Google AI Studio (Gemma 4 only)',
  }
}

/**
 * Analyzes suspicious messages, links, screenshots, or emails using Google Gemma 4.
 * Enforces strict JSON return structure tailored for the SafeLens fraud intelligence platform.
 */
export async function analyzeThreatWithGemma4({ type = 'message', input = '', image = null }) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in server/.env.')
  }

  const promptText = `
You are the SafeLens Threat Intelligence Engine powered by Google Gemma 4.
Your role is to perform forensic cybersecurity and scam fraud analysis on suspicious digital communications, specifically tuned for West African mobile money ecosystems (MTN MoMo, Telecel Cash, AT Money, USSD *170# codes, bank alerts, impersonation of authorities, fake job lures with upfront registration fees, urgent prize promotions, and spoofed phishing domains).

Input Details:
- Scan Type: ${type}
- Submitted Content: "${input || '(No text provided - analyze attached screenshot image)'}"

Analyze this submission rigorously for:
1. Threat indicators: urgency, pressure tactics, impersonation, fee requests, suspicious URLs/domains, USSD code execution (*170#, etc.), OTP/PIN harvesting.
2. Threat Category: exactly one of "MoMo Transfer & Cashout Fraud", "Fake Job & Recruitment Lures", "Phishing Links & Spoofed Websites", "Impersonation & Advance Fee Scams", or "Other".
3. Overall Risk Level: "high", "medium", or "low".
4. Risk Score: integer between 0 and 100.
5. Plain-English summary, specific red flags, actionable recommendations, and vector breakdown percentages.

You MUST respond ONLY with a single JSON object matching this exact schema:
{
  "riskLevel": "high" | "medium" | "low",
  "riskScore": <number 0-100>,
  "summary": "<1-2 sentence executive summary of the threat>",
  "redFlags": ["<specific red flag 1>", "<specific red flag 2>", "<specific red flag 3>"],
  "explanation": "<thorough explanation of how the scam works, the psychology used, and technical indicators>",
  "recommendation": "<direct, practical security guidance on what the user should and should not do>",
  "threatCategory": "MoMo Transfer & Cashout Fraud" | "Fake Job & Recruitment Lures" | "Phishing Links & Spoofed Websites" | "Impersonation & Advance Fee Scams",
  "vectorBreakdown": [
    { "name": "MoMo Transfer & Cashout Fraud", "percentage": <0-100>, "match": <boolean> },
    { "name": "Fake Job & Recruitment Lures", "percentage": <0-100>, "match": <boolean> },
    { "name": "Phishing Links & Spoofed Websites", "percentage": <0-100>, "match": <boolean> },
    { "name": "Impersonation & Advance Fee Scams", "percentage": <0-100>, "match": <boolean> }
  ]
}
`.trim()

  const parts = [{ text: promptText }]

  // If a screenshot image is provided, parse and attach it
  if (image && typeof image === 'string') {
    let mimeType = 'image/png'
    let base64Data = image

    if (image.startsWith('data:')) {
      const match = image.match(/^data:([^;]+);base64,(.+)$/)
      if (match) {
        mimeType = match[1]
        base64Data = match[2]
      }
    }

    if (base64Data) {
      parts.push({
        inline_data: {
          mime_type: mimeType,
          data: base64Data,
        },
      })
    }
  }

  // Attempt generation using the primary Gemma 4 model, with fallback to secondary Gemma 4 model
  let rawJsonText = ''
  let usedModel = GEMMA_MODELS[0]
  let lastError = null

  for (const model of GEMMA_MODELS) {
    try {
      usedModel = model
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.15,
          },
        }),
      })

      if (!response.ok) {
        const errorBody = await response.text()
        throw new Error(`Google AI Studio API error (${response.status}): ${errorBody}`)
      }

      const data = await response.json()
      // Extract non-thinking text parts from Gemma 4
      const candidateParts = data.candidates?.[0]?.content?.parts || []
      const textPart = candidateParts
        .filter((p) => !p.thought && p.text)
        .map((p) => p.text)
        .join('')

      if (textPart.trim()) {
        rawJsonText = textPart.trim()
        break
      }
    } catch (err) {
      lastError = err
      console.warn(`[SafeLens AI] Gemma 4 model (${model}) call failed:`, err.message)
    }
  }

  if (!rawJsonText) {
    throw lastError || new Error('Gemma 4 did not return a valid threat analysis response.')
  }

  let cleaned = rawJsonText.trim()
  let parsed = null
  try {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0])
    } else {
      parsed = JSON.parse(cleaned)
    }
  } catch (err) {
    console.error('[SafeLens AI] Failed to parse Gemma 4 JSON:', cleaned)
    throw new Error('Failed to parse AI output into structured threat intelligence.')
  }

  // Standardize vector breakdown colors
  const defaultColors = {
    'MoMo Transfer & Cashout Fraud': 'var(--danger)',
    'Fake Job & Recruitment Lures': 'var(--warning)',
    'Phishing Links & Spoofed Websites': 'var(--primary)',
    'Impersonation & Advance Fee Scams': 'var(--success)',
  }

  const standardizedBreakdown = (parsed.vectorBreakdown || []).map((vector) => ({
    name: vector.name,
    percentage: typeof vector.percentage === 'number' ? vector.percentage : 25,
    match: Boolean(vector.match),
    color: defaultColors[vector.name] || 'var(--primary)',
  }))

  const id = `scan-${Math.random().toString(36).slice(2, 9)}`
  const now = new Date()

  return {
    id,
    type,
    riskLevel: ['high', 'medium', 'low'].includes(parsed.riskLevel?.toLowerCase())
      ? parsed.riskLevel.toLowerCase()
      : 'medium',
    riskScore: typeof parsed.riskScore === 'number' ? Math.min(100, Math.max(0, parsed.riskScore)) : 65,
    summary: parsed.summary || 'Security threat evaluation completed.',
    redFlags: Array.isArray(parsed.redFlags) && parsed.redFlags.length > 0 ? parsed.redFlags : ['Suspicious intent identified'],
    explanation: parsed.explanation || 'Detailed analysis highlights characteristic fraud indicators.',
    recommendation: parsed.recommendation || 'Do not engage or share funds. Verify directly with the organization.',
    threatCategory: parsed.threatCategory || 'MoMo Transfer & Cashout Fraud',
    vectorBreakdown: standardizedBreakdown.length > 0 ? standardizedBreakdown : [
      { name: 'MoMo Transfer & Cashout Fraud', percentage: 85, match: true, color: 'var(--danger)' },
      { name: 'Fake Job & Recruitment Lures', percentage: 20, match: false, color: 'var(--warning)' },
      { name: 'Phishing Links & Spoofed Websites', percentage: 10, match: false, color: 'var(--primary)' },
      { name: 'Impersonation & Advance Fee Scams', percentage: 40, match: false, color: 'var(--success)' },
    ],
    originalContent: input || (image ? 'Attached screenshot image analysis' : 'No input provided'),
    submittedAt: 'Just now',
    createdAt: now.toISOString().slice(0, 10),
    modelUsed: `Google Gemma 4 (${usedModel})`,
  }
}
