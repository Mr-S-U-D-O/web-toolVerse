import React, { useState } from 'react';
import { ArrowLeft, Key, Code } from 'lucide-react';

interface JwtDecoderToolProps {
  onBack: () => void;
}

export default function JwtDecoderTool({ onBack }: JwtDecoderToolProps) {
  const [token, setToken] = useState<string>('');
  
  const decodeJwt = (t: string) => {
    try {
      const parts = t.split('.');
      if (parts.length !== 3) return null;
      
      const decodeB64 = (str: string) => {
        // Handle Base64Url
        const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
        const pad = b64.length % 4;
        const padded = pad ? b64 + '='.repeat(4 - pad) : b64;
        return decodeURIComponent(atob(padded).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      };

      return {
        header: JSON.parse(decodeB64(parts[0])),
        payload: JSON.parse(decodeB64(parts[1])),
        signature: parts[2]
      };
    } catch {
      return null;
    }
  };

  const decoded = token ? decodeJwt(token) : null;

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

        <h1 className="text-3xl font-bold font-heading mb-2">JWT Decoder</h1>
        <p className="text-on-surface-variant mb-8">Decode JSON Web Tokens securely on the client-side.</p>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="bg-surface rounded-xl p-6 border border-outline flex flex-col gap-4">
            <h2 className="font-bold mb-2 flex items-center gap-2">
              <Key size={18} className="text-primary"/>
              Encoded Token
            </h2>
            <textarea
              className="w-full bg-background border border-outline rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-primary min-h-[300px] resize-y break-all"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            />
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-surface rounded-xl border border-outline overflow-hidden">
              <div className="p-4 border-b border-outline bg-background flex items-center gap-2">
                <Code size={18} className="text-primary"/>
                <span className="font-bold">Header (Algorithm & Type)</span>
              </div>
              <div className="p-4 bg-background font-mono text-sm overflow-x-auto">
                {decoded ? (
                  <pre className="text-primary">{JSON.stringify(decoded.header, null, 2)}</pre>
                ) : (
                  <span className="text-on-surface-variant italic">Invalid or empty token</span>
                )}
              </div>
            </div>

            <div className="bg-surface rounded-xl border border-outline overflow-hidden">
              <div className="p-4 border-b border-outline bg-background flex items-center gap-2">
                <Code size={18} className="text-primary"/>
                <span className="font-bold">Payload (Data)</span>
              </div>
              <div className="p-4 bg-background font-mono text-sm overflow-x-auto min-h-[200px]">
                {decoded ? (
                  <pre className="text-green-600 dark:text-green-400">{JSON.stringify(decoded.payload, null, 2)}</pre>
                ) : (
                  <span className="text-on-surface-variant italic">Invalid or empty token</span>
                )}
              </div>
            </div>

            {decoded && (
              <div className="text-xs text-on-surface-variant break-all">
                <span className="font-bold block mb-1">Signature:</span>
                {decoded.signature}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
