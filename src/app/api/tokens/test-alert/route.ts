import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return NextResponse.json({ error: 'Telegram credentials not configured' }, { status: 400 });
    }

    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: `🚨 AlphaEye Test Alert 🚨\n\n${message}`,
      parse_mode: 'Markdown'
    });

    console.log('✅ Test alert sent to Telegram');
    return NextResponse.json({ success: true, message: 'Test alert sent successfully' });
    
  } catch (error) {
    console.error('Failed to send test alert:', error);
    return NextResponse.json({ error: 'Failed to send test alert' }, { status: 500 });
  }
}
