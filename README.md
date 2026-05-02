# AlphaEye | Pro-Grade Solana Token Guard 🛡️

<p align="center">
  <img src="./public/screenshots/dashboard-preview.jpg" width="100%" alt="AlphaEye Dashboard Preview">
</p>

> **The ultimate real-time sentinel for Solana traders. Detect alpha, analyze risk, and receive instant security alerts before you ape in.**

---

## 🔗 Live Resources
- **🌐 Live Dashboard**: [https://alpha-eye.vercel.app](https://alpha-eye.vercel.app)
- **📱 Telegram Sentinel**: [t.me/alphaEyeAlertBot](https://t.me/alphaEyeAlertBot)
- **💻 Repository**: Private (Access granted for Hackathon Judges)

---

## 🌟 Vision
AlphaEye was engineered for the **Birdeye Data Sprint** to solve the most critical problem in meme-coin trading: the gap between "detection" and "verification." While generic bots merely list names, AlphaEye performs an autonomous deep-dive security audit on every new pool using Birdeye's professional-grade data infrastructure.

### 📱 Live Telegram Intelligence
AlphaEye's sentinel bot dispatches rich, high-fidelity signals directly to your mobile. Every alert includes a weighted security score and instant research links.

<p align="center">
  <img src="./public/screenshots/telegram-alert.jpg" width="450" alt="Telegram Alert Preview">
</p>

---

## 🚀 Key Features

- **Real-time Discovery**: Scans Solana Mainnet every second for new listings via Birdeye V2 APIs.
- **Deep Security Enrichment**: Automatically evaluates holder concentration, contract status, and metadata mutability.
- **Transparent Audit System**: Employs a "Tiered Analysis" logic. If API constraints are met, it honestly reports `Partial Data` with a ⚠️ warning, ensuring 100% data integrity.
- **Resilient Architecture**: Integrated 429 (Rate Limit) fallback mechanisms prevent dashboard crashes and handle high-traffic periods gracefully.
- **Premium HUD**: High-density trading terminal UI featuring Glassmorphism, Emerald-Glow effects, and real-time state management.

---

## 🧠 Technical Depth & Architecture

### 1. The "Sentinel" Scoring Engine
AlphaEye doesn't just show data; it quantifies risk through a weighted algorithm:
- **Liquidity Depth (40%)**: Threshold analysis for tradeability.
- **Holder Distribution (30%)**: Detecting whale risks and developer-heavy supply.
- **Contract Integrity (20%)**: Verifying renounced ownership and mutability status.
- **Metadata Quality (10%)**: Social verification and branding integrity.

### 2. Bulletproof API Strategy
To respect Birdeye's **1 RPS / 60 RPM** constraints, we built a custom `RateLimitedClient`:
- **Sequential Enrichment**: Processing occurs in a strictly controlled queue to maintain a 0% ban rate.
- **Proxy Bypass**: Implemented `proxy: false` Axios configurations to handle restricted network environments and protocol mismatches.
- **Graceful Degradation**: Intelligent catch-blocks switch to "Liquidity-Only" mode if the API returns a 429 error, keeping the user informed without data loss.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 14 (App Router)
- **State Management**: TanStack Query v5 (5-minute intelligent caching)
- **Styling**: Tailwind CSS + Shadcn/ui (Custom Emerald Dark Theme)
- **API**: Birdeye Data API (V2 Listings & V3 Metadata)
- **Alerts**: Telegram Bot API (Fetch/Axios hybrid)
- **Deployment**: Vercel (CI/CD)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Birdeye API Key ([Get it here](https://docs.birdeye.so/))
- Telegram Bot Token ([@BotFather](https://t.me/botfather))

### Installation
1. **Clone & Install**
   ```bash
   git clone https://github.com/rebelliousi/Alpha-Eye.git
   cd Alpha-Eye
   npm install




I joined this Birdeye Data Sprint mid-way, which forced a hyper-focus on the most impactful features: robust security analysis, high-latency alert delivery, and a resilient architecture that handles API constraints with "Senior-level" grace. These 3 days were an intensive deep-dive into the Birdeye ecosystem.
Status: ✅ Production Ready / Fully Deployed
API Endpoints Utilized:
GET /defi/v2/tokens/new_listing
GET /defi/token_security
GET /defi/v3/token/meta-data/single