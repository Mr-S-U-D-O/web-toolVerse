import React, { useState } from 'react';
import { ArrowLeft, Copy, Check } from 'lucide-react';

interface JsonToTypescriptToolProps {
  onBack: () => void;
}

export default function JsonToTypescriptTool({ onBack }: JsonToTypescriptToolProps) {
  const [input, setInput] = useState('{\n  "id": 1,\n  "name": "Leanne Graham",\n  "username": "Bret",\n  "email": "Sincere@april.biz"\n}');
  const [output, setOutput] = useState('');
  const [rootName, setRootName] = useState('RootObject');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      const obj = JSON.parse(input);
      let interfaces = '';
      
      const toInterface = (name: string, data: any): string => {
        let result = `export interface ${name} {\n`;
        const keys = Object.keys(data);
        keys.forEach(k => {
          const val = data[k];
          let type = 'any';
          if (val === null) type = 'null';
          else if (Array.isArray(val)) {
            if (val.length > 0) {
              const firstType = typeof val[0];
              if (firstType === 'object' && val[0] !== null) {
                const subName = k.charAt(0).toUpperCase() + k.slice(1) + 'Item';
                interfaces += toInterface(subName, val[0]) + '\n';
                type = `${subName}[]`;
              } else {
                type = `${firstType}[]`;
              }
            } else {
              type = 'any[]';
            }
          } else if (typeof val === 'object') {
            const subName = k.charAt(0).toUpperCase() + k.slice(1);
            interfaces += toInterface(subName, val) + '\n';
            type = subName;
          } else {
            type = typeof val;
          }
          // Validate key for safe TS output
          const safeKey = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(k) ? k : `"${k}"`;
          result += `  ${safeKey}: ${type};\n`;
        });
        result += `}\n`;
        return result;
      };

      let tsCode = '';
      if (Array.isArray(obj)) {
        if (obj.length > 0) {
           tsCode = toInterface(rootName, obj[0]);
        } else {
           tsCode = `export type ${rootName} = any[];`;
        }
      } else {
         tsCode = toInterface(rootName, obj);
      }
      
      setOutput((interfaces + '\n' + tsCode).trim());
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  }, [input, rootName]);

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

        <h1 className="text-3xl font-bold font-heading mb-2">JSON to TypeScript</h1>
        <p className="text-on-surface-variant mb-8">Convert JSON objects to TypeScript interfaces automatically.</p>

        <div className="grid md:grid-cols-2 gap-6 min-h-[600px]">
          <div className="bg-surface rounded-xl border border-outline flex flex-col overflow-hidden">
             <div className="p-4 bg-background border-b border-outline flex items-center justify-between">
                <span className="font-bold">JSON Input</span>
                <input 
                  type="text" 
                  value={rootName} 
                  onChange={(e) => setRootName(e.target.value)} 
                  className="bg-surface border border-outline px-2 py-1 text-sm rounded focus:outline-none focus:border-primary"
                  placeholder="Root Interface Name"
                />
             </div>
             {error && <div className="p-3 bg-red-500/10 text-red-500 text-sm font-mono break-all">{error}</div>}
             <textarea
              className="w-full h-full bg-background border-none p-4 font-mono text-sm focus:outline-none resize-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="{ ... }"
             />
          </div>

          <div className="bg-surface rounded-xl border border-outline flex flex-col overflow-hidden relative">
             <div className="p-4 bg-background border-b border-outline flex items-center justify-between">
                <span className="font-bold">TypeScript Interfaces</span>
                <button
                  onClick={handleCopy}
                  disabled={!output}
                  className="flex items-center gap-2 bg-primary text-on-primary px-3 py-1.5 text-sm rounded font-bold hover:bg-surface-tint disabled:opacity-50 transition-colors"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  Copy
                </button>
             </div>
             <textarea
              className="w-full h-full bg-surface border-none p-4 font-mono text-sm focus:outline-none resize-none"
              value={output}
              readOnly
             />
          </div>
        </div>
      </div>
    </div>
  );
}
