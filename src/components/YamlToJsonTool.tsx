import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import yaml from 'js-yaml';

interface YamlToJsonToolProps {
  onBack: () => void;
}

export default function YamlToJsonTool({ onBack }: YamlToJsonToolProps) {
  const [yamlInput, setYamlInput] = useState('name: John Doe\\nage: 30\\nskills:\\n  - JavaScript\\n  - React\\n  - Node.js');
  const [jsonOutput, setJsonOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!yamlInput.trim()) {
      setJsonOutput('');
      setError(null);
      return;
    }
    try {
      const parsed = yaml.load(yamlInput);
      setJsonOutput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Invalid YAML');
      setJsonOutput('');
    }
  }, [yamlInput]);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">YAML to JSON Converter</h1>
        <p className="text-on-surface-variant mb-8">Convert YAML text to JSON objects reliably.</p>

        <div className="grid md:grid-cols-2 gap-6 min-h-[500px]">
          <div className="bg-surface rounded-xl border border-outline flex flex-col overflow-hidden">
            <div className="p-4 bg-background border-b border-outline font-bold">YAML Input</div>
            {error && <div className="p-3 bg-red-500/10 text-red-500 text-sm font-mono break-all">{error}</div>}
            <textarea
              className="w-full h-full bg-surface border-none p-4 font-mono text-sm focus:outline-none resize-none"
              value={yamlInput}
              onChange={(e) => setYamlInput(e.target.value)}
              spellCheck={false}
              placeholder="Paste YAML here..."
            />
          </div>

          <div className="bg-surface rounded-xl border border-outline flex flex-col overflow-hidden relative">
            <div className="p-4 bg-background border-b border-outline flex items-center justify-between">
              <span className="font-bold">JSON Output</span>
              <button
                onClick={handleCopy}
                disabled={!jsonOutput}
                className="flex items-center gap-2 bg-primary text-on-primary px-3 py-1.5 text-sm rounded font-bold hover:bg-surface-tint disabled:opacity-50 transition-colors"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                Copy
              </button>
            </div>
            <textarea
              className="w-full h-full bg-surface border-none p-4 font-mono text-sm whitespace-pre-wrap focus:outline-none resize-none"
              value={jsonOutput}
              readOnly
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
