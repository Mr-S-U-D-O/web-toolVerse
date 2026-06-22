import React, { useState } from 'react';
import { ArrowLeft, BarChart2 } from 'lucide-react';


export default function FinRoaCalculatorTool({ onBack }: { onBack: () => void }) {
  const [income, setIncome] = useState<string>('50000');
  const [assets, setAssets] = useState<string>('400000');
  
  const netIncome = parseFloat(income) || 0;
  const totalAssets = parseFloat(assets) || 0;
  
  const roa = totalAssets > 0 ? (netIncome / totalAssets) * 100 : 0;

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
              <BarChart2 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-on-surface mb-4">
              ROA Calculator
            </h1>
            <p className="text-on-surface-variant max-w-2xl">
              Return on Assets Calculator: Net Income divided by Total Assets
            </p>
          </div>

          <div className="bg-surface-container rounded-3xl p-6 md:p-8 ring-1 ring-outline-variant">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Net Income ($)</label>
                <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full bg-surface-container-high text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Total Assets ($)</label>
                <input type="number" value={assets} onChange={(e) => setAssets(e.target.value)} className="w-full bg-surface-container-high text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-high p-6 rounded-xl border border-outline flex items-center justify-center h-full flex-col">
                <div className="text-sm text-on-surface-variant mb-2">Return on Assets (ROA)</div>
                <div className="text-5xl font-bold font-mono text-primary break-all max-w-full">
                  {roa.toFixed(2)}%
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