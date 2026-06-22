import React, { useState } from 'react';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { format } from 'sql-formatter';

interface SqlFormatterToolProps {
  onBack: () => void;
}

export default function SqlFormatterTool({ onBack }: SqlFormatterToolProps) {
  const [input, setInput] = useState('SELECT user_id, first_name, last_name FROM users WHERE status = \'active\' ORDER BY created_at DESC LIMIT 10;');
  const [output, setOutput] = useState('');
  const [dialect, setDialect] = useState('sql');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    try {
      const formatted = format(input, { language: dialect as any });
      setOutput(formatted);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setOutput(input);
    }
  }, [input, dialect]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">SQL Formatter</h1>
        <p className="text-on-surface-variant mb-8">Format and beautify SQL queries instantly.</p>

        <div className="grid lg:grid-cols-2 gap-6 min-h-[500px]">
          <div className="bg-surface rounded-xl flex flex-col border border-outline overflow-hidden">
            <div className="bg-background border-b border-outline p-4 flex items-center justify-between">
              <span className="font-bold">Raw SQL</span>
              <select 
                value={dialect} 
                onChange={(e) => setDialect(e.target.value)}
                className="bg-surface border border-outline rounded px-2 py-1 text-sm focus:outline-none focus:border-primary"
              >
                <option value="sql">Standard SQL</option>
                <option value="postgresql">PostgreSQL</option>
                <option value="mysql">MySQL</option>
                <option value="mariadb">MariaDB</option>
                <option value="sqlite">SQLite</option>
                <option value="tsql">T-SQL</option>
              </select>
            </div>
            <textarea
              className="w-full h-full bg-background border-none p-4 font-mono text-sm focus:outline-none min-h-[400px] resize-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste raw SQL here..."
            />
          </div>

          <div className="bg-surface rounded-xl flex flex-col border border-outline overflow-hidden">
            <div className="bg-background border-b border-outline p-4 flex items-center justify-between">
              <span className="font-bold">Formatted Output</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 bg-primary text-on-primary px-3 py-1.5 text-sm rounded font-bold hover:bg-surface-tint transition-colors"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                Copy
              </button>
            </div>
            {error && (
              <div className="p-3 bg-red-500/10 text-red-500 text-sm font-mono break-all border-b border-red-500/20">
                {error}
              </div>
            )}
            <textarea
              className="w-full h-full bg-surface border-none p-4 font-mono text-sm focus:outline-none min-h-[400px] resize-none"
              value={output}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}
