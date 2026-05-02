import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    let requestData;
    try {
      requestData = await request.json();
    } catch (e) {
      requestData = { message: '' };
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    console.log('📡 [TELEGRAM SIGNAL] Profesyonel mesaj hazırlanıyor...');

    if (!botToken || !chatId) {
      return NextResponse.json({ 
        error: 'Telegram credentials not configured in .env.local' 
      }, { status: 400 });
    }

   
    const signalMessage = `
🚨 *ALPHAEYE SIGNAL DETECTED* 🚨
━━━━━━━━━━━━━━━━━━
💎 *Token:* $MJ (The Coach)
🛡️ *Security Score:* 94/100
💰 *Liquidity:* $2.45M
✅ *Audit Status:* FULL AUDIT

📊 *Quick Analysis:*
• Top 10 Holders: 12% (Low Risk)
• Metadata: Immutable ✅
• Contract: Verified & Renounced ✅

🔗 *Trade & Research:*
• [DexScreener](https://dexscreener.com/solana/7xKXmP)
• [Birdeye](https://birdeye.so/token/7xKXmP)
━━━━━━━━━━━━━━━━━━
👁️ _Powered by AlphaEye AI Sentinel_
    `;

    // Telegram API isteği
    const response = await axios.post(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        chat_id: chatId,
        text: signalMessage,
        parse_mode: 'Markdown',
        disable_web_page_preview: false // Linklerin önizlemesi görünsün (şık durur)
      },
      {
        proxy: false, 
        timeout: 10000 
      }
    );

    console.log('✅ [TELEGRAM SIGNAL] Ssent succesfully!');

    return NextResponse.json({ 
      success: true, 
      message: 'Professional signal sent successfully'
    });

  } catch (error: any) {
    console.error('❌ [TELEGRAM SIGNAL] HATASI:');

    if (error.response) {
      console.error('Detay:', JSON.stringify(error.response.data, null, 2));
      return NextResponse.json({ error: 'Telegram API Error', details: error.response.data }, { status: error.response.status });
    }

    return NextResponse.json({ error: 'Network Error', message: error.message }, { status: 500 });
  }
}