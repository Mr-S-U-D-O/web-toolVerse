import { ArrowLeft, Shield } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';
import { Html5Qrcode } from 'html5-qrcode';

interface BarcodeSuiteToolProps {
  onBack?: () => void;
}

type TabType = 'GENERATE' | 'SCAN';

export default function BarcodeSuiteTool({ onBack }: BarcodeSuiteToolProps) {
  const [activeTab, setActiveTab] = useState<TabType>('GENERATE');
  const [error, setError] = useState<string | null>(null);

  // ─── GENERATE state ──────────────────────────────────────────────────────────
  const [payload, setPayload] = useState('1234567890');
  const [format, setFormat] = useState('CODE128');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Trigger barcode drawing
  useEffect(() => {
    if (activeTab === 'GENERATE' && canvasRef.current && payload.trim()) {
      try {
        setError(null);
        JsBarcode(canvasRef.current, payload, {
          format: format,
          lineColor: '#000000',
          background: '#ffffff',
          width: 2,
          height: 100,
          displayValue: true,
          font: 'monospace',
          fontSize: 14,
        });
      } catch (err) {
        console.error(err);
        setError('Invalid payload format for the selected barcode standard.');
      }
    }
  }, [payload, format, activeTab]);

  const handleDownload = () => {
    if (!canvasRef.current || error) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `barcode_${format.toLowerCase()}_${payload}.png`;
    a.click();
  };

  // ─── SCAN state ─────────────────────────────────────────────────────────────
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (activeTab === 'SCAN') {
      setScanResult(null);
      
      const html5QrCode = new Html5Qrcode("reader");
      scannerRef.current = html5QrCode;

      html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 15,
          qrbox: { width: 300, height: 120 } // wider, shorter box for barcodes
        },
        (decodedText) => {
          setScanResult(decodedText);
        },
        () => {
          // Failure callback, silent
        }
      ).catch((err) => {
        console.error('Camera access failed:', err);
        setError('Failed to access camera. Ensure permissions are granted.');
      });

      return () => {
        if (html5QrCode.isScanning) {
          html5QrCode.stop().catch(err => console.error('Failed to stop scanner:', err));
        }
      };
    } else {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(err => console.error('Failed to stop scanner:', err));
      }
    }
  }, [activeTab]);

  const handleCopyScanResult = async () => {
    if (!scanResult) return;
    try {
      await navigator.clipboard.writeText(scanResult);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
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
            <div className="font-sans text-sm font-medium text-on-surface">Barcode Generator & Scanner</div>
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
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">Barcode Generator & Scanner</h1>
            <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
              Create professional retail barcodes (UPC, EAN, Code128) or scan inventory locally using your web camera.
            </p>
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="border border-red-500 bg-red-500/5 text-red-500 p-4 text-xs font-bold uppercase tracking-wider">
            ERROR: {error}
          </div>
        )}

        {/* ─── TAB: GENERATE ─────────────────────────────────────────────────── */}
        {activeTab === 'GENERATE' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Payload Field */}
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold tracking-wide text-on-surface-variant">
                  BARCODE PAYLOAD / VALUE
                </label>
                <input
                  type="text"
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-base text-on-surface font-mono outline-none focus:border-[#008cff] focus:ring-1 focus:ring-[#008cff] transition-all"
                />
              </div>

              {/* Format Standard Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold tracking-wide text-on-surface-variant">
                  BARCODE STANDARD
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-base text-on-surface font-mono outline-none focus:border-[#008cff] focus:ring-1 focus:ring-[#008cff] transition-all"
                >
                  <option value="CODE128">Code 128 (Alphanumeric)</option>
                  <option value="EAN13">EAN-13 (13 Digits)</option>
                  <option value="UPC">UPC-A (12 Digits)</option>
                  <option value="CODE39">Code 39 (Alphanumeric)</option>
                  <option value="ITF">ITF-14 (Interleaved 2 of 5)</option>
                  <option value="MSI">MSI (Modified Plessey)</option>
                  <option value="PHARMACODE">Pharmacode (Pharmaceutical)</option>
                </select>
              </div>

            </div>

            {/* Canvas Output block */}
            <div className="border border-outline-variant bg-white p-12 flex justify-center items-center min-h-[220px]">
              <canvas ref={canvasRef} />
            </div>

            <button
              onClick={handleDownload}
              disabled={!!error || !payload}
              className="w-full py-4 bg-[#008cff] hover:bg-[#0070cc] text-white disabled:opacity-40 text-xs font-bold uppercase tracking-wide transition-all"
            >
              Download Barcode Png
            </button>
          </div>
        )}

        {/* ─── TAB: SCAN ─────────────────────────────────────────────────────── */}
        {activeTab === 'SCAN' && (
          <div className="flex flex-col gap-6">
            
            {/* Viewport Wrapper */}
            <div className="w-full aspect-video border-2 border-outline-variant bg-surface-container-low overflow-hidden relative">
              <div id="reader" className="w-full h-full object-cover" />
            </div>

            {/* Live Decoded Output String */}
            {scanResult && (
              <div className="border border-outline-variant bg-surface-container-lowest p-6 flex flex-col gap-4">
                <div className="text-xs uppercase font-bold tracking-wide text-on-surface-variant border-b border-outline-variant pb-2">
                  DECODED PAYLOAD VALUE
                </div>
                <div className="text-4xl font-bold text-on-surface break-all tracking-tighter">
                  {scanResult}
                </div>
                <button
                  onClick={handleCopyScanResult}
                  className="w-full py-3 border border-outline-variant bg-surface-container-low hover:bg-surface-container hover:border-[#008cff] text-xs font-bold uppercase tracking-wider transition-all"
                >
                  {copySuccess ? 'Copied' : 'Copy Value'}
                </button>
              </div>
            )}

            {!scanResult && (
              <div className="text-center py-6 text-xs text-on-surface-variant uppercase tracking-wider">
                Align barcode within camera viewbox to scan...
              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
}
