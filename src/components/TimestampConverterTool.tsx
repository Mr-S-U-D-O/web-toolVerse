import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, RefreshCw, Check } from 'lucide-react';

interface TimestampConverterToolProps {
  onBack: () => void;
}

export default function TimestampConverterTool({ onBack }: TimestampConverterToolProps) {
  const [timestamp, setTimestamp] = useState<string>(Math.floor(Date.now() / 1000).toString());
  const [dateResult, setDateResult] = useState<string>('');
  const [isoString, setIsoString] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const ts = parseInt(timestamp, 10);
      if (isNaN(ts)) {
        setDateResult('Invalid timestamp');
        setIsoString('');
        return;
      }
      // Guess if it's seconds or milliseconds. Typically > 20000000000 means ms.
      const ms = ts > 20000000000 ? ts : ts * 1000;
      const d = new Date(ms);
      if (d.toString() === 'Invalid Date') {
        setDateResult('Invalid Date');
        setIsoString('');
      } else {
        setDateResult(d.toLocaleString());
        setIsoString(d.toISOString());
      }
    } catch {
      setDateResult('Error parsing');
    }
  }, [timestamp]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">Timestamp Converter</h1>
        <p className="text-on-surface-variant mb-8">Convert Unix epochs to human-readable dates and vice versa.</p>

        <div className="bg-surface rounded-xl p-6 border border-outline">
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2">Unix Timestamp (sec or ms)</label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-background border border-outline rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary font-mono"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                placeholder="e.g. 1718664123"
              />
              <button
                onClick={() => setTimestamp(Math.floor(Date.now() / 1000).toString())}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                title="Current Timestamp"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-background p-4 rounded-lg border border-outline">
              <div className="text-sm text-on-surface-variant mb-1 font-bold">Local Time</div>
              <div className="font-mono text-lg truncate flex justify-between items-center group">
                {dateResult}
                {dateResult && dateResult !== 'Invalid Date' && (
                  <button onClick={() => handleCopy(dateResult)} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                    <Copy size={16} />
                  </button>
                )}
              </div>
            </div>
            <div className="bg-background p-4 rounded-lg border border-outline">
              <div className="text-sm text-on-surface-variant mb-1 font-bold">ISO 8601 (UTC)</div>
              <div className="font-mono text-lg truncate flex justify-between items-center group">
                {isoString || '-'}
                {isoString && (
                  <button onClick={() => handleCopy(isoString)} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                    <Copy size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {copied && (
           <div className="fixed bottom-6 right-6 bg-primary text-on-primary px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
             <Check size={16} />
             <span>Copied!</span>
           </div>
        )}
      </div>
    </div>
  );
}
