import React, { useState } from 'react';
import { ArrowLeft, Trash2, Copy, Check, FileCode2, Minimize2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function robustJSMinify(code: string): string {
    if (!code.trim()) return '';
    
    let out = '';
    let i = 0;
    const tokens: Array<{type: 'code' | 'string' | 'regex', value: string}> = [];
    let currentCode = '';
    
    while (i < code.length) {
        let char = code[i];

        // String literals
        if (char === '"' || char === "'") {
            if (currentCode) {
                tokens.push({ type: 'code', value: currentCode });
                currentCode = '';
            }
            let quote = char;
            let str = char;
            i++;
            while (i < code.length) {
                if (code[i] === '\\') {
                    str += code[i] + (code[i + 1] || '');
                    i += 2;
                } else if (code[i] === quote) {
                    str += code[i];
                    i++;
                    break;
                } else {
                    str += code[i];
                    i++;
                }
            }
            tokens.push({ type: 'string', value: str });
            continue;
        }

        // Template literals
        if (char === '`') {
            if (currentCode) {
                tokens.push({ type: 'code', value: currentCode });
                currentCode = '';
            }
            let str = char;
            i++;
            while (i < code.length) {
                if (code[i] === '\\') {
                    str += code[i] + (code[i + 1] || '');
                    i += 2;
                } else if (code[i] === '`') {
                    str += code[i];
                    i++;
                    break;
                } else {
                    str += code[i];
                    i++;
                }
            }
            tokens.push({ type: 'string', value: str });
            continue;
        }

        // Single line comments
        if (char === '/' && code[i + 1] === '/') {
            i += 2;
            while (i < code.length && code[i] !== '\n' && code[i] !== '\r') {
                i++;
            }
            continue;
        }

        // Multi line comments
        if (char === '/' && code[i + 1] === '*') {
            i += 2;
            while (i < code.length && !(code[i] === '*' && code[i + 1] === '/')) {
                i++;
            }
            i += 2;
            continue;
        }

        // Regex literals Check
        if (char === '/') {
            let j = currentCode.length - 1;
            while (j >= 0 && /\s/.test(currentCode[j])) {
                j--;
            }
            let lastChar = j >= 0 ? currentCode[j] : '';
            const isRegex = j < 0 || /[=(,\[!:&|;?+\-*~^%<>{}]\s*$/.test(lastChar) || /^(return|yield|throw|typeof|in|instanceof|do|else|case)\s*$/.test(currentCode.substring(0, j + 1).match(/\w+$/)?.[0] || '');
            
            if (isRegex) {
                if (currentCode) {
                    tokens.push({ type: 'code', value: currentCode });
                    currentCode = '';
                }
                let regex = char;
                i++;
                let inCharClass = false;
                while (i < code.length) {
                    if (code[i] === '\\') {
                        regex += code[i] + (code[i + 1] || '');
                        i += 2;
                    } else if (code[i] === '[') {
                        inCharClass = true;
                        regex += code[i];
                        i++;
                    } else if (code[i] === ']') {
                        inCharClass = false;
                        regex += code[i];
                        i++;
                    } else if (code[i] === '/' && !inCharClass) {
                        regex += code[i];
                        i++;
                        while (i < code.length && /[a-zA-Z]/.test(code[i])) {
                            regex += code[i];
                            i++;
                        }
                        break;
                    } else {
                        regex += code[i];
                        i++;
                    }
                }
                tokens.push({ type: 'regex', value: regex });
                continue;
            }
        }
        
        currentCode += char;
        i++;
    }
    
    if (currentCode) {
        tokens.push({ type: 'code', value: currentCode });
    }

    return tokens.map((token, idx) => {
        if (token.type === 'string' || token.type === 'regex') return token.value;
        let s = token.value;
        s = s.replace(/\s+/g, ' ');

        // Keep spaces separating alphanumeric or keyword tokens.
        // For non-alphanumeric, strip surrounding spaces safely.
        s = s.replace(/\s*([{};,:>+~!/\[\]()=|<&?*^%-])\s*/g, '$1');
        
        // Safety gap: Ensure 'return x' doesn't become 'returnx'
        s = s.replace(/([a-zA-Z0-9_$])\s+([a-zA-Z0-9_$])/g, '$1 $2');
        return s;
    }).join('').trim();
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function JavaScriptMinifierTool() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMinify = () => {
    if (!input.trim()) {
       setOutput('');
       setError(null);
       return;
    }
    
    try {
      const minified = robustJSMinify(input);
      setOutput(minified);
      setError(null);
    } catch (e: any) {
      setOutput('');
      setError(e.message || "An unexpected error occurred during minification.");
    }
  };

  React.useEffect(() => {
     handleMinify();
  }, [input]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const savedBytes = Math.max(0, input.length - output.length);
  const savedPercent = input.length > 0 ? ((savedBytes / input.length) * 100).toFixed(1) : '0.0';

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
                 <FileCode2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="font-heading text-3xl font-semibold tracking-tight">JavaScript Minifier</h1>
                <p className="text-on-surface-variant mt-1 text-sm">Safely compress JavaScript by stripping whitespace and comments while protecting logic.</p>
              </div>
            </div>
            
            <button 
              onClick={handleMinify}
              disabled={!input}
              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-on-primary disabled:opacity-50 disabled:hover:bg-primary px-5 py-2.5 rounded-lg font-mono text-xs uppercase tracking-wider transition-colors shadow-sm whitespace-nowrap"
            >
              <Minimize2 className="w-4 h-4" /> Minify JS
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[450px]">
             {/* Input Area */}
             <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col h-[400px] md:h-[500px]">
                <div className="h-14 border-b border-outline-variant bg-surface-container/50 flex items-center px-5">
                  <span className="font-mono text-xs text-outline font-semibold uppercase tracking-widest">Raw JS Input</span>
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste your uncompressed JavaScript here..."
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
                    <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">Clear</span>
                  </button>
                  <span className="font-mono text-[10px] text-outline font-semibold uppercase tracking-wider">{formatBytes(input.length)}</span>
                </div>
             </div>

             {/* Output Area */}
             <div className={`border rounded-xl overflow-hidden shadow-sm flex flex-col h-[400px] md:h-[500px] transition-colors duration-300 ${error ? 'bg-error-container/10 border-error-container/50' : 'bg-surface-container-low border-outline-variant'}`}>
                <div className="h-14 border-b border-outline-variant bg-surface-container/50 flex items-center px-5">
                  <span className="font-mono text-xs text-outline font-semibold uppercase tracking-widest">Minified Output</span>
                </div>
                
                {error ? (
                   <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-error-container/5">
                     <AlertCircle className="w-10 h-10 text-error mb-4 opacity-80 animate-in zoom-in duration-300" />
                     <p className="font-mono text-sm text-error leading-relaxed">{error}</p>
                   </div>
                ) : (
                  <textarea
                    value={output}
                    readOnly
                    placeholder="Minified result will appear here..."
                    className="flex-grow w-full bg-transparent p-5 outline-none font-mono text-sm leading-relaxed text-primary resize-none placeholder:text-outline-variant"
                    spellCheck="false"
                  />
                )}

                <div className="h-auto min-h-[48px] py-2 border-t border-outline-variant bg-surface-container-lowest flex flex-wrap items-center justify-between px-5 gap-y-2 gap-x-4">
                  <button 
                    onClick={handleCopy}
                    disabled={!output || !!error}
                    className="p-1.5 text-primary hover:text-primary-hover disabled:opacity-30 disabled:hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                    <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">
                      {copied ? 'Copied' : 'Copy'}
                    </span>
                  </button>
                  
                  {!error && output ? (
                    <div className="flex items-center flex-wrap justify-end gap-3 text-right ml-auto">
                       <span className="font-mono text-[10px] text-outline font-semibold uppercase tracking-wider">
                         Original: {formatBytes(input.length)} | Minified: {formatBytes(output.length)}
                       </span>
                       <span className="font-mono text-[10px] text-primary bg-primary/10 px-2 py-1 rounded font-semibold uppercase tracking-wider">
                         Saved: {savedPercent}%
                       </span>
                    </div>
                  ) : (
                     <span className="font-mono text-[10px] text-outline font-semibold uppercase tracking-wider ml-auto">
                        {formatBytes(output.length)}
                     </span>
                  )}
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
