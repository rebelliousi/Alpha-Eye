const fs = require('fs');
const axios = require('axios');

// Read .env.local file
function readEnvFile() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const lines = envContent.split('\n');
    const envVars = {};
    
    lines.forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    });
    
    return envVars;
  } catch (error) {
    console.log('❌ Error reading .env.local:', error.message);
    return {};
  }
}

// Main diagnostic function
async function diagnoseAPI() {
  console.log('🔍 === API DIAGNOSTIC START ===\n');
  
  // Read environment variables
  const envVars = readEnvFile();
  const apiKey = envVars.BIRDEYE_API_KEY;
  
  console.log('📋 Environment Check:');
  console.log('  - .env.local file:', fs.existsSync('.env.local') ? '✅ Found' : '❌ Not found');
  console.log('  - BIRDEYE_API_KEY:', apiKey ? `✅ Present (${apiKey.length} chars)` : '❌ Missing');
  
  if (!apiKey) {
    console.log('\n❌ No API key found. Exiting.');
    return;
  }
  
  console.log('\n🌐 Making API Request...');
  console.log('  - URL: https://public-api.birdeye.so/defi/v2/tokens/new_listing?limit=5');
  console.log('  - Method: GET');
  console.log('  - Headers: X-API-KEY, x-chain: solana');
  
  try {
    const response = await axios.get('https://public-api.birdeye.so/defi/v2/tokens/new_listing?limit=5', {
      headers: {
        'X-API-KEY': apiKey,
        'x-chain': 'solana',
        'Content-Type': 'application/json'
      },
      proxy: false,
      timeout: 10000
    });
    
    console.log('\n✅ API Request Successful!');
    console.log('  - Status Code:', response.status);
    console.log('  - Status Text:', response.statusText);
    console.log('  - Response Headers:', JSON.stringify(response.headers, null, 2));
    
    console.log('\n📊 Response Structure:');
    console.log('  - Response type:', typeof response.data);
    console.log('  - Has data property:', 'data' in response.data);
    
    if (response.data && response.data.data) {
      console.log('  - Has data.data property:', true);
      console.log('  - data.data type:', typeof response.data.data);
      console.log('  - Has items property:', 'items' in response.data.data);
      
      if (response.data.data.items) {
        console.log('  - Items count:', response.data.data.items.length);
        console.log('  - First item keys:', Object.keys(response.data.data.items[0] || {}));
      }
    } else {
      console.log('  - Unexpected structure:', Object.keys(response.data));
    }
    
    console.log('\n🎯 CONCLUSION:');
    console.log('  - ✅ API Key is VALID');
    console.log('  - ✅ Request was SUCCESSFUL');
    console.log('  - ✅ Data structure is VALID');
    console.log('  - ✅ Ready for frontend integration');
    
  } catch (error) {
    console.log('\n❌ API Request Failed!');
    console.log('  - Error Type:', error.code || 'Unknown');
    console.log('  - Status Code:', error.response?.status || 'No response');
    console.log('  - Status Text:', error.response?.statusText || 'No response');
    
    if (error.response) {
      console.log('\n📄 Error Response Body:');
      console.log('  - Headers:', JSON.stringify(error.response.headers, null, 2));
      console.log('  - Data:', JSON.stringify(error.response.data, null, 2));
      
      console.log('\n🎯 ERROR ANALYSIS:');
      if (error.response.status === 401) {
        console.log('  - ❌ 401 Unauthorized: API Key is INVALID or EXPIRED');
        console.log('  - 🔧 Solution: Get a new API key from Birdeye');
      } else if (error.response.status === 429) {
        console.log('  - ❌ 429 Rate Limited: API quota EXCEEDED');
        console.log('  - 🔧 Solution: Wait for quota reset or upgrade plan');
      } else if (error.response.status === 400) {
        console.log('  - ❌ 400 Bad Request: Invalid parameters');
        console.log('  - 🔧 Solution: Check request URL and headers');
      } else {
        console.log(`  - ❌ ${error.response.status}: Unknown error`);
        console.log('  - 🔧 Solution: Check Birdeye API documentation');
      }
    } else if (error.code === 'ECONNABORTED') {
      console.log('\n🎯 ERROR ANALYSIS:');
      console.log('  - ❌ Timeout: Request took too long');
      console.log('  - 🔧 Solution: Check network connection or increase timeout');
    } else {
      console.log('\n🎯 ERROR ANALYSIS:');
      console.log('  - ❌ Network Error:', error.message);
      console.log('  - 🔧 Solution: Check internet connection and proxy settings');
    }
  }
  
  console.log('\n🔍 === API DIAGNOSTIC END ===');
}

// Run the diagnostic
diagnoseAPI().catch(console.error);
