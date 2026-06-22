import React, { useState } from 'react';
import { ArrowLeft, Sigma } from 'lucide-react';

export default function MathLogarithmsCalculatorTool({ onBack }: { onBack: () => void }) {
  const [base, setBase] = useState<string>('10');
  const [value, setValue] = useState<string>('100');

  const b = parseFloat(base);
  const v = parseFloat(value);
  
  let result = '0.00';
  let error = '';

  if (isNaN(b) || isNaN(v)) {
    result = '-';
  } else if (b <= 0 || b === 1) {
    error = 'Base must be greater than 0 and not equal to 1';
  } else if (v <= 0) {
    error = 'Value must be greater than 0';
  } else {
    result = (Math.log(v) / Math.log(b)).toString();
  }

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
              <Sigma className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-on-surface mb-4">
              Logarithms Calculator
            </h1>
            <p className="text-on-surface-variant max-w-2xl">
              Calculate the logarithm of a number with a given base.
            </p>
          </div>

          <div className="bg-surface-container rounded-3xl p-6 md:p-8 ring-1 ring-outline-variant">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Log Base</label>
                <input
                  type="number"
                  value={base}
                  onChange={(e) => setBase(e.target.value)}
                  className="w-full bg-surface-container-high text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  placeholder="10"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Value (x)</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full bg-surface-container-high text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  placeholder="100"
                />
              </div>
            </div>

            {error ? (
              <div className="w-full bg-error/10 text-error font-mono text-sm p-4 rounded-xl border border-error/50">
                {error}
              </div>
            ) : (
              <div className="w-full bg-surface-container-high p-6 rounded-xl border border-outline text-center flex flex-col items-center">
                <div className="text-sm text-on-surface-variant mb-2">Result ( y = log_base(x) )</div>
                <div className="text-4xl font-bold text-on-surface font-mono break-all max-w-full">
                  {result}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
