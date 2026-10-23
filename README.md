# SafeLens — AI-Powered Scam & Fraud Intelligence Platform 🛡️🇬🇭

> **Look closer. Stay safer.**  
> SafeLens is an AI-powered scam detection, forensic analysis, and fraud prevention platform built to protect citizens and mobile wallet users across Ghana and West Africa. Powered by **Google Gemma 4** and backed by **Base Sepolia (L2)** immutable blockchain verification, SafeLens analyzes suspicious communications before victims lose their funds.

---

## 🌟 Key Features

### ⚡ Google Gemma 4 AI Threat Scanner
- **SMS & Text Analysis**: Forensic inspection of urgent Mobile Money (MoMo) transfer alerts, erroneous credit lures, USSD prompts (`*170#`), and lottery win claims.
- **Multimodal Screenshot OCR**: Direct image analysis of WhatsApp chats, SMS threads, or payment screenshots using Google Gemma 4 vision capabilities.
- **Phishing & URL Inspection**: Detects spoofed telecommunication domains, malicious TLDs (`.xyz`, `.top`, `.site`), and SSL impersonation attempts.
- **Email Security Auditing**: Identifies advance-fee inheritance letters, brand impersonation, and credential phishing requests.
- **Forensic Threat Breakdown**: Plain-English threat summaries, explicit red flags, risk level ratings (`High`, `Medium`, `Low`), risk index (0–100%), and attack vector distribution.

### ⛓️ Immutable On-Chain Threat Registry (Base L2)
- **Zero-Friction Web3 Verification**: Scam report content hashes are anchored on the **SafeLensRegistry** smart contract on Base Sepolia.
- **Gasless User Experience**: The backend service wallet sponsors gas and signs transactions—end users never need a crypto wallet, seed phrase, or gas tokens.
- **Public Auditability**: Verify whether a phone number, message hash, or phishing lure has previously been reported and anchored on-chain.

### 🛡️ User Protection & Security Education
- **Ghana Cyber Emergency Hub**: Instant 1-click links and hotlines for the **National Cyber Security Authority (CSA Hotline 292)**, MTN Fraud (1917), and Police Service (18555 / 112).
- **Personal Scan History**: Persistent audit trail of past evaluations stored in local storage and database.
- **Educational Knowledge Base**: Interactive Scam Spotter guides detailing MoMo cashout tricks, fake job fees, and impersonation tactics.

---

## 📁 Repository Architecture

```
SafeLens/
│
├── client/                     # Frontend Application (React 19 + Vite)
│   ├── src/
│   │   ├── components/         # Reusable design system (Buttons, Badges, Modals, Chatbot)
│   │   ├── features/           # Modular domain components (Scanner, Results, Protection)
│   │   ├── pages/              # Scanner, Results, Dashboard, History, Pricing, SafetyTips
│   │   ├── services/           # scannerService.js (Gemma 4 API), blockchainService.js
│   │   └── index.css           # Modern dark/light theme & security radar animations
│   └── package.json
│
├── server/                     # Backend API Service (Node.js + Express)
│   ├── src/
│   │   ├── gemmaService.js     # Google Gemma 4 AI threat analysis engine (multimodal + text)
│   │   ├── contract.js         # Base Sepolia ethers.js contract interface
│   │   └── index.js            # Express API server (/api/scan, /api/reports/anchor, /api/health)
│   └── package.json
│
├── contracts/                  # Smart Contracts & Deployment (Hardhat)
│   ├── contracts/
│   │   └── SafeLensRegistry.sol# On-chain scam report hash registry (Base L2)
│   ├── scripts/
│   │   └── deploy.js           # Hardhat deployment script
│   └── hardhat.config.js
│
└── README.md                   # Platform documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Google AI Studio API Key**: For Gemma 4 AI threat scanning

---

### 1. Backend Server Setup (`server/`)

1. Navigate to the server folder:
   ```bash
   cd server
   npm install
   ```

2. Configure environment variables in `server/.env`:
   ```env
   PORT=4000
   CLIENT_ORIGIN=http://localhost:5173

   # Google AI Studio Gemma 4 Configuration
   GEMINI_API_KEY=your_google_ai_studio_api_key
   GEMMA_MODEL=gemma-4-26b-a4b-it

   # Base Sepolia Contract Configuration
   RPC_URL=https://sepolia.base.org
   CONTRACT_ADDRESS=0xb0E56de2C6aD146F9b6c8c86084046EC1200859c
   PRIVATE_KEY=your_base_sepolia_service_wallet_private_key
   ```

3. Start the backend server:
   ```bash
   npm run dev
   ```
   The API will start at `http://localhost:4000`.

---

### 2. Frontend Client Setup (`client/`)

1. Navigate to the client directory:
   ```bash
   cd ../client
   npm install
   ```

2. Configure `client/.env`:
   ```env
   VITE_API_URL=http://localhost:4000
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. Build for production:
   ```bash
   npm run build
   ```

---

### 3. Smart Contracts (`contracts/`)

- **Deployed Contract**: `SafeLensRegistry`
- **Network**: Base Sepolia Testnet (Chain ID: `84532`)
- **Contract Address**: `0xb0E56de2C6aD146F9b6c8c86084046EC1200859c`
- **Block Explorer**: [BaseScan Sepolia Explorer](https://sepolia.basescan.org/address/0xb0E56de2C6aD146F9b6c8c86084046EC1200859c)

To test or redeploy the contract:
```bash
cd contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network baseSepolia
```

---

## 🔌 API Reference

### Health & Model Status
`GET /api/health`
```json
{
  "ok": true,
  "contract": "0xb0E56de2C6aD146F9b6c8c86084046EC1200859c",
  "ai": {
    "activeModel": "gemma-4-26b-a4b-it",
    "availableModels": ["gemma-4-26b-a4b-it", "gemma-4-31b-it"],
    "hasApiKey": true,
    "provider": "Google AI Studio (Gemma 4 only)"
  }
}
```

### Threat Scan
`POST /api/scan`
- **Body**: `{ "type": "message" | "link" | "screenshot" | "email", "input": "text", "image": "base64_data_optional" }`
- **Returns**: Full forensic threat report with risk score, red flags, explanation, threat category, and vector breakdown.

### Anchor Report On-Chain
`POST /api/reports/anchor`
- **Body**: `{ "id": "scan-123", "content": "suspicious content", "riskLevel": "high", "riskScore": 95 }`
- **Returns**: On-chain transaction receipt hash on Base Sepolia.

---

## 🌐 Official Emergency Hotlines (Ghana)

- **National Cyber Security Authority (CSA)**: Call / SMS `292`
- **MTN Fraud Reporting Unit**: Toll-Free `1917`
- **Ghana Police Service Emergency**: `18555` / `112`

---

## 📄 License
Built for community protection and digital cybersecurity awareness.
