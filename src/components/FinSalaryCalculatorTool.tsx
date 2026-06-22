import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { DollarSign } from 'lucide-react';

export default function FinSalaryCalculatorTool({ onBack }: { onBack: () => void }) {
  const [hourlyRate, setHourlyRate] = useState<string>('25');
  const [hoursPerWeek, setHoursPerWeek] = useState<string>('40');
  
  const [yearly, setYearly] = useState<string>('0');
  const [monthly, setMonthly] = useState<string>('0');
  const [weekly, setWeekly] = useState<string>('0');
  const [daily, setDaily] = useState<string>('0');

  useEffect(() => {
    const rate = parseFloat(hourlyRate);
    const hours = parseFloat(hoursPerWeek);
    if (!isNaN(rate) && !isNaN(hours)) {
      const yearlyVal = rate * hours * 52;
      setYearly(yearlyVal.toFixed(2));
      setMonthly((yearlyVal / 12).toFixed(2));
      setWeekly((yearlyVal / 52).toFixed(2));
      setDaily((rate * hours / 5).toFixed(2)); // assuming 5 days a week
    } else {
      setYearly('0');
      setMonthly('0');
      setWeekly('0');
      setDaily('0');
    }
  }, [hourlyRate, hoursPerWeek]);

  return (
        <div className="flex flex-col min-h-screen w-full bg-background text-on-surface">\n      <header className="w-full border-b border-outline-variant bg-background sticky top-0 z-50">\n        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center">\n          <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group">\n             <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />\n             <span className="font-mono text-sm tracking-widest font-medium uppercase mt-0.5">Back to Main</span>\n          </button>\n        </div>\n      </header>\n\n      <main className="flex-grow flex justify-center p-6 lg:p-12 w-full max-w-[1280px] mx-auto relative pt-12 md:pt-16">
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        <div className="flex flex-col items-center justify-center mb-12 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-sm ring-1 ring-primary/20">
            <DollarSign className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-on-surface mb-4">
            Salary Calculator
          </h1>
          <p className="text-on-surface-variant max-w-2xl">
            Convert your hourly rate to daily, weekly, monthly and yearly salary.
          </p>
        </div>

        <div className="bg-surface-container rounded-3xl p-6 md:p-8 ring-1 ring-outline-variant">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface">Hourly Rate ($)</label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full bg-surface-container-high text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                placeholder="25"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface">Hours per Week</label>
              <input
                type="number"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(e.target.value)}
                className="w-full bg-surface-container-high text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                placeholder="40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface-container-high p-4 rounded-xl border border-outline">
              <div className="text-sm text-on-surface-variant mb-1">Yearly Salary</div>
              <div className="text-2xl font-bold text-on-surface font-mono">${yearly}</div>
            </div>
            <div className="bg-surface-container-high p-4 rounded-xl border border-outline">
              <div className="text-sm text-on-surface-variant mb-1">Monthly Salary</div>
              <div className="text-2xl font-bold text-on-surface font-mono">${monthly}</div>
            </div>
            <div className="bg-surface-container-high p-4 rounded-xl border border-outline">
              <div className="text-sm text-on-surface-variant mb-1">Weekly Salary</div>
              <div className="text-2xl font-bold text-on-surface font-mono">${weekly}</div>
            </div>
            <div className="bg-surface-container-high p-4 rounded-xl border border-outline">
              <div className="text-sm text-on-surface-variant mb-1">Daily Salary</div>
              <div className="text-2xl font-bold text-on-surface font-mono">${daily}</div>
            </div>
          </div>
        </div>
      </div>
          </main>
    </div>
  );
}
