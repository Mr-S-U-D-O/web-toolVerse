import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface TipCalculatorToolProps {
  onBack: () => void;
}

export default function TipCalculatorTool({ onBack }: TipCalculatorToolProps) {
  const [billAmount, setBillAmount] = useState('50');
  const [tipPercentage, setTipPercentage] = useState<number>(15);
  const [numPeople, setNumPeople] = useState<number>(1);

  const bill = parseFloat(billAmount) || 0;
  const tipAmount = bill * (tipPercentage / 100);
  const totalAmount = bill + tipAmount;
  
  const tipPerPerson = numPeople > 0 ? tipAmount / numPeople : 0;
  const totalPerPerson = numPeople > 0 ? totalAmount / numPeople : 0;

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">Tip & Split Calculator</h1>
        <p className="text-on-surface-variant mb-6">Calculate tip amounts and split the bill among friends.</p>

        <div className="bg-surface rounded-2xl border border-outline p-6 sm:p-8 shadow-sm">
           <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-bold mb-2">Bill Amount ($)</label>
                 <input 
                   type="number" 
                   min="0"
                   value={billAmount} 
                   onChange={(e) => setBillAmount(e.target.value)} 
                   className="w-full bg-background border border-outline rounded-xl p-4 text-xl focus:outline-none focus:border-primary"
                   placeholder="0.00"
                 />
              </div>

              <div>
                <label className="block text-sm font-bold mb-4">Tip Percentage ({tipPercentage}%)</label>
                <div className="flex gap-2 sm:gap-4 mb-4">
                   {[10, 15, 18, 20, 25].map(pct => (
                     <button 
                       key={pct}
                       onClick={() => setTipPercentage(pct)}
                       className={`flex-1 py-3 rounded-lg font-bold border transition-colors ${tipPercentage === pct ? 'bg-primary text-on-primary border-primary' : 'bg-background border-outline hover:border-primary'}`}
                     >
                       {pct}%
                     </button>
                   ))}
                </div>
                <input 
                  type="range" 
                  min="0" max="50" step="1" 
                  value={tipPercentage} 
                  onChange={(e) => setTipPercentage(Number(e.target.value))}
                  className="w-full accent-primary" 
                />
              </div>

              <div>
                 <label className="block text-sm font-bold mb-2">Number of People</label>
                 <div className="flex items-center gap-4">
                    <button onClick={() => setNumPeople(Math.max(1, numPeople - 1))} className="w-12 h-12 flex justify-center items-center rounded-xl bg-surface-container-highest font-bold text-xl hover:bg-outline-variant">-</button>
                    <span className="text-2xl font-bold w-12 text-center">{numPeople}</span>
                    <button onClick={() => setNumPeople(numPeople + 1)} className="w-12 h-12 flex justify-center items-center rounded-xl bg-surface-container-highest font-bold text-xl hover:bg-outline-variant">+</button>
                 </div>
              </div>
           </div>

           <div className="bg-primary text-on-primary rounded-xl p-6 shadow-md border border-primary/20">
              <div className="flex justify-between items-center mb-4">
                 <div>
                    <div className="font-bold">Tip Amount</div>
                    <div className="text-sm opacity-80">/ person</div>
                 </div>
                 <div className="text-3xl font-bold">${tipPerPerson.toFixed(2)}</div>
              </div>
              <div className="flex justify-between items-center">
                 <div>
                    <div className="font-bold">Total</div>
                    <div className="text-sm opacity-80">/ person</div>
                 </div>
                 <div className="text-4xl font-bold">${totalPerPerson.toFixed(2)}</div>
              </div>
              
              {numPeople > 1 && (
                 <div className="mt-6 pt-6 border-t border-on-primary/20 flex justify-between items-center opacity-90">
                    <span className="font-medium">Total Bill + Tip:</span>
                    <span className="font-bold text-xl">${totalAmount.toFixed(2)}</span>
                 </div>
              )}
           </div>

        </div>
      </div>
    </div>
  );
}
