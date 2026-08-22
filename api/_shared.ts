/**
 * Universal Response & Helper Utilities for Vercel Serverless Functions and Express Server
 */

export function getMasKeyId(): string {
  try {
    return (
      (typeof process !== 'undefined' && process.env && (
        process.env.MAS_API_KEY ||
        process.env.MAS_KEY_ID ||
        process.env.KEY_ID
      )) || ""
    );
  } catch {
    return "";
  }
}

/**
 * Universal sender that handles Express res, Vercel Serverless res, and Edge Web Response
 */
export function sendJsonResponse(req: any, res: any, statusCode: number, data: any) {
  try {
    // 1. If Express or Vercel Node Serverless response object exists
    if (res && typeof res.setHeader === 'function') {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, KeyId, X-Requested-With');

      // Handle OPTIONS preflight
      if (req?.method === 'OPTIONS') {
        if (typeof res.status === 'function') {
          return res.status(200).end();
        }
        res.statusCode = 200;
        return res.end();
      }

      if (typeof res.status === 'function') {
        if (typeof res.json === 'function') {
          return res.status(statusCode).json(data);
        }
        res.status(statusCode);
        return res.end(JSON.stringify(data));
      }

      if (typeof res.json === 'function') {
        res.statusCode = statusCode;
        return res.json(data);
      }

      res.statusCode = statusCode;
      return res.end(JSON.stringify(data));
    }

    // 2. If Standard Web / Edge API (req: Request, no res passed)
    if (typeof Response !== 'undefined') {
      return new Response(JSON.stringify(data), {
        status: statusCode,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, KeyId, X-Requested-With',
        },
      });
    }
  } catch (err) {
    console.error('Error in sendJsonResponse:', err);
    try {
      if (res && typeof res.end === 'function') {
        res.statusCode = 200;
        return res.end(JSON.stringify(data));
      }
    } catch {
      // ignore
    }
  }
}

// Fallback high-precision rate map for currencies if external network is offline
export const FALLBACK_CURRENCIES = [
  {
    id: 'jpy',
    country: 'Japan',
    currencyCode: 'JPY',
    currencyName: 'Japanese Yen',
    region: 'Asia',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=200&auto=format&fit=crop&q=80',
    flagUrl: '🇯🇵',
    currentRate: 112.45,
    changePercent: 2.4,
    threeMonthAgoRate: 109.80,
    isThreeMonthHigh: true,
    hasFlashAlert: true,
    flashAlertText: 'JPY broke through the 112.00 resistance level — SGD purchasing power is at a 3-month peak.',
    historical3M: {
      pastLabel: '3 Mo Ago',
      pastValue: 109.80,
      nowLabel: 'Now',
      nowValue: 112.45,
    },
    trend7d: [110.2, 110.8, 111.1, 111.4, 111.9, 112.1, 112.45],
    travelTip: 'Ideal for booking Autumn/Winter ski resort passes in Hokkaido & Tokyo Michelin dining.',
    bestPaymentMethod: 'MerlionFX Virtual Card via Apple Pay / Suica IC reload for 0% markup.',
    localAtmFee: 'Seven Bank (7-Eleven) ATM: Free with MerlionFX debit card.',
  },
  {
    id: 'krw',
    country: 'South Korea',
    currencyCode: 'KRW',
    currencyName: 'South Korean Won',
    region: 'Asia',
    imageUrl: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=200&auto=format&fit=crop&q=80',
    flagUrl: '🇰🇷',
    currentRate: 1005.20,
    changePercent: 1.8,
    threeMonthAgoRate: 987.40,
    isThreeMonthHigh: true,
    hasFlashAlert: true,
    flashAlertText: 'KRW surpasses 1,000 KRW per 1 SGD threshold for the first time in 90 days.',
    historical3M: {
      pastLabel: '3 Mo Ago',
      pastValue: 987.40,
      nowLabel: 'Now',
      nowValue: 1005.20,
    },
    trend7d: [991.0, 994.5, 998.0, 1001.2, 1003.5, 1004.8, 1005.20],
    travelTip: 'Korean beauty clinics in Gangnam and duty-free shopping offer immediate tax refunds.',
    bestPaymentMethod: 'MerlionFX physical card for 100% merchant contactless acceptance across Seoul.',
    localAtmFee: 'KB Kookmin Bank & Shinhan: 3,000 KRW local surcharge waived for MerlionFX Privilege.',
  },
  {
    id: 'thb',
    country: 'Thailand',
    currencyCode: 'THB',
    currencyName: 'Thai Baht',
    region: 'SE Asia',
    imageUrl: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=200&auto=format&fit=crop&q=80',
    flagUrl: '🇹🇭',
    currentRate: 26.85,
    changePercent: -0.5,
    threeMonthAgoRate: 27.00,
    isThreeMonthHigh: false,
    hasFlashAlert: false,
    historical3M: {
      pastLabel: '3 Mo Ago',
      pastValue: 27.00,
      nowLabel: 'Now',
      nowValue: 26.85,
    },
    trend7d: [27.05, 27.00, 26.95, 26.90, 26.88, 26.86, 26.85],
    travelTip: 'PromptPay QR payments work seamlessly in Bangkok night markets using your MerlionFX wallet.',
    bestPaymentMethod: 'PromptPay QR / MerlionFX Card (No need to hold physical cash in Bangkok).',
    localAtmFee: 'Thai ATMs standard 220 THB flat fee; best to pay directly via QR or card.',
  },
  {
    id: 'myr',
    country: 'Malaysia',
    currencyCode: 'MYR',
    currencyName: 'Malaysian Ringgit',
    region: 'SE Asia',
    imageUrl: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=200&auto=format&fit=crop&q=80',
    flagUrl: '🇲🇾',
    currentRate: 3.32,
    changePercent: 0.6,
    threeMonthAgoRate: 3.30,
    isThreeMonthHigh: false,
    historical3M: {
      pastLabel: '3 Mo Ago',
      pastValue: 3.30,
      nowLabel: 'Now',
      nowValue: 3.32,
    },
    trend7d: [3.30, 3.305, 3.31, 3.315, 3.318, 3.32, 3.32],
    travelTip: 'DuitNow QR interoperability with Singapore PayNow is supported directly.',
    bestPaymentMethod: 'MerlionFX DuitNow QR & contactless payment at JB checkpoints and malls.',
    localAtmFee: 'Maybank / CIMB: Zero withdrawal fees for MerlionFX users.',
  },
  {
    id: 'twd',
    country: 'Taiwan',
    currencyCode: 'TWD',
    currencyName: 'New Taiwan Dollar',
    region: 'Asia',
    imageUrl: 'https://images.unsplash.com/photo-1508248017083-77a63dfd6248?w=200&auto=format&fit=crop&q=80',
    flagUrl: '🇹🇼',
    currentRate: 24.15,
    changePercent: 2.0,
    threeMonthAgoRate: 23.68,
    isThreeMonthHigh: true,
    hasFlashAlert: true,
    flashAlertText: 'TWD reaches highest SGD rate since early 2024. Night market food & high-speed rail discounts.',
    historical3M: {
      pastLabel: '3 Mo Ago',
      pastValue: 23.68,
      nowLabel: 'Now',
      nowValue: 24.15,
    },
    trend7d: [23.75, 23.82, 23.90, 24.01, 24.08, 24.12, 24.15],
    travelTip: 'EasyCard can be reloaded via MerlionFX at all MRT stations in Taipei & Kaohsiung.',
    bestPaymentMethod: 'Line Pay & Contactless Card.',
    localAtmFee: 'Cathay United Bank: Free with MerlionFX.',
  },
  {
    id: 'vnd',
    country: 'Vietnam',
    currencyCode: 'VND',
    currencyName: 'Vietnamese Dong',
    region: 'SE Asia',
    imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=200&auto=format&fit=crop&q=80',
    flagUrl: '🇻🇳',
    currentRate: 18920.0,
    changePercent: 3.1,
    threeMonthAgoRate: 18350.0,
    isThreeMonthHigh: true,
    hasFlashAlert: true,
    flashAlertText: 'VND trading near all-time value for SGD. Luxury beach resorts in Da Nang are 15% cheaper.',
    historical3M: {
      pastLabel: '3 Mo Ago',
      pastValue: 18350.0,
      nowLabel: 'Now',
      nowValue: 18920.0,
    },
    trend7d: [18400, 18520, 18650, 18780, 18850, 18900, 18920],
    travelTip: 'Grab app links directly to MerlionFX wallet for ride-hailing and food in Hanoi & HCMC.',
    bestPaymentMethod: 'GrabPay / MerlionFX Virtual Card.',
    localAtmFee: 'VPBank / Techcombank: Low flat fee of 50,000 VND.',
  },
  {
    id: 'eur',
    country: 'Eurozone',
    currencyCode: 'EUR',
    currencyName: 'Euro',
    region: 'Europe',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=200&auto=format&fit=crop&q=80',
    flagUrl: '🇪🇺',
    currentRate: 0.694,
    changePercent: 1.1,
    threeMonthAgoRate: 0.686,
    isThreeMonthHigh: false,
    historical3M: {
      pastLabel: '3 Mo Ago',
      pastValue: 0.686,
      nowLabel: 'Now',
      nowValue: 0.694,
    },
    trend7d: [0.687, 0.689, 0.691, 0.692, 0.693, 0.694, 0.694],
    travelTip: 'Eurozone merchants rarely accept cash over €50; contactless tapping is universal.',
    bestPaymentMethod: 'MerlionFX Apple Pay / Google Wallet.',
    localAtmFee: 'BNP Paribas & Deutsche Bank: Zero surcharge.',
  },
  {
    id: 'gbp',
    country: 'United Kingdom',
    currencyCode: 'GBP',
    currencyName: 'British Pound',
    region: 'Europe',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=200&auto=format&fit=crop&q=80',
    flagUrl: '🇬🇧',
    currentRate: 0.589,
    changePercent: -0.2,
    threeMonthAgoRate: 0.590,
    isThreeMonthHigh: false,
    historical3M: {
      pastLabel: '3 Mo Ago',
      pastValue: 0.590,
      nowLabel: 'Now',
      nowValue: 0.589,
    },
    trend7d: [0.591, 0.590, 0.590, 0.589, 0.589, 0.589, 0.589],
    travelTip: 'London Underground (TfL) lets you tap your MerlionFX card directly on gate readers.',
    bestPaymentMethod: 'MerlionFX Contactless (TfL daily fare capping applied automatically).',
    localAtmFee: 'NatWest / Barclays: Free ATM cash withdrawals.',
  },
  {
    id: 'aud',
    country: 'Australia',
    currencyCode: 'AUD',
    currencyName: 'Australian Dollar',
    region: 'Oceania',
    imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=200&auto=format&fit=crop&q=80',
    flagUrl: '🇦🇺',
    currentRate: 1.142,
    changePercent: 1.5,
    threeMonthAgoRate: 1.125,
    isThreeMonthHigh: true,
    historical3M: {
      pastLabel: '3 Mo Ago',
      pastValue: 1.125,
      nowLabel: 'Now',
      nowValue: 1.142,
    },
    trend7d: [1.128, 1.131, 1.135, 1.138, 1.140, 1.141, 1.142],
    travelTip: 'Australia is virtually cashless; all dining, cafes, and taxis accept tap-to-pay.',
    bestPaymentMethod: 'Tap & Go with MerlionFX Card.',
    localAtmFee: 'Commonwealth Bank / ANZ: Free.',
  },
  {
    id: 'usd',
    country: 'United States',
    currencyCode: 'USD',
    currencyName: 'US Dollar',
    region: 'Americas',
    imageUrl: 'https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?w=200&auto=format&fit=crop&q=80',
    flagUrl: '🇺🇸',
    currentRate: 0.752,
    changePercent: 0.3,
    threeMonthAgoRate: 0.750,
    isThreeMonthHigh: false,
    historical3M: {
      pastLabel: '3 Mo Ago',
      pastValue: 0.750,
      nowLabel: 'Now',
      nowValue: 0.752,
    },
    trend7d: [0.749, 0.750, 0.751, 0.751, 0.752, 0.752, 0.752],
    travelTip: 'Tip percentages in US restaurants (18-20%) can be settled cleanly on your MerlionFX card.',
    bestPaymentMethod: 'MerlionFX Card / Apple Pay.',
    localAtmFee: 'Chase / Citibank ATMs.',
  },
];
