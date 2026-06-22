import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Calculator } from 'lucide-react';

export default function MathExponentsCalculatorTool({ onBack }: { onBack: () => void }) {
  const [base, setBase] = useState<string>('2');
  const [exponent, setExponent] = useState<string>('3');
  const [result, setResult] = useState<string | null>('8');

  const calculate = () => {
    const b = parseFloat(base);
    const e = parseFloat(exponent);
    if (isNaN(b) || isNaN(e)) {
      setResult('Invalid input');
    } else {
      setResult(Math.pow(b, e).toString());
    }
  };

  return (
        <div className="flex flex-col min-h-screen w-full bg-background text-on-surface">\n      <header className="w-full border-b border-outline-variant bg-background sticky top-0 z-50">\n        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center">\n          <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group">\n             <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />\n             <span className="font-mono text-sm tracking-widest font-medium uppercase mt-0.5">Back to Main</span>\n          </button>\n        </div>\n      </header>\n\n      <main className="flex-grow flex justify-center p-6 lg:p-12 w-full max-w-[1280px] mx-auto relative pt-12 md:pt-16">
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        <div className="flex flex-col items-center justify-center mb-12 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-sm ring-1 ring-primary/20">
            <Calculator className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-on-surface mb-4">
            Exponents Calculator
          </h1>
          <p className="text-on-surface-variant max-w-2xl">
            Calculate the result of a base number raised to a specific power.
          </p>
        </div>

        <div className="bg-surface-container rounded-3xl p-6 md:p-8 ring-1 ring-outline-variant">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface">Base Number</label>
              <input
                type="number"
                value={base}
                onChange={(e) => setBase(e.target.value)}
                className="w-full bg-surface-container-high text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                placeholder="Base"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface">Exponent (Power)</label>
              <input
                type="number"
                value={exponent}
                onChange={(e) => setExponent(e.target.value)}
                className="w-full bg-surface-container-high text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                placeholder="Exponent"
              />
            </div>
          </div>

          <button
            onClick={calculate}
            className="w-full bg-primary hover:bg-primary/90 text-on-primary font-medium rounded-xl px-6 py-3 transition-colors mb-6"
          >
            Calculate
          </button>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-on-surface">Result</label>
            <div className="w-full bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-4 min-h-[60px] font-mono whitespace-pre-wrap break-all flex items-center">
              {result ? result : <span className="text-outline">Result</span>}
            </div>
          </div>
        </div>
      </div>
          </main>
    </div>
  );
}
