import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check } from 'lucide-react';

interface XmlToJsonToolProps {
  onBack: () => void;
}

export default function XmlToJsonTool({ onBack }: XmlToJsonToolProps) {
  const [xml, setXml] = useState('<user>\n  <id>1</id>\n  <name>John Doe</name>\n</user>');
  const [json, setJson] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!xml.trim()) {
      setJson('');
      setError(null);
      return;
    }

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, 'text/xml');
      const parseError = xmlDoc.getElementsByTagName('parsererror');
      if (parseError.length > 0) {
        throw new Error('Invalid XML');
      }

      const xmlToJson = (node: any) => {
        let obj: any = {};
        if (node.nodeType === 1) {
          if (node.attributes.length > 0) {
            obj['@attributes'] = {};
            for (let j = 0; j < node.attributes.length; j++) {
              const attribute = node.attributes.item(j);
              obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
            }
          }
        } else if (node.nodeType === 3) {
          obj = node.nodeValue.trim();
        }

        if (node.hasChildNodes()) {
          for (let i = 0; i < node.childNodes.length; i++) {
            const item = node.childNodes.item(i);
            const nodeName = item.nodeName;

            if (item.nodeType === 3) {
              if (item.nodeValue.trim() !== '') {
                 obj = item.nodeValue.trim();
              }
            } else {
              if (typeof obj[nodeName] === 'undefined') {
                obj[nodeName] = xmlToJson(item);
              } else {
                if (typeof obj[nodeName].push === 'undefined') {
                  const old = obj[nodeName];
                  obj[nodeName] = [];
                  obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
              }
            }
          }
        }
        return obj;
      };

      const result = xmlToJson(xmlDoc);
      setJson(JSON.stringify(result, null, 2));
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Error parsing XML');
      setJson('');
    }
  }, [xml]);

  const handleCopy = () => {
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">XML to JSON Converter</h1>
        <p className="text-on-surface-variant mb-8">Parse and convert XML strings into JSON objects.</p>

        <div className="grid md:grid-cols-2 gap-6 min-h-[500px]">
          <div className="bg-surface rounded-xl border border-outline flex flex-col overflow-hidden">
            <div className="p-4 bg-background border-b border-outline font-bold">XML Input</div>
            {error && <div className="p-3 bg-red-500/10 text-red-500 text-sm font-mono break-all">{error}</div>}
            <textarea
              className="w-full h-full bg-surface border-none p-4 font-mono text-sm focus:outline-none resize-none"
              value={xml}
              onChange={(e) => setXml(e.target.value)}
              placeholder="Paste XML here..."
            />
          </div>

          <div className="bg-surface rounded-xl border border-outline flex flex-col overflow-hidden relative">
            <div className="p-4 bg-background border-b border-outline flex items-center justify-between">
              <span className="font-bold">JSON Output</span>
              <button
                onClick={handleCopy}
                disabled={!json}
                className="flex items-center gap-2 bg-primary text-on-primary px-3 py-1.5 text-sm rounded font-bold hover:bg-surface-tint disabled:opacity-50 transition-colors"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                Copy
              </button>
            </div>
            <textarea
              className="w-full h-full bg-surface border-none p-4 font-mono text-sm whitespace-pre-wrap focus:outline-none resize-none"
              value={json}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}
