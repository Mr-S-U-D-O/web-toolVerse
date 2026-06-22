import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Shield, FileText, Download, Trash2 } from 'lucide-react';

export default function JsonFormatterTool({ onBack }: { onBack?: () => void }) {
  const [inputText, setInputText] = useState(`{"project":"web-toolVerse","author":"Antigravity","stats":{"active":true,"totalTools":40},"tags":["offline","fast"]}`);
  const [outputText, setOutputText] = useState('');
  const [indentSize, setIndentSize] = useState<string>('2'); // '2', '4', 'tab'
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setErrorMsg(null);
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }

    try {
      const parsed = JSON.parse(inputText);
      const spaceVal = indentSize === 'tab' ? '\t' : parseInt(indentSize, 10);
      const formatted = JSON.stringify(parsed, null, spaceVal);
      setOutputText(formatted);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid JSON format.');
      setOutputText('');
    }
  }, [inputText, indentSize]);

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setInputText(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface w-full pb-20 animate-in fade-in duration-300">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b border-outline-variant bg-background/95 backdrop-blur-sm">
        <div className="max-w-[1280px] mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-mono text-[11px] uppercase tracking-widest">web-toolVerse</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="font-sans text-sm font-medium text-on-surface">JSON Formatter</div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#008cff]/10 border border-[#008cff]/20 text-[10px] font-mono uppercase tracking-wider text-[#008cff]">
              <Shield className="w-3 h-3" />
              100% Client-Side
            </div>
          </div>
          <div className="w-[120px]" />
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-6 py-10 w-full">
        {/* Title */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">JSON Formatter</h1>
            <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
              Beautify, clean, and format raw JSON text. Select spacing sizes and indent tabs to generate clear readable JSON.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="file"
              id="file-json-formatter"
              accept=".json"
              className="hidden"
              onChange={handleFileUpload}
            />
            <label
              htmlFor="file-json-formatter"
              className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface-container hover:bg-surface-container-high hover:border-[#008cff] rounded-xl text-xs font-mono uppercase tracking-wider text-on-surface cursor-pointer transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              Upload JSON
            </label>
          </div>
        </div>

        {/* Dual Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-8">
          
          {/* Input Panel */}
          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                Raw Input JSON
              </label>
              {inputText && (
                <button
                  onClick={() => setInputText('')}
                  className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste raw/unformatted JSON here..."
              className="w-full h-96 bg-surface-container border border-outline-variant rounded-xl p-4 font-mono text-sm text-on-surface focus:outline-none focus:border-[#008cff] transition-colors resize-none placeholder:text-outline"
            />
            
            <div className="mt-4 flex justify-between items-center">
              <span className="font-mono text-[10px] text-on-surface-variant">
                Input Length: {inputText.length} chars
              </span>
              
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
                  Indentation:
                </span>
                <select
                  value={indentSize}
                  onChange={(e) => setIndentSize(e.target.value)}
                  className="bg-surface-container border border-outline-variant rounded-lg px-2.5 py-1 text-xs font-sans text-on-surface focus:outline-none focus:border-[#008cff] transition-colors"
                >
                  <option value="2">2 Spaces</option>
                  <option value="4">4 Spaces</option>
                  <option value="8">8 Spaces</option>
                  <option value="tab">Tab Character</option>
                </select>
              </div>
            </div>
          </div>

          {/* Formatted Output Panel */}
          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                Beautified Output
              </label>
              {outputText && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                      copied ? 'text-emerald-400' : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>

                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#008cff] hover:text-[#0070cc] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                </div>
              )}
            </div>

            {errorMsg ? (
              <div className="w-full h-96 bg-red-500/5 border border-red-500/20 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 font-mono text-xs font-semibold">
                  !
                </div>
                <p className="font-sans text-sm font-semibold text-red-400">Formatting Failed</p>
                <p className="font-sans text-xs text-on-surface-variant max-w-xs leading-relaxed font-mono">
                  {errorMsg}
                </p>
              </div>
            ) : (
              <textarea
                readOnly
                value={outputText}
                placeholder="Beautified JSON output will display here..."
                className="w-full h-96 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 font-mono text-sm text-[#008cff] focus:outline-none resize-none placeholder:text-outline/70"
              />
            )}

            <div className="mt-4 text-[10px] font-mono text-on-surface-variant">
              Output Length: {outputText.length} chars
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
