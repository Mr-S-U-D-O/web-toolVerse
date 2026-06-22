import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface DiscountCalculatorToolProps {
  onBack: () => void;
}

export default function DiscountCalculatorTool({ onBack }: DiscountCalculatorToolProps) {
  const [originalPrice, setOriginalPrice] = useState('100');
  const [discountPercent, setDiscountPercent] = useState('20');
  const [taxPercent, setTaxPercent] = useState('0');

  const price = parseFloat(originalPrice) || 0;
  const discount = parseFloat(discountPercent) || 0;
  const tax = parseFloat(taxPercent) || 0;

  const discountAmount = price * (discount / 100);
  const priceAfterDiscount = price - discountAmount;
  const taxAmount = priceAfterDiscount * (tax / 100);
  const finalPrice = priceAfterDiscount + taxAmount;

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">Discount Calculator</h1>
        <p className="text-on-surface-variant mb-6">Calculate the final price after applying a discount and optional tax.</p>

        <div className="bg-surface rounded-2xl border border-outline p-6 sm:p-8 shadow-sm">
           <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-bold mb-2">Original Price</label>
                 <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">$</span>
                   <input 
                     type="number" 
                     min="0"
                     value={originalPrice} 
                     onChange={(e) => setOriginalPrice(e.target.value)} 
                     className="w-full bg-background border border-outline rounded-xl p-4 pl-10 text-lg focus:outline-none focus:border-primary"
                     placeholder="100.00"
                   />
                 </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Discount Percentage</label>
                 <div className="relative">
                   <input 
                     type="number" 
                     min="0"
                     max="100"
                     value={discountPercent} 
                     onChange={(e) => setDiscountPercent(e.target.value)} 
                     className="w-full bg-background border border-outline rounded-xl p-4 pr-10 text-lg focus:outline-none focus:border-primary"
                     placeholder="20"
                   />
                   <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">%</span>
                 </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Sales Tax (Optional)</label>
                 <div className="relative">
                   <input 
                     type="number" 
                     min="0"
                     max="100"
                     value={taxPercent} 
                     onChange={(e) => setTaxPercent(e.target.value)} 
                     className="w-full bg-background border border-outline rounded-xl p-4 pr-10 text-lg focus:outline-none focus:border-primary"
                     placeholder="0"
                   />
                   <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">%</span>
                 </div>
              </div>
           </div>

           <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl p-6 shadow-md border border-emerald-500/20 space-y-4">
              <div className="flex justify-between items-center text-sm font-bold opacity-80">
                 <span>Original Price</span>
                 <span>${price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold opacity-80">
                 <span>Discount Amount</span>
                 <span>-${discountAmount.toFixed(2)}</span>
              </div>
              {tax > 0 && (
                 <div className="flex justify-between items-center text-sm font-bold opacity-80">
                    <span>Tax Amount</span>
                    <span>+${taxAmount.toFixed(2)}</span>
                 </div>
              )}
              <div className="border-t border-emerald-500/20 my-2 pt-4 flex justify-between items-center">
                 <span className="font-bold text-lg">Final Price</span>
                 <span className="text-4xl font-black">${finalPrice.toFixed(2)}</span>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}
