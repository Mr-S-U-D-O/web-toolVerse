import React, { useState } from 'react';
import { ArrowLeft, Calculator } from 'lucide-react';


export default function FinEbitdaCalculatorTool({ onBack }: { onBack: () => void }) {
  const [netIncome, setNetIncome] = useState<string>('150000');
  const [interest, setInterest] = useState<string>('10000');
  const [taxes, setTaxes] = useState<string>('30000');
  const [da, setDa] = useState<string>('20000');
  
  const ebitda = (parseFloat(netIncome) || 0) + (parseFloat(interest) || 0) + (parseFloat(taxes) || 0) + (parseFloat(da) || 0);

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
              <Calculator className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-on-surface mb-4">
              EBITDA Calculator
            </h1>
            <p className="text-on-surface-variant max-w-2xl">
              Sum up Net Income, Interest, Taxes, Depreciation & Amortization
            </p>
          </div>

          <div className="bg-surface-container rounded-3xl p-6 md:p-8 ring-1 ring-outline-variant">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-on-surface">Net Income ($)</label>
                <input type="number" value={netIncome} onChange={(e) => setNetIncome(e.target.value)} className="w-full bg-surface-container-high text-on-surface border border-outline px-3 py-2 rounded-lg focus:ring-1 focus:ring-primary font-mono text-sm" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-on-surface">Interest Expense ($)</label>
                <input type="number" value={interest} onChange={(e) => setInterest(e.target.value)} className="w-full bg-surface-container-high text-on-surface border border-outline px-3 py-2 rounded-lg focus:ring-1 focus:ring-primary font-mono text-sm" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-on-surface">Taxes ($)</label>
                <input type="number" value={taxes} onChange={(e) => setTaxes(e.target.value)} className="w-full bg-surface-container-high text-on-surface border border-outline px-3 py-2 rounded-lg focus:ring-1 focus:ring-primary font-mono text-sm" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-on-surface">Depreciation & Amortization ($)</label>
                <input type="number" value={da} onChange={(e) => setDa(e.target.value)} className="w-full bg-surface-container-high  border border-outline text-on-surface px-3 py-2 rounded-lg focus:ring-1 focus:ring-primary font-mono text-sm" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-high p-6 rounded-xl border border-outline flex items-center justify-center h-full flex-col text-center">
                <div className="text-sm text-on-surface-variant mb-2">EBITDA</div>
                <div className="text-5xl font-bold font-mono text-emerald-500 break-all max-w-full">
                  ${ebitda.toLocaleString()}
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