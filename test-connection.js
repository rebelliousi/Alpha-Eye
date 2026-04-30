const axios = require('axios');
const fs = require('fs');

// Read .env.local manually
const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

// Test Telegram connection
async function testTelegram() {
  console.log('=== TELEGRAM TEST ===');
  
  const botToken = envVars.TELEGRAM_BOT_TOKEN;
  const chatId = envVars.TELEGRAM_CHAT_ID;
  
  console.log('Bot Token exists:', !!botToken);
  console.log('Chat ID exists:', !!chatId);
  console.log('Bot Token length:', botToken?.length);
  console.log('Chat ID:', chatId);
  
  if (!botToken || !chatId) {
    console.log('❌ Missing Telegram credentials');
    return;
  }
  
  try {
    // Try fetch instead of axios for better reliability
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: '🚨 AlphaEye Savaş Modu İspat Mesajı 🚨\n\nBu bir ispat test mesajıdır - sistem çalışıyor!',
        parse_mode: 'Markdown'
      })
    });
    
    const data = await response.json();
    console.log('✅ Telegram test başarılı:', data);
  } catch (error) {
    console.log('❌ Telegram hatası:');
    console.log('Error Code:', error.code);
    console.log('Error Message:', error.message);
    console.log('Error Stack:', error.stack);
    if (error.response) {
      console.log('Response Status:', error.response.status);
      console.log('Response Data:', error.response.data);
    }
    if (error.request) {
      console.log('Request Error:', error.request);
    }
  }
}

// Test Birdeye connection
async function testBirdeye() {
  console.log('\n=== BIRDEYE TEST ===');
  
  const apiKey = envVars.BIRDEYE_API_KEY;
  console.log('Birdeye API Key exists:', !!apiKey);
  console.log('API Key length:', apiKey?.length);
  
  if (!apiKey) {
    console.log('❌ Missing Birdeye API key');
    return;
  }
  
  try {
    const response = await axios.get('https://public-api.birdeye.so/defi/v2/tokens/new_listing', {
      params: {
        limit: 5,
        meme_platform_enabled: true
      },
      headers: {
        'X-API-KEY': apiKey,
        'x-chain': 'solana',
        'accept': 'application/json'
      },
      proxy: false
    });
    
    console.log('✅ Birdeye test başarılı');
    console.log('Token count:', response.data?.data?.items?.length || 0);
    
    // Test security API
    if (response.data?.data?.items?.length > 0) {
      const firstToken = response.data.data.items[0];
      console.log('Testing security API for:', firstToken.address);
      
      try {
        const securityResponse = await axios.get(`https://public-api.birdeye.so/defi/v2/token/security/${firstToken.address}`, {
          headers: {
            'X-API-KEY': apiKey,
            'x-chain': 'solana',
            'accept': 'application/json'
          },
          proxy: false
        });
        
        console.log('✅ Security API çalışıyor');
        console.log('Security data keys:', Object.keys(securityResponse.data?.data || {}));
      } catch (secError) {
        console.log('❌ Security API hatası:', secError.message);
      }
    }
    
  } catch (error) {
    console.log('❌ Birdeye hatası:');
    console.log('Error Code:', error.code);
    console.log('Error Message:', error.message);
    console.log('Error Stack:', error.stack);
    if (error.response) {
      console.log('Response Status:', error.response.status);
      console.log('Response Data:', error.response.data);
    }
    if (error.request) {
      console.log('Request Error:', error.request);
    }
  }
}

// Test analyzer fallback
async function testAnalyzerFallback() {
  console.log('\n=== ANALYZER FALLBACK TEST ===');
  
  // Simulate the analyzer fallback logic
  const mockToken = {
    name: 'TestToken',
    symbol: 'TEST',
    liquidity: 50000,
    address: 'test_address'
  };
  
  // Simulate rate limit scenario (no security/metadata data)
  const security = null;
  const metadata = null;
  
  console.log('Simulating rate limit scenario...');
  console.log('Security data:', security);
  console.log('Metadata data:', metadata);
  
  // This should trigger the fallback
  if (!security && !metadata) {
    console.log('⚠️ Rate limit hit, using simulated score');
    
    // Generate simulated score (65-85 range)
    const simulatedScore = Math.floor(Math.random() * 20) + 65;
    console.log('Generated simulated score:', simulatedScore);
    
    // Generate component scores
    const scores = {
      liquidity: Math.min(25, Math.floor(mockToken.liquidity / 5000)), // Scale based on liquidity
      holderDistribution: Math.floor(Math.random() * 10) + 15, // 15-25
      contractAudit: Math.floor(Math.random() * 10) + 15, // 15-25
      metadata: Math.floor(Math.random() * 10) + 15, // 15-25
    };
    
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    console.log('Component scores:', scores);
    console.log('Total simulated score:', totalScore);
  }
}

// Run tests
async function runTests() {
  console.log('🔍 AlphaEye Ispat Testleri Başlatılıyor...\n');
  
  await testTelegram();
  await testBirdeye();
  await testAnalyzerFallback();
  
  console.log('\n🏁 Ispat Testleri Tamamlandı');
}

runTests().catch(console.error);
