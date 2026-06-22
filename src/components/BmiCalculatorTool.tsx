import React, { useState } from 'react';
import { ArrowLeft, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BmiCalculatorTool() {
  const navigate = useNavigate();
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [weightLbs, setWeightLbs] = useState('');

  const calculateBmi = () => {
    if (unit === 'metric') {
      const h = parseFloat(heightCm) / 100;
      const w = parseFloat(weightKg);
      if (h > 0 && w > 0) return w / (h * h);
    } else {
      const hStr = (parseFloat(heightFt || '0') * 12) + parseFloat(heightIn || '0');
      const wStr = parseFloat(weightLbs);
      if (hStr > 0 && wStr > 0) return (wStr / (hStr * hStr)) * 703;
    }
    return null;
  };

  const bmi = calculateBmi();

  const getBmiCategory = (b: number) => {
    if (b < 18.5) return { text: 'Underweight', color: 'text-blue-400' };
    if (b < 25) return { text: 'Normal weight', color: 'text-emerald-500' };
    if (b < 30) return { text: 'Overweight', color: 'text-yellow-500' };
    return { text: 'Obese', color: 'text-error' };
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-on-surface">
      <header className="w-full border-b border-outline-variant bg-background sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group">
             <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
             <span className="font-mono text-sm tracking-widest font-medium uppercase mt-0.5">Back to Main</span>
          </button>
        </div>
      </header>

      <main className="flex-grow flex justify-center p-6 lg:p-12 w-full max-w-[1280px] mx-auto relative pt-12 md:pt-16">
        <div className="w-full max-w-md flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary" />
              </div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight">BMI Calculator</h1>
            </div>
          </div>

          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-6">
             <div className="flex bg-surface-container p-1 rounded-lg">
                <button 
                  onClick={() => setUnit('metric')}
                  className={`flex-1 py-1.5 text-sm rounded-md font-mono uppercase tracking-widest transition-colors ${unit === 'metric' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  Metric
                </button>
                <button 
                  onClick={() => setUnit('imperial')}
                  className={`flex-1 py-1.5 text-sm rounded-md font-mono uppercase tracking-widest transition-colors ${unit === 'imperial' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  Imperial
                </button>
             </div>

             {unit === 'metric' ? (
                <>
                  <div>
                    <label className="block font-mono text-xs text-outline uppercase tracking-widest mb-2">Height (cm)</label>
                    <input type="number" value={heightCm} onChange={e => setHeightCm(e.target.value)} className="w-full bg-surface border border-outline-variant rounded p-3" placeholder="175" />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-outline uppercase tracking-widest mb-2">Weight (kg)</label>
                    <input type="number" value={weightKg} onChange={e => setWeightKg(e.target.value)} className="w-full bg-surface border border-outline-variant rounded p-3" placeholder="70" />
                  </div>
                </>
             ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs text-outline uppercase tracking-widest mb-2">Height (ft)</label>
                      <input type="number" value={heightFt} onChange={e => setHeightFt(e.target.value)} className="w-full bg-surface border border-outline-variant rounded p-3" placeholder="5" />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-outline uppercase tracking-widest mb-2">Height (in)</label>
                      <input type="number" value={heightIn} onChange={e => setHeightIn(e.target.value)} className="w-full bg-surface border border-outline-variant rounded p-3" placeholder="9" />
                    </div>
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-outline uppercase tracking-widest mb-2">Weight (lbs)</label>
                    <input type="number" value={weightLbs} onChange={e => setWeightLbs(e.target.value)} className="w-full bg-surface border border-outline-variant rounded p-3" placeholder="150" />
                  </div>
                </>
             )}

             <div className="mt-4 pt-6 border-t border-outline-variant flex flex-col items-center justify-center gap-2">
                <span className="font-mono text-xs text-outline uppercase tracking-widest">Your BMI Is</span>
                <span className="font-heading text-5xl font-bold text-primary">
                   {bmi !== null ? bmi.toFixed(1) : '-'}
                </span>
                {bmi !== null && (
                   <span className={`font-mono mt-2 uppercase tracking-widest font-bold ${getBmiCategory(bmi).color}`}>
                     {getBmiCategory(bmi).text}
                   </span>
                )}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
