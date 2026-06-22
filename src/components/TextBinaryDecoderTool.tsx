import React, { useState } from 'react';
import { ArrowLeft, Binary } from 'lucide-react';


export default function TextBinaryDecoderTool({ onBack }: { onBack: () => void }) {
  const [bin, setBin] = useState<string>('');
  const [text, setText] = useState<string>('');
  
  React.useEffect(() => {
    try {
      const cleanBin = bin.replace(/[^01]/g, '');
      let str = '';
      for (let i = 0; i < cleanBin.length; i += 8) {
        str += String.fromCharCode(parseInt(cleanBin.substr(i, 8), 2));
      }
      setText(str);
    } catch {
      setText('');
    }
  }, [bin]);

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
              <Binary className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-on-surface mb-4">
              Binary Decoder
            </h1>
            <p className="text-on-surface-variant max-w-2xl">
              Decode binary sequences back to text.
            </p>
          </div>

          <div className="bg-surface-container rounded-3xl p-6 md:p-8 ring-1 ring-outline-variant">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Input Binary</span>
                {bin && <button onClick={() => setBin('')} className="text-error text-xs hover:text-error/80">Clear</button>}
              </label>
              <textarea value={bin} onChange={(e) => setBin(e.target.value)} className="w-full h-80 bg-surface-container-highest border border-outline rounded-xl px-4 py-3 font-mono text-sm resize-y focus:ring-2 focus:ring-primary" placeholder="011000..." />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Decoded Text</span>
                {text && <button onClick={() => navigator.clipboard.writeText(text)} className="text-primary text-xs hover:text-primary/80">Copy</button>}
              </label>
              <textarea value={text} readOnly className="w-full h-80 bg-surface-container-highest border border-outline rounded-xl px-4 py-3 font-mono text-sm resize-y" placeholder="Result text..." />
            </div>
          </div>
          </div>
        </div>
      </main>
    </div>
  );
}