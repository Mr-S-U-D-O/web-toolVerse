import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check } from 'lucide-react';

interface JsonToCsvToolProps {
  onBack: () => void;
}

export default function JsonToCsvTool({ onBack }: JsonToCsvToolProps) {
  const [json, setJson] = useState('[\n  {\n    "id": 1,\n    "name": "Jane Doe",\n    "email": "jane@example.com"\n  }\n]');
  const [csv, setCsv] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!json.trim()) {
      setCsv('');
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(json);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      if (arr.length === 0) {
        setCsv('');
        setError(null);
        return;
      }

      // Collect all keys
      const headersSet = new Set<string>();
      arr.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          Object.keys(item).forEach(k => headersSet.add(k));
        }
      });
      const headers = Array.from(headersSet);

      let csvStr = headers.map(h => `"${h.replace(/"/g, '""')}"`).join(',') + '\n';

      arr.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          const row = headers.map(h => {
            let val = item[h];
            if (val === null || val === undefined) val = '';
            else if (typeof val === 'object') val = JSON.stringify(val);
            else val = String(val);
            return `"${val.replace(/"/g, '""')}"`;
          });
          csvStr += row.join(',') + '\n';
        }
      });

      setCsv(csvStr.trim());
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setCsv('');
    }
  }, [json]);

  const handleCopy = () => {
    navigator.clipboard.writeText(csv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">JSON to CSV Converter</h1>
        <p className="text-on-surface-variant mb-8">Convert JSON arrays to comma-separated values (CSV).</p>

        <div className="grid md:grid-cols-2 gap-6 min-h-[500px]">
          <div className="bg-surface rounded-xl border border-outline flex flex-col overflow-hidden">
            <div className="p-4 bg-background border-b border-outline font-bold">JSON Input</div>
            {error && <div className="p-3 bg-red-500/10 text-red-500 text-sm font-mono break-all">{error}</div>}
            <textarea
              className="w-full h-full bg-surface border-none p-4 font-mono text-sm focus:outline-none resize-none"
              value={json}
              onChange={(e) => setJson(e.target.value)}
              placeholder="Paste JSON array here..."
            />
          </div>

          <div className="bg-surface rounded-xl border border-outline flex flex-col overflow-hidden relative">
            <div className="p-4 bg-background border-b border-outline flex items-center justify-between">
              <span className="font-bold">CSV Output</span>
              <button
                onClick={handleCopy}
                disabled={!csv}
                className="flex items-center gap-2 bg-primary text-on-primary px-3 py-1.5 text-sm rounded font-bold hover:bg-surface-tint disabled:opacity-50 transition-colors"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                Copy
              </button>
            </div>
            <textarea
              className="w-full h-full bg-surface border-none p-4 font-mono text-sm whitespace-pre-wrap focus:outline-none resize-none"
              value={csv}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}
