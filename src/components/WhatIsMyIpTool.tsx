import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Shield, RefreshCw, Globe, MapPin, Network, Clock } from 'lucide-react';

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
}

export default function WhatIsMyIpTool({ onBack }: { onBack?: () => void }) {
  const [data, setData] = useState<GeoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedIp, setCopiedIp] = useState(false);

  const fetchIpDetails = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (!res.ok) throw new Error('Failed to retrieve IP address profile.');
      const result: GeoData = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not fetch IP location data. Check your network or disable adblockers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIpDetails();
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
            <span className="font-mono text-[11px] uppercase tracking-widest">Tool Cabinet</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="font-sans text-sm font-medium text-on-surface">What Is My IP</div>
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
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">What Is My IP</h1>
            <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
              Quickly display your current public IP address and trace its geographical metadata, network provider, and timezone information.
            </p>
          </div>

          <button
            onClick={fetchIpDetails}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface-container hover:bg-surface-container-high hover:border-[#008cff] rounded-xl text-xs font-mono uppercase tracking-wider text-on-surface transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <div className="w-8 h-8 rounded-full border-4 border-[#008cff] border-t-transparent animate-spin"></div>
            <p className="font-mono text-xs uppercase tracking-wider text-outline">Loading IP profile...</p>
          </div>
        ) : errorMsg ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl text-center font-sans">
            {errorMsg}
          </div>
        ) : data ? (
          <div className="flex flex-col gap-6">
            
            {/* Main IP Display */}
            <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden group">
              <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-72 h-72 rounded-full bg-[#008cff]/5 blur-3xl pointer-events-none" />
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
                  Your Public IP Address
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
                {copiedIp ? 'Copied IP' : 'Copy IP Address'}
              </button>
            </div>

            {/* IP Details Grid */}
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
                    <span className="font-medium text-white">{data.region}</span>
                  </div>
                  <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                    <span>City</span>
                    <span className="font-medium text-white">{data.city}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span>Postal Code</span>
                    <span className="font-medium text-white">{data.postal || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Network Provider Card */}
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant flex flex-col gap-4">
                <h3 className="font-heading font-semibold text-sm text-white flex items-center gap-2">
                  <Network className="w-4 h-4 text-[#008cff]" />
                  Internet Provider
                </h3>
                <div className="flex flex-col gap-2.5 font-sans text-sm text-on-surface-variant">
                  <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                    <span>ASN / Org</span>
                    <span className="font-medium text-white text-right truncate max-w-[150px]" title={data.org}>
                      {data.org}
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
                    <span>Coordinates</span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[#008cff] hover:underline"
                    >
                      View on Map
                    </a>
                  </div>
                </div>
              </div>

              {/* Regional & Timezone Card */}
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant flex flex-col gap-4">
                <h3 className="font-heading font-semibold text-sm text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#008cff]" />
                  Local Details
                </h3>
                <div className="flex flex-col gap-2.5 font-sans text-sm text-on-surface-variant">
                  <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                    <span>Timezone</span>
                    <span className="font-medium text-white">{data.timezone}</span>
                  </div>
                  <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                    <span>Continent</span>
                    <span className="font-medium text-white">{data.timezone?.split('/')[0]}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span>Secure Request</span>
                    <span className="font-medium text-emerald-400">Yes (HTTPS)</span>
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
