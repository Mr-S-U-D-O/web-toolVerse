import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Copy, Check, DollarSign, Settings2, Calculator } from 'lucide-react';

export default function AnyFinTool({ 
  onBack, 
  title, 
  action, 
  topic 
}: { 
  onBack: () => void, 
  title: string, 
  action: string, 
  topic: string 
}) {
  const [amount, setAmount] = useState('1000');
  const [rate, setRate] = useState('5');
  const [years, setYears] = useState('10');
  const [copied, setCopied] = useState(false);

  // Implement generic logic based on action and topic
  const processFinance = () => {
    const p = parseFloat(amount) || 0;
    const r = parseFloat(rate) / 100 || 0;
    const t = parseFloat(years) || 0;

    let result = 0;
    
    if (topic === 'compound' || topic === 'investment' || topic === 'savings') {
      result = p * Math.pow(1 + r, t);
    } else if (topic === 'mortgage' || topic === 'loan') {
      const monthlyRate = r / 12;
      const months = t * 12;
      if (monthlyRate === 0) result = p / months;
      else result = p * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    } else if (action === 'calculator' || action === 'estimator') {
      result = p + (p * r * t);
    } else {
      result = p * (1 + r * t);
    }

    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result);
  };

  const output = processFinance();

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                 <Calculator className="w-5 h-5 text-emerald-500" />
              </div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight">{title}</h1>
            </div>
          </div>

          <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden shadow-sm p-6 flex flex-col gap-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">Amount / Principal</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-4 w-4 text-outline" />
                      </div>
                      <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-surface-container pl-10 pr-4 py-2.5 rounded-lg outline-none font-mono text-sm border border-transparent focus:border-emerald-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">Rate (%)</label>
                    <input 
                      type="number" 
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      className="w-full bg-surface-container px-4 py-2.5 rounded-lg outline-none font-mono text-sm border border-transparent focus:border-emerald-500/50 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">Years / Duration</label>
                    <input 
                      type="number" 
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                      className="w-full bg-surface-container px-4 py-2.5 rounded-lg outline-none font-mono text-sm border border-transparent focus:border-emerald-500/50 transition-colors"
                    />
                  </div>
              </div>

              <div className="mt-4 pt-6 border-t border-outline-variant flex flex-col gap-4">
                 <div className="flex items-center justify-between">
                   <span className="font-mono text-sm text-on-surface-variant uppercase tracking-widest">Calculated Result</span>
                   <span className="font-mono text-3xl font-bold text-emerald-500">
                      {output}
                   </span>
                 </div>
              </div>
          </div>
        </div>
      </main>
    </div>
  );
}
