# SafeLens

SafeLens is an AI-assisted scam detection application intended to help users in Ghana identify suspicious messages, links, and screenshots before they take action.

This repository is organized as a monorepo with separate `client` and `server` folders. The current focus is on the client-side experience.

## Project Vision

SafeLens is designed to feel:
- modern
- trustworthy
- simple
- professional
- security-focused

The initial product is tailored for Ghana, but the architecture is intentionally scalable to support other African markets later.

## Current Status

- `client/` contains the React/Vite frontend with a landing page, scanner UI, results page, and mock data flow.
- `server/` exists as a separate folder for future backend work. It is not modified yet.
- Root-level dependency management is intentionally kept out of the client and server folders.

## Folder Structure

```
SafeLens/
├── client/          # Frontend application (React + Vite)
├── server/          # Backend API and integration (future)
├── README.md        # Project overview and implementation plan
└── package-lock.json? # should not be in root long term
```

### Client Structure

The `client` app follows a feature-oriented layout:

```
client/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── common/
│   ├── features/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── package-lock.json
└── vite.config.js
```

## Implementation Plan

The project is implemented in stages to keep the client simple, polished, and extensible.

### Stage 1 — Project Foundation
- Establish the client app as a React + Vite project.
- Create a clean folder structure that separates UI components, pages, routes, and services.

### Stage 2 — Design System
- Define global color tokens, typography, spacing, buttons, forms, cards, and alerts.
- Build reusable UI components to keep the interface consistent.

### Stage 3 — Navigation
- Implement a responsive Navbar and Footer.
- Support mobile-friendly navigation with a hamburger menu.

### Stage 4 — Home Page
- Create a landing page with a strong hero section.
- Add a features section and explain how SafeLens works.

### Stage 5 — Scanner
- Build the main scan experience at `/scan`.
- Support Message and Screenshot scanning UI.
- Use mock functionality for now instead of real AI integration.

### Stage 6 — Results
- Build a results page at `/results/:id`.
- Show risk score, summary, red flags, explanation, recommendation, and original content.

### Stage 7 — History
- Build a history interface with mock scan data.
- Allow users to revisit previous scan reports.

### Stage 8 — Backend Integration
- Prepare the frontend for API integration after the UI is complete.
- Keep API logic separate from UI components.

## Current Client Features

- Responsive landing page
- Scanner UI for message input and screenshot upload
- Mock analysis flow with loading state
- Results page with risk scoring and actionable guidance
- History view using mock data
- Clear UX language for "Potential Scam", "High Risk", "Medium Risk", and "Low Risk"

## Development Notes

- The client app is the main working area for now. Do not modify or create files outside `client/` or `server/` unless you are updating this root README.
- The backend should be added later in `server/` and should handle AI API keys securely.
- No gradients are used in the theme; the design uses flat color surfaces.
- The primary brand color is `rgb(230, 60, 28)`.

## Running the Client

From the `client/` folder:

```bash
npm install
npm run dev
```

Then open the local Vite URL in your browser.

## Future Work

- Implement the server-side API for real AI analysis
- Add support for link and email scanning
- Add user session history and saved reports
- Improve screenshot parsing and OCR support
- Extend the app for additional African markets

---

> Note: Keep repository-level files minimal and avoid placing client-only modules outside `client/`.
