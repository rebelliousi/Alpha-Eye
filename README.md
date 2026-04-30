# AlphaEye | Advanced Solana Token Guard

🚀 **Real-time Telegram Alpha Alerts** • 🛡️ **Security Scoring** • ⚡ **Lightning Fast**

## 🌟 Real-time Telegram Alpha Alerts

**Get instant notifications when high-scoring tokens appear!**

- 📱 **Instant Telegram Alerts**: 80+ security score tokens sent directly to your Telegram
- 🎯 **Smart Filtering**: Only the safest tokens trigger alerts
- 📊 **Rich Data**: Symbol, score, liquidity, address, and DexScreener links included
- 🔄 **Anti-Spam**: Intelligent caching prevents duplicate alerts

## 🧠 How It Works

### 1. **Data Collection**
- Fetches new token listings from Birdeye API
- Enriches with security metadata and token information
- Calculates comprehensive security scores

### 2. **Security Scoring Algorithm**
```
Security Score = (Liquidity Weight × 40%) + 
                (Holder Distribution × 30%) + 
                (Contract Audit × 20%) + 
                (Metadata Quality × 10%)
```

### 3. **Real-time Alerts**
- Tokens scoring 80+ trigger Telegram notifications
- Professional message formatting with emojis and structure
- Direct DexScreener links for instant research

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with App Router & TypeScript
- **State Management**: TanStack Query (5-minute caching)
- **UI Framework**: Shadcn/ui with Tailwind CSS
- **API Integration**: Birdeye API with rate limiting (1 RPS / 60 RPM)
- **Notifications**: Telegram Bot API
- **Deployment**: Vercel-ready

## 🔒 Security Features

- **Multi-factor Scoring**: Liquidity, holders, contract audit, metadata
- **Rate Limiting**: 1 request per second to respect API limits
- **Smart Caching**: 5-minute client-side cache for performance
- **Duplicate Prevention**: Alert caching prevents spam

## ⚡ Performance Optimizations

- **Instant Load**: Page renders in ~100ms
- **Background Fetching**: Data loads asynchronously
- **Efficient Caching**: TanStack Query with 5-minute stale time
- **Optimized API Calls**: Sequential enrichment with rate limiting

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Birdeye API key
- Telegram Bot Token & Chat ID (for alerts)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/rebelliousi/Alpha-Eye.git
cd Alpha-Eye
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
cp .env.example .env.local
```

4. **Configure environment variables**
```env
BIRDEYE_API_KEY=your_birdeye_api_key
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

5. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## 📊 API Integration

### Why Birdeye API?

**Birdeye is the leading Solana analytics platform** providing:
- ✅ **Real-time token data** with millisecond updates
- ✅ **Comprehensive security metrics** and holder analysis  
- ✅ **Reliable infrastructure** with 99.9% uptime
- ✅ **Professional-grade data** trusted by major exchanges
- ✅ **Advanced filtering** for new listings and security data

### Rate Limiting Strategy

- **1 RPS**: Respectful API usage
- **60 RPM**: Maximum requests per minute
- **Sequential Processing**: Prevents API overload
- **Error Handling**: Graceful degradation on API issues

## 🔧 Configuration

### Telegram Bot Setup

1. Create a bot with [@BotFather](https://t.me/BotFather)
2. Get your bot token
3. Get your chat ID (send a message to your bot and check updates)
4. Add credentials to `.env.local`

### Security Score Thresholds

- 🟢 **80-100**: Safe (Triggers Telegram alerts)
- 🟡 **50-79**: Caution (Display only)
- 🔴 **0-49**: Risk (Warning display)

## 📱 Features

### Dashboard
- **Dark Mode UI**: Professional trading interface
- **Real-time Updates**: Auto-refreshing data
- **Security Badges**: Color-coded scoring system
- **Social Links**: Twitter and website integration
- **Avatar System**: Token logos with fallbacks

### Alert System
- **Toast Notifications**: In-app alerts for high scores
- **Telegram Integration**: Real-time mobile notifications
- **Smart Filtering**: Prevents alert fatigue
- **Rich Formatting**: Professional message structure

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Docker
```bash
docker build -t alphaeye .
docker run -p 3000:3000 alphaeye
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 **Issues**: [GitHub Issues](https://github.com/rebelliousi/Alpha-Eye/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/rebelliousi/Alpha-Eye/discussions)
- 📱 **Telegram**: Direct support for premium users

---

**Built with ❤️ for the Solana ecosystem**  
*AlphaEye - Your Pro-Grade Token Guard* 🛡️
