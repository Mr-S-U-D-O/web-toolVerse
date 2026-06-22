import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface PercentageCalculatorToolProps {
  onBack: () => void;
}

export default function PercentageCalculatorTool({ onBack }: PercentageCalculatorToolProps) {
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');
  
  const [val3, setVal3] = useState('');
  const [val4, setVal4] = useState('');
  
  const [val5, setVal5] = useState('');
  const [val6, setVal6] = useState('');

  const calc1 = () => {
    const p = parseFloat(val1);
    const v = parseFloat(val2);
    if (!isNaN(p) && !isNaN(v)) return (p / 100) * v;
    return '---';
  };

  const calc2 = () => {
    const a = parseFloat(val3);
    const b = parseFloat(val4);
    if (!isNaN(a) && !isNaN(b) && b !== 0) return ((a / b) * 100).toFixed(2) + '%';
    return '---';
  };
  
  const calc3 = () => {
    const a = parseFloat(val5);
    const b = parseFloat(val6);
    if (!isNaN(a) && !isNaN(b) && a !== 0) {
       const change = ((b - a) / Math.abs(a)) * 100;
       return change > 0 ? `+${change.toFixed(2)}% (Increase)` : `${change.toFixed(2)}% (Decrease)`;
    }
    return '---';
  };

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">Percentage Calculator</h1>
        <p className="text-on-surface-variant mb-8">Calculate percentages, ratios, and percentage changes easily.</p>

        <div className="space-y-6">
           {/* What is X% of Y */}
           <div className="bg-surface rounded-xl p-6 border border-outline shadow-sm flex flex-col md:flex-row items-center gap-4">
              <span className="font-bold whitespace-nowrap">What is</span>
              <input type="number" value={val1} onChange={e => setVal1(e.target.value)} className="w-[100px] bg-background border border-outline rounded p-2 text-center focus:outline-none focus:border-primary" />
              <span className="font-bold whitespace-nowrap">% of</span>
              <input type="number" value={val2} onChange={e => setVal2(e.target.value)} className="w-[120px] bg-background border border-outline rounded p-2 text-center focus:outline-none focus:border-primary" />
              <span className="font-bold text-xl ml-auto text-primary">{calc1()}</span>
           </div>

           {/* X is what % of Y */}
           <div className="bg-surface rounded-xl p-6 border border-outline shadow-sm flex flex-col md:flex-row items-center gap-4">
              <input type="number" value={val3} onChange={e => setVal3(e.target.value)} className="w-[120px] bg-background border border-outline rounded p-2 text-center focus:outline-none focus:border-primary" />
              <span className="font-bold whitespace-nowrap">is what % of</span>
              <input type="number" value={val4} onChange={e => setVal4(e.target.value)} className="w-[120px] bg-background border border-outline rounded p-2 text-center focus:outline-none focus:border-primary" />
              <span className="font-bold text-xl ml-auto text-primary">{calc2()}</span>
           </div>

           {/* Percentage change from X to Y */}
           <div className="bg-surface rounded-xl p-6 border border-outline shadow-sm flex flex-col md:flex-row items-center gap-4">
              <span className="font-bold whitespace-nowrap">Change from</span>
              <input type="number" value={val5} onChange={e => setVal5(e.target.value)} className="w-[120px] bg-background border border-outline rounded p-2 text-center focus:outline-none focus:border-primary" />
              <span className="font-bold whitespace-nowrap">to</span>
              <input type="number" value={val6} onChange={e => setVal6(e.target.value)} className="w-[120px] bg-background border border-outline rounded p-2 text-center focus:outline-none focus:border-primary" />
              <span className="font-bold text-xl ml-auto text-primary">{calc3()}</span>
           </div>
        </div>

      </div>
    </div>
  );
}
