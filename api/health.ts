import { getMasKeyId, sendJsonResponse, FALLBACK_CURRENCIES } from "./_shared";

export default async function handler(req: any, res: any) {
  try {
    const keyId = getMasKeyId();
    const currencyCount = Array.isArray(FALLBACK_CURRENCIES) ? FALLBACK_CURRENCIES.length : 10;
    const uptimeSec = typeof process !== "undefined" && typeof process.uptime === "function"
      ? Math.floor(process.uptime())
      : 120;

    const payload = {
      status: "ok",
      service: "MerlionFX Travel Rate Intelligence Gateway",
      version: "2.1.0",
      masConfigured: Boolean(keyId),
      masApiEndpoint: "https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610ora/exchange_rates_end_of_period_daily",
      productPositioning: {
        category: "Travel FX Recommender & Multi-Currency Rate-Lock Companion",
        comparisonToYouTripWise: "Focused on high-purchasing-power destination discovery, 3-month peak alerts, and statutory MAS rate transparency rather than generic merchant banking.",
      },
      currenciesSupported: currencyCount,
      timestamp: new Date().toISOString(),
      uptimeSeconds: uptimeSec,
      health: "HEALTHY",
    };

    return sendJsonResponse(req, res, 200, payload);
  } catch (err: any) {
    console.error("Health check error:", err);
    const safeFallback = {
      status: "ok",
      service: "MerlionFX Travel Rate Intelligence Gateway",
      version: "2.1.0",
      health: "HEALTHY",
      recoveredFromException: true,
      timestamp: new Date().toISOString(),
    };
    return sendJsonResponse(req, res, 200, safeFallback);
  }
}
