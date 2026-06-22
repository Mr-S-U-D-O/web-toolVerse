import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRightLeft, Copy, Check, FileType, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function encodeBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binString = '';
  for (let i = 0; i < bytes.length; i++) {
    binString += String.fromCharCode(bytes[i]);
  }
  return btoa(binString);
}

function decodeBase64(b64: string): string {
  const binString = atob(b64);
  const bytes = new Uint8Array(binString.length);
  for (let i = 0; i < binString.length; i++) {
    bytes[i] = binString.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export default function Base64ConverterTool() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!input) {
      setOutput('');
      setError(null);
      return;
    }
    
    try {
      if (mode === 'encode') {
        setOutput(encodeBase64(input));
        setError(null);
      } else {
        setOutput(decodeBase64(input));
        setError(null);
      }
    } catch (e: any) {
      setOutput('');
      setError(mode === 'encode' ? 'Failed to encode text.' : 'Invalid Base64 sequence.');
    }
  }, [input, mode]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const toggleMode = () => {
    setMode(m => m === 'encode' ? 'decode' : 'encode');
    setInput(output); // swap input with valid output
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-on-surface">
      <header className="w-full border-b border-outline-variant bg-background sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group">
             <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
             <span className="font-mono text-sm tracking-widest font-medium uppercase mt-0.5">Back to Main</span>
          </button>
        </div>
      </header>

      <main className="flex-grow flex justify-center w-full max-w-[1280px] mx-auto p-6 lg:p-12 relative pt-12 md:pt-16">
        <div className="w-full max-w-5xl flex flex-col gap-8 animate-in fade-in duration-300">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                 <FileType className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="font-heading text-3xl font-semibold tracking-tight">Base64 Converter</h1>
                <p className="text-on-surface-variant mt-1 text-sm">Securely encode or decode Base64 strings with full UTF-8 support.</p>
              </div>
            </div>
            
            <button 
              onClick={toggleMode}
              className="flex items-center justify-center gap-2 bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant px-5 py-2.5 rounded-lg font-mono text-xs uppercase tracking-wider transition-colors shadow-sm whitespace-nowrap"
            >
              <ArrowRightLeft className="w-4 h-4" />
              {mode === 'encode' ? 'Switch to Decode' : 'Switch to Encode'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[450px]">
             {/* Input Container */}
             <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col h-[400px] md:h-auto">
                <div className="h-14 border-b border-outline-variant bg-surface-container/50 flex items-center px-5">
                  <span className="font-mono text-xs text-outline font-semibold uppercase tracking-widest">
                    {mode === 'encode' ? 'Raw Text Input' : 'Base64 Input'}
                  </span>
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={mode === 'encode' ? 'Type or paste text to encode...' : 'Paste Base64 encoded string here...'}
                  className="flex-grow w-full bg-transparent p-5 outline-none font-mono text-sm leading-relaxed text-on-surface resize-none placeholder:text-outline-variant"
                />
                <div className="h-12 border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between px-5">
                  <button 
                    onClick={clear} 
                    disabled={!input}
                    className="p-1.5 text-on-surface-variant hover:text-error disabled:opacity-30 disabled:hover:text-on-surface-variant transition-colors flex items-center gap-2 group"
                  >
                    <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">Clear</span>
                  </button>
                  <span className="font-mono text-[10px] text-outline font-semibold uppercase tracking-wider">
                    {input.length} bytes
                  </span>
                </div>
             </div>

             {/* Output Container */}
             <div className={`border rounded-xl overflow-hidden shadow-sm flex flex-col h-[400px] md:h-auto transition-colors duration-300 ${error ? 'bg-error-container/10 border-error-container/50' : 'bg-surface-container-low border-outline-variant'}`}>
                <div className="h-14 border-b border-outline-variant bg-surface-container/50 flex items-center px-5">
                  <span className="font-mono text-xs text-outline font-semibold uppercase tracking-widest">
                    {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
                  </span>
                </div>
                
                {error ? (
                   <div className="flex-grow flex items-center justify-center p-5 text-center">
                     <p className="font-mono text-sm text-error">{error}</p>
                   </div>
                ) : (
                  <textarea
                    value={output}
                    readOnly
                    placeholder="Result will appear here..."
                    className="flex-grow w-full bg-transparent p-5 outline-none font-mono text-sm leading-relaxed text-primary resize-none placeholder:text-outline-variant"
                  />
                )}

                <div className="h-12 border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between px-5">
                  <button 
                    onClick={handleCopy}
                    disabled={!output || !!error}
                    className="p-1.5 text-primary hover:text-primary-hover disabled:opacity-30 disabled:hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                    <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">
                      {copied ? 'Copied to Clipboard' : 'Copy Result'}
                    </span>
                  </button>
                  <span className="font-mono text-[10px] text-outline font-semibold uppercase tracking-wider">
                    {output.length} bytes
                  </span>
                </div>
             </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
