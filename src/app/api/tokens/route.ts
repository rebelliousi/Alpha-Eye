import { NextResponse } from 'next/server';
import axios from 'axios';
import { scoreCalculator } from '@/lib/security/score';
import { sendTelegramAlert } from '@/lib/alerts/telegram';

// Tip Tanımlaması
interface TokenSecurity {
  top10HolderPercent: number;
  mutableMetadata: boolean;
  jupStrictList: boolean;
  creatorBalance: number;
}

export async function GET() {
  const API_KEY = process.env.BIRDEYE_API_KEY;

  try {
    console.log("🚀 AlphaEye: Veri çekme işlemi başlatıldı...");

    // 1. ADIM: Yeni Listelenen Tokenları Çek
    // proxy: false ayarı, yerel socks5/http proxy engellerini aşmak için hayati önem taşır.
    const listingsResponse = await axios.get(
      'https://public-api.birdeye.so/defi/v2/tokens/new_listing?limit=10&meme_platform_enabled=true',
      {
        headers: { 
          'X-API-KEY': API_KEY || '', 
          'x-chain': 'solana',
          'accept': 'application/json'
        },
        proxy: false, // KRİTİK: Sistem proxy'sini devre dışı bırak
        timeout: 10000 // 10 saniye zaman aşımı
      }
    );

    const listings = listingsResponse.data?.data?.items || [];
    console.log(`✅ ${listings.length} yeni token bulundu.`);

    const enrichedTokens = [];

    // 2. ADIM: Her Token'ı Sırayla Zenginleştir (Enrichment)
    for (const token of listings) {
      console.log(`🔍 İşleniyor: ${token.symbol}`);
      
      try {
        // Güvenlik ve Metadata verilerini çek (1 RPS limitine uymak için sırayla)
        const securityRes = await axios.get(
          `https://public-api.birdeye.so/defi/token_security?address=${token.address}`,
          {
            headers: { 'X-API-KEY': API_KEY || '', 'x-chain': 'solana' },
            proxy: false,
            timeout: 5000
          }
        );

        const metadataRes = await axios.get(
          `https://public-api.birdeye.so/defi/v3/token/meta-data/single?address=${token.address}`,
          {
            headers: { 'X-API-KEY': API_KEY || '', 'x-chain': 'solana' },
            proxy: false,
            timeout: 5000
          }
        );

        const securityData = securityRes.data?.data || {};
        const metadataData = metadataRes.data?.data || {};

        // Skor hesapla
        const security: TokenSecurity = {
          top10HolderPercent: securityData.top10HolderPercent || 100,
          mutableMetadata: securityData.mutableMetadata ?? true,
          jupStrictList: securityData.jupStrictList || false,
          creatorBalance: securityData.creatorBalance || 100
        };

        const securityScore = scoreCalculator.calculateSecurityScore(security);

        // Eğer skor 80+ ise Telegram'a sinyal gönder
        if (securityScore >= 80) {
          await sendTelegramAlert({
            symbol: token.symbol,
            name: token.name,
            score: securityScore,
            liquidity: token.liquidity,
            address: token.address
          }).catch(err => console.error("Telegram Sinyal Hatası:", err.message));
        }

        enrichedTokens.push({
          name: token.name,
          symbol: token.symbol,
          address: token.address,
          liquidity: token.liquidity,
          logo: metadataData.logo_uri || token.logoURI,
          securityScore,
          isFullAudit: true, // Başarıyla analiz edildi
          twitter: metadataData.extensions?.twitter || '',
          website: metadataData.extensions?.website || '',
          telegram: metadataData.extensions?.telegram || ''
        });

        console.log(`✨ ${token.symbol} analiz edildi: ${securityScore}/100`);

      } catch (innerError: any) {
        // Eğer bir token'da hata olursa (örn: 429 Rate Limit), sistemi durdurma
        console.log(`⚠️ ${token.symbol} kısıtlı modda eklendi (Hata: ${innerError.message})`);
        
        enrichedTokens.push({
          name: token.name,
          symbol: token.symbol,
          address: token.address,
          liquidity: token.liquidity,
          logo: token.logoURI,
          securityScore: 15, // Sadece likidite bazlı düşük puan
          isFullAudit: false, // Kısıtlı veri uyarısı için
          twitter: '',
          website: '',
          telegram: ''
        });
      }

      // Birdeye 1 RPS kuralı için her istekten sonra 1.1 saniye bekle
      await new Promise(resolve => setTimeout(resolve, 1100));
    }

    console.log("🎯 Tüm işlemler tamamlandı. Frontend'e gönderiliyor.");
    return NextResponse.json(enrichedTokens);

  } catch (error: any) {
    console.error("❌ KRİTİK API HATASI:", error.response?.data || error.message);
    
    // Uygulamanın çökmemesi için hata durumunda boş bir dizi dönüyoruz (500 yerine 200)
    return NextResponse.json([], { status: 200 });
  }
}