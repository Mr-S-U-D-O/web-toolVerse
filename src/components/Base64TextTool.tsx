import React, { useState } from 'react';
import { ArrowLeft, ArrowRightLeft, Copy, Check } from 'lucide-react';

interface Base64TextToolProps {
  onBack: () => void;
}

export default function Base64TextTool({ onBack }: Base64TextToolProps) {
  const [input, setInput] = useState('Hello World!');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    setError('');
    try {
      if (mode === 'encode') {
         // Use btoa safely via encodeURIComponent to handle unicode
         const encoded = btoa(unescape(encodeURIComponent(input)));
         setOutput(encoded);
      } else {
         const decoded = decodeURIComponent(escape(atob(input)));
         setOutput(decoded);
      }
    } catch (err: any) {
       setOutput('');
       setError('Invalid input. Ensure the text format is correct for ' + mode + 'ing.');
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

        <h1 className="text-3xl font-bold font-heading mb-2">Base64 Text Encoder / Decoder</h1>
        <p className="text-on-surface-variant mb-8">Quickly encode text into Base64 format or decode it back to plain text.</p>

        <div className="flex bg-surface-container-low p-1 rounded-lg w-fit mb-6 border border-outline">
           <button 
             onClick={() => { setMode('encode'); setInput(''); }}
             className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${mode==='encode' ? 'bg-primary text-on-primary shadow' : 'hover:bg-surface-container-highest'}`}
           >
             Encode
           </button>
           <button 
             onClick={() => { setMode('decode'); setInput(''); }}
             className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${mode==='decode' ? 'bg-primary text-on-primary shadow' : 'hover:bg-surface-container-highest'}`}
           >
             Decode
           </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-surface rounded-xl border border-outline flex flex-col min-h-[400px]">
             <div className="p-4 bg-background border-b border-outline font-bold">
               {mode === 'decode' ? 'Base64 Input' : 'Text Input'}
             </div>
             <textarea 
                className="flex-1 bg-transparent p-4 font-mono text-sm focus:outline-none resize-none break-all"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'decode' ? 'Paste Base64 here...' : 'Paste text to encode here...'}
             />
          </div>

          <div className="hidden md:flex justify-center items-center -mx-4 z-10 w-8">
             <div className="bg-primary text-on-primary p-2 rounded-full absolute">
               <ArrowRightLeft size={16} />
             </div>
          </div>

          <div className="bg-surface rounded-xl border border-outline flex flex-col min-h-[400px]">
             <div className="p-4 bg-background border-b border-outline flex justify-between items-center">
               <span className="font-bold">{mode === 'decode' ? 'Decoded Text' : 'Base64 Output'}</span>
               <button onClick={handleCopy} disabled={!output} className="flex items-center gap-1 text-sm bg-primary/10 text-primary px-2 py-1 rounded font-bold disabled:opacity-50">
                 {copied ? <Check size={14} /> : <Copy size={14} />} Copy
               </button>
             </div>
             {error ? (
                <div className="flex-1 bg-red-500/10 text-red-500 p-4 font-mono text-sm">{error}</div>
             ) : (
                <textarea 
                   className="flex-1 bg-transparent p-4 font-mono text-sm focus:outline-none resize-none break-all"
                   value={output}
                   readOnly
                />
             )}
          </div>
        </div>

      </div>
    </div>
  );
}
