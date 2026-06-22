import React, { useState } from 'react';
import { ArrowLeft, ArrowRightLeft, Copy, Check } from 'lucide-react';

interface HtmlEntityToolProps {
  onBack: () => void;
}

export default function HtmlEntityTool({ onBack }: HtmlEntityToolProps) {
  const [input, setInput] = useState('<h1>Hello & Welcome</h1>');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (mode === 'encode') {
      // Just basic html entities
      const encoded = input.replace(/[&<>'"]/g, 
        tag => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
        }[tag] || tag)
      );
      setOutput(encoded);
    } else {
       // decode
       const doc = new DOMParser().parseFromString(input, "text/html");
       setOutput(doc.documentElement.textContent || "");
    }
  }, [input, mode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
         <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">HTML Entity Encoder / Decoder</h1>
        <p className="text-on-surface-variant mb-8">Safely encode HTML tags into entities or decode them back into characters.</p>

        <div className="flex bg-surface-container-low p-1 rounded-lg w-fit mb-6 border border-outline">
           <button 
             onClick={() => setMode('encode')}
             className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${mode==='encode' ? 'bg-primary text-on-primary shadow' : 'hover:bg-surface-container-highest'}`}
           >
             Encode text
           </button>
           <button 
             onClick={() => setMode('decode')}
             className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${mode==='decode' ? 'bg-primary text-on-primary shadow' : 'hover:bg-surface-container-highest'}`}
           >
             Decode entities
           </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-surface rounded-xl border border-outline flex flex-col min-h-[400px]">
             <div className="p-4 bg-background border-b border-outline font-bold">
               {mode === 'decode' ? 'Encoded HTML Input' : 'Raw Text Input'}
             </div>
             <textarea 
                className="flex-1 bg-transparent p-4 font-mono text-sm focus:outline-none resize-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your text here..."
             />
          </div>

          <div className="hidden md:flex justify-center items-center -mx-4 z-10 w-8">
             <div className="bg-primary text-on-primary p-2 rounded-full absolute">
               <ArrowRightLeft size={16} />
             </div>
          </div>

          <div className="bg-surface rounded-xl border border-outline flex flex-col min-h-[400px]">
             <div className="p-4 bg-background border-b border-outline flex justify-between items-center">
               <span className="font-bold">{mode === 'decode' ? 'Decoded Text Output' : 'Encoded HTML Output'}</span>
               <button onClick={handleCopy} className="flex items-center gap-1 text-sm bg-primary/10 text-primary px-2 py-1 rounded font-bold">
                 {copied ? <Check size={14} /> : <Copy size={14} />} Copy
               </button>
             </div>
             <textarea 
                className="flex-1 bg-transparent p-4 font-mono text-sm focus:outline-none resize-none"
                value={output}
                readOnly
             />
          </div>
        </div>

      </div>
    </div>
  );
}
