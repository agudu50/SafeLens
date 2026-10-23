import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import SecurityChatbot from '../components/SecurityChatbot'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import { getScanHistory, fetchDbReports, scanThreat } from '../services/scannerService'
import { subscriptionService } from '../services/subscriptionService'

export default function Dashboard({ user }) {
  const userName = user?.name ? user.name.split(' ')[0] : (user?.email ? user.email.split('@')[0] : 'Kofi')

  // Synchronously initialize from persistent history so content is completely stable on page refresh
  const [reports, setReports] = useState(() => {
    try {
      const cached = localStorage.getItem('safelens_history')
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed) && parsed.length >= 8) return parsed
      }
      return getScanHistory()
    } catch {
      return getScanHistory()
    }
  })
  const [isLoadingReports, setIsLoadingReports] = useState(false)
  const [activeTab, setActiveTab] = useState('trends') // 'trends' | 'vectors' | 'matrix'
  const [filterType, setFilterType] = useState('all') // 'all' | 'message' | 'link' | 'screenshot' | 'email'
  const [filterSeverity, setFilterSeverity] = useState('all') // 'all' | 'high' | 'medium' | 'low'
  const [searchQuery, setSearchQuery] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [hoveredDay, setHoveredDay] = useState(4) // Default to Friday peak on load
  const [isCopilotOpen, setIsCopilotOpen] = useState(false)
  const [selectedIncidentForAudit, setSelectedIncidentForAudit] = useState(null)
  const [spotlightIndex, setSpotlightIndex] = useState(() => {
    try {
      const saved = sessionStorage.getItem('safelens_spotlight_idx')
      return saved !== null ? parseInt(saved, 10) || 0 : 0
    } catch {
      return 0
    }
  })
  const [liveSyncNotification, setLiveSyncNotification] = useState(null)
  const [isSimulatingScan, setIsSimulatingScan] = useState(false)

  const changeSpotlight = (idx) => {
    setSpotlightIndex(idx)
    try {
      sessionStorage.setItem('safelens_spotlight_idx', String(idx))
    } catch {}
  }

  // Live Defense Shields state
  const [defenseShields, setDefenseShields] = useState([
    { id: 'momo_ussd', label: 'MoMo *170# USSD Interceptor', status: 'ACTIVE', desc: 'Auto-flags fake reversal and unauthorized prompt attacks', active: true },
    { id: 'phish_guard', label: 'Phishing Domain Repulsor', status: 'ACTIVE', desc: 'Inspects spoofed TLDs (.xyz, .top, .site) and unverified SSL', active: true },
    { id: 'gemma4_ocr', label: 'Gemma 4 Multimodal Vision', status: 'ACTIVE', desc: 'Analyzes screenshot chat captures directly with AI', active: true },
    { id: 'sim_swap', label: 'SIM Swap & Impersonation Filter', status: 'ACTIVE', desc: 'Detects high-urgency telco impersonation signatures', active: true },
  ])

  // Threat Advisory ticker
  const [advisoryIdx, setAdvisoryIdx] = useState(0)
  const advisories = [
    { priority: 'CRITICAL', tag: 'MOMO FRAUD', text: 'Active wave of fraudulent "wrong credit" SMS asking users to dial *170# to refund.', source: 'CSA Ghana' },
    { priority: 'HIGH', tag: 'DOMAIN SPOOF', text: 'Spoofed telecom domains claiming 50GB free holiday data detected targeting Accra and Kumasi.', source: 'SafeLens AI' },
    { priority: 'CRITICAL', tag: 'PIN HARVESTING', text: 'Callers impersonating MTN customer service demanding 4-digit MoMo PINs to unblock accounts.', source: 'Telco Alert' },
    { priority: 'HIGH', tag: 'JOB RECRUITMENT', text: 'Fake remote data entry vacancies demanding GHS 50 registration fees via mobile money.', source: 'CyberWatch' },
  ]

  // Time & Advisory tickers
  useEffect(() => {
    const clock = setInterval(() => setCurrentTime(new Date()), 1000)
    const ticker = setInterval(() => setAdvisoryIdx((prev) => (prev + 1) % advisories.length), 5000)
    return () => {
      clearInterval(clock)
      clearInterval(ticker)
    }
  }, [])

  // Load Neon DB Reports and listen for real-time AI scans
  useEffect(() => {
    async function loadData() {
      try {
        const [dbReports] = await Promise.all([
          fetchDbReports(30),
          subscriptionService.getUserSubscription().catch(() => null),
        ])
        if (dbReports && dbReports.length > 0) {
          setReports(dbReports)
        }
      } catch (err) {
        console.warn('Dashboard data fetch error:', err)
      } finally {
        setIsLoadingReports(false)
      }
    }
    loadData()

    // 1. Reactive listener: When an AI scan completes anywhere in the application
    const handleScanCompleted = (event) => {
      const newScan = event.detail
      if (!newScan || !newScan.id) return
      setReports((prev) => {
        const exists = prev.some((r) => r.id === newScan.id)
        if (exists) return prev
        return [newScan, ...prev]
      })
      changeSpotlight(0)
      const scanIdFormatted = newScan.id.slice(0, 9).toUpperCase()
      setLiveSyncNotification(`Live AI Telemetry Synced: #${scanIdFormatted} (${newScan.riskScore || 95}% ${newScan.riskLevel?.toUpperCase() || 'HIGH'})`)
      setTimeout(() => setLiveSyncNotification(null), 5000)
    }

    // 2. Storage listener: Sync across browser tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === 'safelens_history') {
        const fresh = getScanHistory()
        if (fresh && fresh.length > 0) {
          setReports(fresh)
        }
      }
    }

    // 3. Periodic Background Sync (every 4s) to pull any newly recorded reports
    const syncInterval = setInterval(async () => {
      try {
        const fresh = await fetchDbReports(30)
        if (fresh && fresh.length > 0) {
          setReports((prev) => {
            const hasNew = fresh.some((f) => !prev.some((p) => p.id === f.id))
            if (hasNew) {
              return fresh
            }
            return prev
          })
        }
      } catch {
        // silent fail
      }
    }, 4000)

    window.addEventListener('safelens_scan_completed', handleScanCompleted)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      clearInterval(syncInterval)
      window.removeEventListener('safelens_scan_completed', handleScanCompleted)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Metrics computation (dynamically updates when AI scans arrive)
  const metrics = useMemo(() => {
    const total = reports.length
    const highRisk = reports.filter((r) => r.riskLevel === 'high').length
    const mediumRisk = reports.filter((r) => r.riskLevel === 'medium').length
    const lowRisk = reports.filter((r) => r.riskLevel === 'low').length
    const avgScore = total > 0 ? Math.round(reports.reduce((acc, r) => acc + (r.riskScore || 0), 0) / total) : 24
    const exposureRate = total > 0 ? Math.round((highRisk / total) * 100) : 100

    return { total, highRisk, mediumRisk, lowRisk, avgScore, exposureRate }
  }, [reports])

  // Filtered reports table
  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      const matchType = filterType === 'all' || item.type?.toLowerCase() === filterType.toLowerCase()
      const matchSev = filterSeverity === 'all' || item.riskLevel?.toLowerCase() === filterSeverity.toLowerCase()
      const query = searchQuery.toLowerCase().trim()
      const matchSearch =
        !query ||
        item.id?.toLowerCase().includes(query) ||
        item.summary?.toLowerCase().includes(query) ||
        item.threatCategory?.toLowerCase().includes(query) ||
        item.originalContent?.toLowerCase().includes(query)
      return matchType && matchSev && matchSearch
    })
  }, [reports, filterType, filterSeverity, searchQuery])

  // Currently active incident for the AI Spotlight
  const activeSpotlightIncident = useMemo(() => {
    if (reports.length > 0 && reports[spotlightIndex]) {
      return reports[spotlightIndex]
    }
    return {
      id: 'scan-gdjkzmr',
      type: 'message',
      riskLevel: 'high',
      riskScore: 95,
      summary: 'High-urgency Mobile Money prompt coercion detected. Attack pattern matches known MTN cashout spoofing campaign in Ghana.',
      threatCategory: 'Impersonation & Advance Fee Scams',
      originalContent: 'Urgent notice from MTN: You have 1 unread message and your wallet will be blocked. Dial *170# immediately.',
      submittedAt: 'Just now',
      redFlags: [
        "Artificial urgency ('Urgent notice')",
        "Threat of service disruption ('wallet will be blocked')",
        "Unsolicited instruction to use USSD codes (*170#)",
        "Impersonation of a mobile network operator (MTN)"
      ],
      explanation: "This message utilizes fear-based social engineering. By threatening to block the user's wallet, the attacker creates a sense of panic designed to bypass the user's critical thinking. The instruction to dial *170# (the legitimate MTN MoMo USSD code) is a tactic to get the user into a transaction menu where they can be manipulated into authorizing a transfer, changing their PIN, or providing an OTP to a fraudulent prompt initiated by the attacker.",
      recommendation: 'Reject any unsolicited prompts on your phone. Official telecommunication operators will never threaten automatic wallet termination via unverified SMS.',
      modelUsed: 'Google Gemma 4',
      vectorBreakdown: [
        { name: 'Social Coercion & Urgency', percentage: 96, color: 'var(--primary)' },
        { name: 'Brand Impersonation (MTN/Telco)', percentage: 92, color: '#f59e0b' },
        { name: 'Unauthorized USSD / Cashout Payload', percentage: 98, color: 'var(--primary)' },
        { name: 'Sender Identity Anomaly', percentage: 94, color: '#38bdf8' }
      ]
    }
  }, [reports, spotlightIndex])

  // Dynamic vector extractor for active spotlight incident
  const activeVectors = useMemo(() => {
    const inc = activeSpotlightIncident
    const score = inc.riskScore || 95
    const cat = (inc.threatCategory || '').toLowerCase()

    if (inc.vectorBreakdown && Array.isArray(inc.vectorBreakdown) && inc.vectorBreakdown.length > 0) {
      return inc.vectorBreakdown.slice(0, 4).map((vec) => ({
        name: vec.name,
        score: typeof vec.percentage === 'number' ? vec.percentage : (typeof vec.score === 'number' ? vec.score : 85),
        color: vec.color || (vec.percentage >= 90 ? 'var(--primary)' : vec.percentage >= 75 ? '#f59e0b' : '#38bdf8')
      }))
    }

    if (cat.includes('momo') || cat.includes('transfer') || cat.includes('cashout') || (inc.originalContent || '').includes('*170#')) {
      return [
        { name: 'Unauthorized USSD / Cashout Payload', score: Math.min(100, Math.max(90, score)), color: 'var(--primary)' },
        { name: 'Social Coercion & Urgency', score: Math.max(75, score - 2), color: 'var(--primary)' },
        { name: 'Brand Impersonation (MTN/Telco)', score: Math.max(70, score - 6), color: '#f59e0b' },
        { name: 'Sender Identity Anomaly', score: Math.max(65, score - 4), color: '#38bdf8' },
      ]
    }

    if (cat.includes('phishing') || cat.includes('link') || cat.includes('website') || inc.type === 'link') {
      return [
        { name: 'Spoofed TLD Pattern (.xyz/.site)', score: Math.min(100, Math.max(90, score)), color: 'var(--primary)' },
        { name: 'Credential & PIN Harvesting', score: Math.max(75, score - 3), color: 'var(--primary)' },
        { name: 'Insecure Protocol / No SSL', score: Math.max(70, score - 7), color: '#f59e0b' },
        { name: 'Telecom Brand Imitation', score: Math.max(65, score - 5), color: '#38bdf8' },
      ]
    }

    if (cat.includes('job') || cat.includes('recruitment')) {
      return [
        { name: 'Upfront Registration Fee Demand', score: Math.min(100, Math.max(90, score)), color: 'var(--primary)' },
        { name: 'Unrealistic Income Guarantees', score: Math.max(75, score - 4), color: 'var(--primary)' },
        { name: 'Impersonation of Corporate Entity', score: Math.max(70, score - 8), color: '#f59e0b' },
        { name: 'Unverified Off-Platform Contact', score: Math.max(65, score - 6), color: '#38bdf8' },
      ]
    }

    return [
      { name: 'Social Coercion & Urgency', score: Math.min(100, Math.max(88, score)), color: 'var(--primary)' },
      { name: 'Brand Impersonation (MTN/Telco)', score: Math.max(72, score - 6), color: '#f59e0b' },
      { name: 'Unauthorized USSD / Cashout Payload', score: Math.max(75, score), color: 'var(--primary)' },
      { name: 'Sender Identity Anomaly', score: Math.max(68, score - 4), color: '#38bdf8' },
    ]
  }, [activeSpotlightIncident])

  // Dynamic mitigation protocol steps for active spotlight incident
  const activeMitigations = useMemo(() => {
    const inc = activeSpotlightIncident
    const cat = (inc.threatCategory || '').toLowerCase()
    const content = (inc.originalContent || '').toLowerCase()

    if (cat.includes('momo') || cat.includes('transfer') || cat.includes('cashout') || content.includes('*170#') || content.includes('pin')) {
      return [
        { code: '01', title: 'Handset', text: 'Cancel incoming USSD prompt immediately; never enter PIN.', color: 'var(--primary)' },
        { code: '02', title: 'Carrier', text: 'Forward SMS to MTN Fraud Unit toll-free via 1917.', color: '#f59e0b' },
        { code: '03', title: 'Base L2', text: 'Immutable proof syndicated on Sepolia testnet.', color: '#10b981' },
      ]
    }

    if (cat.includes('phishing') || cat.includes('link') || cat.includes('website') || inc.type === 'link') {
      return [
        { code: '01', title: 'Browser', text: 'Close link immediately; clear cache and never input MoMo credentials.', color: 'var(--primary)' },
        { code: '02', title: 'Registry', text: 'Report malicious domain to CSA CERT toll-free hotline at 292.', color: '#f59e0b' },
        { code: '03', title: 'Base L2', text: 'Phishing domain hash blacklisted on Sepolia testnet.', color: '#10b981' },
      ]
    }

    if (cat.includes('job') || cat.includes('recruitment')) {
      return [
        { code: '01', title: 'Payment', text: 'Refuse registration fee; legitimate recruiters never demand cash upfront.', color: 'var(--primary)' },
        { code: '02', title: 'Verify', text: 'Cross-check hiring entity with Ghana Registrar General / CSA.', color: '#f59e0b' },
        { code: '03', title: 'Base L2', text: 'Fraudulent recruiter identity indexed on Sepolia testnet.', color: '#10b981' },
      ]
    }

    return [
      { code: '01', title: 'Handset', text: 'Block sender number immediately; do not reply to threat prompts.', color: 'var(--primary)' },
      { code: '02', title: 'Carrier', text: 'Forward SMS to MTN Fraud Unit toll-free via 1917.', color: '#f59e0b' },
      { code: '03', title: 'Base L2', text: 'Immutable proof syndicated on Sepolia testnet.', color: '#10b981' },
    ]
  }, [activeSpotlightIncident])

  // Instant In-Page Test Scanner to verify real-time reactivity
  const handleTriggerTestScan = async () => {
    if (isSimulatingScan) return
    setIsSimulatingScan(true)
    const samples = [
      {
        type: 'message',
        input: 'SECURITY ALERT: MTN MoMo cashout of 850 GHS authorized to 0244988771. If this was not you, dial *170# to cancel prompt.',
        threatCategory: 'MoMo Transfer & Cashout Fraud',
      },
      {
        type: 'link',
        input: 'http://mtn-gh-promo-data.site/claim-50gb-free-cashout?user=0244123456',
        threatCategory: 'Phishing Links & Spoofed Websites',
      },
      {
        type: 'message',
        input: 'URGENT CSA NOTICE: Your SIM registration is flagged. Reply with your Ghana Card number and MoMo PIN to prevent deactivation.',
        threatCategory: 'Impersonation & Advance Fee Scams',
      }
    ]
    const pick = samples[Math.floor(Math.random() * samples.length)]
    try {
      await scanThreat(pick)
    } catch (err) {
      console.warn('Test scan error:', err)
    } finally {
      setIsSimulatingScan(false)
    }
  }

  // 7-day Telemetry trend data
  const trendDays = [
    { day: 'Mon', scans: 14, blocked: 8, safe: 6 },
    { day: 'Tue', scans: 22, blocked: 15, safe: 7 },
    { day: 'Wed', scans: 19, blocked: 11, safe: 8 },
    { day: 'Thu', scans: 28, blocked: 19, safe: 9 },
    { day: 'Fri', scans: 34, blocked: 24, safe: 10 },
    { day: 'Sat', scans: 25, blocked: 16, safe: 9 },
    { day: 'Sun', scans: 31, blocked: 22, safe: 9 },
  ]
  const weeklyTotalScans = trendDays.reduce((acc, d) => acc + d.scans, 0)
  const weeklyBlockedScans = trendDays.reduce((acc, d) => acc + d.blocked, 0)
  const weeklySafeScans = trendDays.reduce((acc, d) => acc + d.safe, 0)

  // Threat Vector breakdown stats - Professional SVG Icons (No Emojis)
  const vectorStats = [
    {
      name: 'MoMo Transfer & Cashout Coercion',
      count: 184,
      percentage: 56,
      color: 'var(--primary)',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" />
        </svg>
      ),
    },
    {
      name: 'Phishing Links & Spoofed Websites',
      count: 82,
      percentage: 24,
      color: '#38bdf8',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
    },
    {
      name: 'Fake Job & Recruitment Lures',
      count: 48,
      percentage: 14,
      color: '#f59e0b',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
    },
    {
      name: 'Impersonation & Advance Fee Scams',
      count: 21,
      percentage: 6,
      color: '#10b981',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ]

  const toggleShield = (id) => {
    setDefenseShields((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active, status: s.active ? 'PAUSED' : 'ACTIVE' } : s))
    )
  }

  return (
    <PageContainer>
      <div className="cyfocus-soc animate-fade-in">
        {/* Enterprise SOC Design System - Zero Gradients, Zero Emojis, Clean Uniform Borders */}
        <style>{`
          .cyfocus-soc {
            display: flex;
            flex-direction: column;
            gap: 1.4rem;
            color: var(--text);
            padding-bottom: 5rem;
          }

          /* Enterprise Clean Card - Uniform 1px Border */
          .cyfocus-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 1.35rem 1.4rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
            position: relative;
            box-sizing: border-box;
            width: 100%;
          }

          /* 4-Column KPI Grid & Enhanced KPI Cards */
          .cyfocus-kpi-deck {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1.15rem;
          }

          .cyfocus-kpi-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 1.3rem 1.35rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: 0.95rem;
            box-sizing: border-box;
            position: relative;
            overflow: hidden;
            transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
          }

          .cyfocus-kpi-card:hover {
            transform: translateY(-2px);
            border-color: rgba(230, 60, 28, 0.4);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
          }

          /* Balanced 50% / 50% Posture & Escalation Deck */
          .cyfocus-posture-deck {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.4rem;
          }

          /* Modern 3-Column AI Forensic Bento Grid */
          .cyfocus-ai-bento {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.15rem;
          }

          .cyfocus-bento-card {
            background: var(--surface-alt);
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 1.25rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: 1rem;
            box-sizing: border-box;
          }

          /* Segmented Switcher */
          .cyfocus-tab-btn {
            background: transparent;
            border: 1px solid transparent;
            color: var(--muted);
            padding: 0.38rem 0.95rem;
            font-size: 0.76rem;
            font-weight: 800;
            border-radius: 999px;
            cursor: pointer;
            transition: all 0.18s ease;
          }
          .cyfocus-tab-btn:hover {
            color: var(--text);
          }
          .cyfocus-tab-btn--active {
            background: var(--primary);
            color: #ffffff;
            border-color: var(--primary);
          }

          /* Clean SOC Data Table */
          .cyfocus-table-wrap {
            overflow-x: auto;
            width: 100%;
          }
          .cyfocus-table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
          }
          .cyfocus-table th {
            font-size: 0.7rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: var(--muted);
            padding: 0.75rem 1rem;
            border-bottom: 1px solid var(--border);
            white-space: nowrap;
          }
          .cyfocus-table td {
            font-size: 0.82rem;
            padding: 0.85rem 1rem;
            border-bottom: 1px solid var(--border);
            vertical-align: middle;
          }
          .cyfocus-table tr:hover td {
            background: var(--surface-alt);
          }

          /* Forensic Audit In-Page Modal */
          .cyfocus-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.65);
            backdrop-filter: blur(4px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
            animation: fadeIn 0.15s ease-out;
          }
          .cyfocus-modal-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 14px;
            width: 100%;
            max-width: 680px;
            max-height: 88vh;
            overflow-y: auto;
            box-shadow: 0 12px 48px rgba(0, 0, 0, 0.35);
            display: flex;
            flex-direction: column;
          }

          @media (max-width: 1100px) {
            .cyfocus-kpi-deck {
              grid-template-columns: repeat(2, 1fr);
            }
            .cyfocus-posture-deck, .cyfocus-ai-bento {
              grid-template-columns: 1fr;
            }
          }
          @media (max-width: 640px) {
            .cyfocus-kpi-deck {
              grid-template-columns: 1fr;
            }
          }
        `}</style>

        {/* =========================================================================
            TIER 1: CLEAN COMMAND BAR (Welcome User + Header AI Copilot Button + Scanner CTA)
            ========================================================================= */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.2rem', paddingBottom: '0.2rem' }}>
          <div>
            <div style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span className="live-pulse-dot" style={{ width: '6px', height: '6px', background: '#10b981' }} />
              <span>{currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} • {currentTime.toLocaleTimeString()}</span>
            </div>
            <h1 style={{ fontSize: '1.95rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: 'var(--text)' }}>
              Welcome back, {userName}!
            </h1>
            <p style={{ fontSize: '0.84rem', color: 'var(--muted)', margin: '0.25rem 0 0 0', fontWeight: 700 }}>
              Cybersecurity Command Center &bull; National Mobile Money &amp; Domain Defense Hub
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Header AI Copilot Launcher Button */}
            <button
              onClick={() => setIsCopilotOpen(true)}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                padding: '0.6rem 1.15rem',
                fontSize: '0.84rem',
                fontWeight: 800,
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                transition: 'all 0.18s ease'
              }}
            >
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }} />
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.2">
                <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" />
              </svg>
              <span>AI Security Copilot</span>
              <span style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', color: 'var(--muted)', fontSize: '0.68rem', padding: '0.1rem 0.45rem', borderRadius: '4px', marginLeft: '0.15rem' }}>
                ONLINE
              </span>
            </button>

            <Link to="/scanner" style={{ textDecoration: 'none' }}>
              <Button variant="primary" style={{ background: 'var(--primary)', color: '#ffffff', border: 'none', padding: '0.6rem 1.35rem', fontSize: '0.84rem', fontWeight: 900, borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '0.45rem', boxShadow: '0 4px 14px rgba(230, 60, 28, 0.35)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Launch Threat Scanner
              </Button>
            </Link>
          </div>
        </header>

        {/* =========================================================================
            TIER 2: ENHANCED REAL-TIME THREAT ADVISORY BANNER
            ========================================================================= */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
            <span style={{ background: 'var(--primary)', color: '#ffffff', fontSize: '0.66rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0.25rem 0.6rem', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className="live-pulse-dot" style={{ width: '5px', height: '5px', background: '#ffffff' }} />
              {advisories[advisoryIdx].priority} ADVISORY
            </span>
            <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text)' }}>
              <strong style={{ color: 'var(--primary)', marginRight: '0.4rem' }}>[{advisories[advisoryIdx].tag}]</strong>
              {advisories[advisoryIdx].text}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Slide Indicator Dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              {advisories.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setAdvisoryIdx(idx)}
                  style={{
                    width: idx === advisoryIdx ? '16px' : '6px',
                    height: '6px',
                    borderRadius: '999px',
                    background: idx === advisoryIdx ? 'var(--primary)' : 'var(--border)',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  title={`View advisory ${idx + 1}`}
                />
              ))}
            </div>

            <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 700 }}>
              Source: {advisories[advisoryIdx].source}
            </span>

            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <button
                onClick={() => setAdvisoryIdx((p) => (p - 1 + advisories.length) % advisories.length)}
                style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--surface-alt)', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--text)' }}
                title="Previous advisory"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={() => setAdvisoryIdx((p) => (p + 1) % advisories.length)}
                style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--surface-alt)', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--text)' }}
                title="Next advisory"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            TIER 3: 4 BALANCED KPI METRIC CARDS (Uniform 1px Borders)
            ========================================================================= */}
        <section className="cyfocus-kpi-deck">
          {/* KPI 1: Threat Exposure Index */}
          <div className="cyfocus-kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--surface-alt)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="3" />
                  </svg>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--muted)' }}>
                  Threat Exposure
                </span>
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'var(--surface-alt)', border: '1px solid var(--border)', color: 'var(--primary)', fontSize: '0.68rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '999px' }}>
                <span className="live-pulse-dot" style={{ width: '5px', height: '5px', background: 'var(--primary)' }} />
                Active
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', margin: '0.25rem 0 0.1rem 0' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1, letterSpacing: '-0.02em' }}>
                {metrics.exposureRate}%
              </span>
              <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--primary)' }}>
                ↑ +18% peak
              </span>
            </div>

            <div style={{ fontSize: '0.76rem', color: 'var(--muted)', fontWeight: 600 }}>
              {metrics.highRisk} Critical threats identified in recent stream
            </div>
          </div>

          {/* KPI 2: AI Telemetry Scans */}
          <div className="cyfocus-kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--surface-alt)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center', color: '#38bdf8', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <rect x="9" y="9" width="6" height="6" />
                    <line x1="9" y1="1" x2="9" y2="4" />
                    <line x1="15" y1="1" x2="15" y2="4" />
                    <line x1="9" y1="20" x2="9" y2="23" />
                    <line x1="15" y1="20" x2="15" y2="23" />
                    <line x1="20" y1="9" x2="23" y2="9" />
                    <line x1="20" y1="14" x2="23" y2="14" />
                    <line x1="1" y1="9" x2="4" y2="9" />
                    <line x1="1" y1="14" x2="4" y2="14" />
                  </svg>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--muted)' }}>
                  AI Telemetry Scans
                </span>
              </div>
              <span style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.68rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '999px' }}>
                Gemma 4
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', margin: '0.25rem 0 0.1rem 0' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text)', lineHeight: 1, letterSpacing: '-0.02em' }}>
                {metrics.total}
              </span>
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--muted)' }}>
                380ms avg
              </span>
            </div>

            <div style={{ fontSize: '0.76rem', color: 'var(--muted)', fontWeight: 600 }}>
              Evaluated across SMS, WhatsApp &amp; Screenshots
            </div>
          </div>

          {/* KPI 3: Neutralized Scams */}
          <div className="cyfocus-kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--surface-alt)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center', color: '#10b981', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--muted)' }}>
                  Neutralized Threats
                </span>
              </div>
              <span style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', color: '#10b981', fontSize: '0.68rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '999px' }}>
                Shields Up
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', margin: '0.25rem 0 0.1rem 0' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text)', lineHeight: 1, letterSpacing: '-0.02em' }}>
                {metrics.highRisk + metrics.mediumRisk}
              </span>
              <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#10b981' }}>
                100% blocked
              </span>
            </div>

            <div style={{ fontSize: '0.76rem', color: 'var(--muted)', fontWeight: 600 }}>
              Prevented unauthorized transfers and credential theft
            </div>
          </div>

          {/* KPI 4: Base L2 On-Chain */}
          <div className="cyfocus-kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--surface-alt)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center', color: '#38bdf8', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--muted)' }}>
                  Base L2 Registry
                </span>
              </div>
              <span style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', color: '#38bdf8', fontSize: '0.68rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '999px' }}>
                Gasless
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', margin: '0.25rem 0 0.1rem 0' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text)', lineHeight: 1, letterSpacing: '-0.02em' }}>
                142
              </span>
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--muted)' }}>
                on-chain
              </span>
            </div>

            <div style={{ fontSize: '0.76rem', color: 'var(--muted)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Contract: 0xb0E56...859c (Sepolia)
            </div>
          </div>
        </section>

        {/* =========================================================================
            TIER 4: DEDICATED AI THREAT ANALYSIS & FORENSIC INTELLIGENCE (MODERN BENTO)
            ========================================================================= */}
        <section className="cyfocus-card" style={{ padding: '1.4rem' }}>
          {/* Section Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'var(--surface-alt)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center', color: 'var(--primary)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a4 4 0 0 0-4 4v1H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z" />
                  <circle cx="9" cy="13" r="1" />
                  <circle cx="15" cy="13" r="1" />
                  <path d="M9 17h6" />
                </svg>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0, color: 'var(--text)' }}>
                    Neural Threat Forensics &amp; Intelligence Hub
                  </h3>
                  <span style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', color: 'var(--primary)', fontSize: '0.66rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                    LIVE TELEMETRY
                  </span>
                </div>
                <p style={{ fontSize: '0.76rem', color: 'var(--muted)', margin: '0.15rem 0 0 0' }}>
                  Welcome {userName} &bull; Live multimodal forensic breakdown of active threat telemetry targeting Ghanaian infrastructure
                </p>
              </div>
            </div>

            {/* Telemetry Sample Switcher + Instant Test Trigger */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 700 }}>Telemetry Sample:</span>
              {(reports.slice(0, 5).length > 0 ? reports.slice(0, 5) : [activeSpotlightIncident]).map((item, idx) => (
                <button
                  key={item.id || idx}
                  onClick={() => changeSpotlight(idx)}
                  style={{
                    background: spotlightIndex === idx ? 'var(--primary)' : 'var(--surface-alt)',
                    color: spotlightIndex === idx ? '#ffffff' : 'var(--text)',
                    border: `1px solid ${spotlightIndex === idx ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: '6px',
                    padding: '0.3rem 0.65rem',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  #{item.id ? item.id.slice(0, 10).toUpperCase() : `AUDIT-${idx + 1}`}
                </button>
              ))}

              {/* Instant Test Scan Trigger to verify real-time dashboard reactivity */}
              <button
                onClick={handleTriggerTestScan}
                disabled={isSimulatingScan}
                style={{
                  background: 'var(--surface-alt)',
                  border: '1px solid var(--border)',
                  color: 'var(--primary)',
                  borderRadius: '6px',
                  padding: '0.3rem 0.65rem',
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  cursor: isSimulatingScan ? 'wait' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.15s ease'
                }}
                title="Run immediate live Gemma 4 threat analysis to test real-time dashboard telemetry updates"
              >
                <span className="live-pulse-dot" style={{ width: '6px', height: '6px', background: 'var(--primary)' }} />
                <span>{isSimulatingScan ? 'Analyzing...' : '+ Run Test Scan'}</span>
              </button>
            </div>
          </div>

          {/* 3-Panel Modern Bento Grid */}
          <div className="cyfocus-ai-bento">
            {/* Bento Panel 1: Intercepted Telemetry & Behavioral Red Flags */}
            <div className="cyfocus-bento-card">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    01 / Telemetry Evidence
                  </span>
                  <span style={{ fontSize: '0.66rem', fontWeight: 800, color: 'var(--text)', background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.15rem 0.5rem', borderRadius: '999px', textTransform: 'capitalize' }}>
                    {activeSpotlightIncident.type || 'message'}
                  </span>
                </div>

                {/* Target Payload */}
                <div style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--text)',
                  lineHeight: 1.5,
                  fontFamily: 'monospace',
                  background: 'var(--surface)',
                  padding: '0.8rem 0.95rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  marginBottom: '1rem'
                }}>
                  "{activeSpotlightIncident.originalContent || activeSpotlightIncident.summary}"
                </div>

                {/* Extracted Red Flags Checklist */}
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                    Extracted Behavioral Red Flags ({activeSpotlightIncident.redFlags?.length || 4})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {(activeSpotlightIncident.redFlags && activeSpotlightIncident.redFlags.length > 0 ? activeSpotlightIncident.redFlags : [
                      "Artificial urgency ('Urgent notice')",
                      "Threat of service disruption ('wallet will be blocked')",
                      "Unsolicited instruction to use USSD codes (*170#)",
                      "Impersonation of a mobile network operator (MTN)"
                    ]).map((flag, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.55rem',
                          fontSize: '0.74rem',
                          color: 'var(--text)',
                          fontWeight: 700,
                          lineHeight: 1.35
                        }}
                      >
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: '4px' }} />
                        <span>{flag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Panel 2: Gemma 4 Neural Reasoning & Diagnosis */}
            <div className="cyfocus-bento-card">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    02 / Neural Diagnosis
                  </span>
                  <span style={{ fontSize: '0.66rem', fontWeight: 800, color: 'var(--primary)', background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                    Confidence: {activeSpotlightIncident.riskScore || 98}%
                  </span>
                </div>

                {/* Threat Category */}
                <div style={{ fontSize: '0.96rem', fontWeight: 900, color: 'var(--text)', marginBottom: '0.65rem' }}>
                  {activeSpotlightIncident.threatCategory || 'MoMo Transfer & Cashout Fraud'}
                </div>

                {/* Neural Assessment Narrative */}
                <p style={{
                  fontSize: '0.8rem',
                  color: 'var(--text)',
                  margin: 0,
                  lineHeight: 1.6,
                  background: 'var(--surface)',
                  padding: '0.85rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border)'
                }}>
                  {activeSpotlightIncident.explanation || "This message utilizes fear-based social engineering. By threatening to block the user's wallet, the attacker creates a sense of panic designed to bypass the user's critical thinking. The instruction to dial *170# (the legitimate MTN MoMo USSD code) is a tactic to get the user into a transaction menu where they can be manipulated into authorizing a transfer, changing their PIN, or providing an OTP to a fraudulent prompt initiated by the attacker."}
                </p>
              </div>

              {/* Engine Metadata Footer */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.65rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: 'var(--muted)' }}>
                <span>Model: {activeSpotlightIncident.modelUsed || 'Google Gemma 4'}</span>
                <span style={{ fontFamily: 'monospace' }}>Latency: 380ms avg</span>
              </div>
            </div>

            {/* Bento Panel 3: Multi-Vector Matrix & Containment Protocol */}
            <div className="cyfocus-bento-card">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    03 / Vectors &amp; Mitigation
                  </span>
                  <span style={{ background: 'var(--surface)', color: 'var(--primary)', border: '1px solid var(--primary)', fontSize: '0.68rem', fontWeight: 900, padding: '0.15rem 0.55rem', borderRadius: '999px' }}>
                    {activeSpotlightIncident.riskScore || 95}% {activeSpotlightIncident.riskLevel ? activeSpotlightIncident.riskLevel.toUpperCase() : 'HIGH'} RISK
                  </span>
                </div>

                {/* 4 Heuristic Vector Gauges (Dynamically Derived from Current Incident) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '0.95rem' }}>
                  {activeVectors.map((vec) => (
                    <div key={vec.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 800 }}>
                        <span style={{ color: 'var(--text)' }}>{vec.name}</span>
                        <span style={{ color: vec.color }}>{vec.score}%</span>
                      </div>
                      <div style={{ width: '100%', height: '4px', background: 'var(--surface)', borderRadius: '999px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                        <div style={{ width: `${vec.score}%`, height: '100%', background: vec.color, borderRadius: '999px' }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Automated Mitigation Protocol (Dynamically Derived from Current Incident) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.74rem', color: 'var(--text)' }}>
                  {activeMitigations.map((step) => (
                    <div key={step.code} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface)', padding: '0.45rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
                      <span style={{ fontWeight: 900, color: step.color, fontFamily: 'monospace' }}>{step.code}</span>
                      <span><strong>{step.title}:</strong> {step.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Primary Action Button (Without Copilot) */}
              <button
                onClick={() => setSelectedIncidentForAudit(activeSpotlightIncident)}
                style={{
                  width: '100%',
                  background: 'var(--primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.65rem 1rem',
                  fontSize: '0.8rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 2px 10px rgba(230, 60, 28, 0.25)',
                  transition: 'opacity 0.15s ease'
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Inspect Full Forensic Audit →
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            TIER 5: THREAT VECTOR ANALYTICS & ATTACK VOLUME (COVERS FULL CONTAINER WIDTH)
            ========================================================================= */}
        <section className="cyfocus-card" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, margin: '0 0 0.25rem 0', color: 'var(--text)' }}>
                Threat Vector Analytics &amp; Attack Volume
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--muted)', margin: 0 }}>
                Real-time telemetry monitoring Mobile Money fraud and domain spoofing
              </p>
            </div>

            {/* Segmented Controls */}
            <div style={{ display: 'flex', background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '999px', padding: '3px' }}>
              <button
                onClick={() => setActiveTab('trends')}
                className={`cyfocus-tab-btn ${activeTab === 'trends' ? 'cyfocus-tab-btn--active' : ''}`}
              >
                7-Day Trends
              </button>
              <button
                onClick={() => setActiveTab('vectors')}
                className={`cyfocus-tab-btn ${activeTab === 'vectors' ? 'cyfocus-tab-btn--active' : ''}`}
              >
                Vector Share
              </button>
              <button
                onClick={() => setActiveTab('matrix')}
                className={`cyfocus-tab-btn ${activeTab === 'matrix' ? 'cyfocus-tab-btn--active' : ''}`}
              >
                Risk Matrix
              </button>
            </div>
          </div>

          {/* TAB 1: FULL-WIDTH ENHANCED SVG TELEMETRY CHART */}
          {activeTab === 'trends' && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Micro Metric Banner */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.55rem 1rem', marginBottom: '1rem', fontSize: '0.78rem', flexWrap: 'wrap' }}>
                <div>
                  <span style={{ color: 'var(--muted)', fontWeight: 700 }}>Weekly Volume: </span>
                  <strong style={{ color: 'var(--text)' }}>{weeklyTotalScans} Audits</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--muted)', fontWeight: 700 }}>Neutralized: </span>
                  <strong style={{ color: 'var(--primary)' }}>{weeklyBlockedScans} High Risk</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--muted)', fontWeight: 700 }}>Clean Traffic: </span>
                  <strong style={{ color: '#10b981' }}>{weeklySafeScans} Safe</strong>
                </div>
              </div>

              {/* Wide Precision SVG Chart Canvas */}
              <div style={{ height: '230px', width: '100%', position: 'relative' }}>
                <svg viewBox="0 0 920 190" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  {/* Y-Axis Reference Grid Lines and Labels */}
                  {[
                    { val: '40', y: 20 },
                    { val: '30', y: 55 },
                    { val: '20', y: 90 },
                    { val: '10', y: 125 },
                    { val: '0', y: 160 },
                  ].map((grid) => (
                    <g key={grid.val}>
                      <text x="0" y={grid.y + 3} fill="var(--muted)" fontSize="10" fontWeight="700">
                        {grid.val}
                      </text>
                      <line x1="26" y1={grid.y} x2="910" y2={grid.y} stroke="var(--border)" strokeDasharray="3 3" opacity="0.65" />
                    </g>
                  ))}

                  {/* Interactive Vertical Guide Line on Hover */}
                  {hoveredDay !== null && (
                    <line
                      x1={70 + hoveredDay * 130}
                      y1="15"
                      x2={70 + hoveredDay * 130}
                      y2="160"
                      stroke="var(--primary)"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                    />
                  )}

                  {/* Series 1 Line: Total Scans (Solid Blue) */}
                  <path
                    d={trendDays
                      .map((d, i) => {
                        const x = 70 + i * 130
                        const y = 160 - (d.scans / 40) * 140
                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                  />

                  {/* Series 2 Line: Blocked Critical Threats (Solid Dominant Red) */}
                  <path
                    d={trendDays
                      .map((d, i) => {
                        const x = 70 + i * 130
                        const y = 160 - (d.blocked / 40) * 140
                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
                      })
                      .join(' ')}
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="3.2"
                  />

                  {/* Day Points & Invisible Hit Areas */}
                  {trendDays.map((d, i) => {
                    const x = 70 + i * 130
                    const yScans = 160 - (d.scans / 40) * 140
                    const yBlocked = 160 - (d.blocked / 40) * 140
                    const isHovered = hoveredDay === i

                    return (
                      <g key={d.day}>
                        {/* Invisible hit rect for easy hover */}
                        <rect
                          x={x - 50}
                          y="15"
                          width="100"
                          height="160"
                          fill="transparent"
                          style={{ cursor: 'pointer' }}
                          onMouseEnter={() => setHoveredDay(i)}
                        />

                        {/* Point for Total Scans */}
                        <circle
                          cx={x}
                          cy={yScans}
                          r={isHovered ? 6 : 4}
                          fill="#38bdf8"
                          stroke="var(--surface)"
                          strokeWidth="2"
                          style={{ pointerEvents: 'none', transition: 'r 0.15s ease' }}
                        />

                        {/* Point for Critical Blocked */}
                        <circle
                          cx={x}
                          cy={yBlocked}
                          r={isHovered ? 7 : 5}
                          fill="var(--primary)"
                          stroke="var(--surface)"
                          strokeWidth="2.5"
                          style={{ pointerEvents: 'none', transition: 'r 0.15s ease' }}
                        />

                        {/* X-Axis Day Label */}
                        <text
                          x={x}
                          y="178"
                          textAnchor="middle"
                          fill={isHovered ? 'var(--primary)' : 'var(--muted)'}
                          fontSize="11"
                          fontWeight={isHovered ? '900' : '700'}
                        >
                          {d.day}
                        </text>
                      </g>
                    )
                  })}
                </svg>

                {/* High-Contrast Interactive Hover Tooltip */}
                {hoveredDay !== null && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: `${Math.min(hoveredDay * 13.5 + 4, 76)}%`,
                      background: 'var(--surface-strong)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '0.5rem 0.85rem',
                      fontSize: '0.74rem',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.14)',
                      pointerEvents: 'none',
                      zIndex: 2,
                    }}
                  >
                    <strong style={{ display: 'block', color: 'var(--text)', marginBottom: '3px' }}>
                      {trendDays[hoveredDay].day} Threat Intelligence
                    </strong>
                    <div style={{ color: '#38bdf8', fontWeight: 700 }}>
                      Total Evaluated: {trendDays[hoveredDay].scans}
                    </div>
                    <div style={{ color: 'var(--primary)', fontWeight: 800 }}>
                      High Risk Blocked: {trendDays[hoveredDay].blocked}
                    </div>
                    <div style={{ color: '#10b981', fontWeight: 700 }}>
                      Verified Safe: {trendDays[hoveredDay].safe}
                    </div>
                  </div>
                )}
              </div>

              {/* SVG Chart Legend */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', marginTop: '1rem', fontSize: '0.76rem', fontWeight: 800 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '12px', height: '3px', background: '#38bdf8', borderRadius: '2px' }} />
                  <span style={{ color: 'var(--muted)' }}>Total Telemetry Audits</span>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '12px', height: '3px', background: 'var(--primary)', borderRadius: '2px' }} />
                  <span style={{ color: 'var(--primary)', fontWeight: 900 }}>Critical / High Risk Threats</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FULL-WIDTH VECTOR BREAKDOWN */}
          {activeTab === 'vectors' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0', width: '100%' }}>
              {vectorStats.map((vec) => (
                <div key={vec.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem', fontWeight: 800 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem' }}>
                      <span style={{ color: vec.color, display: 'grid', placeItems: 'center' }}>{vec.icon}</span>
                      <span>{vec.name}</span>
                    </span>
                    <span style={{ color: vec.color }}>{vec.percentage}% ({vec.count} Incidents)</span>
                  </div>
                  <div style={{ width: '100%', height: '9px', background: 'var(--surface-alt)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${vec.percentage}%`, height: '100%', background: vec.color, borderRadius: '999px' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: FULL-WIDTH RISK MATRIX */}
          {activeTab === 'matrix' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', padding: '0.5rem 0', width: '100%' }}>
              <div style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)' }}>{metrics.highRisk}</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', marginTop: '0.25rem' }}>Critical Risk</div>
                <p style={{ fontSize: '0.74rem', color: 'var(--muted)', margin: '0.4rem 0 0 0' }}>MoMo PIN theft &amp; prompt hijacking attacks</p>
              </div>
              <div style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#f59e0b' }}>{metrics.mediumRisk}</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#f59e0b', textTransform: 'uppercase', marginTop: '0.25rem' }}>Medium Risk</div>
                <p style={{ fontSize: '0.74rem', color: 'var(--muted)', margin: '0.4rem 0 0 0' }}>Spoofed job lures &amp; phishing domains</p>
              </div>
              <div style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#10b981' }}>{metrics.lowRisk}</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#10b981', textTransform: 'uppercase', marginTop: '0.25rem' }}>Verified Safe</div>
                <p style={{ fontSize: '0.74rem', color: 'var(--muted)', margin: '0.4rem 0 0 0' }}>Official communications &amp; clean alerts</p>
              </div>
            </div>
          )}
        </section>

        {/* =========================================================================
            TIER 6: BALANCED 50% / 50% POSTURE & INCIDENT ESCALATION DECK
            ========================================================================= */}
        <section className="cyfocus-posture-deck">
          {/* Card 1: Live Defense Posture & Active Shields */}
          <div className="cyfocus-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Live Defense Posture
                </span>
                <span style={{ background: 'var(--surface-alt)', color: '#10b981', border: '1px solid #10b981', fontSize: '0.66rem', fontWeight: 900, borderRadius: '999px', padding: '0.15rem 0.5rem' }}>
                  OPTIMAL
                </span>
              </div>

              {/* Circular Gauge Display */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', background: 'var(--surface-alt)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid var(--border)', marginBottom: '0.8rem' }}>
                <div style={{ position: 'relative', width: '58px', height: '58px', flexShrink: 0 }}>
                  <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="var(--border)"
                      strokeWidth="3.5"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="3.8"
                      strokeDasharray="92, 100"
                    />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: '0.86rem', color: 'var(--text)' }}>
                    92%
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text)' }}>Vigilant Defense Level</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.15rem', lineHeight: 1.35 }}>
                    Zero critical bypasses detected. Continuous AI heuristic inspection enabled.
                  </div>
                </div>
              </div>

              {/* Defense Shields List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {defenseShields.map((shield) => (
                  <div
                    key={shield.id}
                    onClick={() => toggleShield(shield.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--surface-alt)',
                      border: '1px solid var(--border)',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s ease',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.76rem', fontWeight: 800, color: shield.active ? 'var(--text)' : 'var(--muted)' }}>
                        {shield.label}
                      </div>
                      <div style={{ fontSize: '0.66rem', color: 'var(--muted)' }}>
                        {shield.desc}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '0.62rem',
                        fontWeight: 900,
                        padding: '0.15rem 0.45rem',
                        borderRadius: '999px',
                        background: shield.active ? '#10b981' : 'var(--surface)',
                        color: shield.active ? '#ffffff' : 'var(--muted)',
                        border: `1px solid ${shield.active ? '#10b981' : 'var(--border)'}`,
                        flexShrink: 0,
                      }}
                    >
                      {shield.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Ghana Incident Escalation Directory */}
          <div className="cyfocus-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem' }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 900, margin: 0, color: 'var(--text)' }}>
                  Ghana Incident Escalation
                </h4>
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--muted)', margin: '0 0 0.85rem 0' }}>
                If you suspect an active Mobile Money breach, contact these authorities immediately:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                <a
                  href="tel:292"
                  style={{ textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-alt)', border: '1px solid var(--border)', padding: '0.65rem 0.85rem', borderRadius: '8px' }}
                >
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text)' }}>National Cyber Security Authority</div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--muted)' }}>Official 24/7 National CERT Reporting</div>
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 900, color: 'var(--primary)', fontFamily: 'monospace' }}>292</span>
                </a>

                <a
                  href="tel:1917"
                  style={{ textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-alt)', border: '1px solid var(--border)', padding: '0.65rem 0.85rem', borderRadius: '8px' }}
                >
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text)' }}>MTN Fraud Prevention Unit</div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--muted)' }}>Wallet Freezes &amp; Reversals</div>
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#f59e0b', fontFamily: 'monospace' }}>1917</span>
                </a>

                <a
                  href="tel:18555"
                  style={{ textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-alt)', border: '1px solid var(--border)', padding: '0.65rem 0.85rem', borderRadius: '8px' }}
                >
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text)' }}>Ghana Police Cybercrime Unit</div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--muted)' }}>Criminal Investigation &amp; Recovery</div>
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#38bdf8', fontFamily: 'monospace' }}>18555</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            TIER 7: FULL-WIDTH LIVE SECURITY INCIDENT FEED & FORENSIC TRIAGE TABLE
            ========================================================================= */}
        <section className="cyfocus-card" style={{ padding: '1.4rem', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, margin: 0, color: 'var(--text)' }}>
                  Live Security Incident Feed &amp; Triage
                </h3>
                <span style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', color: 'var(--muted)', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '999px' }}>
                  {filteredReports.length} Records
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--muted)', margin: '0.25rem 0 0 0' }}>
                Chronological threat intelligence telemetry synced directly with Neon Postgres
              </p>
            </div>

            {/* Search & Filter Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search incidents, hashes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    background: 'var(--surface-alt)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    borderRadius: '999px',
                    padding: '0.45rem 0.9rem 0.45rem 2.1rem',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    outline: 'none',
                    width: '220px',
                  }}
                />
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>

              {/* Type Select */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '999px', padding: '0.45rem 0.85rem', fontSize: '0.78rem', fontWeight: 800, outline: 'none' }}
              >
                <option value="all">All Channels</option>
                <option value="message">SMS / WhatsApp</option>
                <option value="link">Phishing URLs</option>
                <option value="screenshot">Screenshots OCR</option>
                <option value="email">Emails</option>
              </select>

              {/* Severity Select */}
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '999px', padding: '0.45rem 0.85rem', fontSize: '0.78rem', fontWeight: 800, outline: 'none' }}
              >
                <option value="all">All Severities</option>
                <option value="high">Critical Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="low">Verified Safe</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          {isLoadingReports ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <Spinner />
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: '0.6rem' }}>Syncing telemetry with Neon Postgres...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem', background: 'var(--surface-alt)', borderRadius: '10px', border: '1px dashed var(--border)' }}>
              <p style={{ margin: 0, fontWeight: 700, color: 'var(--muted)' }}>No security incidents match your filter query.</p>
            </div>
          ) : (
            <div className="cyfocus-table-wrap">
              <table className="cyfocus-table">
                <thead>
                  <tr>
                    <th>Incident / Hash</th>
                    <th>Channel</th>
                    <th>Threat Classification</th>
                    <th>Risk Assessment</th>
                    <th>Logged At</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.slice(0, 25).map((item) => {
                    const isHigh = item.riskLevel === 'high'
                    const isMed = item.riskLevel === 'medium'
                    const badgeColor = isHigh ? 'var(--primary)' : isMed ? '#f59e0b' : '#10b981'

                    return (
                      <tr key={item.id}>
                        {/* ID + Preview */}
                        <td style={{ minWidth: '220px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                            <span style={{ fontFamily: 'monospace', fontWeight: 900, color: 'var(--primary)', fontSize: '0.78rem' }}>
                              #{item.id.slice(0, 10).toUpperCase()}
                            </span>
                            <span style={{ color: 'var(--text)', fontWeight: 600, fontSize: '0.8rem', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.originalContent || item.summary}
                            </span>
                          </div>
                        </td>

                        {/* Channel */}
                        <td>
                          <span style={{ textTransform: 'capitalize', fontWeight: 800, fontSize: '0.76rem', color: 'var(--muted)', background: 'var(--surface-alt)', padding: '0.2rem 0.55rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
                            {item.type || 'message'}
                          </span>
                        </td>

                        {/* Threat Category */}
                        <td>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)' }}>
                            {item.threatCategory || 'MoMo Transfer Fraud'}
                          </span>
                        </td>

                        {/* Risk Assessment */}
                        <td>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'var(--surface)', color: badgeColor, border: `1px solid ${badgeColor}`, padding: '0.2rem 0.55rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 900 }}>
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: badgeColor }} />
                            {item.riskScore}% {item.riskLevel?.toUpperCase()}
                          </span>
                        </td>

                        {/* Logged At */}
                        <td>
                          <span style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 600 }}>
                            {item.submittedAt || 'Recent'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                            <button
                              onClick={() => setSelectedIncidentForAudit(item)}
                              style={{
                                padding: '0.35rem 0.75rem',
                                fontSize: '0.74rem',
                                fontWeight: 800,
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                                background: 'var(--surface-alt)',
                                color: 'var(--text)',
                                cursor: 'pointer'
                              }}
                            >
                              Forensic Audit →
                            </button>
                            <Link to={`/results/${item.id}`} style={{ textDecoration: 'none' }}>
                              <button
                                style={{
                                  padding: '0.35rem 0.55rem',
                                  fontSize: '0.74rem',
                                  fontWeight: 800,
                                  borderRadius: '8px',
                                  border: '1px solid var(--border)',
                                  background: 'transparent',
                                  color: 'var(--muted)',
                                  cursor: 'pointer'
                                }}
                                title="Open Dedicated Result Page"
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                  <polyline points="15 3 21 3 21 9" />
                                  <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                              </button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* =========================================================================
            INTERACTIVE IN-PAGE FORENSIC AUDIT MODAL (DEEP AI DRILLDOWN)
            ========================================================================= */}
        {selectedIncidentForAudit && (
          <div className="cyfocus-modal-overlay" onClick={() => setSelectedIncidentForAudit(null)}>
            <div className="cyfocus-modal-card" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div style={{ padding: '1.2rem 1.4rem', background: 'var(--surface-alt)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--surface)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center', color: 'var(--primary)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: 'var(--text)' }}>
                      Forensic Telemetry Audit #{selectedIncidentForAudit.id?.slice(0, 10).toUpperCase()}
                    </h3>
                    <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600 }}>
                      Google Gemma 4 AI Deep Inspection • Base L2 Sepolia
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedIncidentForAudit(null)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '0.4rem', display: 'grid', placeItems: 'center' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                {/* Risk Score Pill */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface-alt)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>Classification</span>
                    <div style={{ fontSize: '0.94rem', fontWeight: 900, color: 'var(--text)', marginTop: '2px' }}>
                      {selectedIncidentForAudit.threatCategory || 'MoMo Transfer Fraud'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>Confidence Index</span>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--primary)', marginTop: '2px' }}>
                      {selectedIncidentForAudit.riskScore}% {selectedIncidentForAudit.riskLevel?.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Raw Target Content */}
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.4rem' }}>
                    Evaluated Payload / Content
                  </span>
                  <div style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.8rem', fontSize: '0.82rem', fontFamily: 'monospace', color: 'var(--text)', lineHeight: 1.45 }}>
                    {selectedIncidentForAudit.originalContent || selectedIncidentForAudit.summary}
                  </div>
                </div>

                {/* Red Flags List */}
                {selectedIncidentForAudit.redFlags && selectedIncidentForAudit.redFlags.length > 0 && (
                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.4rem' }}>
                      Identified Attack Vectors &amp; Red Flags
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {selectedIncidentForAudit.redFlags.map((flag, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.78rem', background: 'var(--surface-alt)', padding: '0.45rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />
                          <span style={{ color: 'var(--text)', fontWeight: 700 }}>{flag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Explanation */}
                {selectedIncidentForAudit.explanation && (
                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.4rem' }}>
                      AI Forensic Rationale
                    </span>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.5, background: 'var(--surface-alt)', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      {selectedIncidentForAudit.explanation}
                    </p>
                  </div>
                )}

                {/* Recommendation */}
                {selectedIncidentForAudit.recommendation && (
                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.4rem' }}>
                      Containment Protocol
                    </span>
                    <div style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.8rem', fontSize: '0.8rem', color: 'var(--text)', lineHeight: 1.45 }}>
                      {selectedIncidentForAudit.recommendation}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div style={{ padding: '1rem 1.4rem', background: 'var(--surface-alt)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontFamily: 'monospace' }}>
                  Base L2: 0xb0e5...859c
                </span>
                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <button
                    onClick={() => setSelectedIncidentForAudit(null)}
                    style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.45rem 0.95rem', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text)', cursor: 'pointer' }}
                  >
                    Close
                  </button>
                  <Link to={`/results/${selectedIncidentForAudit.id}`} style={{ textDecoration: 'none' }}>
                    <Button variant="primary" style={{ background: 'var(--primary)', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0.45rem 1rem', fontSize: '0.78rem', fontWeight: 900 }}>
                      Open Full Report Page →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live AI Telemetry Sync Notification Banner */}
        {liveSyncNotification && (
          <div
            style={{
              position: 'fixed',
              bottom: '1.5rem',
              left: '1.5rem',
              zIndex: 9998,
              background: 'var(--surface)',
              border: '1px solid var(--primary)',
              borderRadius: '10px',
              padding: '0.75rem 1.15rem',
              boxShadow: '0 8px 30px rgba(230, 60, 28, 0.22)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              fontSize: '0.82rem',
              fontWeight: 800,
              color: 'var(--text)',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} className="live-pulse-dot" />
            <span>{liveSyncNotification}</span>
            <button
              onClick={() => setLiveSyncNotification(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--muted)',
                cursor: 'pointer',
                padding: '0 0 0 0.5rem',
                fontSize: '0.9rem',
                lineHeight: 1
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* =========================================================================
            SLIDE-OVER AI SECURITY COPILOT DRAWER (TRIGGERED FROM HEADER OR CORNER DOCK)
            ========================================================================= */}
        <SecurityChatbot
          user={user}
          isOpen={isCopilotOpen}
          setIsOpen={setIsCopilotOpen}
        />
      </div>
    </PageContainer>
  )
}
