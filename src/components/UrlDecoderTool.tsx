import React, { useState } from 'react';
import { ArrowLeft, ArrowRightLeft } from 'lucide-react';

interface UrlDecoderToolProps {
  onBack: () => void;
}

export default function UrlDecoderTool({ onBack }: UrlDecoderToolProps) {
  const [input, setInput] = useState('https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world%26param%3D1');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'decode' | 'encode'>('decode');

  React.useEffect(() => {
    try {
      if (mode === 'decode') {
        setOutput(decodeURIComponent(input));
      } else {
        setOutput(encodeURIComponent(input));
      }
      setError('');
    } catch (e: any) {
      setOutput('');
      setError('Invalid input for selected operation.');
    }
  }, [input, mode]);

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
         <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">URL Encoder / Decoder</h1>
        <p className="text-on-surface-variant mb-8">Safely encode or decode URL components.</p>

        <div className="flex bg-surface-container-low p-1 rounded-lg w-fit mb-6 border border-outline">
           <button 
             onClick={() => setMode('decode')}
             className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${mode==='decode' ? 'bg-primary text-on-primary shadow' : 'hover:bg-surface-container-highest'}`}
           >
             Decode URL
           </button>
           <button 
             onClick={() => setMode('encode')}
             className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${mode==='encode' ? 'bg-primary text-on-primary shadow' : 'hover:bg-surface-container-highest'}`}
           >
             Encode URL
           </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-surface rounded-xl border border-outline flex flex-col min-h-[400px]">
             <div className="p-4 bg-background border-b border-outline font-bold">
               {mode === 'decode' ? 'Encoded Input' : 'Raw Input'}
             </div>
             <textarea 
                className="flex-1 bg-transparent p-4 font-mono text-sm focus:outline-none resize-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste URL text here..."
             />
          </div>

          <div className="hidden md:flex justify-center items-center -mx-4 z-10 w-8">
             <div className="bg-primary text-on-primary p-2 rounded-full absolute">
               <ArrowRightLeft size={16} />
             </div>
          </div>

          <div className="bg-surface rounded-xl border border-outline flex flex-col min-h-[400px]">
             <div className="p-4 bg-background border-b border-outline font-bold">
               {mode === 'decode' ? 'Decoded Output' : 'Encoded Output'}
             </div>
             {error ? (
                <div className="flex-1 p-4 bg-red-500/10 text-red-500 font-mono text-sm break-all">
                  {error}
                </div>
             ) : (
               <textarea 
                  className="flex-1 bg-transparent p-4 font-mono text-sm focus:outline-none resize-none"
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
