import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Database } from 'lucide-react';
import { format } from 'sql-formatter';

export default function DevSqlFormatterTool({ onBack }: { onBack: () => void }) {
  const [code, setCode] = useState<string>('');
  const [formattedCode, setFormattedCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  const formatCode = () => {
    try {
      setError('');
      const formatted = format(code, {
        language: 'sql', 
        tabWidth: 2,
        keywordCase: 'upper',
        linesBetweenQueries: 2,
      });
      setFormattedCode(formatted);
    } catch (err: any) {
      setError(err.message || 'Error parsing SQL');
    }
  };

  return (
        <div className="flex flex-col min-h-screen w-full bg-background text-on-surface">\n      <header className="w-full border-b border-outline-variant bg-background sticky top-0 z-50">\n        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center">\n          <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group">\n             <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />\n             <span className="font-mono text-sm tracking-widest font-medium uppercase mt-0.5">Back to Main</span>\n          </button>\n        </div>\n      </header>\n\n      <main className="flex-grow flex justify-center p-6 lg:p-12 w-full max-w-[1280px] mx-auto relative pt-12 md:pt-16">
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        <div className="flex flex-col items-center justify-center mb-12 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-sm ring-1 ring-primary/20">
            <Database className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-on-surface mb-4">
            SQL Formatter
          </h1>
          <p className="text-on-surface-variant max-w-2xl">
            Format and beautify your database SQL queries effortlessly.
          </p>
        </div>

        <div className="bg-surface-container rounded-3xl p-6 md:p-8 ring-1 ring-outline-variant">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Input Code</span>
                {code && (
                  <button onClick={() => setCode('')} className="text-error hover:text-error/80 text-xs">Clear</button>
                )}
              </label>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-96 bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm resize-y whitespace-pre"
                spellCheck={false}
                placeholder="SELECT * FROM users WHERE id = 1"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Formatted Output</span>
                {formattedCode && (
                  <button onClick={() => navigator.clipboard.writeText(formattedCode)} className="text-primary hover:text-primary/80 text-xs">Copy Output</button>
                )}
              </label>
              <textarea
                value={formattedCode}
                readOnly
                className="w-full h-96 bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm resize-y whitespace-pre"
                spellCheck={false}
                placeholder="Formatted SQL will appear here..."
              />
            </div>
          </div>
          {error && (
            <div className="w-full bg-error/10 text-error font-mono text-sm p-4 rounded-xl border border-error/50 mb-6 break-all whitespace-pre-wrap">
              {error}
            </div>
          )}
          <button
            onClick={formatCode}
            disabled={!code}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-on-primary font-medium rounded-xl px-6 py-3 transition-colors"
          >
            Format SQL
          </button>
        </div>
      </div>
          </main>
    </div>
  );
}
