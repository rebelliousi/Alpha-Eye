import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    console.log('TELEGRAM_TEST: Bot Token exists:', !!botToken);
    console.log('TELEGRAM_TEST: Chat ID exists:', !!chatId);
    console.log('TELEGRAM_TEST: Bot Token length:', botToken?.length);
    console.log('TELEGRAM_TEST: Chat ID:', chatId);

    if (!botToken || !chatId) {
      return NextResponse.json({ error: 'Telegram credentials not configured' }, { status: 400 });
    }

    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: `🚨 AlphaEye Test Alert 🚨\n\n${message}`,
      parse_mode: 'Markdown',
      proxy: false
    });

    console.log('✅ Test alert sent to Telegram');
    return NextResponse.json({ success: true, message: 'Test alert sent successfully' });
    
  } catch (error) {
    console.error('Failed to send test alert:', error);
    console.log('TELEGRAM_TEST_ERROR:', error.response?.data);
    return NextResponse.json({ error: 'Failed to send test alert' }, { status: 500 });
  }
}
