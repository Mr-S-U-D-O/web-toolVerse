import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, Download, QrCode } from 'lucide-react';
import QRCode from 'react-qr-code';

interface QrCodeGeneratorToolProps {
  onBack: () => void;
}

export default function QrCodeGeneratorTool({ onBack }: QrCodeGeneratorToolProps) {
  const [input, setInput] = useState('https://google.com');
  const [size, setSize] = useState([256]);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [fgColor, setFgColor] = useState('#000000');

  const downloadQR = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = size[0];
      canvas.height = size[0];
      if(ctx) {
          ctx.drawImage(img, 0, 0);
          const pngFile = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.download = "qrcode.png";
          downloadLink.href = `${pngFile}`;
          downloadLink.click();
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-on-surface">
      <header className="w-full border-b border-outline-variant bg-background sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center">
          <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group">
             <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
             <span className="font-mono text-sm tracking-widest font-medium uppercase mt-0.5">Back to Main</span>
          </button>
        </div>
      </header>

      <main className="flex-grow flex justify-center p-6 lg:p-12 w-full max-w-[1280px] mx-auto relative pt-12 md:pt-16">
        <div className="w-full max-w-4xl flex flex-col gap-6 animate-in fade-in duration-300">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                 <QrCode className="w-5 h-5 text-primary" />
              </div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight">QR Code Generator</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
             {/* Controls */}
             <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-6">
                <div>
                  <label className="block font-mono text-xs text-outline uppercase tracking-widest mb-2">Content (URL or Text)</label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter URL or text..."
                    className="w-full bg-surface border border-outline-variant rounded-lg p-3 outline-none focus:border-primary font-mono text-[13px] text-on-surface h-24 resize-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-outline uppercase tracking-widest mb-2 flex justify-between">
                    <span>Size</span>
                    <span className="text-primary">{size[0]}px</span>
                  </label>
                  <input
                    type="range"
                    min="128"
                    max="512"
                    step="32"
                    value={size[0]}
                    onChange={(e) => setSize([parseInt(e.target.value)])}
                    className="w-full accent-primary bg-surface h-2 rounded-lg cursor-pointer appearance-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block font-mono text-xs text-outline uppercase tracking-widest mb-2">Background</label>
                     <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer border border-outline-variant p-1 bg-surface"
                        />
                        <span className="font-mono text-xs text-on-surface uppercase">{bgColor}</span>
                     </div>
                   </div>
                   <div>
                     <label className="block font-mono text-xs text-outline uppercase tracking-widest mb-2">Foreground</label>
                     <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={fgColor}
                          onChange={(e) => setFgColor(e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer border border-outline-variant p-1 bg-surface"
                        />
                        <span className="font-mono text-xs text-on-surface uppercase">{fgColor}</span>
                     </div>
                   </div>
                </div>
             </div>

             {/* Preview */}
             <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col min-h-[400px]">
                <div className="h-12 border-b border-outline-variant bg-surface-container flex items-center px-4">
                  <span className="font-mono text-xs text-outline uppercase tracking-widest">Preview</span>
                </div>
                
                <div className="flex-grow flex items-center justify-center p-8 bg-surface-container-lowest">
                   {input.trim() ? (
                     <div className="p-4 bg-white rounded-xl shadow-sm border border-outline-variant" style={{ backgroundColor: bgColor }}>
                        <QRCode
                          id="qr-code-svg"
                          value={input}
                          size={size[0]}
                          bgColor={bgColor}
                          fgColor={fgColor}
                          level="H"
                        />
                     </div>
                   ) : (
                     <div className="text-outline font-mono text-sm tracking-widest uppercase">
                        Enter text to generate
                     </div>
                   )}
                </div>

                <div className="h-16 border-t border-outline-variant bg-surface-container-lowest flex items-center justify-center px-6">
                  <button 
                    onClick={downloadQR}
                    disabled={!input.trim()}
                    className="w-full bg-primary hover:bg-primary/90 text-on-primary py-2.5 rounded-lg flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    Download PNG
                  </button>
                </div>
             </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
