import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Shield, FileText, ChevronRight, ChevronDown, Search, Folder, FolderOpen } from 'lucide-react';

// Recursive Tree Node component
interface TreeNodeProps {
  label: string | number;
  value: any;
  depth: number;
  searchQuery: string;
}

function JsonTreeNode({ label, value, depth, searchQuery }: TreeNodeProps) {
  const [collapsed, setCollapsed] = useState(false);

  const isObject = value !== null && typeof value === 'object';
  const isArray = Array.isArray(value);

  // Render values by type
  const renderPrimitive = (val: any) => {
    if (val === null) return <span className="text-gray-400 font-mono">null</span>;
    if (typeof val === 'boolean') return <span className="text-amber-400 font-mono">{val ? 'true' : 'false'}</span>;
    if (typeof val === 'number') return <span className="text-amber-500 font-mono">{val}</span>;
    if (typeof val === 'string') {
      const isMatch = searchQuery && val.toLowerCase().includes(searchQuery.toLowerCase());
      return (
        <span className={`text-emerald-400 font-mono break-all ${isMatch ? 'bg-[#008cff]/20 px-0.5 rounded border border-[#008cff]/30 text-white font-semibold' : ''}`}>
          "{val}"
        </span>
      );
    }
    return <span className="text-white font-mono">{String(val)}</span>;
  };

  const handleCopyNode = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value));
    } catch (err) {
      console.error(err);
    }
  };

  // Label highlighting
  const isLabelMatch = searchQuery && String(label).toLowerCase().includes(searchQuery.toLowerCase());
  const formattedLabel = (
    <span className={`font-mono text-sm font-semibold select-all text-on-surface ${isLabelMatch ? 'bg-[#008cff]/30 px-0.5 rounded border border-[#008cff]/40 text-white font-bold' : ''}`}>
      {typeof label === 'number' ? label : `"${label}"`}
    </span>
  );

  if (!isObject) {
    return (
      <div className="flex items-start gap-1 py-1 font-mono text-xs hover:bg-surface-container/20 px-2 rounded-lg transition-colors group">
        <div className="w-4 h-4 flex-shrink-0" /> {/* Spacer */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {formattedLabel}
          <span className="text-outline">:</span>
          {renderPrimitive(value)}
        </div>
        <button
          onClick={handleCopyNode}
          className="ml-auto opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-white transition-all"
          title="Copy node value"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  const entries = isArray ? value.map((v, i) => [i, v]) : Object.entries(value);
  const itemsCount = entries.length;

  return (
    <div className="flex flex-col font-mono text-xs">
      <div
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-1 py-1 hover:bg-surface-container/20 px-2 rounded-lg cursor-pointer transition-colors group select-none"
      >
        <span className="text-outline-variant hover:text-white transition-colors">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>

        <span className="text-[#008cff] flex items-center gap-1.5">
          {collapsed ? <Folder className="w-3.5 h-3.5" /> : <FolderOpen className="w-3.5 h-3.5" />}
          {formattedLabel}
        </span>
        <span className="text-outline">:</span>

        <span className="text-outline-variant font-mono">
          {isArray ? `Array[${itemsCount}]` : `Object{${itemsCount}}`}
        </span>

        <button
          onClick={handleCopyNode}
          className="ml-auto opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-white transition-all"
          title="Copy JSON block"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
      </div>

      {!collapsed && (
        <div className="pl-6 border-l border-outline-variant/40 ml-4 flex flex-col gap-0.5 mt-0.5">
          {entries.length === 0 ? (
            <div className="py-0.5 text-outline-variant italic">empty</div>
          ) : (
            entries.map(([key, val], index) => (
              <JsonTreeNode
                key={key}
                label={key}
                value={val}
                depth={depth + 1}
                searchQuery={searchQuery}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function JsonViewerTool({ onBack }: { onBack?: () => void }) {
  const [inputText, setInputText] = useState(`{
  "project": "web-toolVerse",
  "version": "1.2.0",
  "author": "Antigravity AI",
  "features": [
    "100% Client-Side execution",
    "TailwindCSS styling",
    "Interactive code-splitting"
  ],
  "stats": {
    "totalTools": 40,
    "active": true
  }
}`);

  const [parsedJson, setParsedJson] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);

  useEffect(() => {
    setErrorMsg(null);
    if (!inputText.trim()) {
      setParsedJson(null);
      return;
    }
    try {
      setParsedJson(JSON.parse(inputText));
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid JSON format.');
      setParsedJson(null);
    }
  }, [inputText]);

  const handleCopyAll = async () => {
    if (!inputText) return;
    try {
      await navigator.clipboard.writeText(inputText);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setInputText(event.target?.result as string);
    };
    reader.readAsText(file);
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
            <div className="font-sans text-sm font-medium text-on-surface">JSON Viewer</div>
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
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">JSON Viewer</h1>
            <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
              Inspect structured JSON data. View it as an interactive, collapsible tree to easily locate properties, trace keys, and copy partial components.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="file"
              id="file-json"
              accept=".json"
              className="hidden"
              onChange={handleFileUpload}
            />
            <label
              htmlFor="file-json"
              className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface-container hover:bg-surface-container-high hover:border-[#008cff] rounded-xl text-xs font-mono uppercase tracking-wider text-on-surface cursor-pointer transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              Upload JSON
            </label>
          </div>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Input Panel */}
          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                Raw JSON String Input
              </label>
              <button
                onClick={handleCopyAll}
                className={`flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                  copiedAll ? 'text-emerald-400' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Input
              </button>
            </div>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste raw JSON here..."
              className="w-full h-[500px] bg-surface-container border border-outline-variant rounded-xl p-4 font-mono text-sm text-on-surface focus:outline-none focus:border-[#008cff] transition-colors resize-none placeholder:text-outline"
            />
            
            <div className="mt-2 text-[11px] font-mono text-on-surface-variant flex justify-between">
              <span>Size: {(inputText.length / 1024).toFixed(2)} KB</span>
              <span>Characters: {inputText.length}</span>
            </div>
          </div>

          {/* Interactive Tree View Panel */}
          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                Interactive Tree Inspection
              </label>
              
              {parsedJson && (
                <div className="relative flex items-center bg-surface-container border border-outline-variant rounded-lg px-2 py-1 max-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-outline mr-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search keys/values..."
                    className="bg-transparent border-none outline-none font-sans text-xs text-white placeholder:text-outline w-full"
                  />
                </div>
              )}
            </div>

            <div className="w-full h-[500px] bg-surface-container-lowest border border-outline-variant rounded-xl p-4 overflow-auto scrollbar-thin">
              {errorMsg ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 font-mono text-sm font-semibold">
                    !
                  </div>
                  <p className="font-sans text-sm font-semibold text-red-400">JSON Parsing Failed</p>
                  <p className="font-sans text-xs text-on-surface-variant max-w-xs leading-relaxed font-mono">
                    {errorMsg}
                  </p>
                </div>
              ) : parsedJson ? (
                <div className="flex flex-col gap-1.5">
                  <JsonTreeNode
                    label="Root"
                    value={parsedJson}
                    depth={0}
                    searchQuery={searchQuery}
                  />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-outline text-xs font-mono">
                  Input JSON to visualize tree structure...
                </div>
              )}
            </div>

            <div className="mt-2 text-[11px] font-mono text-on-surface-variant flex justify-between">
              <span>Status: {errorMsg ? 'Invalid JSON' : parsedJson ? 'Parsed OK' : 'Idle'}</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
