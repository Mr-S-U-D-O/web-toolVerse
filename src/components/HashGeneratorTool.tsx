import React, { useState } from 'react';
import { ArrowLeft, Check, Copy, Hash } from 'lucide-react';

interface HashGeneratorToolProps {
  onBack: () => void;
}

export default function HashGeneratorTool({ onBack }: HashGeneratorToolProps) {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState({
    SHA1: '',
    SHA256: '',
    SHA384: '',
    SHA512: '',
  });

  const generateHashes = async (text: string) => {
    if (!text) {
      setHashes({ SHA1: '', SHA256: '', SHA384: '', SHA512: '' });
      return;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const algorithms = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
    const newHashes: any = {};

    for (const algo of algorithms) {
        try {
            const hashBuffer = await crypto.subtle.digest(algo, data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            newHashes[algo.replace('-', '')] = hashHex;
        } catch (e) {
            newHashes[algo.replace('-', '')] = 'Error calculating hash';
        }
    }
    setHashes(newHashes as any);
  };

  React.useEffect(() => {
    generateHashes(input);
  }, [input]);

  const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
      if (!text) return;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <button 
        onClick={handleCopy}
        disabled={!text}
        className="p-2 bg-surface hover:bg-surface-container-highest border border-outline-variant rounded-md transition-colors disabled:opacity-50 text-on-surface-variant flex-shrink-0"
        title="Copy to clipboard"
      >
        {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
      </button>
    );
  };

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
        <div className="w-full max-w-4xl flex flex-col gap-6 animate-in fade-in duration-300">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                 <Hash className="w-5 h-5 text-primary" />
              </div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight">Hash Generator</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             {/* Input Area */}
             <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col h-[600px]">
                <div className="h-12 border-b border-outline-variant bg-surface-container flex items-center px-4">
                  <span className="font-mono text-xs text-outline uppercase tracking-widest">Input Text</span>
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter text to generate hashes..."
                  className="flex-grow w-full bg-transparent p-5 outline-none font-mono text-[13px] text-on-surface resize-none placeholder:text-outline"
                  spellCheck="false"
                />
             </div>

             {/* Output Area */}
             <div className="flex flex-col gap-4">
                {['SHA1', 'SHA256', 'SHA384', 'SHA512'].map((algo) => (
                  <div key={algo} className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col">
                    <div className="h-10 border-b border-outline-variant bg-surface-container flex items-center px-4">
                      <span className="font-mono text-xs text-primary font-bold tracking-widest uppercase">{algo}</span>
                    </div>
                    <div className="p-3 bg-surface-container-lowest flex items-center gap-3">
                      <div className="flex-grow font-mono text-xs text-on-surface-variant break-all leading-tight select-all">
                        {hashes[algo as keyof typeof hashes] || <span className="text-outline">Waiting for input...</span>}
                      </div>
                      <CopyButton text={hashes[algo as keyof typeof hashes]} />
                    </div>
                  </div>
                ))}
             </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
