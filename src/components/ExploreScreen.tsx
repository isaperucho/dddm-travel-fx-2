import React, { useState } from 'react';
import {
  Compass,
  TrendingUp,
  MapPin,
  CreditCard,
  Building,
  BadgeDollarSign,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { CurrencyRate } from '../types';

interface ExploreScreenProps {
  currencies: CurrencyRate[];
  onSelectCurrency: (currency: CurrencyRate) => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  currencies,
  onSelectCurrency,
}) => {
  const [exchangeComparisonAmount, setExchangeComparisonAmount] = useState(2000);

  const topGainers = [...currencies]
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 4);

  return (
    <div className="pb-24 pt-2 px-4 max-w-md mx-auto space-y-5">
      {/* Title & Introduction */}
      <div>
        <h2 className="text-xl font-bold text-[#191c1d] tracking-tight">
          Destination FX Intelligence
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Where Singapore Dollar holders have the highest purchasing advantage right now
        </p>
      </div>

      {/* Top Value Index Destinations */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#004581]" />
          Highest SGD Purchasing Power
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {topGainers.map((dest) => (
            <div
              key={dest.id}
              onClick={() => onSelectCurrency(dest)}
              className="bg-white p-3.5 rounded-2xl border border-[#e9ecef] shadow-xs hover:border-[#004581] hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="relative w-full h-24 rounded-xl overflow-hidden mb-2.5">
                <img
                  src={dest.imageUrl}
                  alt={dest.country}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-md text-[10px] font-bold text-white">
                  {dest.flagUrl} {dest.country}
                </span>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-[#004581] text-white rounded-md text-[10px] font-bold shadow-xs">
                  +{dest.changePercent}% 3M
                </span>
              </div>

              <div className="text-xs font-bold text-[#191c1d]">
                1 SGD = {dest.currentRate >= 1000 ? dest.currentRate.toLocaleString('en-US') : dest.currentRate}{' '}
                {dest.currencyCode}
              </div>
              <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                {dest.travelTip}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Money Changer vs MerlionFX Comparison */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <BadgeDollarSign className="w-4 h-4 text-emerald-600" />
            Street Money Changer vs MerlionFX
          </h3>
          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
            Save up to S$68.00
          </span>
        </div>

        <p className="text-[11px] text-slate-500 mb-3">
          Traditional money changers (The Arcade / People's Park) mark up exchange rates by 1.8% - 3.5%. MerlionFX gives you direct MAS interbank mid-market rates.
        </p>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
            <span className="text-slate-600 font-medium">Exchanging for Japan (JPY):</span>
            <span className="font-bold text-slate-800">S$ 2,000 SGD</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center pt-1">
            <div className="p-3 bg-red-50/50 border border-red-200 rounded-xl">
              <span className="text-[10px] text-red-700 font-semibold uppercase">Street Kiosk Rate</span>
              <div className="text-sm font-bold text-slate-800 mt-0.5">¥218,200</div>
              <span className="text-[10px] text-red-600">Rate: 109.10</span>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl">
              <span className="text-[10px] text-emerald-800 font-bold uppercase">MerlionFX Rate</span>
              <div className="text-sm font-extrabold text-[#004581] mt-0.5">¥224,900</div>
              <span className="text-[10px] font-bold text-emerald-700">+¥6,700 Extra (S$59.60 saved)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Destination Payment Playbooks */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5 text-[#004581]" />
          Regional Payment Playbooks
        </h3>

        <div className="space-y-2.5">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
              <span>🇯🇵 Japan — Tokyo / Osaka</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              Add your MerlionFX card to Apple Wallet and reload your digital Suica / Pasmo IC transit card directly in Yen with 0% FX transaction fee.
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
              <span>🇹🇭 Thailand — Bangkok / Phuket</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              Use PayNow interoperability to scan Thai PromptPay QR codes at Chatuchak market and roadside stalls with instant THB conversion.
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
              <span>🇰🇷 South Korea — Seoul</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              All major subway turnstiles, Olive Young cosmetic boutiques, and K-beauty clinics accept contactless tap with your locked KRW wallet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
