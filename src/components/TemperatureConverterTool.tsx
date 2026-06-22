import React, { useState } from 'react';
import { ArrowLeft, ArrowRightLeft } from 'lucide-react';

interface TemperatureConverterToolProps {
  onBack: () => void;
}

const units = [
  { id: 'c', name: 'Celsius (°C)' },
  { id: 'f', name: 'Fahrenheit (°F)' },
  { id: 'k', name: 'Kelvin (K)' }
];

export default function TemperatureConverterTool({ onBack }: TemperatureConverterToolProps) {
  const [val1, setVal1] = useState('0');
  const [unit1, setUnit1] = useState('c');
  const [unit2, setUnit2] = useState('f');

  const convert = (valueStr: string, fromUnit: string, toUnit: string) => {
     const value = parseFloat(valueStr);
     if (isNaN(value)) return '';
     
     // First convert to Celsius
     let c = value;
     if (fromUnit === 'f') c = (value - 32) * 5/9;
     if (fromUnit === 'k') c = value - 273.15;
     
     // Then convert C to target
     let result = c;
     if (toUnit === 'f') result = (c * 9/5) + 32;
     if (toUnit === 'k') result = c + 273.15;
     
     return parseFloat(result.toFixed(4)).toString();
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

        <h1 className="text-3xl font-bold font-heading mb-2">Temperature Converter</h1>
        <p className="text-on-surface-variant mb-6">Convert temperatures between Celsius, Fahrenheit, and Kelvin.</p>

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
