import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Shield, Trash2, Download } from 'lucide-react';

function xmlNodeToJson(node: Node): any {
  if (node.nodeType === 3) { // TEXT_NODE
    return node.nodeValue?.trim() || null;
  }
  
  if (node.nodeType !== 1) { // ELEMENT_NODE
    return null;
  }

  const obj: any = {};
  const element = node as Element;

  // Parse attributes
  if (element.attributes && element.attributes.length > 0) {
    obj['@attributes'] = {};
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      obj['@attributes'][attr.nodeName] = attr.nodeValue;
    }
  }

  // Parse child nodes
  const childNodes = element.childNodes;
  let hasElements = false;
  const childGroups: Record<string, any[]> = {};

  for (let i = 0; i < childNodes.length; i++) {
    const child = childNodes[i];
    if (child.nodeType === 1) { // ELEMENT_NODE
      hasElements = true;
      const childName = child.nodeName;
      if (!childGroups[childName]) {
        childGroups[childName] = [];
      }
      const parsedChild = xmlNodeToJson(child);
      if (parsedChild !== null) {
        childGroups[childName].push(parsedChild);
      }
    } else if (child.nodeType === 3) { // TEXT_NODE
      const txt = child.nodeValue?.trim();
      if (txt) {
        if (!obj['#text']) obj['#text'] = '';
        obj['#text'] += (obj['#text'] ? ' ' : '') + txt;
      }
    }
  }

  // Assign child groups
  for (const name in childGroups) {
    const group = childGroups[name];
    if (group.length === 1) {
      obj[name] = group[0];
    } else {
      obj[name] = group;
    }
  }

  // Simplify objects that only have text
  const keys = Object.keys(obj);
  if (keys.length === 1 && keys[0] === '#text') {
    return obj['#text'];
  }
  if (keys.length === 0 && !hasElements) {
    return '';
  }

  return obj;
}

function convertXmlToJson(xmlStr: string): string {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlStr, 'text/xml');
  
  const parserError = xmlDoc.getElementsByTagName('parsererror');
  if (parserError.length > 0) {
    throw new Error(parserError[0].textContent || 'XML Syntax Error');
  }

  const rootElement = xmlDoc.documentElement;
  if (!rootElement) {
    throw new Error('No root XML element detected.');
  }

  const res: any = {};
  res[rootElement.nodeName] = xmlNodeToJson(rootElement);
  return JSON.stringify(res, null, 2);
}

export default function XmlToJsonTool({ onBack }: { onBack?: () => void }) {
  const [inputText, setInputText] = useState(`<note>
  <to>Tove</to>
  <from>Jani</from>
  <heading>Reminder</heading>
  <body>Don't forget me this weekend!</body>
</note>`);

  const [outputText, setOutputText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setErrorMsg(null);
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }
    try {
      setOutputText(convertXmlToJson(inputText));
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to parse XML.');
      setOutputText('');
    }
  }, [inputText]);

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
    const blob = new Blob([outputText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.json';
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
            <div className="font-sans text-sm font-medium text-on-surface">XML to JSON</div>
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
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">XML to JSON</h1>
            <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
              Convert structured XML documents or segments into valid formatted JSON strings using the browser's native XML parsing engine.
            </p>
          </div>
        </div>

        {/* Dual Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* XML Input Panel */}
          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                XML Document Input
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
              placeholder="<root><element>Value</element></root>"
              className="w-full h-96 bg-surface-container border border-outline-variant rounded-xl p-4 font-mono text-sm text-on-surface focus:outline-none focus:border-[#008cff] transition-colors resize-none placeholder:text-outline"
            />

            <div className="mt-2 text-[11px] font-mono text-on-surface-variant">
              Length: {inputText.length} chars
            </div>
          </div>

          {/* JSON Output Panel */}
          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                Converted JSON Output
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
                placeholder="Converted JSON text will display here..."
                className="w-full h-96 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 font-mono text-sm text-[#008cff] focus:outline-none resize-none placeholder:text-outline/70"
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
