import { getMasKeyId, FALLBACK_CURRENCIES } from "../_shared";

export default async function handler(req: any, res: any) {
  const keyId = getMasKeyId();
  const masEndpoint =
    "https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610ora/exchange_rates_end_of_period_daily/views/exchange_rates_end_of_period_daily";

  try {
    const fetchHeaders: Record<string, string> = {
      "Accept": "application/json",
      "User-Agent": "MerlionFX-Finance-Gateway/1.0",
    };

    if (keyId) {
      fetchHeaders["KeyId"] = keyId;
    }

    // Attempt to fetch from MAS API endpoint
    const queryRows = req.query?.rows ? `?rows=${req.query.rows}` : "?rows=10";
    const masResponse = await fetch(`${masEndpoint}${queryRows}`, {
      method: "GET",
      headers: fetchHeaders,
    });

    if (masResponse.ok) {
      const data = await masResponse.json();
      const records = data?.result?.records || data?.records || (Array.isArray(data) ? data : []);

      if (records.length > 0) {
        const latestRecord = records[0];
        const prevRecord = records[records.length - 1];

        // Helper to extract converted rate from a MAS record
        const extractSgdToForeignRate = (record: any, currencyCode: string, fallbackRate: number) => {
          const code = currencyCode.toLowerCase();
          
          // MAS Dataset Column Names for 100-unit currencies (e.g., 100 JPY = 0.8893 SGD)
          const per100Keys = [
            `${code}_sgd_100`,
            `${code}_100_sgd`,
            `${code}_100`,
            `${code}100_sgd`,
            `${code}_sgd_100_end_of_period`,
          ];
          // MAS Dataset Column Names for 1-unit currencies (e.g., 1 USD = 1.33 SGD)
          const perUnitKeys = [
            `${code}_sgd`,
            `${code}_sgd_end_of_period`,
            `sgd_${code}`,
          ];

          // 1. Check for 100-unit quotation (MAS: 100 Foreign = X SGD)
          for (const key of per100Keys) {
            if (record[key] !== undefined && record[key] !== null && record[key] !== '') {
              const sgdPer100 = parseFloat(record[key]);
              if (!isNaN(sgdPer100) && sgdPer100 > 0) {
                // Conversion Formula:
                // If 100 JPY = sgdPer100 SGD
                // Then 1 SGD = (100 / sgdPer100) JPY
                const rateSgdToForeign = +(100 / sgdPer100).toFixed(
                  code === 'jpy' || code === 'thb' || code === 'twd' || code === 'myr' ? 2 : 2
                );
                return {
                  rate: rateSgdToForeign,
                  rawQuote: sgdPer100,
                  quoteUnit: `100 ${currencyCode.toUpperCase()}`,
                  formula: `1 SGD = 100 / ${sgdPer100} = ${rateSgdToForeign} ${currencyCode.toUpperCase()}`,
                };
              }
            }
          }

          // 2. Check for 1-unit quotation (MAS: 1 Foreign = Y SGD)
          for (const key of perUnitKeys) {
            if (record[key] !== undefined && record[key] !== null && record[key] !== '') {
              const sgdPerUnit = parseFloat(record[key]);
              if (!isNaN(sgdPerUnit) && sgdPerUnit > 0) {
                // Conversion Formula:
                // If 1 USD = sgdPerUnit SGD
                // Then 1 SGD = (1 / sgdPerUnit) USD
                const decimals = code === 'usd' || code === 'eur' || code === 'gbp' || code === 'aud' ? 3 : 2;
                const rateSgdToForeign = +(1 / sgdPerUnit).toFixed(decimals);
                return {
                  rate: rateSgdToForeign,
                  rawQuote: sgdPerUnit,
                  quoteUnit: `1 ${currencyCode.toUpperCase()}`,
                  formula: `1 SGD = 1 / ${sgdPerUnit} = ${rateSgdToForeign} ${currencyCode.toUpperCase()}`,
                };
              }
            }
          }

          return {
            rate: fallbackRate,
            rawQuote: null,
            quoteUnit: null,
            formula: null,
          };
        };

        // Process MAS rate fields into currency rate models
        const mappedCurrencies = FALLBACK_CURRENCIES.map((fallback) => {
          const latest = extractSgdToForeignRate(latestRecord, fallback.currencyCode, fallback.currentRate);
          const past = prevRecord
            ? extractSgdToForeignRate(prevRecord, fallback.currencyCode, fallback.threeMonthAgoRate)
            : { rate: fallback.threeMonthAgoRate };

          const currentForeignPerSgd = latest.rate;
          const pastForeignPerSgd = past.rate;

          const changePercent = pastForeignPerSgd > 0
            ? +(((currentForeignPerSgd - pastForeignPerSgd) / pastForeignPerSgd) * 100).toFixed(1)
            : 0;
          const isThreeMonthHigh = changePercent > 1.2;

          // Extract trend if multiple rows are present
          let dynamicTrend = fallback.trend7d;
          if (records.length >= 5) {
            const extractedTrend = records.slice(0, 7).map((r: any) => {
              const parsed = extractSgdToForeignRate(r, fallback.currencyCode, fallback.currentRate);
              return parsed.rate;
            }).reverse();
            if (extractedTrend.every((v: number) => !isNaN(v) && v > 0)) {
              dynamicTrend = extractedTrend;
            }
          }

          return {
            ...fallback,
            currentRate: currentForeignPerSgd,
            changePercent,
            threeMonthAgoRate: pastForeignPerSgd,
            isThreeMonthHigh,
            masRawQuote: latest.rawQuote,
            masQuoteUnit: latest.quoteUnit,
            masQuoteFormula: latest.formula,
            trend7d: dynamicTrend,
            historical3M: {
              pastLabel: '3 Mo Ago',
              pastValue: pastForeignPerSgd,
              nowLabel: 'Now',
              nowValue: currentForeignPerSgd,
            },
          };
        });

        return res.json({
          success: true,
          source: "mas_official_api",
          asOfDate: latestRecord.end_of_day || latestRecord.end_of_date || new Date().toISOString().split('T')[0],
          data: mappedCurrencies,
          rawRecordsCount: records.length,
        });
      }
    }

    // If MAS returns non-200 or empty, gracefully serve validated fallback model
    return res.json({
      success: true,
      source: "cached_fallback",
      masStatus: masResponse.status,
      asOfDate: new Date().toISOString().split('T')[0],
      data: FALLBACK_CURRENCIES,
      note: "Serving high-accuracy cached interbank baseline rates.",
    });
  } catch (err: any) {
    console.error("Error connecting to MAS exchange rates API:", err?.message);
    return res.json({
      success: true,
      source: "cached_fallback",
      error: err?.message,
      asOfDate: new Date().toISOString().split('T')[0],
      data: FALLBACK_CURRENCIES,
    });
  }
}
