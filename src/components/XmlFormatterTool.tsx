import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, Code } from 'lucide-react';

interface XmlFormatterToolProps {
  onBack: () => void;
}

export default function XmlFormatterTool({ onBack }: XmlFormatterToolProps) {
  const [input, setInput] = useState<string>('<?xml version="1.0"?><catalog><book id="bk101"><author>Gambardella, Matthew</author><title>XML Developer\'s Guide</title><genre>Computer</genre><price>44.95</price><publish_date>2000-10-01</publish_date><description>An in-depth look at creating applications with XML.</description></book></catalog>');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formatXml = (xml: string) => {
    try {
      let formatted = '';
      let pad = 0;
      xml = xml.replace(/(>)(<)(\/*)/g, '$1\r\n$2$3');
      
      const padStr = (p: number) => {
        let s = '';
        for (let i = 0; i < p; i++) s += '  ';
        return s;
      };

      xml.split('\r\n').forEach((node) => {
        let indent = 0;
        if (node.match(/.+<\/\w[^>]*>$/)) {
          indent = 0;
        } else if (node.match(/^<\/\w/)) {
          if (pad !== 0) {
            pad -= 1;
          }
        } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
          indent = 1;
        } else {
          indent = 0;
        }

        formatted += padStr(pad) + node + '\n';
        pad += indent;
      });

      return formatted.trim();
    } catch {
      return xml;
    }
  };

  React.useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      // Basic check
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, 'application/xml');
      const parseError = doc.querySelector('parsererror');
      
      if (parseError) {
        setError(parseError.textContent || 'Syntax Error');
        setOutput(input);
      } else {
        setError(null);
        setOutput(formatXml(input));
      }
    } catch (e: any) {
      setError(e.message);
      setOutput(input);
    }
  }, [input]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">XML Formatter</h1>
        <p className="text-on-surface-variant mb-8">Format and beautify your XML data instantly.</p>

        <div className="grid lg:grid-cols-2 gap-6 min-h-[600px]">
          <div className="bg-surface rounded-xl flex flex-col border border-outline overflow-hidden">
            <div className="bg-background border-b border-outline p-4 flex items-center justify-between">
              <span className="font-bold flex items-center gap-2"><Code size={18} /> Raw XML</span>
            </div>
            <textarea
              className={`w-full h-full bg-background border-none p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-inset ${error ? 'focus:ring-red-500' : 'focus:ring-primary'} resize-none`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste raw XML here..."
            />
          </div>

          <div className="bg-surface rounded-xl flex flex-col border border-outline overflow-hidden relative">
            <div className="bg-background border-b border-outline p-4 flex items-center justify-between">
              <span className="font-bold flex items-center gap-2"><Code size={18} /> Beautified XML</span>
              <button
                onClick={handleCopy}
                disabled={!output || !!error}
                className="flex items-center gap-2 bg-primary text-on-primary px-3 py-1.5 text-sm rounded font-bold hover:bg-surface-tint disabled:opacity-50 transition-colors"
                title="Copy formatted XML"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            {error && (
              <div className="p-3 bg-red-500/10 text-red-500 border-b border-red-500/20 text-sm font-mono break-all">
                {error}
              </div>
            )}
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
