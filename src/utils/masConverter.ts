/**
 * Utility for parsing and converting MAS (Monetary Authority of Singapore)
 * exchange rate database quotes into direct SGD -> Foreign Currency rates.
 *
 * Background:
 * In the MAS statistical database (exchange_rates_end_of_period_daily),
 * Asian and high-denomination currencies (such as JPY, KRW, THB, TWD, VND, IDR, INR, MYR)
 * are quoted as SGD per 100 units of foreign currency (e.g. 100 JPY = 0.8893 SGD).
 *
 * To display standard travel FX rates (e.g. SGD to JPY):
 * Rate (1 SGD in Foreign Currency) = 100 / (MAS rate in SGD per 100 units)
 *
 * For currencies quoted per single unit (USD, EUR, GBP, AUD, CHF):
 * Rate (1 SGD in Foreign Currency) = 1 / (MAS rate in SGD per 1 unit)
 */

export interface MasRawRecord {
  end_of_day?: string;
  end_of_date?: string;
  [key: string]: any;
}

export interface ConvertedMasRate {
  currencyCode: string;
  masRawQuote: number | null;
  quoteType: 'PER_100_UNITS' | 'PER_UNIT';
  masQuoteDescription: string;
  rateSgdToForeign: number;
}

export function convertMasQuoteToSgdToForeign(
  currencyCode: string,
  record: MasRawRecord
): ConvertedMasRate | null {
  const code = currencyCode.toLowerCase();

  // Potential field names in MAS datasets:
  // e.g. jpy_sgd_100, jpy_100_sgd, jpy_100, jpy100_sgd, jpy_sgd
  const per100Keys = [
    `${code}_sgd_100`,
    `${code}_100_sgd`,
    `${code}_100`,
    `${code}100_sgd`,
    `${code}_sgd_100_end_of_period`,
  ];

  const perUnitKeys = [
    `${code}_sgd`,
    `${code}_sgd_end_of_period`,
    `sgd_${code}`,
  ];

  // 1. Check for 100-unit quote
  for (const key of per100Keys) {
    if (record[key] !== undefined && record[key] !== null && record[key] !== '') {
      const val = parseFloat(record[key]);
      if (!isNaN(val) && val > 0) {
        // 100 Foreign Currency = val SGD  =>  1 SGD = 100 / val Foreign Currency
        const converted = 100 / val;
        return {
          currencyCode: currencyCode.toUpperCase(),
          masRawQuote: val,
          quoteType: 'PER_100_UNITS',
          masQuoteDescription: `100 ${currencyCode.toUpperCase()} = S$${val.toFixed(4)}`,
          rateSgdToForeign: code === 'jpy' || code === 'thb' || code === 'twd' || code === 'myr'
            ? +converted.toFixed(2)
            : code === 'krw' || code === 'vnd'
            ? +converted.toFixed(2)
            : +converted.toFixed(3),
        };
      }
    }
  }

  // 2. Check for 1-unit quote
  for (const key of perUnitKeys) {
    if (record[key] !== undefined && record[key] !== null && record[key] !== '') {
      const val = parseFloat(record[key]);
      if (!isNaN(val) && val > 0) {
        // 1 Foreign Currency = val SGD  =>  1 SGD = 1 / val Foreign Currency
        const converted = 1 / val;
        return {
          currencyCode: currencyCode.toUpperCase(),
          masRawQuote: val,
          quoteType: 'PER_UNIT',
          masQuoteDescription: `1 ${currencyCode.toUpperCase()} = S$${val.toFixed(4)}`,
          rateSgdToForeign: code === 'usd' || code === 'eur' || code === 'gbp' || code === 'aud' || code === 'chf'
            ? +converted.toFixed(3)
            : +converted.toFixed(2),
        };
      }
    }
  }

  return null;
}
