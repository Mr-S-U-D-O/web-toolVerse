import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Plus, Trash2 } from 'lucide-react';

interface QueryParamsBuilderToolProps {
  onBack: () => void;
}

export default function QueryParamsBuilderTool({ onBack }: QueryParamsBuilderToolProps) {
  const [params, setParams] = useState<{ id: number; key: string; value: string }[]>([
    { id: 1, key: 'search', value: 'shoes' },
    { id: 2, key: 'sort', value: 'desc' },
    { id: 3, key: 'page', value: '1' }
  ]);
  const [baseUrl, setBaseUrl] = useState('https://example.com/api/items');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const url = new URL(baseUrl || 'https://example.com');
      params.forEach(p => {
        if (p.key.trim()) {
           url.searchParams.append(p.key.trim(), p.value);
        }
      });
      // only show path+query if baseUrl is omitted but we forced a throw otherwise
      let finalUrl = url.toString();
      if (!baseUrl) {
         finalUrl = url.search + url.hash;
      }
      setResult(finalUrl);
    } catch {
      // Fallback manual build if base url is completely invalid
      let query = params
        .filter(p => p.key.trim())
        .map(p => `${encodeURIComponent(p.key.trim())}=${encodeURIComponent(p.value)}`)
        .join('&');
      
      if (baseUrl) {
         setResult(baseUrl + (baseUrl.includes('?') ? '&' : '?') + query);
      } else {
         setResult('?' + query);
      }
    }
  }, [params, baseUrl]);

  const addParam = () => setParams([...params, { id: Date.now(), key: '', value: '' }]);
  const updateParam = (id: number, field: 'key'|'value', val: string) => {
    setParams(params.map(p => p.id === id ? { ...p, [field]: val } : p));
  };
  const removeParam = (id: number) => setParams(params.filter(p => p.id !== id));

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">Query Parameters Builder</h1>
        <p className="text-on-surface-variant mb-8">Build precise query strings and URLs safely.</p>

        <div className="bg-surface rounded-xl p-6 border border-outline mb-6">
          <label className="block text-sm font-bold mb-2">Base URL (Optional)</label>
          <input
            type="text"
            className="w-full bg-background border border-outline rounded-lg px-4 py-3 font-mono focus:outline-none focus:border-primary"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://example.com/api..."
          />
        </div>

        <div className="bg-surface rounded-xl p-6 border border-outline mb-6">
           <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Parameters</h2>
              <button onClick={addParam} className="flex items-center gap-2 text-sm text-primary font-bold hover:bg-primary/10 px-3 py-1.5 rounded transition-colors">
                <Plus size={16} /> Add 
              </button>
           </div>

           <div className="space-y-3">
             {params.map(p => (
               <div key={p.id} className="flex gap-2 items-center">
                 <input 
                   type="text" 
                   value={p.key} 
                   onChange={(e) => updateParam(p.id, 'key', e.target.value)}
                   className="flex-1 bg-background border border-outline rounded p-2 text-sm focus:outline-none focus:border-primary font-mono"
                   placeholder="Key"
                 />
                 <span className="text-on-surface-variant">=</span>
                 <input 
                   type="text" 
                   value={p.value} 
                   onChange={(e) => updateParam(p.id, 'value', e.target.value)}
                   className="flex-1 bg-background border border-outline rounded p-2 text-sm focus:outline-none focus:border-primary font-mono"
                   placeholder="Value"
                 />
                 <button onClick={() => removeParam(p.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors ml-2">
                   <Trash2 size={18} />
                 </button>
               </div>
             ))}
             {params.length === 0 && (
               <div className="text-center text-sm text-on-surface-variant italic py-4">No parameters added.</div>
             )}
           </div>
        </div>

        <div className="bg-surface rounded-xl p-6 border border-outline">
           <label className="block text-sm font-bold mb-2">Generated URL String</label>
           <div className="flex bg-background border border-outline rounded-lg overflow-hidden">
             <div className="flex-1 p-4 font-mono text-sm break-all leading-relaxed">
               {result}
             </div>
             <button onClick={handleCopy} className="bg-primary text-on-primary px-6 hover:bg-surface-tint font-bold transition-colors flex items-center justify-center gap-2 border-l border-primary">
                {copied ? <Check size={18} /> : <Copy size={18} />} Copy
             </button>
           </div>
        </div>

      </div>
    </div>
  );
}
