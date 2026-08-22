/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveTab, CurrencyRate, RateAlert, ConversionTransaction } from './types';
import { INITIAL_CURRENCIES, INITIAL_ALERTS, INITIAL_TRANSACTIONS } from './data/currencies';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { RatesScreen } from './components/RatesScreen';
import { HomeScreen } from './components/HomeScreen';
import { ExploreScreen } from './components/ExploreScreen';
import { AccountScreen } from './components/AccountScreen';
import { RateDetailModal } from './components/RateDetailModal';
import { FlashAlertModal } from './components/FlashAlertModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('rates');
  const [currencies, setCurrencies] = useState<CurrencyRate[]>(INITIAL_CURRENCIES);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyRate | null>(null);
  const [showFlashAlerts, setShowFlashAlerts] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<RateAlert[]>(INITIAL_ALERTS);
  const [transactions, setTransactions] = useState<ConversionTransaction[]>(INITIAL_TRANSACTIONS);
  const [masSource, setMasSource] = useState<string>('MAS Live API');
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const [isLiveFeed, setIsLiveFeed] = useState<boolean>(true);

  const fetchRates = async () => {
    try {
      const res = await fetch('/api/mas/exchange-rates');
      const data = await res.json();
      if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
        setCurrencies(data.data);
        if (data.source === 'mas_official_api') {
          setMasSource(`MAS Official API`);
          setIsLiveFeed(true);
        } else {
          setMasSource(`Interbank Baseline Feed`);
          setIsLiveFeed(false);
        }
        setLastSyncTime(new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (err) {
      console.log('Using initial rate data:', err);
      setMasSource(`Cached Baseline`);
      setIsLiveFeed(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  // Handle direct currency exchange from modal
  const handleConfirmExchange = (
    fromCurrency: string,
    fromAmount: number,
    toCurrency: string,
    toAmount: number,
    rate: number
  ) => {
    const newTx: ConversionTransaction = {
      id: `tx-${Date.now()}`,
      fromCurrency,
      fromAmount,
      toCurrency,
      toAmount,
      rate,
      timestamp: 'Just now',
      status: 'COMPLETED',
    };
    setTransactions([newTx, ...transactions]);
  };

  // Add custom rate alert
  const handleAddAlert = (currencyCode: string, targetRate: number) => {
    const newAlert: RateAlert = {
      id: `alt-${Date.now()}`,
      currencyCode,
      targetRate,
      direction: 'ABOVE',
      createdAt: 'Just now',
      active: true,
    };
    setAlerts([newAlert, ...alerts]);
  };

  // Remove rate alert
  const handleRemoveAlert = (alertId: string) => {
    setAlerts(alerts.filter((a) => a.id !== alertId));
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d] flex justify-center font-sans antialiased">
      {/* Central Mobile App Frame for perfect aspect ratio & responsive desktop */}
      <div className="w-full max-w-md bg-[#f8f9fa] min-h-screen flex flex-col relative border-x border-slate-200/60 shadow-xl">
        {/* Persistent Top Header */}
        <Header
          unreadAlertsCount={currencies.filter((c) => c.hasFlashAlert).length}
          onOpenNotifications={() => setShowFlashAlerts(true)}
        />

        {/* Tab Content */}
        <main className="flex-1">
          {activeTab === 'rates' && (
            <RatesScreen
              currencies={currencies}
              onSelectCurrency={(curr) => setSelectedCurrency(curr)}
              onOpenFlashAlerts={() => setShowFlashAlerts(true)}
              onQuickExchange={(curr) => setSelectedCurrency(curr)}
              rateSourceStatus={{
                source: masSource,
                lastUpdated: lastSyncTime,
                isLive: isLiveFeed,
              }}
              onRefreshRates={fetchRates}
            />
          )}

          {activeTab === 'home' && (
            <HomeScreen
              currencies={currencies}
              transactions={transactions}
              onNavigateToRates={() => setActiveTab('rates')}
              onSelectCurrency={(curr) => setSelectedCurrency(curr)}
              onOpenFlashAlerts={() => setShowFlashAlerts(true)}
            />
          )}

          {activeTab === 'explore' && (
            <ExploreScreen
              currencies={currencies}
              onSelectCurrency={(curr) => setSelectedCurrency(curr)}
            />
          )}

          {activeTab === 'account' && (
            <AccountScreen
              alerts={alerts}
              onRemoveAlert={handleRemoveAlert}
              onAddAlert={handleAddAlert}
            />
          )}
        </main>

        {/* Persistent Bottom Navigation matching the screenshot */}
        <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />

        {/* Currency Rate Detail & Live Converter Modal */}
        {selectedCurrency && (
          <RateDetailModal
            currency={selectedCurrency}
            onClose={() => setSelectedCurrency(null)}
            onConfirmExchange={handleConfirmExchange}
            onAddAlert={handleAddAlert}
          />
        )}

        {/* Flash Value Alerts Popup */}
        {showFlashAlerts && (
          <FlashAlertModal
            currencies={currencies}
            onClose={() => setShowFlashAlerts(false)}
            onSelectCurrency={(curr) => setSelectedCurrency(curr)}
          />
        )}
      </div>
    </div>
  );
}
