import { getMasKeyId, FALLBACK_CURRENCIES } from "./_shared";

export default async function handler(req: any, res: any) {
  const keyId = getMasKeyId();

  return res.status(200).json({
    status: "ok",
    service: "MerlionFX Travel Rate Intelligence Gateway",
    version: "2.1.0",
    masConfigured: Boolean(keyId),
    masApiEndpoint: "https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610ora/exchange_rates_end_of_period_daily",
    productPositioning: {
      category: "Travel FX Recommender & Multi-Currency Rate-Lock Companion",
      comparisonToYouTripWise: "Focused on high-purchasing-power destination discovery, 3-month peak alerts, and statutory MAS rate transparency rather than generic merchant banking.",
    },
    currenciesSupported: FALLBACK_CURRENCIES.length,
    timestamp: new Date().toISOString(),
    uptimeSeconds: process.uptime ? Math.floor(process.uptime()) : 120,
    health: "HEALTHY",
  });
}
