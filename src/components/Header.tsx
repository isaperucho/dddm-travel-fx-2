import React from 'react';
import { Bell } from 'lucide-react';

interface HeaderProps {
  unreadAlertsCount?: number;
  onOpenNotifications: () => void;
  onRefresh?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  unreadAlertsCount = 2,
  onOpenNotifications,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#f8f9fa]/95 backdrop-blur-md px-5 pt-4 pb-3 border-b border-[#e9ecef]/60 transition-all">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand Title */}
        <div className="flex items-center gap-2">
          <h1 className="text-[26px] font-bold tracking-tight text-[#004581] font-sans">
            MerlionFX
          </h1>
        </div>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          aria-label="View notifications and alerts"
          className="relative p-2 text-[#414751] hover:text-[#004581] hover:bg-slate-200/50 active:scale-95 transition-all rounded-full"
        >
          <Bell className="w-6 h-6 stroke-[1.75]" />
          {unreadAlertsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full ring-2 ring-[#f8f9fa] animate-pulse" />
          )}
        </button>
      </div>
    </header>
  );
};
