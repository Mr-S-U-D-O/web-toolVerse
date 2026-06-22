import React, { useState } from 'react';
import { ArrowLeft, TrendingUp } from 'lucide-react';


export default function FinOptionsCalculatorTool({ onBack }: { onBack: () => void }) {
  const [type, setType] = useState<string>('call');
  const [stockPrice, setStockPrice] = useState<string>('150');
  const [strikePrice, setStrikePrice] = useState<string>('140');
  const [premium, setPremium] = useState<string>('5');
  
  const current = parseFloat(stockPrice) || 0;
  const strike = parseFloat(strikePrice) || 0;
  const cost = parseFloat(premium) || 0;
  
  let intrinsic = 0;
  if (type === 'call') intrinsic = Math.max(0, current - strike);
  else intrinsic = Math.max(0, strike - current);
  
  const profit = intrinsic - cost;

  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-on-surface">
      <header className="w-full border-b border-outline-variant bg-background sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center">
          <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group">
             <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
             <span className="font-mono text-sm tracking-widest font-medium uppercase mt-0.5">Back to Main</span>
          </button>
        </div>
      </header>

      <main className="flex-grow flex justify-center p-6 lg:p-12 w-full max-w-[1280px] mx-auto relative pt-12 md:pt-16">
        <div className="max-w-4xl w-full mx-auto p-6 md:p-8">
          <div className="flex flex-col items-center justify-center mb-12 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-sm ring-1 ring-primary/20">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-on-surface mb-4">
              Options Calculator
            </h1>
            <p className="text-on-surface-variant max-w-2xl">
              Calculate basic intrinsic value for Call or Put options.
            </p>
          </div>

          <div className="bg-surface-container rounded-3xl p-6 md:p-8 ring-1 ring-outline-variant">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Option Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono text-sm leading-6">
                  <option value="call">Call Option</option>
                  <option value="put">Put Option</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Current Stock Price ($)</label>
                <input type="number" value={stockPrice} onChange={(e) => setStockPrice(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Option Strike Price ($)</label>
                <input type="number" value={strikePrice} onChange={(e) => setStrikePrice(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Premium Paid / Option Cost ($)</label>
                <input type="number" value={premium} onChange={(e) => setPremium(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-high p-6 border border-outline rounded-xl flex flex-col items-center">
                <div className="text-sm text-on-surface-variant mb-1">Intrinsic Value (Per Share)</div>
                <div className="text-3xl font-bold font-mono text-primary">${intrinsic.toFixed(2)}</div>
              </div>
              <div className="bg-surface-container-high p-6 border border-outline rounded-xl flex flex-col items-center">
                <div className="text-sm text-on-surface-variant mb-1">Net Profit / Loss (Per Share)</div>
                <div className={`text-4xl font-bold font-mono ${profit >= 0 ? "text-emerald-500" : "text-error"}`}>${profit.toFixed(2)}</div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </main>
    </div>
  );
}