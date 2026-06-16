import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, UploadCloud, Download, Image as ImageIcon, Link as LinkIcon
} from 'lucide-react';

interface ImageResizerToolProps {
  onBack: () => void;
}

export default function ImageResizerTool({ onBack }: ImageResizerToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [maintainRatio, setMaintainRatio] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);

      const img = new Image();
      img.onload = () => {
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = url;
    }
  };

  const handleWidthChange = (val: string) => {
    const w = parseInt(val) || 0;
    setWidth(w);
    if (maintainRatio && originalWidth > 0) {
      setHeight(Math.round(w * (originalHeight / originalWidth)));
    }
  };

  const handleHeightChange = (val: string) => {
    const h = parseInt(val) || 0;
    setHeight(h);
    if (maintainRatio && originalHeight > 0) {
      setWidth(Math.round(h * (originalWidth / originalHeight)));
    }
  };

  const handleDownload = () => {
    if (!previewUrl || width <= 0 || height <= 0) return;
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resized-${width}x${height}-${file?.name || 'image.png'}`;
        a.click();
        URL.revokeObjectURL(url);
      }, file?.type || 'image/png');
    };
    img.src = previewUrl;
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

      <main className="flex-grow flex flex-col items-center p-6 lg:p-12 w-full max-w-[1280px] mx-auto relative pt-12 md:pt-24">
        {!file ? (
           <div className="w-full max-w-3xl flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300 mx-auto mt-8">
            <label className="w-full aspect-[2/1] border border-dashed border-outline hover:border-primary rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors duration-200 flex flex-col items-center justify-center p-8 gap-6 cursor-pointer group shadow-sm">
              <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
              <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center text-outline group-hover:text-primary group-hover:scale-105 transition-all">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="font-heading text-[24px] font-semibold text-primary tracking-tight">Upload Image to Resize</h2>
                <p className="font-sans text-[15px] text-on-surface-variant font-normal">Drag and drop your file here, or click to browse.</p>
              </div>
              <div className="mt-4">
                <span className="bg-primary text-on-primary font-mono text-[13px] tracking-wide font-semibold px-6 py-3 rounded transition-colors hover:bg-surface-tint">
                  Select File
                </span>
              </div>
            </label>
           </div>
        ) : (
           <div className="w-full grid justify-center grid-cols-1 xl:grid-cols-12 gap-8 min-h-[600px] animate-in fade-in duration-300">
             
             {/* Canvas Area */}
             <div className="xl:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col overflow-hidden relative shadow-lg">
               <div className="h-14 border-b border-outline-variant bg-surface-container-low flex items-center px-6">
                 <div className="flex items-center gap-3 text-on-surface-variant">
                   <ImageIcon className="w-4 h-4" />
                   <span className="font-mono text-[13px]">{file.name}</span>
                 </div>
                 <div className="flex-grow" />
                 <span className="font-mono text-[11px] text-outline uppercase tracking-wider">{originalWidth} x {originalHeight} px original</span>
               </div>
               <div className="flex-grow bg-grid-pattern relative flex items-center justify-center p-12 overflow-hidden bg-background">
                 {previewUrl && (
                   <img src={previewUrl} className="max-w-full max-h-[600px] object-contain shadow-2xl transition-all" style={{ opacity: 0.8 }} alt="Preview" />
                 )}
                 <canvas ref={canvasRef} className="hidden" />
               </div>
             </div>

             {/* Sidebar Controls */}
             <div className="xl:col-span-4 flex flex-col gap-6 h-full">
               <div className="bg-surface-container-low rounded-xl border border-outline-variant p-6 flex flex-col gap-6 shadow-sm">
                 <h3 className="font-mono text-[13px] text-on-surface uppercase tracking-widest font-semibold flex items-center justify-between">
                   Dimensions
                 </h3>
                 
                 <div className="flex flex-col gap-4">
                    <label className="flex flex-col gap-2">
                       <span className="font-mono text-[11px] text-outline tracking-wider uppercase">Width (px)</span>
                       <input 
                         type="number" 
                         value={width} 
                         onChange={(e) => handleWidthChange(e.target.value)}
                         className="bg-surface-container-highest border border-outline-variant focus:border-primary rounded px-4 py-3 font-mono text-[14px] text-on-surface outline-none"
                       />
                    </label>

                    <label className="flex items-center gap-3 my-1 cursor-pointer group w-fit">
                       <div className={`w-4 h-4 rounded flex items-center border ${maintainRatio ? 'bg-primary border-primary' : 'bg-transparent border-outline'}`}>
                          {maintainRatio && <LinkIcon className="w-3 h-3 text-on-primary mx-auto" />}
                       </div>
                       <span className="font-sans text-[14px] text-on-surface-variant group-hover:text-primary">Lock aspect ratio</span>
                       <input type="checkbox" className="hidden" checked={maintainRatio} onChange={(e) => setMaintainRatio(e.target.checked)} />
                    </label>

                    <label className="flex flex-col gap-2">
                       <span className="font-mono text-[11px] text-outline tracking-wider uppercase">Height (px)</span>
                       <input 
                         type="number" 
                         value={height} 
                         onChange={(e) => handleHeightChange(e.target.value)}
                         className="bg-surface-container-highest border border-outline-variant focus:border-primary rounded px-4 py-3 font-mono text-[14px] text-on-surface outline-none"
                       />
                    </label>
                 </div>

               </div>

               {/* Actions */}
               <div className="bg-surface-container-low rounded-xl border border-outline-variant p-6 flex flex-col gap-3 shadow-sm">
                 <button onClick={handleDownload} className="w-full bg-primary text-on-primary font-mono text-[13px] font-bold tracking-wide uppercase py-4 rounded transition-colors hover:bg-surface-tint flex justify-center items-center gap-2">
                    <Download className="w-[18px] h-[18px]" />
                    Resize & Download
                 </button>
                 <button 
                    onClick={() => { setFile(null); setPreviewUrl(null); }}
                    className="w-full bg-transparent border border-outline-variant text-on-surface hover:border-outline hover:bg-surface-container-highest font-mono text-[13px] font-semibold tracking-wide uppercase py-4 rounded transition-colors mt-2"
                 >
                    Cancel
                 </button>
               </div>
             </div>
           </div>
        )}
      </main>
    </div>
  );
}
