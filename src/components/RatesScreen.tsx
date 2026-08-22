import React, { useState } from 'react';
import {
  TrendingUp,
  Zap,
  Search,
  ArrowUpDown,
  ChevronRight,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Type,
} from 'lucide-react';
import { CurrencyRate } from '../types';

interface RatesScreenProps {
  currencies: CurrencyRate[];
  onSelectCurrency: (currency: CurrencyRate) => void;
  onOpenFlashAlerts: () => void;
  onQuickExchange: (currency: CurrencyRate) => void;
  rateSourceStatus?: {
    source: string;
    asOfDate?: string;
    isLive: boolean;
    lastUpdated: string;
  };
  onRefreshRates?: () => Promise<void>;
}

export const RatesScreen: React.FC<RatesScreenProps> = ({
  currencies,
  onSelectCurrency,
  onOpenFlashAlerts,
  rateSourceStatus = {
    source: 'MAS Live API',
    asOfDate: new Date().toLocaleDateString('en-SG', { month: 'short', day: 'numeric', year: 'numeric' }),
    isLive: true,
    lastUpdated: 'Just now',
  },
  onRefreshRates,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | '3M_HIGH' | 'ASIA' | 'SE_ASIA' | 'EUROPE'>('3M_HIGH');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  // Filter currencies
  const filteredCurrencies = currencies.filter((c) => {
    const matchesSearch =
      c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.currencyCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.currencyName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === '3M_HIGH') return c.isThreeMonthHigh;
    if (selectedFilter === 'ASIA') return c.region === 'Asia';
    if (selectedFilter === 'SE_ASIA') return c.region === 'SE Asia';
    if (selectedFilter === 'EUROPE') return c.region === 'Europe';
    return true;
  });

  const handleRefresh = async () => {
    if (onRefreshRates) {
      setIsRefreshing(true);
      try {
        await onRefreshRates();
      } finally {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  };

  return (
    <div className={`pb-24 pt-2 px-4 max-w-md mx-auto transition-all ${isEnlarged ? 'text-base' : 'text-sm'}`}>
      {/* Top Banner Badges & Accessibility Zoom Toggle */}
      <div className="flex flex-col gap-3 mb-4">
        {/* Flash Value Alert Pill & Comfort Zoom */}
        <div className="flex items-center justify-between">
          <button
            onClick={onOpenFlashAlerts}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#78350f] text-xs font-bold shadow-xs hover:bg-[#fde68a] active:scale-95 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-[#d97706] text-[#d97706]" />
            <span>Flash Value Alert</span>
            <span className="bg-[#b45309] text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ml-0.5">
              {currencies.filter((c) => c.hasFlashAlert).length}
            </span>
          </button>

          {/* Sizing / Enlarged Mode Toggle (P011 accessibility request) */}
          <button
            onClick={() => setIsEnlarged(!isEnlarged)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isEnlarged
                ? 'bg-[#004581] text-white border-[#004581] shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Toggle Large Comfort Reading View"
          >
            <Type className="w-3.5 h-3.5" />
            <span>{isEnlarged ? 'Large text (On)' : 'Large text'}</span>
          </button>
        </div>

        {/* Live Feed Trust & Timestamp Header */}
        <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-800">
              {rateSourceStatus.source}
            </span>
            <span className="text-[11px] text-slate-400">• Updated {rateSourceStatus.lastUpdated}</span>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-[11px] font-bold text-[#004581] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
            title="Sync Latest MAS Interbank Feed"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync'}</span>
          </button>
        </div>

        {/* 3-Month High / Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedFilter(selectedFilter === '3M_HIGH' ? 'ALL' : '3M_HIGH')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedFilter === '3M_HIGH'
                ? 'bg-[#dcfce7] border border-[#bbf7d0] text-[#14532d] shadow-xs ring-1 ring-emerald-400/40'
                : 'bg-white border border-[#e5e7eb] text-[#4b5563] hover:bg-slate-50'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#15803d]" />
            <span>3-Month High</span>
          </button>

          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              selectedFilter === 'ALL'
                ? 'bg-[#004581] text-white shadow-xs'
                : 'bg-white border border-[#e5e7eb] text-[#4b5563] hover:bg-slate-50'
            }`}
          >
            All Currencies
          </button>

          <button
            onClick={() => setSelectedFilter(selectedFilter === 'ASIA' ? 'ALL' : 'ASIA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              selectedFilter === 'ASIA'
                ? 'bg-[#004581] text-white shadow-xs'
                : 'bg-white border border-[#e5e7eb] text-[#4b5563] hover:bg-slate-50'
            }`}
          >
            Asia Focus
          </button>

          <button
            onClick={() => setSelectedFilter(selectedFilter === 'SE_ASIA' ? 'ALL' : 'SE_ASIA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              selectedFilter === 'SE_ASIA'
                ? 'bg-[#004581] text-white shadow-xs'
                : 'bg-white border border-[#e5e7eb] text-[#4b5563] hover:bg-slate-50'
            }`}
          >
            SE Asia
          </button>

          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`p-1.5 rounded-lg text-xs font-medium border transition-all shrink-0 cursor-pointer ${
              isSearchOpen || searchQuery
                ? 'bg-[#004581] text-white border-[#004581]'
                : 'bg-white border-[#e5e7eb] text-[#4b5563] hover:bg-slate-50'
            }`}
            title="Search currency"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Input Bar when toggled */}
      {isSearchOpen && (
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search country or currency (e.g. JPY, Korea)..."
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-[#191c1d] focus:outline-none focus:border-[#004581] focus:ring-2 focus:ring-[#004581]/10 transition-all shadow-xs"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* List of Currency Cards */}
      <div className="space-y-4">
        {filteredCurrencies.map((currency) => {
          const isPositive = currency.changePercent >= 0;
          const rateColor = currency.isThreeMonthHigh
            ? 'text-[#004581]'
            : 'text-[#191c1d]';

          return (
            <div
              key={currency.id}
              onClick={() => onSelectCurrency(currency)}
              className={`bg-white rounded-[22px] border border-[#e9ecef] shadow-[0px_4px_20px_rgba(0,93,170,0.04)] hover:shadow-[0px_8px_24px_rgba(0,93,170,0.08)] hover:border-[#c1c6d3] transition-all cursor-pointer group ${
                isEnlarged ? 'p-6' : 'p-5'
              }`}
            >
              {/* Header row: Flag/Image + Country/Sub + Rate/Change */}
              <div className="flex items-start justify-between mb-4">
                {/* Left Side: Avatar & Country Info */}
                <div className="flex items-center gap-3.5">
                  <div
                    className={`relative rounded-full overflow-hidden shrink-0 border border-slate-100 shadow-xs group-hover:scale-105 transition-transform bg-slate-100 flex items-center justify-center ${
                      isEnlarged ? 'w-14 h-14' : 'w-12 h-12'
                    }`}
                  >
                    {!imgErrors[currency.id] ? (
                      <img
                        src={currency.imageUrl}
                        alt={currency.country}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        onError={() =>
                          setImgErrors((prev) => ({ ...prev, [currency.id]: true }))
                        }
                      />
                    ) : (
                      <span className="text-2xl">{currency.flagUrl}</span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3
                        className={`font-bold text-[#191c1d] leading-tight tracking-tight ${
                          isEnlarged ? 'text-2xl' : 'text-[20px]'
                        }`}
                      >
                        {currency.country}
                      </h3>
                      {currency.isThreeMonthHigh && (
                        <span className="text-[10px] font-extrabold bg-[#dcfce7] text-[#14532d] px-2 py-0.5 rounded-full border border-[#bbf7d0]">
                          3M High
                        </span>
                      )}
                    </div>
                    <p
                      className={`font-medium text-[#727782] mt-0.5 ${
                        isEnlarged ? 'text-sm' : 'text-[13px]'
                      }`}
                    >
                      {currency.flagUrl} {currency.currencyCode} • {currency.region}
                    </p>
                  </div>
                </div>

                {/* Right Side: Rate & % change */}
                <div className="text-right">
                  <div
                    className={`font-bold tracking-tight ${rateColor} ${
                      isEnlarged ? 'text-[26px]' : 'text-[22px]'
                    }`}
                  >
                    {currency.currentRate >= 1000
                      ? currency.currentRate.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : currency.currentRate.toFixed(2)}
                  </div>
                  <div
                    className={`font-bold tracking-tight mt-0.5 ${
                      isPositive ? 'text-[#006b24]' : 'text-[#ba1a1a]'
                    } ${isEnlarged ? 'text-sm' : 'text-[12px]'}`}
                  >
                    {isPositive ? `+${currency.changePercent}% 3M` : `${currency.changePercent}% 3M`}
                  </div>
                </div>
              </div>

              {/* Value vs SGD Comparison Box */}
              <div className="bg-[#f8f9fa] rounded-xl p-4 border border-slate-100/80">
                <div
                  className={`text-center font-semibold text-[#727782] mb-3.5 tracking-wide ${
                    isEnlarged ? 'text-sm' : 'text-[12px]'
                  }`}
                >
                  Purchasing Power vs SGD (3-Month Comparison)
                </div>

                <div className="flex items-end justify-center gap-8">
                  {/* 3 Mo Ago Bar & Label */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-500">
                      {currency.threeMonthAgoRate >= 1000
                        ? currency.threeMonthAgoRate.toLocaleString()
                        : currency.threeMonthAgoRate.toFixed(2)}
                    </span>
                    <div
                      className="w-16 bg-[#d9dadb] rounded-sm transition-all shadow-2xs"
                      style={{
                        height: isPositive ? '50px' : '64px',
                      }}
                    />
                    <span className="text-[12px] font-medium text-[#727782]">
                      3 Mo Ago
                    </span>
                  </div>

                  {/* Now Bar & Label */}
                  <div className="flex flex-col items-center gap-2">
                    <span
                      className={`text-[11px] font-bold ${
                        isPositive ? 'text-[#004581]' : 'text-slate-800'
                      }`}
                    >
                      {currency.currentRate >= 1000
                        ? currency.currentRate.toLocaleString()
                        : currency.currentRate.toFixed(2)}
                    </span>
                    <div
                      className={`w-16 rounded-sm transition-all shadow-xs ${
                        isPositive
                          ? 'bg-[#004581] group-hover:bg-[#005daa]'
                          : 'bg-[#414751]'
                      }`}
                      style={{
                        height: isPositive ? '68px' : '50px',
                      }}
                    />
                    <span
                      className={`text-[12px] font-bold ${
                        isPositive ? 'text-[#004581]' : 'text-[#191c1d]'
                      }`}
                    >
                      Now
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive micro footer */}
              <div className="mt-3.5 pt-2 flex items-center justify-between text-xs text-[#727782] group-hover:text-[#004581] transition-colors">
                <span className="flex items-center gap-1 font-semibold">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  Tap to convert & lock rate
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#004581] group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          );
        })}

        {filteredCurrencies.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
            <p className="text-sm font-medium text-slate-500">
              No currencies match "{searchQuery}"
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('ALL');
              }}
              className="mt-3 text-xs font-bold text-[#004581] hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* MAS Regulatory & Mid-market transparency notice */}
      <div className="mt-6 px-2 text-center">
        <p className="text-[11px] text-[#727782] leading-relaxed">
          Official MAS End-of-Period reference mid-market rate. Zero retail kiosk markup.
        </p>
      </div>
    </div>
  );
};
