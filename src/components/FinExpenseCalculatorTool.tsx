import React, { useState } from 'react';
import { ArrowLeft, CreditCard } from 'lucide-react';


export default function FinExpenseCalculatorTool({ onBack }: { onBack: () => void }) {
  const [housing, setHousing] = useState<string>('1500');
  const [food, setFood] = useState<string>('500');
  const [transport, setTransport] = useState<string>('300');
  const [utilities, setUtilities] = useState<string>('200');
  const [other, setOther] = useState<string>('300');
  
  const h = parseFloat(housing) || 0;
  const f = parseFloat(food) || 0;
  const t = parseFloat(transport) || 0;
  const u = parseFloat(utilities) || 0;
  const o = parseFloat(other) || 0;
  
  const monthly = h + f + t + u + o;
  const annual = monthly * 12;

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
              <CreditCard className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-on-surface mb-4">
              Expense Calculator
            </h1>
            <p className="text-on-surface-variant max-w-2xl">
              Calculate total monthly and annual expenses.
            </p>
          </div>

          <div className="bg-surface-container rounded-3xl p-6 md:p-8 ring-1 ring-outline-variant">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Housing / Rent ($)</label>
                <input type="number" value={housing} onChange={(e) => setHousing(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Food & Groceries ($)</label>
                <input type="number" value={food} onChange={(e) => setFood(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Transport ($)</label>
                <input type="number" value={transport} onChange={(e) => setTransport(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Utilities & Bills ($)</label>
                <input type="number" value={utilities} onChange={(e) => setUtilities(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Other / Misc ($)</label>
                <input type="number" value={other} onChange={(e) => setOther(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-high p-6 border border-outline rounded-xl flex flex-col items-center">
                <div className="text-sm text-on-surface-variant mb-1">Total Monthly Expenses</div>
                <div className="text-4xl font-bold font-mono text-error">${monthly.toFixed(2)}</div>
              </div>
              <div className="bg-surface-container-high p-6 border border-outline rounded-xl flex flex-col items-center">
                <div className="text-sm text-on-surface-variant mb-1">Total Annual Expenses</div>
                <div className="text-3xl font-bold font-mono text-error/80">${annual.toFixed(2)}</div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </main>
    </div>
  );
}