import React, { useState } from 'react';
import { ArrowLeft, TrendingUp } from 'lucide-react';

export default function FinProfitCalculatorTool({ onBack }: { onBack: () => void }) {
  const [cost, setCost] = useState<string>('');
  const [revenue, setRevenue] = useState<string>('');

  const c = parseFloat(cost) || 0;
  const r = parseFloat(revenue) || 0;
  const profit = r - c;
  const margin = r > 0 ? (profit / r) * 100 : 0;

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
              Profit Calculator
            </h1>
            <p className="text-on-surface-variant max-w-2xl">
              Calculate profit and profit margin from cost and revenue.
            </p>
          </div>

          <div className="bg-surface-container rounded-3xl p-6 md:p-8 ring-1 ring-outline-variant">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Cost ($)</label>
                <input
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="w-full bg-surface-container-high text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  placeholder="0.00"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Revenue ($)</label>
                <input
                  type="number"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  className="w-full bg-surface-container-high text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-surface-container-high p-4 rounded-xl border border-outline">
                <div className="text-sm text-on-surface-variant mb-1">Gross Profit</div>
                <div className={`text-2xl font-bold font-mono ${profit >= 0 ? 'text-emerald-500' : 'text-error'}`}>
                  ${profit.toFixed(2)}
                </div>
              </div>
              <div className="bg-surface-container-high p-4 rounded-xl border border-outline">
                <div className="text-sm text-on-surface-variant mb-1">Profit Margin</div>
                <div className="text-2xl font-bold text-on-surface font-mono">{margin.toFixed(2)}%</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
