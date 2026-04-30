import axios from 'axios';

interface TelegramAlertData {
  symbol: string;
  name: string;
  score: number;
  liquidity: number;
  address: string;
}

const alertedCache = new Set<string>();

export async function sendTelegramAlert(data: TelegramAlertData): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.log('Telegram credentials not configured, skipping alert');
    return;
  }

  // Check if already alerted for this token
  if (alertedCache.has(data.address)) {
    console.log(`Already sent alert for ${data.symbol}, skipping`);
    return;
  }

  const message = `🚨 *ALPHA DETECTED* 🚨\n` +
    `💎 Token: $${data.symbol} (${data.name})\n` +
    `🛡️ Score: ${data.score}/100\n` +
    `💰 Liquidity: $${data.liquidity.toLocaleString()}\n` +
    `🔗 Address: \`${data.address}\`\n` +
    `📊 DexScreener: https://dexscreener.com/solana/${data.address}`;

  try {
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
      disable_web_page_preview: false
    });

    // Mark as alerted
    alertedCache.add(data.address);
    console.log(`✅ Telegram alert sent for ${data.symbol}`);

    // Clean cache periodically (keep last 100 alerts)
    if (alertedCache.size > 100) {
      const entries = Array.from(alertedCache);
      const toRemove = entries.slice(0, 50);
      toRemove.forEach(addr => alertedCache.delete(addr));
    }
  } catch (error) {
    console.error('Failed to send Telegram alert:', error);
  }
}
