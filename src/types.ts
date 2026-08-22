export interface CurrencyRate {
  id: string;
  country: string;
  currencyCode: string;
  currencyName: string;
  region: string;
  flagUrl: string;
  imageUrl: string;
  currentRate: number;
  changePercent: number;
  threeMonthAgoRate: number;
  isThreeMonthHigh?: boolean;
  hasFlashAlert?: boolean;
  flashAlertText?: string;
  historical3M: {
    pastLabel: string;
    pastValue: number;
    nowLabel: string;
    nowValue: number;
  };
  trend7d: number[];
  travelTip?: string;
  bestPaymentMethod?: string;
  localAtmFee?: string;
  masRawQuote?: number;
  masQuoteUnit?: string;
  masQuoteFormula?: string;
}

export interface RateAlert {
  id: string;
  currencyCode: string;
  targetRate: number;
  direction: 'ABOVE' | 'BELOW';
  createdAt: string;
  active: boolean;
}

export interface ConversionTransaction {
  id: string;
  fromCurrency: string;
  fromAmount: number;
  toCurrency: string;
  toAmount: number;
  rate: number;
  timestamp: string;
  status: 'COMPLETED' | 'LOCKED';
}

export type ActiveTab = 'home' | 'rates' | 'explore' | 'account';
