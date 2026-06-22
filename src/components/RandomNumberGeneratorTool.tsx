import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, RefreshCw } from 'lucide-react';

interface RandomNumberGeneratorToolProps {
  onBack: () => void;
}

export default function RandomNumberGeneratorTool({ onBack }: RandomNumberGeneratorToolProps) {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [results, setResults] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let newResults: number[] = [];
    const minVal = Math.ceil(min);
    const maxVal = Math.floor(max);

    if (minVal > maxVal) {
      alert("Minimum value cannot be greater than maximum value.");
      return;
    }

    if (!allowDuplicates && count > (maxVal - minVal + 1)) {
      alert("Count cannot exceed the range of possibilities when duplicates are not allowed.");
      return;
    }

    if (allowDuplicates) {
      for (let i = 0; i < count; i++) {
        newResults.push(Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal);
      }
    } else {
      const pool = [];
      for (let i = minVal; i <= maxVal; i++) pool.push(i);
      
      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * pool.length);
        newResults.push(pool[randomIndex]);
        pool.splice(randomIndex, 1);
      }
    }

    setResults(newResults);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(results.join(', '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">Random Number Generator</h1>
        <p className="text-on-surface-variant mb-8">Generate random numbers securely and instantly.</p>

        <div className="grid md:grid-cols-[1fr_2fr] gap-6">
          
          <div className="bg-surface rounded-xl p-6 border border-outline h-fit space-y-6">
             <div>
               <label className="block text-sm font-bold mb-2">Minimum</label>
               <input type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} className="w-full bg-background border border-outline rounded p-2 focus:border-primary focus:outline-none" />
             </div>
             <div>
               <label className="block text-sm font-bold mb-2">Maximum</label>
               <input type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} className="w-full bg-background border border-outline rounded p-2 focus:border-primary focus:outline-none" />
             </div>
             <div>
               <label className="block text-sm font-bold mb-2">How Many Numbers?</label>
               <input type="number" min="1" max="1000" value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full bg-background border border-outline rounded p-2 focus:border-primary focus:outline-none" />
             </div>
             <div>
               <label className="flex items-center gap-3 cursor-pointer">
                 <input type="checkbox" checked={allowDuplicates} onChange={(e) => setAllowDuplicates(e.target.checked)} className="w-5 h-5 accent-primary" />
                 <span className="text-sm font-bold">Allow Duplicates</span>
               </label>
             </div>
             <button onClick={generate} className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold hover:bg-surface-tint transition-colors flex justify-center items-center gap-2">
               <RefreshCw size={18} /> Generate
             </button>
          </div>

          <div className="bg-surface rounded-xl border border-outline flex flex-col min-h-[400px]">
             <div className="p-4 bg-background border-b border-outline flex justify-between items-center">
               <span className="font-bold">Results ({results.length})</span>
               <button onClick={handleCopy} disabled={results.length===0} className="flex items-center gap-2 text-primary hover:bg-primary/10 px-3 py-1.5 rounded transition-colors disabled:opacity-50">
                 {copied ? <Check size={16} /> : <Copy size={16} />} 
               </button>
             </div>
             <div className="p-6 overflow-y-auto flex-1 text-2xl font-mono leading-relaxed text-center flex flex-wrap content-start justify-center gap-4">
                {results.length === 0 ? (
                  <div className="text-on-surface-variant/50 w-full mt-20">Click Generate...</div>
                ) : (
                  results.map((r, i) => (
                     <div key={i} className="bg-background border border-outline-variant px-4 py-2 rounded-lg shadow-sm">
                        {r}
                     </div>
                  ))
                )}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
