import React, { useState } from 'react';
import { ArrowLeft, BarChart2 } from 'lucide-react';


export default function FinStocksCalculatorTool({ onBack }: { onBack: () => void }) {
  const [shares, setShares] = useState<string>('100');
  const [buyPrice, setBuyPrice] = useState<string>('50');
  const [sellPrice, setSellPrice] = useState<string>('70');
  const [fees, setFees] = useState<string>('5');
  
  const s = parseFloat(shares) || 0;
  const buyP = parseFloat(buyPrice) || 0;
  const sellP = parseFloat(sellPrice) || 0;
  const f = parseFloat(fees) || 0;
  
  const totalCost = (s * buyP) + f;
  const totalRevenue = (s * sellP) - f;
  const profit = totalRevenue - totalCost;
  const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;

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
              <BarChart2 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-on-surface mb-4">
              Stocks Calculator
            </h1>
            <p className="text-on-surface-variant max-w-2xl">
              Calculate profit or loss from buying and selling stocks.
            </p>
          </div>

          <div className="bg-surface-container rounded-3xl p-6 md:p-8 ring-1 ring-outline-variant">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Number of Shares</label>
                <input type="number" value={shares} onChange={(e) => setShares(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-on-surface">Buy Price ($)</label>
                  <input type="number" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-2 font-mono text-sm" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-on-surface">Sell Price ($)</label>
                  <input type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-2 font-mono text-sm" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Trading Fees ($ total)</label>
                <input type="number" value={fees} onChange={(e) => setFees(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-high p-6 border border-outline rounded-xl flex flex-col items-center">
                <div className="text-sm text-on-surface-variant mb-1">Net Profit / Loss</div>
                <div className={`text-4xl font-bold font-mono ${profit >= 0 ? "text-emerald-500" : "text-error"}`}>${profit.toFixed(2)}</div>
              </div>
              <div className="bg-surface-container-high p-6 border border-outline rounded-xl flex flex-col items-center">
                <div className="text-sm text-on-surface-variant mb-1">Return on Investment (ROI)</div>
                <div className={`text-3xl font-bold font-mono ${roi >= 0 ? "text-emerald-500/80" : "text-error/80"}`}>{roi.toFixed(2)}%</div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </main>
    </div>
  );
}