import React, { useState } from 'react';
import {
  Wallet,
  ArrowRightLeft,
  ArrowUpRight,
  TrendingUp,
  Zap,
  Plane,
  QrCode,
  Shield,
  CreditCard,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { CurrencyRate, ConversionTransaction } from '../types';
import { DisqusComments } from './DisqusComments';
import { ChangiLoungePassModal } from './ChangiLoungePassModal';

interface HomeScreenProps {
  currencies: CurrencyRate[];
  transactions: ConversionTransaction[];
  onNavigateToRates: () => void;
  onSelectCurrency: (currency: CurrencyRate) => void;
  onOpenFlashAlerts: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currencies,
  transactions,
  onNavigateToRates,
  onSelectCurrency,
  onOpenFlashAlerts,
}) => {
  const [payAmount, setPayAmount] = useState<number>(500);
  const [selectedTargetCode, setSelectedTargetCode] = useState<string>('JPY');
  const [showLoungePass, setShowLoungePass] = useState(false);

  const selectedCurrency = currencies.find((c) => c.currencyCode === selectedTargetCode) || currencies[0];
  const calculatedForeignAmount = payAmount * selectedCurrency.currentRate;

  // Flash highlight items
  const flashCurrencies = currencies.filter((c) => c.hasFlashAlert);

  return (
    <div className="pb-24 pt-2 px-4 max-w-md mx-auto space-y-5">
      {/* Executive Multi-Currency Wallet Card */}
      <div className="bg-gradient-to-br from-[#00386b] via-[#004581] to-[#075fac] rounded-[24px] p-5 text-white shadow-lg relative overflow-hidden">
        {/* Subtle decorative background watermarks */}
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-white/90">
          <Shield className="w-3.5 h-3.5 text-emerald-300" />
          MAS Licensed Wallet
        </div>

        <div>
          <span className="text-xs font-medium text-white/70 tracking-wide uppercase">
            Total Multi-Currency Value
          </span>
          <div className="text-3xl font-extrabold tracking-tight mt-0.5 text-white">
            S$ 14,820<span className="text-xl text-white/70">.50</span>
          </div>
        </div>

        {/* Currency balances preview */}
        <div className="mt-4 pt-3 border-t border-white/15 grid grid-cols-3 gap-2">
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
            <span className="text-[10px] text-white/70 font-semibold">SGD Cash</span>
            <div className="text-sm font-bold mt-0.5">$9,240.00</div>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
            <span className="text-[10px] text-white/70 font-semibold">JPY Locked</span>
            <div className="text-sm font-bold mt-0.5">¥185,000</div>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
            <span className="text-[10px] text-white/70 font-semibold">KRW Locked</span>
            <div className="text-sm font-bold mt-0.5">₩850,000</div>
          </div>
        </div>

        {/* Quick Action buttons */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={onNavigateToRates}
            className="flex-1 py-2.5 bg-white text-[#004581] font-bold text-xs rounded-xl shadow-xs hover:bg-slate-100 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Exchange Currency
          </button>
          <button
            onClick={() => alert('PayNow QR top-up reference: UEN 202618992A-FX')}
            className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" />
            Top Up
          </button>
        </div>
      </div>

      {/* Flash Value Alert Banner */}
      <div
        onClick={onOpenFlashAlerts}
        className="bg-gradient-to-r from-[#fef3c7] to-[#fde68a] border border-[#f59e0b]/30 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#78350f] text-amber-200 rounded-xl shadow-xs group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 fill-amber-300 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#78350f] uppercase tracking-wider">
                Flash FX Opportunity
              </span>
              <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                Live Peak
              </span>
            </div>
            <p className="text-xs font-semibold text-amber-950 mt-0.5">
              JPY & KRW at 3-Month Highs against Singapore Dollar
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-amber-800 group-hover:translate-x-0.5 transition-transform" />
      </div>

      {/* Quick Converter Widget */}
      <div className="bg-white rounded-[20px] p-5 border border-[#e9ecef] shadow-[0px_4px_20px_rgba(0,93,170,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[#191c1d] flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-[#004581]" />
            Quick Exchange Calculator
          </h2>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            0% Markup
          </span>
        </div>

        <div className="space-y-3">
          {/* Pay Input */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                You Pay
              </span>
              <div className="flex items-center gap-1 text-sm font-bold text-slate-800 mt-0.5">
                <span>🇸🇬 SGD</span>
              </div>
            </div>
            <div className="text-right">
              <input
                type="number"
                value={payAmount}
                onChange={(e) => setPayAmount(Number(e.target.value))}
                className="w-28 text-right text-lg font-bold text-[#191c1d] bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {/* Receive Output with Currency Selector */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                You Receive
              </span>
              <div className="mt-0.5">
                <select
                  value={selectedTargetCode}
                  onChange={(e) => setSelectedTargetCode(e.target.value)}
                  className="text-xs font-bold text-[#004581] bg-white border border-slate-200 rounded-lg px-2 py-1 focus:outline-none"
                >
                  {currencies.map((c) => (
                    <option key={c.currencyCode} value={c.currencyCode}>
                      {c.flagUrl} {c.currencyCode} - {c.country}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-extrabold text-[#004581]">
                {calculatedForeignAmount >= 1000
                  ? calculatedForeignAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })
                  : calculatedForeignAmount.toFixed(2)}
              </div>
              <span className="text-[10px] font-medium text-slate-500">
                1 SGD = {selectedCurrency.currentRate.toFixed(2)} {selectedCurrency.currencyCode}
              </span>
            </div>
          </div>

          <button
            onClick={() => onSelectCurrency(selectedCurrency)}
            className="w-full py-3 bg-[#004581] hover:bg-[#005daa] text-white font-bold text-xs rounded-xl shadow-xs active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Lock Rate & Transfer to {selectedCurrency.currencyCode} Wallet
          </button>
        </div>
      </div>

      {/* Changi Airport & Travel Concierge Perk */}
      <div className="bg-[#f8f9fa] rounded-2xl p-4 border border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#735c00]/10 text-[#735c00] rounded-xl">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#191c1d]">
              Changi Airport Lounge Access
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Complimentary T1/T3 Lounge entry with MerlionFX card
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowLoungePass(true)}
          className="text-xs font-bold text-[#735c00] bg-[#fed65b]/50 hover:bg-[#fed65b] px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          View Pass
        </button>
      </div>

      {/* Recent Conversions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[#191c1d]">Recent FX Conversions</h2>
          <button
            onClick={onNavigateToRates}
            className="text-xs font-semibold text-[#004581] hover:underline cursor-pointer"
          >
            View Live Rates
          </button>
        </div>

        <div className="space-y-2">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-white rounded-xl p-3.5 border border-slate-200/80 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-700 font-bold text-xs">
                  {tx.toCurrency}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#191c1d]">
                    SGD {tx.fromAmount.toLocaleString()} → {tx.toCurrency}{' '}
                    {tx.toAmount.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Rate: 1 SGD = {tx.rate} {tx.toCurrency} • {tx.timestamp}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Locked
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Talk to Us - Community Discussion Forum */}
      <DisqusComments />

      {/* Changi Lounge Digital Pass Modal */}
      {showLoungePass && (
        <ChangiLoungePassModal onClose={() => setShowLoungePass(false)} />
      )}
    </div>
  );
};
