import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Shield, Plus, Trash2, Edit3, Settings } from 'lucide-react';

function flattenObject(obj: any, prefix = '', res: Record<string, any> = {}): Record<string, any> {
  if (obj === null || typeof obj !== 'object') {
    if (prefix) res[prefix] = obj;
    return res;
  }
  
  const keys = Object.keys(obj);
  if (keys.length === 0) {
    if (prefix) res[prefix] = Array.isArray(obj) ? [] : {};
    return res;
  }

  for (const k of keys) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (typeof obj[k] === 'object' && obj[k] !== null) {
      flattenObject(obj[k], p, res);
    } else {
      res[p] = obj[k];
    }
  }
  return res;
}

function unflattenObject(flat: Record<string, any>): any {
  const result: any = {};
  for (const key in flat) {
    const parts = key.split('.');
    let cur = result;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      
      // Determine if next key part is a number index
      const isNextNumber = i < parts.length - 1 && /^\d+$/.test(parts[i + 1]);

      if (i === parts.length - 1) {
        cur[part] = flat[key];
      } else {
        if (!(part in cur)) {
          cur[part] = isNextNumber ? [] : {};
        }
        cur = cur[part];
      }
    }
  }
  return result;
}

export default function JsonEditorTool({ onBack }: { onBack?: () => void }) {
  const [inputText, setInputText] = useState(`{
  "user": {
    "name": "Alex Mercer",
    "role": "Lead Architect",
    "details": {
      "verified": true,
      "reputation": 99
    }
  },
  "active": true
}`);

  const [parsedObj, setParsedObj] = useState<any>(null);
  const [flatFields, setFlatFields] = useState<Record<string, any>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newType, setNewType] = useState<'string' | 'number' | 'boolean'>('string');
  const [copied, setCopied] = useState(false);

  // Sync raw input text with parsed and flattened properties
  useEffect(() => {
    setErrorMsg(null);
    if (!inputText.trim()) {
      setParsedObj(null);
      setFlatFields({});
      return;
    }
    try {
      const parsed = JSON.parse(inputText);
      setParsedObj(parsed);
      setFlatFields(flattenObject(parsed));
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid JSON format.');
    }
  }, [inputText]);

  // Sync changes from the interactive form back to the raw JSON string
  const handleFieldChange = (path: string, val: any) => {
    const updatedFlat = { ...flatFields, [path]: val };
    setFlatFields(updatedFlat);
    try {
      const restored = unflattenObject(updatedFlat);
      setInputText(JSON.stringify(restored, null, 2));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim()) return;

    let typedVal: any = newValue;
    if (newType === 'number') typedVal = Number(newValue) || 0;
    if (newType === 'boolean') typedVal = newValue === 'true';

    const updatedFlat = { ...flatFields, [newKey.trim()]: typedVal };
    setFlatFields(updatedFlat);
    try {
      const restored = unflattenObject(updatedFlat);
      setInputText(JSON.stringify(restored, null, 2));
      setNewKey('');
      setNewValue('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteField = (path: string) => {
    const updatedFlat = { ...flatFields };
    delete updatedFlat[path];
    setFlatFields(updatedFlat);
    try {
      const restored = unflattenObject(updatedFlat);
      setInputText(JSON.stringify(restored, null, 2));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = async () => {
    if (!inputText) return;
    try {
      await navigator.clipboard.writeText(inputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
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
            <div className="font-sans text-sm font-medium text-on-surface">JSON Editor</div>
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
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">JSON Editor</h1>
          <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
            Edit JSON structures dynamically. Use the dual-pane panel to edit raw text on the left, or edit nested properties as flattened key-value fields on the right.
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Raw Input Text Panel */}
          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                Raw JSON Document
              </label>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                  copied ? 'text-emerald-400' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Document
              </button>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste JSON here..."
              className="w-full h-[550px] bg-surface-container border border-outline-variant rounded-xl p-4 font-mono text-sm text-on-surface focus:outline-none focus:border-[#008cff] transition-colors resize-none placeholder:text-outline"
            />

            <div className="mt-2 text-[11px] font-mono text-on-surface-variant">
              Status: {errorMsg ? <span className="text-red-400">Syntax Error ({errorMsg})</span> : <span className="text-emerald-400">Valid & Parsed</span>}
            </div>
          </div>

          {/* Interactive Properties Panel */}
          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col justify-between">
            
            {/* Top Form to Add Fields */}
            <form onSubmit={handleAddField} className="mb-6 bg-surface-container-high/40 p-4 border border-outline-variant rounded-xl flex flex-col gap-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5 font-bold">
                <Plus className="w-3.5 h-3.5 text-[#008cff]" /> Add Property Key
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-4">
                  <label className="font-sans text-[10px] text-outline block mb-1">Path Name</label>
                  <input
                    type="text"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    placeholder="e.g. user.age"
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#008cff]"
                  />
                </div>
                
                <div className="sm:col-span-3">
                  <label className="font-sans text-[10px] text-outline block mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#008cff]"
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="font-sans text-[10px] text-outline block mb-1">Initial Value</label>
                  <input
                    type="text"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="Value..."
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#008cff]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-[#008cff] hover:bg-[#0070cc] text-white font-mono text-[10px] uppercase tracking-wider py-2 rounded-lg transition-colors font-semibold shadow-sm"
                  >
                    Add
                  </button>
                </div>
              </div>
            </form>

            {/* List of Flattened Fields */}
            <div className="w-full h-[400px] bg-surface-container-lowest border border-outline-variant rounded-xl p-4 overflow-y-auto flex flex-col gap-3 scrollbar-thin">
              {Object.keys(flatFields).length > 0 ? (
                Object.entries(flatFields).map(([path, val]) => {
                  const valType = typeof val;
                  return (
                    <div
                      key={path}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-surface-container/60 border border-outline-variant/50 rounded-xl hover:border-outline-variant transition-colors"
                    >
                      <div className="overflow-hidden flex-grow pr-3">
                        <span className="font-mono text-xs text-[#008cff] font-semibold break-all block mb-1.5 select-all">
                          {path}
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-outline">
                          Type: {valType}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        {valType === 'boolean' ? (
                          <select
                            value={String(val)}
                            onChange={(e) => handleFieldChange(path, e.target.value === 'true')}
                            className="bg-surface-container-low border border-outline-variant rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#008cff]"
                          >
                            <option value="true">true</option>
                            <option value="false">false</option>
                          </select>
                        ) : (
                          <input
                            type={valType === 'number' ? 'number' : 'text'}
                            value={val === null ? '' : val}
                            onChange={(e) => handleFieldChange(path, valType === 'number' ? Number(e.target.value) : e.target.value)}
                            className="bg-surface-container-low border border-outline-variant rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#008cff] w-36 font-mono"
                          />
                        )}

                        <button
                          onClick={() => handleDeleteField(path)}
                          className="p-1.5 text-on-surface-variant hover:text-red-400 transition-colors rounded-lg border border-outline-variant/30 hover:border-red-500/20 bg-surface-container-low"
                          title="Delete property"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex items-center justify-center text-outline text-xs font-mono">
                  No properties to edit. Input JSON on the left to start.
                </div>
              )}
            </div>

            <div className="mt-2 text-[11px] font-mono text-on-surface-variant">
              Flattened Properties Count: {Object.keys(flatFields).length}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
