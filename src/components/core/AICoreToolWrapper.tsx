import React, { useState } from 'react';
import { ArrowLeft, Sparkles, AlertCircle, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export function AICoreToolWrapper({ id, name, onBack, systemPrompt }: { id: string, name: string, onBack: () => void, systemPrompt: string }) {
  const [inputText, setInputText] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleRun = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setError('');
    setOutput('');

    try {
      const response = await fetch('/api/gemini/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemPrompt, input: inputText }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate output');
      }

      setOutput(data.text);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        <div className="w-full max-w-4xl flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                 <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-bold tracking-tight">{name}</h1>
                <p className="text-sm text-on-surface-variant mt-1 font-mono">Advanced AI Generation Model</p>
              </div>
            </div>
            <button 
                onClick={handleRun}
                disabled={isLoading || !inputText.trim()}
                className="bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-on-primary font-mono text-sm tracking-wider uppercase font-medium px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2"
            >
                {isLoading ? (
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Process
                  </>
                )}
            </button>
          </div>

          {error && (
            <div className="bg-error/10 text-error border border-error/20 p-4 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 min-h-[500px]">
             <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden flex flex-col h-[400px] lg:h-full shadow-sm relative group focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 transition-all">
                <div className="h-12 border-b border-outline-variant bg-surface-container flex items-center px-4 justify-between">
                  <span className="font-mono text-xs text-on-surface-variant uppercase tracking-widest font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Input Context
                  </span>
                </div>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={"Enter the data or prompt for " + name + "..."}
                  className="flex-grow w-full bg-transparent p-5 outline-none font-mono text-[14px] leading-relaxed text-on-surface resize-none placeholder:text-outline"
                />
             </div>

             <div className="border border-outline-variant bg-surface-container-low rounded-xl overflow-hidden flex flex-col h-[400px] lg:h-full shadow-sm relative">
                <div className="h-12 border-b border-outline-variant bg-surface-container flex items-center px-4 justify-between">
                  <span className="font-mono text-xs text-on-surface-variant uppercase tracking-widest font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary/70"></span> Generated Output
                  </span>
                  {output && (
                    <button onClick={handleCopy} className="text-on-surface-variant hover:text-primary transition-colors flex flex-row items-center gap-1.5 bg-surface-container-high px-2.5 py-1 rounded-md">
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[10px] uppercase font-bold tracking-wider">{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
                <div className="flex-grow w-full bg-transparent p-5 overflow-auto outline-none">
                  {output ? (
                    <div className="prose prose-invert prose-p:text-on-surface prose-headings:text-on-surface max-w-none text-[15px] leading-relaxed">
                      <ReactMarkdown>{output}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="font-mono text-[13px] text-outline text-center max-w-[200px]">Results will be generated and streamed here.</p>
                    </div>
                  )}
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
