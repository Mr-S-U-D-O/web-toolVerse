import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface ValidationError {
  message: string;
  line?: number;
  column?: number;
}

function parseJsonError(err: Error, text: string): ValidationError {
  const msg = err.message;
  
  // Try to parse line and column numbers from typical JS engine error messages
  // e.g. "Unexpected token } in JSON at position 45" or "at line 3 column 10"
  let line: number | undefined;
  let column: number | undefined;
  
  const lineColMatch = msg.match(/line (\d+) column (\d+)/i);
  if (lineColMatch) {
    line = parseInt(lineColMatch[1], 10);
    column = parseInt(lineColMatch[2], 10);
  } else {
    // Try matching Chrome-style "at position 45"
    const posMatch = msg.match(/position (\d+)/i);
    if (posMatch) {
      const pos = parseInt(posMatch[1], 10);
      const sub = text.substring(0, pos);
      const lines = sub.split('\n');
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    }
  }

  return {
    message: msg,
    line,
    column
  };
}

export default function JsonValidatorTool({ onBack }: { onBack?: () => void }) {
  const [inputText, setInputText] = useState(`{
  "name": "Tool Cabinet",
  "category": "utility",
  "dependencies": {
    "react": "^19.0.0",
  }
}`); // Contains a trailing comma error by default to show capability

  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errorDetails, setErrorDetails] = useState<ValidationError | null>(null);

  useEffect(() => {
    if (!inputText.trim()) {
      setIsValid(null);
      setErrorDetails(null);
      return;
    }

    try {
      JSON.parse(inputText);
      setIsValid(true);
      setErrorDetails(null);
    } catch (err: any) {
      setIsValid(false);
      setErrorDetails(parseJsonError(err, inputText));
    }
  }, [inputText]);

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
            <span className="font-mono text-[11px] uppercase tracking-widest">Tool Cabinet</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="font-sans text-sm font-medium text-on-surface">JSON Validator</div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#008cff]/10 border border-[#008cff]/20 text-[10px] font-mono uppercase tracking-wider text-[#008cff]">
              <Shield className="w-3 h-3" />
              100% Client-Side
            </div>
          </div>
          <div className="w-[120px]" />
        </div>
      </header>

      <main className="max-w-[1000px] mx-auto px-6 py-10 w-full">
        {/* Title */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">JSON Validator</h1>
          <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
            Validate JSON strings with precise syntax checks. Automatically identifies missing brackets, unquoted keys, bad commas, and prints the exact error line.
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Input Area */}
          <div className="md:col-span-8 flex flex-col gap-4">
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant">
              <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant block mb-3">
                Input JSON String
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste raw JSON here..."
                className="w-full h-96 bg-surface-container border border-outline-variant rounded-xl p-4 font-mono text-sm text-on-surface focus:outline-none focus:border-[#008cff] transition-colors resize-y placeholder:text-outline"
              />
            </div>
          </div>

          {/* Validation Status Panel */}
          <div className="md:col-span-4 bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-6 sticky top-[80px]">
            <h3 className="font-heading font-semibold text-sm text-white">Validation Status</h3>

            {isValid === null ? (
              <div className="text-center py-10 font-sans text-xs text-on-surface-variant">
                Input JSON text to trigger validation checks.
              </div>
            ) : isValid ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-5 rounded-xl flex flex-col items-center justify-center gap-3 text-center animate-in zoom-in-95 duration-200">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
                <div>
                  <h4 className="font-sans text-sm font-semibold">Valid JSON</h4>
                  <p className="font-sans text-[11px] text-emerald-300/80 mt-1">
                    Your JSON string conforms to standard syntax specifications.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-xl flex flex-col items-center justify-center gap-3 text-center animate-in zoom-in-95 duration-200">
                <AlertTriangle className="w-10 h-10 text-red-400" />
                <div className="w-full">
                  <h4 className="font-sans text-sm font-semibold">Syntax Error</h4>
                  
                  {errorDetails && (
                    <div className="mt-4 text-left bg-surface-container-lowest/50 p-3 rounded-lg border border-outline-variant/40 font-mono text-[11px] text-on-surface-variant leading-relaxed select-all">
                      <p className="text-red-300 font-semibold mb-1 truncate" title={errorDetails.message}>
                        {errorDetails.message}
                      </p>
                      {errorDetails.line && (
                        <p className="mt-1 border-t border-outline-variant/20 pt-1 text-on-surface">
                          Line: <span className="text-[#008cff] font-bold">{errorDetails.line}</span>, 
                          Column: <span className="text-[#008cff] font-bold">{errorDetails.column}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
