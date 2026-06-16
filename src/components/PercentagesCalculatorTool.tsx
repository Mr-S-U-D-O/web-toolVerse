import React, { useState } from 'react';
import { ArrowLeft, Percent } from 'lucide-react';

export default function PercentagesCalculatorTool({ onBack }: { onBack: () => void }) {
  const [val1A, setVal1A] = useState('');
  const [val1B, setVal1B] = useState('');
  
  const [val2A, setVal2A] = useState('');
  const [val2B, setVal2B] = useState('');

  const res1 = (val1A && val1B) ? (parseFloat(val1A) / 100) * parseFloat(val1B) : null;
  const res2 = (val2A && val2B) ? (parseFloat(val2A) / parseFloat(val2B)) * 100 : null;

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
        <div className="w-full max-w-2xl flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Percent className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight">Percentages Calculator</h1>
          </div>

          <div className="flex flex-col gap-8 mt-4">
             {/* Mode 1 */}
             <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 shadow-sm">
                <h3 className="font-heading text-lg font-medium mb-4">What is X% of Y?</h3>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="font-mono text-sm">What is</span>
                  <input type="number" value={val1A} onChange={e => setVal1A(e.target.value)} className="w-24 bg-surface border border-outline-variant rounded p-2 text-center" placeholder="%" />
                  <span className="font-mono text-sm">% of</span>
                  <input type="number" value={val1B} onChange={e => setVal1B(e.target.value)} className="w-32 bg-surface border border-outline-variant rounded p-2 text-center" placeholder="number" />
                  <span className="font-mono text-sm">=</span>
                  <div className="flex-grow bg-surface-container-highest rounded p-2 text-center font-bold text-primary min-w-[100px]">
                     {res1 !== null && !isNaN(res1) ? res1.toLocaleString('en-US', { maximumFractionDigits: 4 }) : '-'}
                  </div>
                </div>
             </div>

             {/* Mode 2 */}
             <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 shadow-sm">
                <h3 className="font-heading text-lg font-medium mb-4">X is what percent of Y?</h3>
                <div className="flex items-center gap-4 flex-wrap">
                  <input type="number" value={val2A} onChange={e => setVal2A(e.target.value)} className="w-32 bg-surface border border-outline-variant rounded p-2 text-center" placeholder="number" />
                  <span className="font-mono text-sm">is what % of</span>
                  <input type="number" value={val2B} onChange={e => setVal2B(e.target.value)} className="w-32 bg-surface border border-outline-variant rounded p-2 text-center" placeholder="number" />
                  <span className="font-mono text-sm">=</span>
                  <div className="flex-grow bg-surface-container-highest rounded p-2 text-center font-bold text-primary min-w-[100px]">
                     {res2 !== null && !isNaN(res2) ? res2.toLocaleString('en-US', { maximumFractionDigits: 4 }) + '%' : '-'}
                  </div>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
