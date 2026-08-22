import React, { useState } from 'react';
import {
  User,
  CreditCard,
  Lock,
  Bell,
  Trash2,
  Plus,
  ShieldCheck,
  Plane,
  Eye,
  EyeOff,
  Smartphone,
  ChevronRight,
  ExternalLink,
  Database,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Zap,
  TrendingUp,
  CreditCard as CardIcon,
  ChevronDown,
  Info,
  DollarSign,
} from 'lucide-react';
import { RateAlert } from '../types';

interface AccountScreenProps {
  alerts: RateAlert[];
  onRemoveAlert: (alertId: string) => void;
  onAddAlert: (currencyCode: string, targetRate: number) => void;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({
  alerts,
  onRemoveAlert,
  onAddAlert,
}) => {
  const [isCardFrozen, setIsCardFrozen] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [overseasAtmEnabled, setOverseasAtmEnabled] = useState(true);
  const [showNewAlertInput, setShowNewAlertInput] = useState(false);
  const [newCurrency, setNewCurrency] = useState('JPY');
  const [newTarget, setNewTarget] = useState('113.50');
  const [newDirection, setNewDirection] = useState<'ABOVE' | 'BELOW'>('ABOVE');
  const [showDataSourceInfo, setShowDataSourceInfo] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [billingCards, setBillingCards] = useState([
    { id: 'c1', bank: 'DBS Altitude Visa', last4: '4192', isDefault: true },
    { id: 'c2', bank: 'OCBC 365 Mastercard', last4: '8821', isDefault: false },
  ]);
  const [newCardBank, setNewCardBank] = useState('UOB PRVI Miles');
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardCvv, setNewCardCvv] = useState('');
  const [cardError, setCardError] = useState('');
  const [testNotificationToast, setTestNotificationToast] = useState<string | null>(null);

  const handleCreateAlert = () => {
    const num = parseFloat(newTarget);
    if (!isNaN(num) && num > 0) {
      onAddAlert(newCurrency, num);
      setShowNewAlertInput(false);
      setTestNotificationToast(`Alert configured for ${newCurrency} ${newDirection === 'ABOVE' ? '>' : '<'} ${num}`);
      setTimeout(() => setTestNotificationToast(null), 3000);
    }
  };

  const handleAddBillingCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardNumber || newCardNumber.length < 16) {
      setCardError('Please enter a valid 16-digit card number.');
      return;
    }
    if (!newCardExpiry || !newCardExpiry.includes('/')) {
      setCardError('Please enter a valid expiry date (MM/YY).');
      return;
    }

    const last4 = newCardNumber.slice(-4);
    setBillingCards([
      ...billingCards,
      { id: `c-${Date.now()}`, bank: newCardBank, last4, isDefault: false },
    ]);
    setNewCardNumber('');
    setNewCardExpiry('');
    setNewCardCvv('');
    setCardError('');
    setShowAddCardModal(false);
  };

  return (
    <div className="pb-24 pt-2 px-4 max-w-md mx-auto space-y-5">
      {/* Toast feedback */}
      {testNotificationToast && (
        <div className="p-3 bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{testNotificationToast}</span>
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#004581] text-white font-bold text-lg flex items-center justify-center shadow-xs">
            AT
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-[#191c1d]">Alexander Tan</h2>
              <span className="text-[10px] bg-[#735c00]/10 text-[#735c00] font-bold px-2 py-0.5 rounded-full">
                Prestige Member
              </span>
            </div>
            <p className="text-xs text-slate-500">alexander.tan@singapore.com</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-semibold block">KrisFlyer Miles</span>
          <span className="text-xs font-bold text-[#004581]">48,920 pts</span>
        </div>
      </div>

      {/* MerlionFX Multi-Currency Digital Debit Card */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-[#004581]" />
            MerlionFX Travel Debit Card
          </h3>
          <button
            onClick={() => setShowCardNumber(!showCardNumber)}
            className="text-[11px] font-bold text-[#004581] flex items-center gap-1 cursor-pointer"
          >
            {showCardNumber ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showCardNumber ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        <div
          className={`rounded-2xl p-5 text-white shadow-md relative overflow-hidden transition-all duration-300 ${
            isCardFrozen
              ? 'bg-slate-700 opacity-80 filter grayscale'
              : 'bg-gradient-to-br from-[#00386b] via-[#004581] to-[#075fac]'
          }`}
        >
          {/* Card Top */}
          <div className="flex items-center justify-between mb-8">
            <span className="text-base font-bold tracking-wider">MerlionFX</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-wider bg-white/20 px-2 py-0.5 rounded-md">
                PRESTIGE
              </span>
              <Smartphone className="w-4 h-4 text-white/80" />
            </div>
          </div>

          {/* Card Number */}
          <div className="font-mono text-base font-medium tracking-widest mb-4">
            {showCardNumber ? '4532  8910  9934  7821' : '••••  ••••  ••••  7821'}
          </div>

          {/* Card Footer */}
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[9px] text-white/60 block uppercase font-medium">Cardholder</span>
              <span className="text-xs font-semibold tracking-wide uppercase">ALEXANDER TAN</span>
            </div>
            <div>
              <span className="text-[9px] text-white/60 block uppercase font-medium">Expires</span>
              <span className="text-xs font-semibold tracking-wide">08/29</span>
            </div>
            <div className="text-right">
              <span className="text-base font-extrabold italic tracking-tighter">VISA</span>
            </div>
          </div>
        </div>

        {/* Card Security Controls */}
        <div className="bg-white rounded-xl p-3 border border-slate-200 grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => setIsCardFrozen(!isCardFrozen)}
            className={`p-2.5 rounded-lg border font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isCardFrozen
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            {isCardFrozen ? 'Unfreeze Card' : 'Freeze Card'}
          </button>

          <button
            onClick={() => setOverseasAtmEnabled(!overseasAtmEnabled)}
            className={`p-2.5 rounded-lg border font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              overseasAtmEnabled
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            {overseasAtmEnabled ? 'Overseas ATM: ON' : 'Overseas ATM: OFF'}
          </button>
        </div>
      </div>

      {/* Linked Funding & Charging Cards (Monetization & Top-Up readiness) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <CardIcon className="w-3.5 h-3.5 text-[#004581]" />
            Linked Top-Up & Charging Cards
          </h3>
          <button
            onClick={() => setShowAddCardModal(!showAddCardModal)}
            className="text-xs font-bold text-[#004581] flex items-center gap-1 hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Card
          </button>
        </div>

        {/* Add Card Form in-place */}
        {showAddCardModal && (
          <form onSubmit={handleAddBillingCard} className="p-4 bg-slate-50 rounded-2xl border border-slate-300 space-y-3 text-xs">
            <div className="font-bold text-slate-800">Add Singapore Bank Card for Instant Top-Ups</div>
            {cardError && (
              <div className="p-2 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{cardError}</span>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-600 mb-1">Issuing Bank & Card Name</label>
              <input
                type="text"
                value={newCardBank}
                onChange={(e) => setNewCardBank(e.target.value)}
                placeholder="e.g. DBS Altitude / UOB PRVI"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">16-Digit Card Number</label>
              <input
                type="text"
                maxLength={16}
                value={newCardNumber}
                onChange={(e) => setNewCardNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="4532 0000 0000 0000"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono font-medium text-slate-800"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Expiry (MM/YY)</label>
                <input
                  type="text"
                  maxLength={5}
                  value={newCardExpiry}
                  onChange={(e) => setNewCardExpiry(e.target.value)}
                  placeholder="12/28"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">CVV (3 digits)</label>
                <input
                  type="password"
                  maxLength={3}
                  value={newCardCvv}
                  onChange={(e) => setNewCardCvv(e.target.value.replace(/\D/g, ''))}
                  placeholder="123"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-800"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddCardModal(false)}
                className="px-3 py-1.5 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#004581] text-white font-bold rounded-lg hover:bg-[#005daa]"
              >
                Save & Link Card
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {billingCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-xl p-3 border border-slate-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {card.bank} •••• {card.last4}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {card.isDefault ? 'Primary Top-Up Method' : 'Secondary Method'}
                  </span>
                </div>
              </div>

              {card.isDefault && (
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Default
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Active Rate Alerts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-[#004581]" />
            Your Active Rate Alerts
          </h3>
          <button
            onClick={() => setShowNewAlertInput(!showNewAlertInput)}
            className="text-xs font-bold text-[#004581] flex items-center gap-1 hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Alert
          </button>
        </div>

        {/* New alert inline form */}
        {showNewAlertInput && (
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-300 space-y-2.5 text-xs">
            <div className="font-bold text-slate-800">Set Custom Rate Notification</div>
            <div className="flex items-center gap-2">
              <select
                value={newCurrency}
                onChange={(e) => setNewCurrency(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
              >
                <option value="JPY">JPY (Japan)</option>
                <option value="KRW">KRW (Korea)</option>
                <option value="THB">THB (Thailand)</option>
                <option value="TWD">TWD (Taiwan)</option>
                <option value="MYR">MYR (Malaysia)</option>
                <option value="VND">VND (Vietnam)</option>
                <option value="EUR">EUR (Europe)</option>
                <option value="GBP">GBP (UK)</option>
                <option value="AUD">AUD (Australia)</option>
                <option value="USD">USD (USA)</option>
              </select>

              <select
                value={newDirection}
                onChange={(e) => setNewDirection(e.target.value as any)}
                className="bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800"
              >
                <option value="ABOVE">Rises &gt;</option>
                <option value="BELOW">Drops &lt;</option>
              </select>

              <input
                type="number"
                step="0.01"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                placeholder="Target Rate"
                className="w-24 px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
              />

              <button
                onClick={handleCreateAlert}
                className="px-3 py-1.5 bg-[#004581] text-white text-xs font-bold rounded-lg hover:bg-[#005daa] transition-colors cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {alerts.map((al) => (
            <div
              key={al.id}
              className="bg-white rounded-xl p-3.5 border border-slate-200/90 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-slate-100 rounded-lg font-bold text-xs text-[#004581]">
                  {al.currencyCode}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Notify when 1 SGD &gt; {al.targetRate} {al.currencyCode}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    Active push notification • Created {al.createdAt}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onRemoveAlert(al.id)}
                className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                title="Remove alert"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {alerts.length === 0 && (
            <div className="p-4 bg-white rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
              No active alerts. Tap "Add Alert" to get notified when exchange rates reach 3-month peaks.
            </div>
          )}
        </div>
      </div>

      {/* FX Data Source & Transparency Disclosure (Answering P002 XE vs MAS) */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <button
          onClick={() => setShowDataSourceInfo(!showDataSourceInfo)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Database className="w-4 h-4 text-[#004581]" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                FX Data Source: Why MAS API instead of XE?
              </h4>
              <p className="text-[10px] text-slate-500">
                Official Monetary Authority of Singapore reference benchmarks
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform ${
              showDataSourceInfo ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showDataSourceInfo && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 space-y-2.5 leading-relaxed">
            <div className="font-semibold text-slate-800">
              Our Data Integrity & Transparency Philosophy:
            </div>
            <p>
              <strong>1. Statutory Authority:</strong> Unlike commercial aggregators like XE or OANDA, which apply proprietary bid-ask retail markups or affiliate partner spreads, the <strong>Monetary Authority of Singapore (MAS)</strong> publishes statutory end-of-period interbank mid-market exchange rates.
            </p>
            <p>
              <strong>2. Exact 100-Unit Quotation Precision:</strong> Asian currencies such as JPY, KRW, THB, and TWD are converted directly from MAS’s official 100-unit basket formula, ensuring 100% mathematical fidelity with Singapore banking standards.
            </p>
            <p>
              <strong>3. Resilient High-Precision Cache:</strong> If external network congestion occurs, MerlionFX seamlessly serves verified interbank baselines so travellers are never locked out of rate decisioning.
            </p>
          </div>
        )}
      </div>

      {/* Trust & Regulatory Badge */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 space-y-1">
          <p className="font-bold text-slate-800">
            Regulated by Monetary Authority of Singapore (MAS)
          </p>
          <p className="text-[11px] text-slate-500 leading-snug">
            Customer funds are safeguarded under the Payment Services Act with institutional partner banks in Singapore.
          </p>
        </div>
      </div>
    </div>
  );
};
