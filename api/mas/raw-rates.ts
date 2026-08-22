import { getMasKeyId, sendJsonResponse, FALLBACK_CURRENCIES } from "../_shared";

export default async function handler(req: any, res: any) {
  const masEndpoint =
    "https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610ora/exchange_rates_end_of_period_daily/views/exchange_rates_end_of_period_daily";

  try {
    const keyId = getMasKeyId();
    const fetchHeaders: Record<string, string> = {
      "Accept": "application/json",
    };
    if (keyId) {
      fetchHeaders["KeyId"] = keyId;
    }

    const rows = req?.query?.rows ? `?rows=${req.query.rows}` : "?rows=5";
    let json: any = null;

    try {
      const response = await fetch(`${masEndpoint}${rows}`, {
        headers: fetchHeaders,
      });
      if (response.ok) {
        json = await response.json();
      }
    } catch (err: any) {
      console.warn("Direct MAS raw-rates fetch failed:", err?.message);
    }

    if (json) {
      return sendJsonResponse(req, res, 200, json);
    }

    return sendJsonResponse(req, res, 200, {
      status: "fallback",
      records: FALLBACK_CURRENCIES.map((c) => ({
        currency: c.currencyCode,
        rate: c.currentRate,
      })),
    });
  } catch (err: any) {
    return sendJsonResponse(req, res, 200, {
      status: "fallback",
      error: err?.message,
      records: FALLBACK_CURRENCIES.map((c) => ({
        currency: c.currencyCode,
        rate: c.currentRate,
      })),
    });
  }
}
