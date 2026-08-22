import React from 'react';
import { Home, TrendingUp, Map, User } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#e9ecef] shadow-[0px_-4px_20px_rgba(0,0,0,0.03)]">
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-around">
        {/* Home Tab */}
        <button
          onClick={() => onChangeTab('home')}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'bg-[#004581] text-white px-4 py-1.5 rounded-full shadow-xs'
              : 'text-[#5a626f] hover:text-[#004581] py-1 px-2'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.2]' : 'stroke-[1.75]'}`} />
          <span className={`text-[11px] font-medium tracking-tight mt-0.5 ${activeTab === 'home' ? 'text-white font-semibold' : ''}`}>
            Home
          </span>
        </button>

        {/* Rates Tab (Matches screenshot active style) */}
        <button
          onClick={() => onChangeTab('rates')}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'rates'
              ? 'bg-[#004581] text-white px-5 py-1.5 rounded-full shadow-xs scale-105'
              : 'text-[#5a626f] hover:text-[#004581] py-1 px-2'
          }`}
        >
          <TrendingUp className={`w-5 h-5 ${activeTab === 'rates' ? 'stroke-[2.2]' : 'stroke-[1.75]'}`} />
          <span className={`text-[11px] font-medium tracking-tight mt-0.5 ${activeTab === 'rates' ? 'text-white font-semibold' : ''}`}>
            Rates
          </span>
        </button>

        {/* Explore Tab */}
        <button
          onClick={() => onChangeTab('explore')}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'explore'
              ? 'bg-[#004581] text-white px-4 py-1.5 rounded-full shadow-xs'
              : 'text-[#5a626f] hover:text-[#004581] py-1 px-2'
          }`}
        >
          <Map className={`w-5 h-5 ${activeTab === 'explore' ? 'stroke-[2.2]' : 'stroke-[1.75]'}`} />
          <span className={`text-[11px] font-medium tracking-tight mt-0.5 ${activeTab === 'explore' ? 'text-white font-semibold' : ''}`}>
            Explore
          </span>
        </button>

        {/* Account Tab */}
        <button
          onClick={() => onChangeTab('account')}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'account'
              ? 'bg-[#004581] text-white px-4 py-1.5 rounded-full shadow-xs'
              : 'text-[#5a626f] hover:text-[#004581] py-1 px-2'
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === 'account' ? 'stroke-[2.2]' : 'stroke-[1.75]'}`} />
          <span className={`text-[11px] font-medium tracking-tight mt-0.5 ${activeTab === 'account' ? 'text-white font-semibold' : ''}`}>
            Account
          </span>
        </button>
      </div>
    </nav>
  );
};
