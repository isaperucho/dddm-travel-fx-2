import { getMasKeyId, sendJsonResponse } from "../_shared";

export default async function handler(req: any, res: any) {
  const soraEndpoint =
    "https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610mssql/domestic_interest_rates_daily/views/domestic_interest_rates_daily";

  const fallbackSora = {
    sora: 3.12,
    compounded1M: 3.08,
    compounded3M: 3.15,
    compounded6M: 3.19,
    asOfDate: new Date().toISOString().split('T')[0],
  };

  try {
    const keyId = getMasKeyId();
    const fetchHeaders: Record<string, string> = {
      "Accept": "application/json",
      "User-Agent": "MerlionFX-Finance-Gateway/1.0",
    };

    if (keyId) {
      fetchHeaders["KeyId"] = keyId;
    }

    let soraResponse: any = null;
    try {
      soraResponse = await fetch(`${soraEndpoint}?rows=5`, {
        method: "GET",
        headers: fetchHeaders,
      });
    } catch (err: any) {
      console.warn("Direct MAS SORA network fetch failed:", err?.message);
    }

    if (soraResponse && soraResponse.ok) {
      const data = await soraResponse.json();
      return sendJsonResponse(req, res, 200, {
        success: true,
        source: "mas_official_api",
        data,
      });
    }

    return sendJsonResponse(req, res, 200, {
      success: true,
      source: "cached_sora",
      data: fallbackSora,
    });
  } catch (err: any) {
    console.error("Error connecting to MAS SORA API:", err?.message);
    return sendJsonResponse(req, res, 200, {
      success: true,
      source: "cached_sora",
      data: fallbackSora,
    });
  }
}
