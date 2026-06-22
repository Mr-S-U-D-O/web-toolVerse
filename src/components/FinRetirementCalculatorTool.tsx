import React, { useState } from 'react';
import { ArrowLeft, Heart } from 'lucide-react';


export default function FinRetirementCalculatorTool({ onBack }: { onBack: () => void }) {
  const [current, setCurrent] = useState<string>('30');
  const [retireAge, setRetireAge] = useState<string>('65');
  const [monthlyNeed, setMonthlyNeed] = useState<string>('5000');
  
  const c = parseInt(current) || 0;
  const r = parseInt(retireAge) || 0;
  const mn = parseFloat(monthlyNeed) || 0;
  
  const years = Math.max(0, r - c);
  // Using 4% Withdrawal Rule for target nest egg
  const annualNeed = mn * 12;
  const targetNestEgg = annualNeed * 25;

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
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-on-surface mb-4">
              Retirement Calculator
            </h1>
            <p className="text-on-surface-variant max-w-2xl">
              Estimate required savings for retirement target.
            </p>
          </div>

          <div className="bg-surface-container rounded-3xl p-6 md:p-8 ring-1 ring-outline-variant">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Current Age</label>
                <input type="number" value={current} onChange={(e) => setCurrent(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Expected Retirement Age</label>
                <input type="number" value={retireAge} onChange={(e) => setRetireAge(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Desired Monthly Income During Retirement ($)</label>
                <input type="number" value={monthlyNeed} onChange={(e) => setMonthlyNeed(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-high p-6 border border-outline rounded-xl flex flex-col items-center">
                <div className="text-sm text-on-surface-variant mb-1">Target Nest Egg (4% Rule)</div>
                <div className="text-4xl font-bold font-mono text-primary">${(targetNestEgg/1000000).toFixed(2)}M</div>
                <div className="text-xs text-on-surface-variant mt-2">${targetNestEgg.toLocaleString()} total</div>
              </div>
              <div className="bg-surface-container-high p-6 border border-outline rounded-xl flex flex-col items-center">
                <div className="text-sm text-on-surface-variant mb-1">Years to Prepare</div>
                <div className="text-3xl font-bold font-mono text-on-surface">{years} Years</div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </main>
    </div>
  );
}