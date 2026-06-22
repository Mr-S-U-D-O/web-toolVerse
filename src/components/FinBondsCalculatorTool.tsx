import React, { useState } from 'react';
import { ArrowLeft, FileText } from 'lucide-react';


export default function FinBondsCalculatorTool({ onBack }: { onBack: () => void }) {
  const [faceValue, setFaceValue] = useState<string>('1000');
  const [couponRate, setCouponRate] = useState<string>('5');
  const [years, setYears] = useState<string>('10');
  const [price, setPrice] = useState<string>('950');
  
  const f = parseFloat(faceValue) || 0;
  const cRate = (parseFloat(couponRate) || 0) / 100;
  const y = parseFloat(years) || 0;
  const p = parseFloat(price) || 0;
  
  const annualCoupon = f * cRate;
  // Approximation of Yield to Maturity (YTM)
  const ytm = p > 0 && y > 0 ? ((annualCoupon + ((f - p) / y)) / ((f + p) / 2)) * 100 : 0;

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
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-on-surface mb-4">
              Bonds Calculator
            </h1>
            <p className="text-on-surface-variant max-w-2xl">
              Calculate bond yield to maturity and coupon payments.
            </p>
          </div>

          <div className="bg-surface-container rounded-3xl p-6 md:p-8 ring-1 ring-outline-variant">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Face/Par Value ($)</label>
                <input type="number" value={faceValue} onChange={(e) => setFaceValue(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Coupon Rate (%)</label>
                <input type="number" value={couponRate} onChange={(e) => setCouponRate(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Years to Maturity</label>
                <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Current Market Price ($)</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-high p-6 border border-outline rounded-xl flex flex-col items-center">
                <div className="text-sm text-on-surface-variant mb-1">Annual Coupon Payment</div>
                <div className="text-3xl font-bold font-mono text-primary">${annualCoupon.toFixed(2)}</div>
              </div>
              <div className="bg-surface-container-high p-6 border border-outline rounded-xl flex flex-col items-center">
                <div className="text-sm text-on-surface-variant mb-1">Approx. Yield to Maturity (YTM)</div>
                <div className="text-4xl font-bold font-mono text-emerald-500">{ytm.toFixed(2)}%</div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </main>
    </div>
  );
}