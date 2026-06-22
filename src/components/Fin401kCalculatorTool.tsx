import React, { useState } from 'react';
import { ArrowLeft, Briefcase } from 'lucide-react';


export default function Fin401kCalculatorTool({ onBack }: { onBack: () => void }) {
  const [salary, setSalary] = useState<string>('80000');
  const [contribution, setContribution] = useState<string>('10');
  const [matchPercent, setMatchPercent] = useState<string>('50');
  const [matchLimit, setMatchLimit] = useState<string>('6');
  const [years, setYears] = useState<string>('20');
  const [rate, setRate] = useState<string>('7');
  
  const s = parseFloat(salary) || 0;
  const contribPct = (parseFloat(contribution) || 0) / 100;
  const matchP = (parseFloat(matchPercent) || 0) / 100;
  const limitP = (parseFloat(matchLimit) || 0) / 100;
  const y = parseFloat(years) || 0;
  const r = (parseFloat(rate) || 0) / 100;
  
  const employeeContrib = s * contribPct;
  const matchedPortion = Math.min(contribPct, limitP) * s;
  const employerContrib = matchedPortion * matchP;
  const annualTotal = employeeContrib + employerContrib;
  
  const futureValue = r > 0 ? annualTotal * (Math.pow(1 + r, y) - 1) / r : annualTotal * y;

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
              <Briefcase className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-on-surface mb-4">
              401k Calculator
            </h1>
            <p className="text-on-surface-variant max-w-2xl">
              Calculate 401(k) growth with employer match.
            </p>
          </div>

          <div className="bg-surface-container rounded-3xl p-6 md:p-8 ring-1 ring-outline-variant">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-on-surface">Annual Salary ($)</label>
                  <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-2 font-mono text-sm" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-on-surface">Your Contrib (%)</label>
                  <input type="number" value={contribution} onChange={(e) => setContribution(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-2 font-mono text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-on-surface">Employer Match (%)</label>
                  <input type="number" value={matchPercent} onChange={(e) => setMatchPercent(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-2 font-mono text-sm" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-on-surface">Match Limit (%)</label>
                  <input type="number" value={matchLimit} onChange={(e) => setMatchLimit(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-2 font-mono text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-on-surface">Years to Grow</label>
                  <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-2 font-mono text-sm" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-on-surface">Est. Return (%)</label>
                  <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-2 font-mono text-sm" />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-high p-6 border border-outline rounded-xl flex flex-col items-center justify-center flex-grow">
                <div className="text-sm text-on-surface-variant mb-1">Estimated 401(k) Balance</div>
                <div className="text-4xl font-bold font-mono text-emerald-500">${futureValue.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                <div className="text-xs text-on-surface-variant mt-2 border-t border-outline/50 pt-2">Annual You: ${employeeContrib} | Annual Match: ${employerContrib}</div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </main>
    </div>
  );
}