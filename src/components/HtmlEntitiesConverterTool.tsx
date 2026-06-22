import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRightLeft, Copy, Check, Code, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function decodeHtmlEntities(html: string): string {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.documentElement.textContent || "";
}

function encodeHtmlEntities(text: string): string {
    // Encodes standard HTML characters and high-plane Unicode safely to &#...;
    return String(text).replace(/[&<>"'\u00A0-\u9999]/g, function(i) {
        return '&#'+i.charCodeAt(0)+';';
    });
}

export default function HtmlEntitiesConverterTool() {
  const navigate = useNavigate();
  const [input, setInput] = useState('<div class="example">& Hello "World" ©</div>');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!input.trim()) {
        setOutput('');
        return;
    }
    try {
        if (mode === 'encode') {
           setOutput(encodeHtmlEntities(input));
        } else {
           setOutput(decodeHtmlEntities(input));
        }
    } catch (err) {
        setOutput('');
    }
  }, [input, mode]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleMode = () => {
    setMode(prev => prev === 'encode' ? 'decode' : 'encode');
    setInput(output); // Swap logic smartly
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
                 <Code className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="font-heading text-3xl font-semibold tracking-tight">HTML Entities Converter</h1>
                <p className="text-on-surface-variant mt-1 text-sm">Bidirectionally encode or decode special characters to HTML entities safely.</p>
              </div>
            </div>
            
            <div className="bg-surface-container-low border border-outline-variant p-1 rounded-lg flex items-center shadow-sm">
                <button
                   onClick={() => setMode('encode')}
                   className={`px-4 py-2 rounded-md text-xs font-mono tracking-wider uppercase font-semibold transition-colors ${mode === 'encode' ? 'bg-primary text-on-primary' : 'hover:bg-surface-container-high'}`}
                >
                   Encode
                </button>
                <button
                   onClick={() => setMode('decode')}
                   className={`px-4 py-2 rounded-md text-xs font-mono tracking-wider uppercase font-semibold transition-colors ${mode === 'decode' ? 'bg-primary text-on-primary' : 'hover:bg-surface-container-high'}`}
                >
                   Decode
                </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px]">
             {/* Input Area */}
             <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col h-[400px]">
                <div className="h-14 border-b border-outline-variant bg-surface-container/50 flex items-center justify-between px-5">
                  <span className="font-mono text-xs text-outline font-semibold uppercase tracking-widest">
                     {mode === 'encode' ? 'Raw Text Input' : 'HTML Entities Input'}
                  </span>
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={mode === 'encode' ? "Paste raw text here..." : "Paste encoded HTML here..."}
                  className="flex-grow w-full bg-transparent p-5 outline-none font-mono text-sm leading-relaxed text-on-surface resize-none placeholder:text-outline-variant"
                  spellCheck="false"
                />
                <div className="h-12 border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between px-5">
                  <button 
                    onClick={() => setInput('')} 
                    disabled={!input}
                    className="p-1.5 text-on-surface-variant hover:text-error disabled:opacity-30 disabled:hover:text-on-surface-variant transition-colors flex items-center gap-2 group"
                  >
                    <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">Clear Input</span>
                  </button>
                </div>
             </div>

             {/* Output Area */}
             <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col h-[400px] relative">
                {/* Visual Connector Line (desktop) */}
                <div className="hidden md:flex absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-surface-container-highest border border-outline-variant rounded-full items-center justify-center z-10 cursor-pointer hover:scale-110 transition-transform hover:border-primary group" onClick={toggleMode}>
                    <ArrowRightLeft className="w-3 h-3 text-on-surface-variant group-hover:text-primary" />
                </div>
                
                <div className="h-14 border-b border-outline-variant bg-surface-container/50 flex items-center px-5">
                  <span className="font-mono text-xs text-outline font-semibold uppercase tracking-widest pl-2">
                     {mode === 'encode' ? 'Encoded Result' : 'Decoded Result'}
                  </span>
                </div>
                
                <textarea
                  value={output}
                  readOnly
                  placeholder="Result will appear here..."
                  className="flex-grow w-full bg-transparent p-5 outline-none font-mono text-sm leading-relaxed text-primary resize-none placeholder:text-outline-variant"
                  spellCheck="false"
                />

                <div className="h-12 border-t border-outline-variant bg-surface-container-lowest flex flex-wrap items-center justify-between px-5 pl-7">
                  <button 
                    onClick={handleCopy}
                    disabled={!output}
                    className="p-1.5 text-primary hover:text-primary-hover disabled:opacity-30 disabled:hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                    <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">
                      {copied ? 'Copied to Clipboard' : 'Copy Output'}
                    </span>
                  </button>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
