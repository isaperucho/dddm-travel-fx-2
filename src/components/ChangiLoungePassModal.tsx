import React, { useState } from 'react';
import { X, Plane, QrCode, ShieldCheck, Clock, MapPin, Coffee, Wifi, Sparkles, CheckCircle2 } from 'lucide-react';

interface ChangiLoungePassModalProps {
  onClose: () => void;
}

export const ChangiLoungePassModal: React.FC<ChangiLoungePassModalProps> = ({ onClose }) => {
  const [selectedTerminal, setSelectedTerminal] = useState<'T1' | 'T2' | 'T3' | 'T4'>('T3');
  const [passCopied, setPassCopied] = useState(false);

  const lounges = {
    T1: {
      name: 'Marhaba Lounge (Terminal 1)',
      location: 'Level 3, Departure Transit Hall (Near Gate C1)',
      amenities: ['Buffet Dining', 'Private Shower Suites', 'High-Speed Wi-Fi', 'Flight Monitor'],
      openHours: '24 Hours Daily',
    },
    T2: {
      name: 'SATS Premier Lounge (Terminal 2)',
      location: 'Level 3, Departure Transit Lounge (Opposite Duty Free)',
      amenities: ['Hot Laksa Bar', 'Massage Chairs', 'Cocktail Bar', 'Shower Facilities'],
      openHours: '24 Hours Daily',
    },
    T3: {
      name: 'Ambassador Transit Lounge (Terminal 3)',
      location: 'Level 3, Departure Transit Hall (Next to Movie Theatre)',
      amenities: ['Full Hot Buffet', 'Private Sleep Pods', 'Executive Shower', 'Business Center'],
      openHours: '24 Hours Daily',
    },
    T4: {
      name: 'Blossom Lounge (Terminal 4)',
      location: 'Level 2M, Heritage Zone Transit Area',
      amenities: ['Outdoor Deck Area', 'Barista Coffee', 'Gourmet Tapas', 'Shower Suites'],
      openHours: '24 Hours Daily',
    },
  };

  const activeLounge = lounges[selectedTerminal];

  const handleCopyCode = () => {
    setPassCopied(true);
    setTimeout(() => setPassCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-[#00386b] via-[#004581] to-[#075fac] p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close pass"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-wider uppercase bg-[#fed65b] text-[#735c00] px-2.5 py-0.5 rounded-full">
              Prestige Benefit
            </span>
            <span className="text-[11px] text-white/80">Changi Singapore</span>
          </div>

          <h2 className="text-lg font-extrabold mt-1 text-white flex items-center gap-2">
            <Plane className="w-5 h-5 text-[#fed65b]" />
            Airport Lounge Digital Pass
          </h2>
          <p className="text-xs text-white/80 mt-0.5">
            Member: Alexander Tan • KrisFlyer Linked
          </p>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Terminal Tabs */}
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Select Changi Terminal
            </span>
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">
              {(['T1', 'T2', 'T3', 'T4'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTerminal(t)}
                  className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                    selectedTerminal === t
                      ? 'bg-white text-[#004581] shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Digital QR Code Boarding Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-dashed border-slate-300 text-center space-y-3">
            <div className="inline-block p-3 bg-white rounded-xl shadow-xs border border-slate-200">
              <div className="w-36 h-36 bg-slate-900 mx-auto rounded-lg flex flex-col items-center justify-center p-2 relative overflow-hidden">
                {/* SVG QR Code Pattern */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                  <rect x="0" y="0" width="30" height="30" rx="4" />
                  <rect x="5" y="5" width="20" height="20" fill="#0f172a" />
                  <rect x="9" y="9" width="12" height="12" fill="white" />
                  
                  <rect x="70" y="0" width="30" height="30" rx="4" />
                  <rect x="75" y="5" width="20" height="20" fill="#0f172a" />
                  <rect x="79" y="9" width="12" height="12" fill="white" />

                  <rect x="0" y="70" width="30" height="30" rx="4" />
                  <rect x="5" y="75" width="20" height="20" fill="#0f172a" />
                  <rect x="9" y="79" width="12" height="12" fill="white" />

                  <rect x="40" y="10" width="10" height="10" />
                  <rect x="55" y="15" width="10" height="20" />
                  <rect x="40" y="40" width="20" height="20" rx="2" />
                  <rect x="15" y="45" width="15" height="10" />
                  <rect x="70" y="45" width="20" height="10" />
                  <rect x="40" y="70" width="15" height="15" />
                  <rect x="65" y="75" width="25" height="15" />
                </svg>
              </div>
            </div>

            <div>
              <div className="font-mono text-sm font-bold text-slate-800 tracking-wider">
                SIN-LOU-2026-8821-FX
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Present at lounge reception desk alongside your boarding pass
              </p>
            </div>

            <button
              onClick={handleCopyCode}
              className="text-xs font-bold text-[#004581] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              {passCopied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pass Code Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Copy Digital Pass ID</span>
                </>
              )}
            </button>
          </div>

          {/* Lounge Details */}
          <div className="bg-white rounded-xl p-3.5 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#004581] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900">{activeLounge.name}</div>
                <div className="text-[11px] text-slate-500">{activeLounge.location}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-600 pt-1 border-t border-slate-100">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{activeLounge.openHours}</span>
            </div>

            <div className="pt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Included Amenities
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {activeLounge.amenities.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-700 bg-slate-50 px-2 py-1 rounded-md">
                    <Sparkles className="w-3 h-3 text-[#004581]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Valid till 31 Dec 2026</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#004581] text-white text-xs font-bold rounded-xl hover:bg-[#005daa] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
