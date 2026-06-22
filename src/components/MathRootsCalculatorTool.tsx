import React, { useState } from 'react';
import { ArrowLeft, SquareRadical } from 'lucide-react';

export default function MathRootsCalculatorTool({ onBack }: { onBack: () => void }) {
  const [root, setRoot] = useState<string>('2');
  const [value, setValue] = useState<string>('16');

  const r = parseFloat(root);
  const v = parseFloat(value);
  
  let result = '0.00';
  let error = '';

  if (isNaN(r) || isNaN(v)) {
    result = '-';
  } else if (r === 0) {
    error = 'Root degree cannot be zero';
  } else if (v < 0 && r % 2 === 0) {
    error = 'Cannot calculate even root of a negative number';
  } else {
    // For odd roots of negative numbers
    if (v < 0) {
      result = (-Math.pow(Math.abs(v), 1 / r)).toString();
    } else {
      result = Math.pow(v, 1 / r).toString();
    }
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
              <SquareRadical className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-on-surface mb-4">
              Roots Calculator
            </h1>
            <p className="text-on-surface-variant max-w-2xl">
              Calculate square roots, cube roots, or any custom root.
            </p>
          </div>

          <div className="bg-surface-container rounded-3xl p-6 md:p-8 ring-1 ring-outline-variant">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Root Degree (n)</label>
                <input
                  type="number"
                  value={root}
                  onChange={(e) => setRoot(e.target.value)}
                  className="w-full bg-surface-container-high text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  placeholder="2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Value (x)</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full bg-surface-container-high text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  placeholder="16"
                />
              </div>
            </div>

            {error ? (
              <div className="w-full bg-error/10 text-error font-mono text-sm p-4 rounded-xl border border-error/50">
                {error}
              </div>
            ) : (
              <div className="w-full bg-surface-container-high p-6 rounded-xl border border-outline text-center flex flex-col items-center">
                <div className="text-sm text-on-surface-variant mb-2">n-th Root Result</div>
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
