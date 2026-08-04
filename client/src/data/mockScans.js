export const MOCK_SCANS = [
  {
    id: 'scan-101',
    type: 'message',
    channel: 'SMS / MoMo',
    date: '12 mins ago',
    timestamp: '2026-08-04T11:40:00Z',
    riskScore: 94,
    riskLevel: 'High Risk',
    category: 'MoMo Reversal Scam',
    summary: 'Fake MTN Mobile Money accidental reversal SMS requesting manual cash refund.',
    originalContent: 'Yello! I accidentally sent GH₵ 450 to your MoMo account. Please check your SMS and send it back to 0551234567 immediately or I will report you to police.',
    redFlags: [
      'Sender number differs from official MTN 170 / MoMo SMS header',
      'Urgent coercion and threat of police report',
      'Request to send funds manually instead of using official telecom reversal (*170#)',
      'Unverified sender contact details'
    ],
    reasons: [
      'Telecom operators (MTN, Telecel, AT) manage wrong transfer reversals directly via customer care (dial 100 or 1917). Subscribers never need to transfer funds back manually.',
      'Scammers send fake SMS notifications formatted to mimic official bank/MoMo balance alerts, hoping victims do not verify their real wallet balance first.'
    ],
    recommendations: [
      'Do NOT send any money back manually.',
      'Check your actual MoMo wallet balance by dialing *170#.',
      'Advise the sender to dial 100 or 1917 for an official reversal.',
      'Report the sender number to the Cyber Security Authority by dialing 292.'
    ],
    isVerified: true,
    verificationDetails: {
      network: 'Ethereum Mainnet',
      reportId: '0x8f1e2d3c4b5a',
      reportHash: '0x7a91b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9',
      timestamp: '2026-08-04T11:41:00Z',
      status: 'Verified Integrity'
    }
  },
  {
    id: 'scan-102',
    type: 'screenshot',
    channel: 'WhatsApp',
    date: '2 hours ago',
    timestamp: '2026-08-04T09:30:00Z',
    riskScore: 88,
    riskLevel: 'High Risk',
    category: 'Fake Job Agent Fee',
    summary: 'Unsolicited WhatsApp job offer requiring GH₵ 250 registration fee.',
    originalContent: 'Congratulations! You have been selected for an online Remote Data Entry job with International Logistics Ltd. Salary is GH₵ 4,500/month. Pay GH₵ 250 processing fee for registration form.',
    redFlags: [
      'Demanding upfront registration or processing fees for employment',
      'Unusually high salary for entry-level remote task',
      'Informal messaging channel (WhatsApp) without official company domain email'
    ],
    reasons: [
      'Legitimate employers in Ghana do not charge job applicants fees for interviews or registration.',
      'Scammers use fake high-paying job advertisements to target job seekers across Kumasi and Accra.'
    ],
    recommendations: [
      'Never pay any agent or company money to secure a job.',
      'Verify the company on official channels or corporate registers.',
      'Block and report the contact on WhatsApp.'
    ],
    isVerified: true,
    verificationDetails: {
      network: 'Ethereum Mainnet',
      reportId: '0x3a4b5c6d7e8f',
      reportHash: '0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c',
      timestamp: '2026-08-04T09:31:00Z',
      status: 'Verified Integrity'
    }
  },
  {
    id: 'scan-103',
    type: 'message',
    channel: 'Web Link',
    date: 'Yesterday',
    timestamp: '2026-08-03T16:15:00Z',
    riskScore: 35,
    riskLevel: 'Medium Risk',
    category: 'Unverified Promo Link',
    summary: 'Suspicious survey link claiming free mobile data giveaway.',
    originalContent: 'MTN 25th Anniversary Free 50GB Data Giveaway! Click http://mtn-free-data-ghana.gift-claim.xyz to claim yours today.',
    redFlags: [
      'Non-official domain name (.xyz instead of mtn.com.gh)',
      'Unrealistic free gift claims'
    ],
    reasons: [
      'Phishing websites use lookalike URLs to harvest personal phone numbers and social login credentials.'
    ],
    recommendations: [
      'Do not click unknown promo links.',
      'Always visit the official MTN website (mtn.com.gh) for genuine promotions.'
    ],
    isVerified: false
  },
  {
    id: 'scan-104',
    type: 'message',
    channel: 'SMS',
    date: '3 days ago',
    timestamp: '2026-08-01T10:00:00Z',
    riskScore: 12,
    riskLevel: 'Low Risk',
    category: 'Official Notification',
    summary: 'Legitimate notification from official service provider.',
    originalContent: 'Dear Customer, your monthly subscription renewal for SafeLens Shield is successful. Thank you for protecting your wallet.',
    redFlags: [],
    reasons: [
      'Sent from official service header with zero pressure tactics or money requests.'
    ],
    recommendations: [
      'This message appears safe. No further action needed.'
    ],
    isVerified: true,
    verificationDetails: {
      network: 'Ethereum Mainnet',
      reportId: '0x9e8d7c6b5a4f',
      reportHash: '0x4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d',
      timestamp: '2026-08-01T10:01:00Z',
      status: 'Verified Integrity'
    }
  }
]
