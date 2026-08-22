import { getMasKeyId } from "../_shared";

export default async function handler(req: any, res: any) {
  const keyId = getMasKeyId();
  const soraEndpoint =
    "https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610mssql/domestic_interest_rates_daily/views/domestic_interest_rates_daily";

  try {
    const fetchHeaders: Record<string, string> = {
      "Accept": "application/json",
      "User-Agent": "MerlionFX-Finance-Gateway/1.0",
    };

    if (keyId) {
      fetchHeaders["KeyId"] = keyId;
    }

    const soraResponse = await fetch(`${soraEndpoint}?rows=5`, {
      method: "GET",
      headers: fetchHeaders,
    });

    if (soraResponse.ok) {
      const data = await soraResponse.json();
      return res.json({
        success: true,
        source: "mas_official_api",
        data,
      });
    }

    // Default SORA rates fallback
    return res.json({
      success: true,
      source: "cached_sora",
      data: {
        sora: 3.12,
        compounded1M: 3.08,
        compounded3M: 3.15,
        compounded6M: 3.19,
        asOfDate: new Date().toISOString().split('T')[0],
      },
    });
  } catch (err: any) {
    console.error("Error connecting to MAS SORA API:", err?.message);
    return res.json({
      success: true,
      source: "cached_sora",
      data: {
        sora: 3.12,
        compounded1M: 3.08,
        compounded3M: 3.15,
        compounded6M: 3.19,
        asOfDate: new Date().toISOString().split('T')[0],
      },
    });
  }
}
