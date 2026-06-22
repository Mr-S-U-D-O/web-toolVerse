import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Copy, Download, Check, Image as ImageIcon, Settings2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ImagePlaceholderGeneratorTool() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [text, setText] = useState('800 x 600');
  const [bgColor, setBgColor] = useState('#e2e8f0');
  const [textColor, setTextColor] = useState('#475569');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    drawCanvas();
  }, [width, height, text, bgColor, textColor]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Text configuration
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Dynamic scaling for font size
    const fontSize = Math.max(12, Math.min(width, height) * 0.1);
    ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;

    // Draw text centrally
    ctx.fillText(text, width / 2, height / 2);
  };

  const handleDimensionChange = (type: 'w' | 'h', val: number) => {
    const prevMatch = text === `${width} x ${height}`;
    if (type === 'w') {
      setWidth(val);
      if (prevMatch) setText(`${val} x ${height}`);
    } else {
      setHeight(val);
      if (prevMatch) setText(`${width} x ${val}`);
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `placeholder-${width}x${height}.png`;
    link.href = dataUrl;
    link.click();
  };

  const copyImageToClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }, 'image/png');
    } catch (e) {
      console.error('Failed to copy image', e);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-on-surface">
      <header className="w-full border-b border-outline-variant bg-background sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group">
             <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
             <span className="font-mono text-sm tracking-widest font-medium uppercase mt-0.5">Back to Main</span>
          </button>
        </div>
      </header>

      <main className="flex-grow flex justify-center w-full max-w-[1280px] mx-auto p-6 lg:p-12 relative pt-12 md:pt-16">
        <div className="w-full max-w-5xl flex flex-col gap-8 animate-in fade-in duration-300">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                 <ImageIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="font-heading text-3xl font-semibold tracking-tight">Image Placeholder Generator</h1>
                <p className="text-on-surface-variant mt-1 text-sm">Generate downloadable dummy images for mockups and wireframes instantly.</p>
              </div>
            </div>
            
            <button 
              onClick={downloadImage}
              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-on-primary px-5 py-2.5 rounded-lg font-mono text-xs uppercase tracking-wider transition-colors shadow-sm whitespace-nowrap"
            >
              <Download className="w-4 h-4" /> Download PNG
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
             {/* Configuration Panel */}
             <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col p-6 space-y-6">
                <div className="flex items-center gap-2 border-b border-outline-variant pb-4">
                   <Settings2 className="w-4 h-4 text-primary" />
                   <span className="font-mono text-xs text-outline font-semibold uppercase tracking-widest">Configuration</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] text-outline font-semibold uppercase tracking-wider mb-2">Width (px)</label>
                    <input
                      type="number"
                      min="10" max="4000"
                      value={width}
                      onChange={(e) => handleDimensionChange('w', parseInt(e.target.value) || 10)}
                      className="w-full bg-background border border-outline-variant rounded-lg px-3 py-2 focus:outline-none focus:border-primary font-mono text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-outline font-semibold uppercase tracking-wider mb-2">Height (px)</label>
                    <input
                      type="number"
                      min="10" max="4000"
                      value={height}
                      onChange={(e) => handleDimensionChange('h', parseInt(e.target.value) || 10)}
                      className="w-full bg-background border border-outline-variant rounded-lg px-3 py-2 focus:outline-none focus:border-primary font-mono text-sm transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-outline font-semibold uppercase tracking-wider mb-2">Display Text</label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full bg-background border border-outline-variant rounded-lg px-3 py-2 focus:outline-none focus:border-primary font-sans text-sm transition-colors"
                    placeholder="E.g. 800 x 600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block font-mono text-[10px] text-outline font-semibold uppercase tracking-wider mb-2">Background Color</label>
                     <div className="flex border border-outline-variant rounded-lg bg-background overflow-hidden relative items-center focus-within:border-primary transition-colors">
                       <div className="w-10 h-10 flex-shrink-0 relative">
                         <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-full p-0 border-none cursor-pointer absolute opacity-0" />
                         <div className="w-full h-full pointer-events-none" style={{ backgroundColor: bgColor }}></div>
                       </div>
                       <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full text-xs font-mono px-2 uppercase focus:outline-none bg-transparent" />
                     </div>
                  </div>
                  <div>
                     <label className="block font-mono text-[10px] text-outline font-semibold uppercase tracking-wider mb-2">Text Color</label>
                     <div className="flex border border-outline-variant rounded-lg bg-background overflow-hidden relative items-center focus-within:border-primary transition-colors">
                       <div className="w-10 h-10 flex-shrink-0 relative">
                         <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full h-full p-0 border-none cursor-pointer absolute opacity-0" />
                         <div className="w-full h-full pointer-events-none" style={{ backgroundColor: textColor }}></div>
                       </div>
                       <input type="text" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full text-xs font-mono px-2 uppercase focus:outline-none bg-transparent" />
                     </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-outline-variant">
                   <button 
                     onClick={copyImageToClipboard} 
                     className="w-full flex items-center justify-center gap-2 bg-transparent border-2 border-primary text-primary px-4 py-2.5 rounded-lg font-mono text-xs uppercase tracking-wider font-semibold hover:bg-primary/10 transition-colors"
                   >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? 'Image Copied!' : 'Copy to Clipboard'}
                   </button>
                </div>
             </div>

             {/* Live Preview Area */}
             <div className="bg-surface-container-low border border-outline-variant rounded-xl shadow-sm flex flex-col h-[500px]">
                <div className="h-14 border-b border-outline-variant bg-surface-container/50 flex items-center px-5">
                  <span className="font-mono text-xs text-outline font-semibold uppercase tracking-widest">Live Canvas Preview</span>
                </div>
                <div className="flex-grow p-6 flex flex-col items-center justify-center bg-surface w-full overflow-hidden relative chessboard-bg rounded-b-xl border-[16px] border-surface-container-low">
                   <div className="max-w-full max-h-full aspect-auto flex items-center justify-center shadown-sm overflow-hidden border border-outline-variant rounded"
                        style={{
                           maxWidth: '100%',
                           maxHeight: '100%',
                        }}>
                      <canvas 
                         ref={canvasRef}
                         width={width}
                         height={height}
                         className="object-contain w-full h-full"
                      />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>
      <style dangerouslySetInnerHTML={{__html: `
        .chessboard-bg {
           background-image: 
             linear-gradient(45deg, var(--color-surface-container) 25%, transparent 25%), 
             linear-gradient(-45deg, var(--color-surface-container) 25%, transparent 25%), 
             linear-gradient(45deg, transparent 75%, var(--color-surface-container) 75%), 
             linear-gradient(-45deg, transparent 75%, var(--color-surface-container) 75%);
           background-size: 20px 20px;
           background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
      `}} />
    </div>
  );
}
