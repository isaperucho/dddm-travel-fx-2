import React, { useState } from 'react';
import { X, ArrowRight, TrendingUp, Check, Bell, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';
import { CurrencyRate } from '../types';

interface RateDetailModalProps {
  currency: CurrencyRate | null;
  onClose: () => void;
  onConfirmExchange: (fromCurrency: string, fromAmount: number, toCurrency: string, toAmount: number, rate: number) => void;
  onAddAlert: (currencyCode: string, targetRate: number) => void;
}

export const RateDetailModal: React.FC<RateDetailModalProps> = ({
  currency,
  onClose,
  onConfirmExchange,
  onAddAlert,
}) => {
  if (!currency) return null;

  const [sgdAmount, setSgdAmount] = useState<number>(1000);
  const [timeframe, setTimeframe] = useState<'7D' | '1M' | '3M' | '1Y'>('3M');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [alertTargetInput, setAlertTargetInput] = useState<string>((currency.currentRate * 1.01).toFixed(2));
  const [isSettingAlert, setIsSettingAlert] = useState(false);
  const [alertSuccessToast, setAlertSuccessToast] = useState(false);

  const convertedAmount = sgdAmount * currency.currentRate;
  const isPositive = currency.changePercent >= 0;

  // Chart data simulation based on timeframe
  const chartPoints = timeframe === '7D'
    ? currency.trend7d
    : timeframe === '1M'
    ? [currency.threeMonthAgoRate * 1.005, currency.threeMonthAgoRate * 1.012, currency.currentRate * 0.99, currency.currentRate]
    : [currency.threeMonthAgoRate, currency.threeMonthAgoRate * 1.01, currency.threeMonthAgoRate * 1.018, currency.currentRate * 0.995, currency.currentRate];

  const minVal = Math.min(...chartPoints) * 0.995;
  const maxVal = Math.max(...chartPoints) * 1.005;
  const range = maxVal - minVal || 1;

  // Normalize points for SVG path
  const svgWidth = 320;
  const svgHeight = 120;
  const pointsString = chartPoints
    .map((val, idx) => {
      const x = (idx / (chartPoints.length - 1)) * (svgWidth - 20) + 10;
      const y = svgHeight - 10 - ((val - minVal) / range) * (svgHeight - 30);
      return `${x},${y}`;
    })
    .join(' ');

  const handleExchange = () => {
    onConfirmExchange('SGD', sgdAmount, currency.currencyCode, convertedAmount, currency.currentRate);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      onClose();
    }, 1500);
  };

  const handleSaveAlert = () => {
    const num = parseFloat(alertTargetInput);
    if (!isNaN(num) && num > 0) {
      onAddAlert(currency.currencyCode, num);
      setAlertSuccessToast(true);
      setTimeout(() => {
        setAlertSuccessToast(false);
        setIsSettingAlert(false);
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-md rounded-t-[28px] sm:rounded-[24px] max-h-[92vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img
              src={currency.imageUrl}
              alt={currency.country}
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
              referrerPolicy="no-referrer"
            />
            <div>
              <h2 className="text-xl font-bold text-[#191c1d] leading-tight">
                {currency.country}
              </h2>
              <span className="text-xs font-semibold text-[#727782]">
                1 SGD = {currency.currentRate.toFixed(2)} {currency.currencyCode}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rate Headline & Badge */}
        <div className="mt-4 flex items-baseline justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Live Mid-Market Rate
            </span>
            <div className="text-3xl font-extrabold text-[#004581] tracking-tight mt-0.5">
              {currency.currentRate >= 1000
                ? currency.currentRate.toLocaleString('en-US', { minimumFractionDigits: 2 })
                : currency.currentRate.toFixed(2)}{' '}
              <span className="text-lg font-semibold text-slate-600">
                {currency.currencyCode}
              </span>
            </div>
          </div>

          <div
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
              isPositive
                ? 'bg-emerald-50 text-[#006b24] border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            {isPositive ? `+${currency.changePercent}%` : `${currency.changePercent}%`} 3M Trend
          </div>
        </div>

        {/* Interactive Chart */}
        <div className="mt-4 bg-[#f8f9fa] rounded-2xl p-4 border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600">
              SGD to {currency.currencyCode} History
            </span>
            <div className="flex gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
              {(['7D', '1M', '3M', '1Y'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded-md transition-all ${
                    timeframe === t
                      ? 'bg-[#004581] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-[#004581]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[120px] w-full flex items-center justify-center">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
              {/* Subtle Grid Lines */}
              <line x1="0" y1="20" x2={svgWidth} y2="20" stroke="#e2e8f0" strokeDasharray="3,3" />
              <line x1="0" y1="60" x2={svgWidth} y2="60" stroke="#e2e8f0" strokeDasharray="3,3" />
              <line x1="0" y1="100" x2={svgWidth} y2="100" stroke="#e2e8f0" strokeDasharray="3,3" />

              {/* Trend Polyline */}
              <polyline
                fill="none"
                stroke={isPositive ? '#004581' : '#dc2626'}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsString}
              />
            </svg>
          </div>

          <div className="flex justify-between text-[11px] font-medium text-slate-400 mt-1">
            <span>{timeframe === '3M' ? '3 Months Ago' : timeframe}</span>
            <span>Today (Live Peak)</span>
          </div>
        </div>

        {/* Live Instant FX Converter */}
        <div className="mt-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Instant Currency Conversion (0% Markup)
          </h3>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
            {/* SGD Input */}
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-600">You Pay (SGD)</label>
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-xs font-bold text-slate-500">S$</span>
                <input
                  type="number"
                  min="1"
                  max="50000"
                  value={sgdAmount}
                  onChange={(e) => setSgdAmount(Math.max(1, Number(e.target.value)))}
                  className="w-24 text-right font-bold text-sm text-[#191c1d] focus:outline-none"
                />
              </div>
            </div>

            {/* Target Output */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
              <label className="text-xs font-semibold text-slate-600">
                You Receive ({currency.currencyCode})
              </label>
              <div className="text-right">
                <div className="text-base font-bold text-[#004581]">
                  {convertedAmount >= 1000
                    ? convertedAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })
                    : convertedAmount.toFixed(2)}{' '}
                  {currency.currencyCode}
                </div>
                <div className="text-[11px] font-medium text-[#006b24]">
                  MerlionFX Fee: $0.00 SGD (Waived)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAS Official Database Quote & Conversion Breakdown */}
        <div className="mt-4 p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-xs">
          <div className="flex items-center justify-between font-semibold text-[#004581]">
            <span>MAS Official Quote Conversion</span>
            <span className="text-[10px] bg-blue-100/80 text-blue-800 px-2 py-0.5 rounded-full font-bold">
              Automated Ingestion
            </span>
          </div>
          <div className="mt-1.5 space-y-1 text-slate-600 text-[11px] leading-relaxed">
            {currency.currencyCode === 'JPY' || currency.currencyCode === 'KRW' || currency.currencyCode === 'THB' || currency.currencyCode === 'TWD' || currency.currencyCode === 'VND' || currency.currencyCode === 'MYR' ? (
              <p>
                <strong>MAS Data Format:</strong> Quoted as <em>SGD per 100 {currency.currencyCode}</em> (e.g.{' '}
                {currency.masRawQuote ? `S$${currency.masRawQuote.toFixed(4)}` : `S$${(100 / currency.currentRate).toFixed(4)}`}).
                <br />
                <strong>App Display:</strong> Converted to <em>SGD to {currency.currencyCode}</em> via{' '}
                <code className="bg-white px-1 py-0.5 rounded border border-blue-200 text-blue-900 font-mono text-[10px]">
                  100 ÷ (MAS Quote) = {currency.currentRate.toFixed(2)} {currency.currencyCode} per 1 SGD
                </code>
              </p>
            ) : (
              <p>
                <strong>MAS Data Format:</strong> Quoted as <em>SGD per 1 {currency.currencyCode}</em> (e.g.{' '}
                {currency.masRawQuote ? `S$${currency.masRawQuote.toFixed(4)}` : `S$${(1 / currency.currentRate).toFixed(4)}`}).
                <br />
                <strong>App Display:</strong> Converted to <em>SGD to {currency.currencyCode}</em> via{' '}
                <code className="bg-white px-1 py-0.5 rounded border border-blue-200 text-blue-900 font-mono text-[10px]">
                  1 ÷ (MAS Quote) = {currency.currentRate.toFixed(3)} {currency.currencyCode} per 1 SGD
                </code>
              </p>
            )}
          </div>
        </div>

        {/* Travel & Payment Strategy Tip */}
        {currency.travelTip && (
          <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-950">Local Travel Insight</p>
              <p className="mt-0.5 text-amber-800 leading-snug">{currency.travelTip}</p>
              {currency.bestPaymentMethod && (
                <p className="mt-1 text-[11px] text-amber-900/90 font-medium">
                  💳 Recommended: {currency.bestPaymentMethod}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2.5">
          {/* Convert / Lock Button */}
          <button
            onClick={handleExchange}
            className="w-full py-3.5 px-4 bg-[#004581] hover:bg-[#005daa] text-white font-bold text-sm rounded-xl shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            Lock Rate & Add to {currency.currencyCode} Wallet
          </button>

          {/* Rate Alert Toggle */}
          {!isSettingAlert ? (
            <button
              onClick={() => setIsSettingAlert(true)}
              className="w-full py-2.5 px-4 bg-white border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-slate-500" />
              Set Custom Rate Alert
            </button>
          ) : (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 shrink-0">
                Alert when {currency.currencyCode} &gt;
              </span>
              <input
                type="number"
                step="0.01"
                value={alertTargetInput}
                onChange={(e) => setAlertTargetInput(e.target.value)}
                className="w-20 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-bold text-slate-800"
              />
              <button
                onClick={handleSaveAlert}
                className="px-3 py-1 bg-[#004581] text-white rounded text-xs font-bold hover:bg-[#005daa]"
              >
                Save
              </button>
              <button
                onClick={() => setIsSettingAlert(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Success Toast for exchange */}
        {showSuccessToast && (
          <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 text-center flex items-center justify-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            Rate locked! Transferred to your multi-currency wallet.
          </div>
        )}

        {/* Success Toast for alert */}
        {alertSuccessToast && (
          <div className="mt-3 p-2.5 bg-sky-50 border border-sky-300 rounded-xl text-xs font-bold text-sky-800 text-center flex items-center justify-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-sky-600" />
            Alert activated! We will notify you instantly when target is reached.
          </div>
        )}
      </div>
    </div>
  );
};
