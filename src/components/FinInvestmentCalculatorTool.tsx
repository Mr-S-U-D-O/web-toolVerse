import React, { useState } from 'react';
import { ArrowLeft, TrendingUp } from 'lucide-react';


export default function FinInvestmentCalculatorTool({ onBack }: { onBack: () => void }) {
  const [initial, setInitial] = useState<string>('5000');
  const [current, setCurrent] = useState<string>('6500');
  
  const i = parseFloat(initial) || 0;
  const c = parseFloat(current) || 0;
  
  const profit = c - i;
  const roi = i > 0 ? (profit / i) * 100 : 0;

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
              Investment Calculator
            </h1>
            <p className="text-on-surface-variant max-w-2xl">
              Calculate Return on Investment (ROI) factoring initial and final values
            </p>
          </div>

          <div className="bg-surface-container rounded-3xl p-6 md:p-8 ring-1 ring-outline-variant">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Initial Investment ($)</label>
                <input type="number" value={initial} onChange={(e) => setInitial(e.target.value)} className="w-full bg-surface-container-high text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Current/Final Value ($)</label>
                <input type="number" value={current} onChange={(e) => setCurrent(e.target.value)} className="w-full bg-surface-container-high text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-high p-6 rounded-xl border border-outline flex flex-col items-center">
                <div className="text-sm text-on-surface-variant mb-1">Return on Investment (ROI)</div>
                <div className={`text-4xl font-bold font-mono break-all max-w-full ${roi >= 0 ? 'text-emerald-500' : 'text-error'}`}>
                  {roi.toFixed(2)}%
                </div>
              </div>
              <div className="bg-surface-container-high p-6 rounded-xl border border-outline flex flex-col items-center">
                <div className="text-sm text-on-surface-variant mb-1">Net Profit / Loss</div>
                <div className={`text-3xl font-bold font-mono break-all max-w-full ${profit >= 0 ? 'text-emerald-500/80' : 'text-error/80'}`}>
                  {profit >= 0 ? '+' : ''}${profit.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </main>
    </div>
  );
}