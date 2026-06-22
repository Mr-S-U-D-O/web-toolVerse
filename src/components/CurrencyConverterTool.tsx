import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Copy, Check, Shield, ArrowRightLeft, RefreshCw, AlertCircle } from 'lucide-react';

interface CurrencyData {
  base: string;
  rates: Record<string, number>;
  time_last_update_utc?: string;
}

// Hardcoded rates relative to USD as a reliable offline backup
const OFFLINE_RATES: Record<string, number> = {
  USD: 1.00,
  EUR: 0.925,
  GBP: 0.788,
  JPY: 159.20,
  CAD: 1.368,
  AUD: 1.505,
  INR: 83.55,
  CNY: 7.26,
  CHF: 0.894,
  BRL: 5.42,
  ZAR: 18.02,
  SGD: 1.353,
  NZD: 1.632,
  MXN: 18.15
};

const CURRENCY_NAMES: Record<string, string> = {
  USD: 'United States Dollar',
  EUR: 'Euro',
  GBP: 'British Pound Sterling',
  JPY: 'Japanese Yen',
  CAD: 'Canadian Dollar',
  AUD: 'Australian Dollar',
  INR: 'Indian Rupee',
  CNY: 'Chinese Yuan',
  CHF: 'Swiss Franc',
  BRL: 'Brazilian Real',
  ZAR: 'South African Rand',
  SGD: 'Singapore Dollar',
  NZD: 'New Zealand Dollar',
  MXN: 'Mexican Peso'
};

export default function CurrencyConverterTool({ onBack }: { onBack?: () => void }) {
  const [fromValue, setFromValue] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  
  const [rates, setRates] = useState<Record<string, number>>(OFFLINE_RATES);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastUpdate, setLastUpdate] = useState<string>('Offline Backup');
  const [copiedMain, setCopiedMain] = useState(false);
  const [copiedGridId, setCopiedGridId] = useState<string | null>(null);

  const fetchRates = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!response.ok) throw new Error('API response error');
      const data: CurrencyData = await response.json();
      
      // Filter rates to only our supported currencies to keep layout neat
      const filteredRates: Record<string, number> = {};
      Object.keys(OFFLINE_RATES).forEach(code => {
        if (data.rates[code]) {
          filteredRates[code] = data.rates[code];
        } else {
          filteredRates[code] = OFFLINE_RATES[code];
        }
      });
      
      setRates(filteredRates);
      setIsLive(true);
      if (data.time_last_update_utc) {
        // format UTC date string nicely
        setLastUpdate(new Date(data.time_last_update_utc).toLocaleDateString());
      }
    } catch (err) {
      console.warn('Using offline currency backup:', err);
      setRates(OFFLINE_RATES);
      setIsLive(false);
      setLastUpdate('Offline Backup');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  // Compute calculated conversion output
  const toValue = useMemo(() => {
    const amount = parseFloat(fromValue);
    if (isNaN(amount)) return '';
    
    // Rates are in USD.
    // Convert source amount to USD base, then to target currency
    const rateFrom = rates[fromCurrency] || 1;
    const rateTo = rates[toCurrency] || 1;
    
    const amountInUSD = amount / rateFrom;
    const converted = amountInUSD * rateTo;
    
    return parseFloat(converted.toFixed(2)).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }, [fromValue, fromCurrency, toCurrency, rates]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    if (toValue !== '') {
      // Strip formatting commas for input field
      setFromValue(toValue.replace(/,/g, ''));
    }
  };

  const handleCopyMain = async () => {
    if (toValue === '') return;
    try {
      await navigator.clipboard.writeText(toValue.replace(/,/g, ''));
      setCopiedMain(true);
      setTimeout(() => setCopiedMain(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleCopyGrid = async (valStr: string, id: string) => {
    try {
      await navigator.clipboard.writeText(valStr.replace(/,/g, ''));
      setCopiedGridId(id);
      setTimeout(() => setCopiedGridId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface w-full pb-20 animate-in fade-in duration-300">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b border-outline-variant bg-background/95 backdrop-blur-sm">
        <div className="max-w-[1280px] mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-mono text-[11px] uppercase tracking-widest">Tool Cabinet</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="font-sans text-sm font-medium text-on-surface">Currency Converter</div>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border ${
              isLive 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
            }`}>
              {isLive ? 'Live Exchange Rates' : 'Offline Mode'}
            </div>
          </div>
          <div className="w-[120px]" />
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-6 py-10 w-full">
        {/* Title */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">Currency Converter</h1>
            <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
              Convert values between major world currencies. Fetches live daily rates with a built-in offline dataset backup.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-on-surface-variant uppercase">
              Updated: {lastUpdate}
            </span>
            <button
              onClick={fetchRates}
              disabled={loading}
              className="p-2 rounded-lg border border-outline-variant bg-surface-container hover:bg-surface-container-high hover:border-[#008cff] text-on-surface-variant hover:text-[#008cff] transition-all disabled:opacity-50"
              title="Refresh Rates"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Dual Pane Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center bg-surface-container-low p-6 rounded-2xl border border-outline-variant mb-10">
          
          {/* FROM Unit */}
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">Amount</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={fromValue}
                onChange={(e) => setFromValue(e.target.value)}
                placeholder="100.00"
                className="flex-grow bg-surface-container border border-outline-variant rounded-xl p-4 font-mono text-lg text-on-surface focus:outline-none focus:border-[#008cff] transition-colors w-1/2"
              />
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="bg-surface-container border border-outline-variant rounded-xl px-4 py-4 text-sm font-sans text-on-surface focus:outline-none focus:border-[#008cff] transition-colors w-1/2"
              >
                {Object.keys(rates).map((code) => (
                  <option key={code} value={code}>
                    {code} - {CURRENCY_NAMES[code] || code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 flex items-center justify-center pointer-events-none">
            <button
              onClick={handleSwap}
              className="pointer-events-auto w-10 h-10 rounded-full bg-surface-container border border-outline-variant hover:border-[#008cff] text-on-surface-variant hover:text-[#008cff] flex items-center justify-center transition-all shadow-md active:scale-95"
              title="Swap currencies"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* TO Unit */}
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant flex justify-between items-center">
              <span>Converted Result</span>
              {toValue !== '' && (
                <button
                  onClick={handleCopyMain}
                  className={`flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider transition-colors ${
                    copiedMain ? 'text-emerald-400' : 'text-on-surface-variant hover:text-[#008cff]'
                  }`}
                >
                  {copiedMain ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedMain ? 'Copied!' : 'Copy'}
                </button>
              )}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={toValue}
                placeholder="0.00"
                className="flex-grow bg-surface-container-lowest border border-outline-variant rounded-xl p-4 font-mono text-lg text-[#008cff] focus:outline-none w-1/2"
              />
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="bg-surface-container border border-outline-variant rounded-xl px-4 py-4 text-sm font-sans text-on-surface focus:outline-none focus:border-[#008cff] transition-colors w-1/2"
              >
                {Object.keys(rates).map((code) => (
                  <option key={code} value={code}>
                    {code} - {CURRENCY_NAMES[code] || code}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* Matrix Grid */}
        <div>
          <h2 className="font-heading font-semibold text-lg mb-6 text-white">
            Exchange Rate Matrix Reference ({fromValue || '0'} {fromCurrency})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.keys(rates).map((code) => {
              const amount = parseFloat(fromValue);
              let valStr = '0.00';
              if (!isNaN(amount)) {
                const rateFrom = rates[fromCurrency] || 1;
                const rateTo = rates[code] || 1;
                const converted = (amount / rateFrom) * rateTo;
                valStr = parseFloat(converted.toFixed(2)).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                });
              }
              const isCopied = copiedGridId === code;

              return (
                <div
                  key={code}
                  className="bg-surface-container-low border border-outline-variant hover:border-outline p-4 rounded-xl flex flex-col justify-between group transition-colors relative"
                >
                  <button
                    onClick={() => handleCopyGrid(valStr, code)}
                    className={`absolute top-3 right-3 p-1.5 rounded-lg border bg-surface-container-lowest transition-colors opacity-0 group-hover:opacity-100 ${
                      isCopied
                        ? 'border-emerald-500/30 text-emerald-400'
                        : 'border-outline-variant hover:border-[#008cff] text-on-surface-variant hover:text-[#008cff]'
                    }`}
                    title="Copy value"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant block mb-1">
                    {code} - {CURRENCY_NAMES[code]}
                  </span>
                  
                  <span className="text-lg font-mono font-bold text-white break-all pr-6">
                    {valStr}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}
