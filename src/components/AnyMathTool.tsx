import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, Calculator } from 'lucide-react';

export default function AnyMathTool({ 
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
  const [input, setInput] = useState('10, 20, 30');
  const [copied, setCopied] = useState(false);

  const processMath = () => {
    try {
      const numbers = input.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
      if (numbers.length === 0) return 'Please enter valid comma-separated numbers';

      if (topic === 'statistics' || topic === 'probability') {
         const sum = numbers.reduce((a,b)=>a+b,0);
         const mean = sum / numbers.length;
         const sorted = [...numbers].sort((a,b)=>a-b);
         const median = numbers.length % 2 === 0 ? (sorted[numbers.length/2 - 1] + sorted[numbers.length/2]) / 2 : sorted[Math.floor(numbers.length/2)];
         return `Count: ${numbers.length}\nSum: ${sum}\nMean: ${mean.toFixed(4)}\nMedian: ${median}\nMin: ${sorted[0]}\nMax: ${sorted[sorted.length-1]}`;
      }

      if (topic === 'geometry') {
         const r = numbers[0];
         return `Circle Radius: ${r}\nArea: ${(Math.PI * Math.pow(r, 2)).toFixed(4)}\nCircumference: ${(2 * Math.PI * r).toFixed(4)}`;
      }

      if (topic === 'fractions' || topic === 'percentages' || topic === 'ratios') {
         const total = numbers.reduce((a,b)=>a+b,0);
         return numbers.map((n, i) => `Value ${i+1}: ${n} => ${((n/total)*100).toFixed(2)}%`).join('\n');
      }

      if (topic === 'algebra' || topic === 'calculus' || topic === 'trigonometry') {
         return numbers.map((n) => `x = ${n}\nsin(x) = ${Math.sin(n).toFixed(4)}\ncos(x) = ${Math.cos(n).toFixed(4)}\nx² = ${Math.pow(n, 2)}`).join('\n\n');
      }

      if (action === 'generator' || action === 'simulator') {
         const start = numbers[0] || 0;
         const step = numbers[1] || 1;
         const count = numbers[2] || 10;
         return Array.from({length: Math.min(count, 100)}).map((_, i) => start + i * step).join(', ');
      }

      // Generic fallback
      const sum = numbers.reduce((a,b) => a+b, 0);
      const product = numbers.reduce((a,b) => a*b, 1);
      return `Input: ${numbers.join(', ')}\nSum = ${sum}\nProduct = ${product}`;
    } catch(e) {
      return 'Error in calculation. Please check your inputs.';
    }
  };

  const output = processMath();

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
        <div className="w-full max-w-4xl flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                 <Calculator className="w-5 h-5 text-blue-500" />
              </div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight">{title}</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 min-h-[400px]">
             <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col h-[400px] lg:h-full">
                <div className="h-12 border-b border-outline-variant bg-surface-container flex items-center px-4">
                  <span className="font-mono text-xs text-outline uppercase tracking-widest">Input Values (Comma separated)</span>
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. 10, 20, 30"
                  className="flex-grow w-full bg-transparent p-5 outline-none font-mono text-[13px] text-on-surface resize-none placeholder:text-outline"
                />
             </div>

             <div className="border border-outline-variant bg-surface-container-low rounded-xl overflow-hidden shadow-sm flex flex-col h-[400px] lg:h-full">
                <div className="h-12 border-b border-outline-variant bg-surface-container flex items-center px-4">
                  <span className="font-mono text-xs text-outline uppercase tracking-widest">Output Results</span>
                </div>
                <textarea
                  value={output}
                  readOnly
                  placeholder="Result will appear here..."
                  className="flex-grow w-full bg-transparent p-5 outline-none font-mono text-[13px] resize-none placeholder:text-outline text-blue-500"
                />
                <div className="h-12 border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between px-4">
                  <button 
                    onClick={handleCopy}
                    disabled={!output}
                    className="p-1.5 text-blue-500 hover:text-white disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="font-mono text-[10px] uppercase tracking-wider">{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
