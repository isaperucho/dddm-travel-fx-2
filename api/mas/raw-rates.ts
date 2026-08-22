import { getMasKeyId } from "../_shared";

export default async function handler(req: any, res: any) {
  const keyId = getMasKeyId();
  const masEndpoint =
    "https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610ora/exchange_rates_end_of_period_daily/views/exchange_rates_end_of_period_daily";

  try {
    const fetchHeaders: Record<string, string> = {
      "Accept": "application/json",
    };
    if (keyId) {
      fetchHeaders["KeyId"] = keyId;
    }

    const rows = req.query?.rows ? `?rows=${req.query.rows}` : "?rows=5";
    const response = await fetch(`${masEndpoint}${rows}`, {
      headers: fetchHeaders,
    });
    const json = await response.json();
    return res.json(json);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message });
  }
}
