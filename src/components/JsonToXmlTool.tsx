import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Shield, Trash2, Download } from 'lucide-react';

function jsonToXmlString(val: any, nodeName = 'item', depth = 1): string {
  const indent = '  '.repeat(depth);
  
  if (val === null) return `${indent}<${nodeName}>null</${nodeName}>`;
  if (typeof val === 'boolean' || typeof val === 'number') {
    return `${indent}<${nodeName}>${val}</${nodeName}>`;
  }
  if (typeof val === 'string') {
    const escaped = val
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
    return `${indent}<${nodeName}>${escaped}</${nodeName}>`;
  }

  if (Array.isArray(val)) {
    return val.map(item => jsonToXmlString(item, nodeName, depth)).join('\n');
  }

  if (typeof val === 'object') {
    // Validate tag name (must start with letter or underscore, no spaces)
    const cleanNodeName = nodeName.replace(/[^a-zA-Z0-9_-]/g, '_');
    let xml = `${indent}<${cleanNodeName}`;
    
    // Attributes support
    const attrs = val['@attributes'];
    if (attrs && typeof attrs === 'object') {
      for (const k in attrs) {
        xml += ` ${k}="${attrs[k]}"`;
      }
    }
    
    const childrenKeys = Object.keys(val).filter(k => k !== '@attributes');
    if (childrenKeys.length === 0) {
      xml += ' />';
      return xml;
    }

    xml += '>\n';
    
    const childrenXml = childrenKeys.map(k => {
      return jsonToXmlString(val[k], k, depth + 1);
    }).join('\n');
    
    xml += childrenXml + `\n${indent}</${cleanNodeName}>`;
    return xml;
  }

  return '';
}

function convertJsonToXml(jsonStr: string, rootName = 'root', includeDeclaration = true): string {
  const parsed = JSON.parse(jsonStr);
  let xml = includeDeclaration ? '<?xml version="1.0" encoding="UTF-8"?>\n' : '';
  
  const cleanRootName = rootName.replace(/[^a-zA-Z0-9_-]/g, '_');

  if (Array.isArray(parsed)) {
    xml += `<${cleanRootName}>\n`;
    xml += parsed.map(item => jsonToXmlString(item, 'item', 1)).join('\n');
    xml += `\n</${cleanRootName}>`;
  } else {
    xml += jsonToXmlString(parsed, cleanRootName, 0);
  }

  return xml;
}

export default function JsonToXmlTool({ onBack }: { onBack?: () => void }) {
  const [inputText, setInputText] = useState(`{
  "note": {
    "@attributes": {
      "id": "101"
    },
    "to": "Tove",
    "from": "Jani",
    "heading": "Reminder",
    "body": "Don't forget me this weekend!"
  }
}`);

  const [outputText, setOutputText] = useState('');
  const [rootElement, setRootElement] = useState('root');
  const [declaration, setDeclaration] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setErrorMsg(null);
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }
    try {
      setOutputText(convertJsonToXml(inputText, rootElement, declaration));
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to parse JSON.');
      setOutputText('');
    }
  }, [inputText, rootElement, declaration]);

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
    const blob = new Blob([outputText], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.xml';
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
            <div className="font-sans text-sm font-medium text-on-surface">JSON to XML</div>
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
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">JSON to XML</h1>
            <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
              Convert structured JSON objects or arrays back into standard valid XML documents. Customize root wrapper tag and XML declarations.
            </p>
          </div>
        </div>

        {/* Dual Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* JSON Input Panel */}
          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                JSON Source Text
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
              placeholder='{ "root": { "element": "Value" } }'
              className="w-full h-80 bg-surface-container border border-outline-variant rounded-xl p-4 font-mono text-sm text-on-surface focus:outline-none focus:border-[#008cff] transition-colors resize-none placeholder:text-outline"
            />

            {/* Custom parameters block */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface-container-high/40 p-4 border border-outline-variant/60 rounded-xl">
              <div>
                <label className="font-sans text-[10px] text-outline block mb-1">Root Tag Name</label>
                <input
                  type="text"
                  value={rootElement}
                  onChange={(e) => setRootElement(e.target.value)}
                  placeholder="root"
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#008cff]"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="include-decl"
                  checked={declaration}
                  onChange={(e) => setDeclaration(e.target.checked)}
                  className="rounded border-outline-variant bg-surface-container text-[#008cff] focus:ring-[#008cff] w-4 h-4"
                />
                <label htmlFor="include-decl" className="font-sans text-xs text-on-surface-variant cursor-pointer select-none">
                  Include XML Declaration Tag
                </label>
              </div>
            </div>
          </div>

          {/* XML Output Panel */}
          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                XML Output Markup
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
                <p className="font-sans text-sm font-semibold text-red-400">XML Conversion Failed</p>
                <p className="font-sans text-xs text-on-surface-variant max-w-xs leading-relaxed font-mono">
                  {errorMsg}
                </p>
              </div>
            ) : (
              <textarea
                readOnly
                value={outputText}
                placeholder="Converted XML string will load here..."
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
