import React from 'react';
import { Zap, X, ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import { CurrencyRate } from '../types';

interface FlashAlertModalProps {
  currencies: CurrencyRate[];
  onClose: () => void;
  onSelectCurrency: (currency: CurrencyRate) => void;
}

export const FlashAlertModal: React.FC<FlashAlertModalProps> = ({
  currencies,
  onClose,
  onSelectCurrency,
}) => {
  const alertCurrencies = currencies.filter((c) => c.hasFlashAlert);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-md rounded-t-[28px] sm:rounded-[24px] max-h-[85vh] overflow-y-auto p-6 shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 rounded-full text-amber-700">
              <Zap className="w-5 h-5 fill-amber-500 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#191c1d]">
                Flash Value Alerts
              </h2>
              <p className="text-xs text-slate-500">
                Peak Singapore Dollar purchasing opportunities
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alert Cards List */}
        <div className="mt-4 space-y-3">
          {alertCurrencies.map((currency) => (
            <div
              key={currency.id}
              onClick={() => {
                onSelectCurrency(currency);
                onClose();
              }}
              className="p-4 bg-amber-50/50 border border-amber-200 rounded-2xl hover:bg-amber-100/60 hover:border-amber-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <img
                    src={currency.imageUrl}
                    alt={currency.country}
                    className="w-8 h-8 rounded-full object-cover border border-amber-300"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      {currency.country} ({currency.currencyCode})
                      <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded-full font-semibold">
                        3-Mo Peak
                      </span>
                    </h3>
                    <p className="text-xs font-semibold text-[#004581]">
                      1 SGD = {currency.currentRate.toFixed(2)} {currency.currencyCode} (+{currency.changePercent}%)
                    </p>
                  </div>
                </div>

                <div className="p-1.5 bg-white rounded-full shadow-2xs group-hover:bg-[#004581] group-hover:text-white transition-all text-slate-400">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-white/70 p-2.5 rounded-xl border border-amber-100">
                {currency.flashAlertText || `${currency.country} currency is currently at a 90-day low against SGD.`}
              </p>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#004581] text-white text-xs font-bold rounded-xl hover:bg-[#005daa] transition-all cursor-pointer"
          >
            Return to Rates
          </button>
        </div>
      </div>
    </div>
  );
};
