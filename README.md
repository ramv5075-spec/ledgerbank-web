Here's the README — copy and paste it into your GitHub:
# ⬡ LedgerBank Web

A React.js web dashboard for LedgerBank — featuring authentication, wallet management, fund transfers, transaction history, and loan workflows. Connected to the live LedgerBank REST API.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-4-646CFF?style=flat&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=flat&logo=javascript&logoColor=black)

## Features

- **JWT Authentication** — Secure login and register with token stored in localStorage
- **Wallet Dashboard** — View balance, stats, and recent transactions
- **Fund Transfers** — Send money to any wallet instantly
- **Transaction History** — Full table view of all sent and received transfers
- **Loan System** — Apply for loans, instant disbursement, repay anytime with progress tracking
- **Protected Routes** — Auth-based routing with React Router

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Build Tool | Vite |
| Routing | React Router v6 |
| HTTP | Axios |
| State | React Context API |
| Styling | Plain CSS with CSS Variables |
| Backend | LedgerBank REST API |

## Project Structure
src/
├── components/
│   └── Navbar.jsx          # Sticky navigation bar
├── context/
│   └── AuthContext.jsx     # JWT auth state management
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Transfer.jsx
│   ├── Transactions.jsx
│   └── Loans.jsx
├── services/
│   └── api.js              # Axios instance with auth interceptor
└── index.css               # Global styles with CSS variables

## Getting Started

### 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/ledgerbank-web.git
cd ledgerbank-web

### 2. Install dependencies
npm install

### 3. Run locally
npm run dev

App runs at http://localhost:5173

## Backend API

This app connects to the live LedgerBank REST API:

**Base URL:** `https://ledgerbank-api-production.up.railway.app/api`

Full API documentation: [ledgerbank-api](https://github.com/YOUR_USERNAME/ledgerbank-api)

## Related Repos

- [ledgerbank-api](https://github.com/YOUR_USERNAME/ledgerbank-api) — Node.js + PostgreSQL REST API
- [ledgerbank-mobile](https://github.com/YOUR_USERNAME/ledgerbank-mobile) — React Native mobile app

## License

MIT
