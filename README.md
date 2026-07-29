# SafeLens — AI-Powered Scam & Fraud Detector 🛡️🇬🇭

> **Look closer. Stay safer.**  
> SafeLens is an AI-assisted threat detection and awareness platform designed to help everyday citizens in Ghana and beyond identify suspicious Mobile Money (MoMo) alerts, SMS lures, phishing URLs, and job recruitment scams before taking action.

---

## 🌟 Key Features

- **⚡ Multi-Vector AI Threat Scanner**:
  - **Message Scan**: Detects MoMo cashout tricks, urgency coercion, and SMS fraud.
  - **Screenshot OCR Analysis**: Upload conversation screenshots for automated text extraction & threat evaluation.
  - **Link Reputation Audit**: Evaluates HTTPS security, domain registrar age, and phishing blacklists.
  - **Email Header & Body Scan**: Identifies domain spoofing and credential harvesting lures.

- **🔒 Authentication & Protected Features**:
  - Account protection (`ProtectedRoute`) for scanning tools, scan logs, and profile management.
  - Local authentication with demo credentials (`kofi@example.com` / `password123`) & 1-click test drive option.

- **📜 Personal Scan Logs & History**:
  - Filterable audit trail of previous scans with risk severity tags (`High`, `Medium`, `Low`).

- **🎯 Interactive Instant Scan Sandbox**:
  - Test pre-configured real-world Ghanaian scams with interactive visual analysis overlays.

- **🎓 Ghana Security Education Center & Quiz**:
  - Common scam tactics library (MoMo wrong transfer, fake job registration fees, brand impersonation).
  - Interactive 3-stage **Scam Spotter Quiz** with score calculation and rank badges (*Scam Guardian*, *Vigilant Citizen*, *Vulnerable Wallet*).

- **📱 Full Mobile & Tablet Responsiveness**:
  - Fluid typography, touch-swipe tab rows, and responsive media query system.

- **🎨 Modern Dark & Light Mode Theme**:
  - Smooth glassmorphism visuals, ambient security radar waves, and quick theme toggle.

---

## 📁 Repository Architecture

```
SafeLens/
├── client/                 # React 19 + Vite Frontend Application
│   ├── public/             # Public assets (Logo, Favicon, Icons)
│   └── src/
│       ├── components/     # UI design system & layout components
│       │   ├── auth/       # ProtectedRoute & auth guards
│       │   ├── ui/         # Buttons, Badges, Alerts, Cards
│       │   └── layout/     # Navbar, Footer, PageContainer, BackgroundAnimation
│       ├── pages/          # Home, Scanner, Results, History, About, Login, Register, Profile
│       ├── routes/         # AppRoutes configuration
│       ├── services/       # Auth service, scanner service, mock database
│       └── index.css       # Design tokens & responsive styles
├── server/                 # Backend API and integration (future release)
└── README.md               # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### Installation & Local Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/agudu50/SafeLens.git
   cd SafeLens/client
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Production Build**:
   ```bash
   npm run build
   ```

---

## 🌐 Live Hotlines & Emergency Contacts (Ghana)

- **National Cyber Security Authority (CSA)**: Hotline `292`
- **MTN Fraud Reporting Unit**: Toll-Free `1917`
- **Ghana Police Service**: Emergency `18555` / `112`

---

## 📄 License

This project is built for educational and community safety awareness.
