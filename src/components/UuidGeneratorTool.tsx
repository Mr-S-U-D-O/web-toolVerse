import React, { useState } from 'react';
import { ArrowLeft, Copy, RefreshCw, Check, CheckSquare, Square } from 'lucide-react';

interface UuidGeneratorToolProps {
  onBack: () => void;
}

export default function UuidGeneratorTool({ onBack }: UuidGeneratorToolProps) {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState<number>(5);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [noHyphens, setNoHyphens] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateUuids = () => {
    const newUuids: string[] = [];
    const loopCount = Math.min(Math.max(count, 1), 100);
    for (let i = 0; i < loopCount; i++) {
      let uid: string = crypto.randomUUID();
      if (noHyphens) uid = uid.replace(/-/g, '');
      if (uppercase) uid = uid.toUpperCase();
      newUuids.push(uid);
    }
    setUuids(newUuids);
  };

  // Generate some on mount
  React.useEffect(() => {
    generateUuids();
  }, []);

  // Regen on setting change
  React.useEffect(() => {
    if (uuids.length > 0) generateUuids();
  }, [uppercase, noHyphens]);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopiedIndex(-1);
    setTimeout(() => setCopiedIndex(null), 2000);
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

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-heading mb-2">UUID v4 Generator</h1>
            <p className="text-on-surface-variant">Generate cryptographically secure random UUIDs.</p>
          </div>
          <button
            onClick={generateUuids}
            className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg font-bold hover:bg-surface-tint transition-colors"
          >
            <RefreshCw size={18} />
            Regenerate
          </button>
        </div>

        <div className="grid md:grid-cols-[250px_1fr] gap-6">
          <div className="bg-surface rounded-xl p-6 border border-outline flex flex-col gap-4 h-fit">
            <div>
              <label className="block text-sm font-bold mb-2">Quantity (1-100)</label>
              <input
                type="number"
                min="1"
                max="100"
                className="w-full bg-background border border-outline rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              />
            </div>
            
            <button
              onClick={() => setUppercase(!uppercase)}
              className="flex items-center gap-2 text-sm select-none"
            >
              {uppercase ? <CheckSquare size={20} className="text-primary"/> : <Square size={20} className="text-on-surface-variant" />}
              Uppercase
            </button>

            <button
              onClick={() => setNoHyphens(!noHyphens)}
              className="flex items-center gap-2 text-sm select-none"
            >
              {noHyphens ? <CheckSquare size={20} className="text-primary"/> : <Square size={20} className="text-on-surface-variant" />}
              Remove Hyphens
            </button>
          </div>

          <div className="bg-surface rounded-xl border border-outline overflow-hidden flex flex-col">
            <div className="p-4 border-b border-outline flex justify-between items-center bg-background">
              <span className="font-bold text-sm">Generated UUIDs</span>
              <button
                onClick={handleCopyAll}
                className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
              >
                {copiedIndex === -1 ? <Check size={16} /> : <Copy size={16} />}
                {copiedIndex === -1 ? 'Copied All!' : 'Copy All'}
              </button>
            </div>
            <div className="p-4 max-h-[500px] overflow-y-auto font-mono text-sm space-y-2">
              {uuids.map((uid, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 hover:bg-background rounded group">
                  <span className="truncate mr-4">{uid}</span>
                  <button 
                    onClick={() => handleCopy(uid, idx)}
                    className="text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                  >
                    {copiedIndex === idx ? <Check size={16} className="text-primary" /> : <Copy size={16} />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
