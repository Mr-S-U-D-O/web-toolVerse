import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Shield, Search, MapPin, Network, Clock, Globe } from 'lucide-react';

interface GeoData {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  country_code: string;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  org: string;
  error?: boolean;
  reason?: string;
}

export default function IpAddressLookupTool({ onBack }: { onBack?: () => void }) {
  const [ipInput, setIpInput] = useState('8.8.8.8');
  const [data, setData] = useState<GeoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedIp, setCopiedIp] = useState(false);

  const handleLookup = async () => {
    const trimmed = ipInput.trim();
    if (!trimmed) {
      setErrorMsg('Please enter a valid IP address.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setData(null);

    try {
      const res = await fetch(`https://ipapi.co/${encodeURIComponent(trimmed)}/json/`);
      if (!res.ok) throw new Error('API server returned an error.');
      const result: GeoData = await res.json();
      
      if (result.error) {
        throw new Error(result.reason || 'IP Lookup failed.');
      }

      setData(result);
    } catch (err) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : 'Could not fetch details for this IP address.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleLookup();
  }, []);

  const handleCopyIp = async () => {
    if (!data?.ip) return;
    try {
      await navigator.clipboard.writeText(data.ip);
      setCopiedIp(true);
      setTimeout(() => setCopiedIp(false), 2000);
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
            <div className="font-sans text-sm font-medium text-on-surface">IP Address Lookup</div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#008cff]/10 border border-[#008cff]/20 text-[10px] font-mono uppercase tracking-wider text-[#008cff]">
              <Shield className="w-3 h-3" />
              100% Client-Side
            </div>
          </div>
          <div className="w-[120px]" />
        </div>
      </header>

      <main className="max-w-[1000px] mx-auto px-6 py-10 w-full">
        {/* Title */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">IP Address Lookup</h1>
          <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
            Query the geological location coordinates, internet service provider, and regional details of any public IPv4 or IPv6 address.
          </p>
        </div>

        {/* Input panel */}
        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
              placeholder="e.g. 8.8.8.8 or 2001:4860:4860::8888"
              className="flex-grow bg-surface-container border border-outline-variant rounded-xl p-4 font-mono text-base text-on-surface focus:outline-none focus:border-[#008cff] transition-colors"
            />
            <button
              onClick={handleLookup}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-[#008cff] text-white hover:bg-[#0070cc] rounded-xl text-sm font-mono uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              Lookup
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <div className="w-8 h-8 rounded-full border-4 border-[#008cff] border-t-transparent animate-spin"></div>
            <p className="font-mono text-xs uppercase tracking-wider text-outline">Retrieving location records...</p>
          </div>
        ) : errorMsg ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl text-center font-sans">
            {errorMsg}
          </div>
        ) : data ? (
          <div className="flex flex-col gap-6">
            
            {/* Main Result IP Display */}
            <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden group">
              <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-72 h-72 rounded-full bg-[#008cff]/5 blur-3xl pointer-events-none" />
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  Target IP Address
                </span>
                <h2 className="text-3xl md:text-5xl font-bold font-mono tracking-tight text-white mt-1">
                  {data.ip}
                </h2>
              </div>

              <button
                onClick={handleCopyIp}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-mono uppercase tracking-wider transition-all duration-300 ${
                  copiedIp
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-[#008cff] text-white hover:bg-[#0070cc] shadow-md'
                }`}
              >
                {copiedIp ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedIp ? 'Copied' : 'Copy IP'}
              </button>
            </div>

            {/* Geo details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Location Card */}
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant flex flex-col gap-4">
                <h3 className="font-heading font-semibold text-sm text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#008cff]" />
                  Geographic Location
                </h3>
                <div className="flex flex-col gap-2.5 font-sans text-sm text-on-surface-variant">
                  <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                    <span>Country</span>
                    <span className="font-medium text-white">{data.country_name} ({data.country_code})</span>
                  </div>
                  <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                    <span>Region / State</span>
                    <span className="font-medium text-white">{data.region || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                    <span>City</span>
                    <span className="font-medium text-white">{data.city || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span>Postal Code</span>
                    <span className="font-medium text-white">{data.postal || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Provider Card */}
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant flex flex-col gap-4">
                <h3 className="font-heading font-semibold text-sm text-white flex items-center gap-2">
                  <Network className="w-4 h-4 text-[#008cff]" />
                  ISP Network Operator
                </h3>
                <div className="flex flex-col gap-2.5 font-sans text-sm text-on-surface-variant">
                  <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                    <span>AS / Org</span>
                    <span className="font-medium text-white text-right truncate max-w-[150px]" title={data.org}>
                      {data.org || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                    <span>Latitude</span>
                    <span className="font-mono text-white">{data.latitude}°</span>
                  </div>
                  <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                    <span>Longitude</span>
                    <span className="font-mono text-white">{data.longitude}°</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span>Map Coordinates</span>
                    {data.latitude && data.longitude ? (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[#008cff] hover:underline"
                      >
                        View on Map
                      </a>
                    ) : (
                      <span>N/A</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Timezone Card */}
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant flex flex-col gap-4">
                <h3 className="font-heading font-semibold text-sm text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#008cff]" />
                  Local Details
                </h3>
                <div className="flex flex-col gap-2.5 font-sans text-sm text-on-surface-variant">
                  <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                    <span>Timezone</span>
                    <span className="font-medium text-white">{data.timezone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                    <span>Continent</span>
                    <span className="font-medium text-white">{data.timezone?.split('/')[0] || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span>API Query</span>
                    <span className="font-medium text-emerald-400">Success</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        ) : null}
      </main>
    </div>
  );
}
