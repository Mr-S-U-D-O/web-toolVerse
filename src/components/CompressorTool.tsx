import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, UploadCloud, Download, Image as ImageIcon
} from 'lucide-react';

interface CompressorToolProps {
  onBack: () => void;
}

export default function CompressorTool({ onBack }: CompressorToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState(80);
  const [compressedDataUrl, setCompressedDataUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  useEffect(() => {
    if (!previewUrl) return;

    const img = new Image();
    img.src = previewUrl;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      const dataUrl = canvas.toDataURL('image/jpeg', quality / 100);
      setCompressedDataUrl(dataUrl);

      // Calculate approximate size in bytes. Base64 encoding adds ~33% overhead.
      // String length * (3/4) is a good approximation, minus padding.
      const base64Length = dataUrl.length - 'data:image/jpeg;base64,'.length;
      const approxBytes = base64Length * 0.75;
      setCompressedSize(approxBytes);
    };
  }, [previewUrl, quality]);

  const handleDownload = () => {
    if (!compressedDataUrl) return;
    const a = document.createElement('a');
    a.href = compressedDataUrl;
    a.download = `compressed-${file?.name || 'image.jpg'}`;
    a.click();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-on-surface">
      {/* Header */}
      <header className="w-full border-b border-outline-variant bg-background sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center">
          <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group">
             <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
             <span className="font-mono text-sm tracking-widest font-medium uppercase mt-0.5">Back to Main</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-grow flex flex-col items-center p-6 lg:p-12 w-full max-w-[1280px] mx-auto relative pt-12 md:pt-24">
        {!file ? (
           <div className="w-full max-w-3xl flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300 mx-auto mt-8">
            <label 
              className="w-full aspect-[2/1] border border-dashed border-outline hover:border-primary rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors duration-200 flex flex-col items-center justify-center p-8 gap-6 cursor-pointer group shadow-sm"
            >
              <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
              <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center text-outline group-hover:text-primary group-hover:scale-105 transition-all">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="font-heading text-[24px] font-semibold text-primary tracking-tight">Upload Image</h2>
                <p className="font-sans text-[15px] text-on-surface-variant font-normal">Drag and drop your file here, or click to browse.</p>
              </div>
              <div className="mt-4">
                <span className="bg-primary text-on-primary font-mono text-[13px] tracking-wide font-semibold px-6 py-3 rounded transition-colors hover:bg-surface-tint">
                  Select File
                </span>
              </div>
              <p className="font-mono text-xs text-outline mt-2 tracking-widest uppercase">Supports: JPG, PNG, WEBP</p>
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
               </div>
               <div className="flex-grow bg-grid-pattern relative flex items-center justify-center p-12 overflow-hidden bg-background">
                 {compressedDataUrl && (
                   <img src={compressedDataUrl} className="max-w-full max-h-[600px] object-contain shadow-2xl" alt="Compressed preview" />
                 )}
                 <canvas ref={canvasRef} className="hidden" />
               </div>
             </div>

             {/* Sidebar Controls */}
             <div className="xl:col-span-4 flex flex-col gap-6 h-full">
               <div className="bg-surface-container-low rounded-xl border border-outline-variant p-6 flex flex-col gap-6 shadow-sm">
                 <h3 className="font-mono text-[13px] text-on-surface uppercase tracking-widest font-semibold flex items-center justify-between">
                   Compression Settings
                 </h3>
                 
                 <div className="space-y-4">
                   <div className="flex justify-between items-center">
                     <span className="font-mono text-[13px] text-on-surface-variant">Quality</span>
                     <span className="font-mono text-[13px] text-primary tabular-nums font-semibold">{quality}%</span>
                   </div>
                   <input 
                     type="range" 
                     min="1" max="100" 
                     value={quality}
                     onChange={(e) => setQuality(Number(e.target.value))}
                     className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary" 
                   />
                 </div>

                 <div className="bg-surface-container-highest p-4 rounded-lg mt-4 flex flex-col gap-2 border border-outline-variant">
                    <div className="flex justify-between">
                       <span className="font-mono text-[12px] text-outline">Original:</span>
                       <span className="font-mono text-[12px] text-on-surface">{formatBytes(file.size)}</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="font-mono text-[12px] text-outline">Compressed:</span>
                       <span className="font-mono text-[12px] text-primary font-bold">{formatBytes(compressedSize)}</span>
                    </div>
                 </div>
               </div>

               {/* Actions */}
               <div className="bg-surface-container-low rounded-xl border border-outline-variant p-6 flex flex-col gap-3 shadow-sm">
                 <button onClick={handleDownload} className="w-full bg-primary text-on-primary font-mono text-[13px] font-bold tracking-wide uppercase py-4 rounded transition-colors hover:bg-surface-tint flex justify-center items-center gap-2">
                    <Download className="w-[18px] h-[18px]" />
                    Download
                 </button>
                 <button 
                    onClick={() => { setFile(null); setPreviewUrl(null); setCompressedDataUrl(null); }}
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
