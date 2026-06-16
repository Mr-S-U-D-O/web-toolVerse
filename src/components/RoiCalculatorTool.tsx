import React, { useState } from 'react';
import { ArrowLeft, Sigma } from 'lucide-react';

export default function RoiCalculatorTool({ onBack }: { onBack: () => void }) {
  const [invested, setInvested] = useState('');
  const [returned, setReturned] = useState('');

  const inv = parseFloat(invested);
  const ret = parseFloat(returned);
  
  const profit = (!isNaN(inv) && !isNaN(ret)) ? ret - inv : null;
  const roi = (!isNaN(inv) && !isNaN(ret) && inv !== 0) ? (profit! / inv) * 100 : null;

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
        <div className="w-full max-w-lg flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Sigma className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight">ROI Calculator</h1>
          </div>

          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-6">
             <div>
                <label className="block font-mono text-xs text-outline uppercase tracking-widest mb-2">Amount Invested ($)</label>
                <input 
                  type="number" 
                  value={invested} 
                  onChange={e => setInvested(e.target.value)} 
                  className="w-full bg-surface border border-outline-variant rounded-lg p-3 text-lg font-mono placeholder:text-outline" 
                  placeholder="e.g. 1000" 
                />
             </div>
             <div>
                <label className="block font-mono text-xs text-outline uppercase tracking-widest mb-2">Amount Returned ($)</label>
                <input 
                  type="number" 
                  value={returned} 
                  onChange={e => setReturned(e.target.value)} 
                  className="w-full bg-surface border border-outline-variant rounded-lg p-3 text-lg font-mono placeholder:text-outline" 
                  placeholder="e.g. 1200" 
                />
             </div>

             <div className="mt-4 pt-6 border-t border-outline-variant flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-on-surface-variant uppercase tracking-widest">Investment Gain/Loss</span>
                  <span className={`font-mono text-xl font-bold ${profit !== null && profit < 0 ? 'text-error' : 'text-emerald-500'}`}>
                     {profit !== null ? `${profit >= 0 ? '+' : ''}$${profit.toLocaleString('en-US', {minimumFractionDigits: 2})}` : '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-on-surface-variant uppercase tracking-widest">ROI</span>
                  <span className={`font-mono text-3xl font-bold ${roi !== null && roi < 0 ? 'text-error' : 'text-primary'}`}>
                     {roi !== null ? `${roi.toLocaleString('en-US', {maximumFractionDigits: 2})}%` : '-'}
                  </span>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
