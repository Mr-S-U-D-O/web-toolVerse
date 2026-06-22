import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Shield, Trash2, Download } from 'lucide-react';

function flattenObject(obj: any, prefix = '', res: Record<string, any> = {}): Record<string, any> {
  if (obj === null || typeof obj !== 'object') {
    if (prefix) res[prefix] = obj;
    return res;
  }
  
  for (const k in obj) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (typeof obj[k] === 'object' && obj[k] !== null) {
      flattenObject(obj[k], p, res);
    } else {
      res[p] = obj[k];
    }
  }
  return res;
}

function jsonToYaml(val: any, depth = 0): string {
  const indent = '  '.repeat(depth);
  if (val === null) return 'null';
  if (typeof val !== 'object') return String(val);

  if (Array.isArray(val)) {
    if (val.length === 0) return '[]';
    return val.map(item => {
      const itemStr = jsonToYaml(item, depth + 1);
      return `\n${indent}- ${itemStr.trim()}`;
    }).join('');
  }

  const keys = Object.keys(val);
  if (keys.length === 0) return '{}';

  return keys.map(k => {
    const value = val[k];
    const valStr = jsonToYaml(value, depth + 1);
    if (typeof value === 'object' && value !== null) {
      return `\n${indent}${k}:${valStr}`;
    }
    return `\n${indent}${k}: ${valStr}`;
  }).join('').trim();
}

function convertJsonToText(jsonStr: string, mode: string): string {
  const parsed = JSON.parse(jsonStr);
  if (mode === 'yaml') {
    return jsonToYaml(parsed).trim();
  }

  // Default: flat path mode
  const flattened = flattenObject(parsed);
  return Object.entries(flattened)
    .map(([path, val]) => `${path}: ${val === null ? 'null' : String(val)}`)
    .join('\n');
}

export default function JsonToTextTool({ onBack }: { onBack?: () => void }) {
  const [inputText, setInputText] = useState(`{
  "project": "Tool Cabinet",
  "version": "1.2.0",
  "author": {
    "name": "Antigravity",
    "role": "Developer"
  },
  "tags": ["React", "Typescript", "Vite"]
}`);

  const [outputText, setOutputText] = useState('');
  const [textMode, setTextMode] = useState('flat'); // 'flat', 'yaml'
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setErrorMsg(null);
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }
    try {
      setOutputText(convertJsonToText(inputText, textMode));
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to parse JSON.');
      setOutputText('');
    }
  }, [inputText, textMode]);

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
    const ext = textMode === 'yaml' ? 'yaml' : 'txt';
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
            <span className="font-mono text-[11px] uppercase tracking-widest">Tool Cabinet</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="font-sans text-sm font-medium text-on-surface">JSON to Text</div>
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
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">JSON to Text</h1>
            <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
              Convert structured JSON data into flat key-value text maps or clean indentation YAML layout syntax.
            </p>
          </div>
        </div>

        {/* Dual Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* JSON Input Panel */}
          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                JSON Document Input
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
              placeholder='{ "key": "value" }'
              className="w-full h-80 bg-surface-container border border-outline-variant rounded-xl p-4 font-mono text-sm text-on-surface focus:outline-none focus:border-[#008cff] transition-colors resize-none placeholder:text-outline"
            />

            {/* Custom parameters block */}
            <div className="mt-4 flex items-center justify-between bg-surface-container-high/40 p-4 border border-outline-variant/60 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
                  Text Mode Format:
                </span>
                <select
                  value={textMode}
                  onChange={(e) => setTextMode(e.target.value)}
                  className="bg-surface-container border border-outline-variant rounded-lg px-2.5 py-1 text-xs font-sans text-on-surface focus:outline-none focus:border-[#008cff] transition-colors"
                >
                  <option value="flat">Flat Key-Value Path (.txt)</option>
                  <option value="yaml">Clean YAML Format (.yaml)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Text Output Panel */}
          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                Output Plain Text
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
                <p className="font-sans text-sm font-semibold text-red-400">Conversion Failed</p>
                <p className="font-sans text-xs text-on-surface-variant max-w-xs leading-relaxed font-mono">
                  {errorMsg}
                </p>
              </div>
            ) : (
              <textarea
                readOnly
                value={outputText}
                placeholder="Text conversion results will load here..."
                className="w-full h-[380px] bg-surface-container-lowest border border-outline-variant rounded-xl p-4 font-mono text-sm text-[#008cff] focus:outline-none resize-none placeholder:text-outline/70"
              />
            )}

            <div className="mt-2 text-[11px] font-mono text-on-surface-variant">
              Output Length: {outputText.length} chars
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
