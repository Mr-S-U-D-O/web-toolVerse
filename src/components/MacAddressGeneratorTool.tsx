import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Copy, Check } from 'lucide-react';

interface MacAddressGeneratorToolProps {
  onBack: () => void;
}

export default function MacAddressGeneratorTool({ onBack }: MacAddressGeneratorToolProps) {
  const [count, setCount] = useState(5);
  const [format, setFormat] = useState<'colon' | 'hyphen' | 'none'>('colon');
  const [uppercase, setUppercase] = useState(true);
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generateMacs = () => {
    const newMacs: string[] = [];
    for (let i = 0; i < count; i++) {
       let mac = '';
       for(let j=0; j<6; j++){
         mac += Math.floor(Math.random()*256).toString(16).padStart(2, '0');
       }
       
       if (uppercase) mac = mac.toUpperCase();

       if (format === 'colon') {
          mac = mac.match(/.{1,2}/g)?.join(':') || mac;
       } else if (format === 'hyphen') {
          mac = mac.match(/.{1,2}/g)?.join('-') || mac;
       }

       newMacs.push(mac);
    }
    setResults(newMacs);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(results.join('\\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">MAC Address Generator</h1>
        <p className="text-on-surface-variant mb-8">Generate random, valid MAC addresses for testing.</p>

        <div className="grid md:grid-cols-[1fr_2fr] gap-6">
           <div className="bg-surface rounded-xl border border-outline p-6 h-fit space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">Count</label>
                <input 
                  type="number" 
                  min={1} 
                  max={500}
                  value={count} 
                  onChange={(e) => setCount(Number(e.target.value))} 
                  className="w-full bg-background border border-outline rounded-lg p-3 focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Format</label>
                <div className="flex flex-col gap-2">
                   <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" value="colon" checked={format==='colon'} onChange={() => setFormat('colon')} className="accent-primary w-4 h-4"/> 
                      <span className="text-sm">Colon (00:1A:2B...)</span>
                   </label>
                   <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" value="hyphen" checked={format==='hyphen'} onChange={() => setFormat('hyphen')} className="accent-primary w-4 h-4"/> 
                      <span className="text-sm">Hyphen (00-1A-2B...)</span>
                   </label>
                   <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" value="none" checked={format==='none'} onChange={() => setFormat('none')} className="accent-primary w-4 h-4"/> 
                      <span className="text-sm">None (001A2B...)</span>
                   </label>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                   <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} className="accent-primary w-4 h-4"/>
                   <span className="text-sm font-bold">Uppercase Mode</span>
                </label>
              </div>

              <button onClick={generateMacs} className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-on-primary font-bold rounded-lg hover:bg-surface-tint transition-colors">
                 <RefreshCw size={18} /> Generate
              </button>
           </div>

           <div className="bg-surface rounded-xl border border-outline flex flex-col min-h-[400px]">
              <div className="bg-background border-b border-outline p-4 flex justify-between items-center">
                 <span className="font-bold">Generated Addresses</span>
                 <button onClick={handleCopy} disabled={results.length===0} className="flex justify-center items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary font-bold rounded hover:bg-primary/20 disabled:opacity-50 transition-colors">
                    {copied ? <Check size={16}/> : <Copy size={16} />} Copy
                 </button>
              </div>
              <div className="flex-1 p-4 font-mono overflow-y-auto leading-relaxed text-sm">
                 {results.length === 0 ? (
                    <div className="text-on-surface-variant italic text-center mt-12">Click Generate to see MAC addresses.</div>
                 ) : (
                    results.map((r, i) => <div key={i}>{r}</div>)
                 )}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
