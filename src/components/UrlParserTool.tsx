import React, { useState } from 'react';
import { ArrowLeft, Copy, Check } from 'lucide-react';

interface UrlParserToolProps {
  onBack: () => void;
}

export default function UrlParserTool({ onBack }: UrlParserToolProps) {
  const [url, setUrl] = useState('https://www.example.com:8080/path/to/resource?search=query&user=123#hash-section');
  
  let parsedUrl: URL | null = null;
  let params: [string, string][] = [];
  
  try {
    parsedUrl = new URL(url);
    parsedUrl.searchParams.forEach((value, key) => {
      params.push([key, value]);
    });
  } catch {
    parsedUrl = null;
  }

  const Segment = ({ label, value }: { label: string, value: string }) => (
    <div className="p-3 bg-background border border-outline rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <span className="font-bold text-sm text-on-surface-variant min-w-[120px]">{label}</span>
      <span className="font-mono text-sm break-all">{value || <span className="opacity-50 italic">empty</span>}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">URL Parser</h1>
        <p className="text-on-surface-variant mb-8">Parse and extract information from URLs instantly.</p>

        <div className="bg-surface p-6 rounded-xl border border-outline mb-6">
          <label className="block text-sm font-bold mb-2">Full URL</label>
          <textarea
            className="w-full bg-background border border-outline rounded-xl px-4 py-3 focus:outline-none focus:border-primary font-mono text-sm min-h-[100px]"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>

        {parsedUrl ? (
          <div className="space-y-6">
            <div className="bg-surface p-6 rounded-xl border border-outline grid gap-2">
              <h2 className="font-bold text-lg mb-2">URL Parts</h2>
              <Segment label="Protocol" value={parsedUrl.protocol} />
              <Segment label="Host" value={parsedUrl.host} />
              <Segment label="Hostname" value={parsedUrl.hostname} />
              <Segment label="Port" value={parsedUrl.port} />
              <Segment label="Pathname" value={parsedUrl.pathname} />
              <Segment label="Search/Query" value={parsedUrl.search} />
              <Segment label="Hash/Fragment" value={parsedUrl.hash} />
              <Segment label="Origin" value={parsedUrl.origin} />
            </div>

            {params.length > 0 && (
              <div className="bg-surface p-6 rounded-xl border border-outline">
                <h2 className="font-bold text-lg mb-4">Query Parameters</h2>
                <div className="grid gap-2">
                  {params.map(([key, val], i) => (
                    <div key={i} className="flex flex-col sm:flex-row border-b border-outline/50 last:border-0 pb-2 mb-2 last:mb-0 last:pb-0 gap-2">
                      <div className="sm:w-1/3 font-bold font-mono text-sm text-primary break-all">{key}</div>
                      <div className="sm:w-2/3 font-mono text-sm break-all">{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 text-center font-bold">
             Invalid URL. Make sure it includes the protocol (e.g. https://).
          </div>
        )}
      </div>
    </div>
  );
}
