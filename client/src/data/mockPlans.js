export const MOCK_PROTECTION_PLANS = [
  {
    id: 'plan-starter',
    name: 'Starter Plan',
    priceGhs: 0,
    period: 'Free Forever',
    scanLimit: 5,
    features: [
      '5 AI scans per month',
      'Basic risk score assessment',
      'Essential red flag detection',
      'Access to Safety Tips guide'
    ],
    popular: false,
    ctaText: 'Current Plan'
  },
  {
    id: 'plan-safe',
    name: 'Safe Plan',
    priceGhs: 5,
    period: 'per month',
    scanLimit: 50,
    features: [
      '50 AI scans per month',
      'Screenshot & message analysis',
      'Detailed plain-English explanations',
      'Complete scan history logs',
      'Ghana Scam Helpline shortcuts'
    ],
    popular: true,
    ctaText: 'Upgrade to Safe'
  },
  {
    id: 'plan-shield',
    name: 'Shield Plan',
    priceGhs: 10,
    period: 'per month',
    scanLimit: 150,
    features: [
      '150 AI scans per month',
      'Screenshot & message analysis',
      'URL & Email threat analysis',
      'Priority Scam Intelligence alerts',
      'Blockchain report verification badge',
      '24/7 Priority Emergency Support'
    ],
    popular: false,
    ctaText: 'Upgrade to Shield'
  }
]

export const MOCK_USER_SUBSCRIPTION = {
  planId: 'plan-safe',
  planName: 'Safe Protection Plan',
  scansUsed: 23,
  scanLimit: 50,
  resetDaysRemaining: 18,
  priceGhs: 5,
  status: 'Active',
  renewalDate: '2026-08-22',
  paymentMethod: 'MTN Mobile Money (*170#)',
  history: [
    { date: '2026-07-22', amount: 'GH₵ 5.00', status: 'Paid', method: 'MTN MoMo' },
    { date: '2026-06-22', amount: 'GH₵ 5.00', status: 'Paid', method: 'MTN MoMo' }
  ]
}

export const MOCK_WALLET_STATUS = {
  isConnected: false,
  address: null,
  network: 'Ethereum Mainnet',
  networkId: 1,
  balanceEth: '0.00'
}
