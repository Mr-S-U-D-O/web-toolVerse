import React, { useState } from 'react';
import { ArrowLeft, ArrowRightLeft } from 'lucide-react';

interface WeightUnitConverterToolProps {
  onBack: () => void;
}

const units = [
  { id: 'mg', name: 'Milligrams (mg)', factor: 0.001 },
  { id: 'g', name: 'Grams (g)', factor: 1 },
  { id: 'kg', name: 'Kilograms (kg)', factor: 1000 },
  { id: 'oz', name: 'Ounces (oz)', factor: 28.3495 },
  { id: 'lb', name: 'Pounds (lb)', factor: 453.592 },
  { id: 't', name: 'Metric Tons (t)', factor: 1000000 }
];

export default function WeightUnitConverterTool({ onBack }: WeightUnitConverterToolProps) {
  const [val1, setVal1] = useState('1');
  const [unit1, setUnit1] = useState('lb');
  const [unit2, setUnit2] = useState('kg');

  const convert = (valueStr: string, fromUnit: string, toUnit: string) => {
     const value = parseFloat(valueStr);
     if (isNaN(value)) return '';
     const fromFactor = units.find(u => u.id === fromUnit)?.factor || 1;
     const toFactor = units.find(u => u.id === toUnit)?.factor || 1;
     
     // Convert to grams first, then to target unit
     const grams = value * fromFactor;
     const result = grams / toFactor;
     
     // Format slightly
     return parseFloat(result.toFixed(6)).toString();
  };

  const handleSwap = () => {
    const v1 = val1;
    setUnit1(unit2);
    setUnit2(unit1);
    setVal1(convert(v1, unit1, unit2));
  };

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">Weight Unit Converter</h1>
        <p className="text-on-surface-variant mb-6">Convert weights and masses between metric and imperial units.</p>

        <div className="bg-surface rounded-2xl border border-outline p-6 sm:p-8 shadow-sm">
           
           <div className="flex flex-col md:flex-row gap-6 relative">
              <div className="flex-1 space-y-2">
                 <label className="block text-sm font-bold">From</label>
                 <select value={unit1} onChange={e => setUnit1(e.target.value)} className="w-full bg-background border border-outline rounded-lg p-3 text-lg font-bold focus:outline-none focus:border-primary">
                    {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                 </select>
                 <input 
                    type="number"
                    value={val1}
                    onChange={e => setVal1(e.target.value)}
                    className="w-full bg-background border border-outline rounded-lg p-4 text-2xl font-mono focus:outline-none focus:border-primary"
                 />
              </div>

              <div className="hidden md:flex flex-col justify-end pb-4">
                 <button onClick={handleSwap} className="p-3 bg-surface-container-highest rounded-full hover:bg-outline-variant hover:text-primary transition-colors">
                    <ArrowRightLeft size={24} />
                 </button>
              </div>
              <div className="md:hidden flex justify-center py-2 h-10">
                 <button onClick={handleSwap} className="p-2 bg-surface-container-highest rounded-full hover:bg-outline-variant hover:text-primary transition-colors rotate-90">
                    <ArrowRightLeft size={20} />
                 </button>
              </div>

              <div className="flex-1 space-y-2">
                 <label className="block text-sm font-bold">To</label>
                 <select value={unit2} onChange={e => setUnit2(e.target.value)} className="w-full bg-background border border-outline rounded-lg p-3 text-lg font-bold focus:outline-none focus:border-primary">
                    {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                 </select>
                 <div className="w-full bg-surface-container-lowest border border-outline rounded-lg p-4 text-2xl font-mono text-primary truncate">
                    {convert(val1, unit1, unit2) || '0'}
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}
