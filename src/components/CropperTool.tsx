import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, UploadCloud, Image as ImageIcon, ZoomIn, ZoomOut, 
  RotateCcw, RotateCw, FlipHorizontal, FlipVertical, Link, CropIcon
} from 'lucide-react';
import ReactCrop, { type Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface CropperToolProps {
  onBack: () => void;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export default function CropperTool({ onBack }: CropperToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  
  const imgRef = useRef<HTMLImageElement>(null);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      const reader = new FileReader()
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || ''),
      )
      reader.readAsDataURL(e.target.files[0])
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspect))
    }
  }

  const handleDownload = async () => {
    if (completedCrop?.width && completedCrop?.height && imgRef.current && file) {
       const canvas = document.createElement('canvas');
       const image = imgRef.current;
       
       const scaleX = image.naturalWidth / image.width;
       const scaleY = image.naturalHeight / image.height;
       
       canvas.width = completedCrop.width * scaleX;
       canvas.height = completedCrop.height * scaleY;
       
       const ctx = canvas.getContext('2d');
       if (!ctx) return;
       
       ctx.imageSmoothingQuality = 'high';
       
       ctx.translate(canvas.width / 2, canvas.height / 2);
       ctx.rotate((rotate * Math.PI) / 180);
       ctx.translate(-canvas.width / 2, -canvas.height / 2);

       ctx.drawImage(
         image,
         completedCrop.x * scaleX,
         completedCrop.y * scaleY,
         completedCrop.width * scaleX,
         completedCrop.height * scaleY,
         0,
         0,
         completedCrop.width * scaleX,
         completedCrop.height * scaleY
       );

       canvas.toBlob((blob) => {
         if (!blob) return;
         const url = URL.createObjectURL(blob);
         const a = document.createElement('a');
         a.href = url;
         a.download = `cropped-${file.name}`;
         a.click();
         URL.revokeObjectURL(url);
       }, file.type || 'image/jpeg');
    }
  };

  const handleAspectClick = (newAspect: number | undefined) => {
    setAspect(newAspect);
    if (imgRef.current && newAspect) {
       const { width, height } = imgRef.current;
       setCrop(centerAspectCrop(width, height, newAspect));
    }
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
        {!imgSrc ? (
           <div className="w-full max-w-3xl flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300 mx-auto mt-8">
            <label className="w-full aspect-[2/1] border border-dashed border-outline hover:border-primary rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors duration-200 flex flex-col items-center justify-center p-8 gap-6 cursor-pointer group shadow-sm">
              <input type="file" accept="image/*" className="hidden" onChange={onSelectFile} />
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
                   <span className="font-mono text-[13px]">{file?.name}</span>
                 </div>
               </div>

               {/* Main Preview */}
               <div className="flex-grow bg-grid-pattern relative flex items-center justify-center p-12 overflow-hidden bg-background max-h-[70vh] overflow-y-auto w-full">
                 <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspect}
                 >
                    <img
                      ref={imgRef}
                      alt="Crop me"
                      src={imgSrc}
                      style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                      onLoad={onImageLoad}
                      className="max-h-[60vh] w-auto max-w-full object-contain"
                    />
                 </ReactCrop>
               </div>
             </div>

             {/* Sidebar Controls */}
             <div className="xl:col-span-4 flex flex-col gap-6 h-full">
               {/* Aspect Ratio Panel */}
               <div className="bg-surface-container-low rounded-xl border border-outline-variant p-6 flex flex-col gap-6 shadow-sm">
                 <h3 className="font-mono text-[13px] text-on-surface uppercase tracking-widest font-semibold flex items-center justify-between">
                   Aspect Ratio
                 </h3>
                 <div className="grid grid-cols-2 gap-3">
                   <div onClick={() => handleAspectClick(1)}><RatioButton label="1:1" active={aspect === 1} icon={<div className="w-5 h-5 border-2 border-current rounded-sm" />} /></div>
                   <div onClick={() => handleAspectClick(4/3)}><RatioButton label="4:3" active={aspect === 4/3} icon={<div className="w-[1.6rem] h-5 border-2 border-current rounded-sm" />} /></div>
                   <div onClick={() => handleAspectClick(16/9)}><RatioButton label="16:9" active={aspect === 16/9} icon={<div className="w-[2.2rem] h-5 border-2 border-current rounded-sm" />} /></div>
                   <div onClick={() => handleAspectClick(undefined)}><RatioButton label="Custom" active={aspect === undefined} icon={<div className="w-6 h-6 border-2 border-dashed border-current rounded-sm" />} /></div>
                 </div>
               </div>

               {/* Transform Panel */}
               <div className="bg-surface-container-low rounded-xl border border-outline-variant p-6 flex flex-col gap-6 shadow-sm">
                  <h3 className="font-mono text-[13px] text-on-surface uppercase tracking-widest font-semibold flex items-center justify-between">
                    Transform
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[13px] text-on-surface-variant">Straighten</span>
                      <span className="font-mono text-[13px] text-primary tabular-nums font-semibold">{rotate}°</span>
                    </div>
                    <input 
                      type="range" 
                      min="-45" max="45" 
                      value={rotate}
                      onChange={(e) => setRotate(Number(e.target.value))}
                      className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary" 
                    />
                  </div>
               </div>

               <div className="flex-grow" />

               {/* Actions */}
               <div className="bg-surface-container-low rounded-xl border border-outline-variant p-6 flex flex-col gap-3 shadow-sm">
                 <button onClick={handleDownload} className="w-full bg-primary text-on-primary font-mono text-[13px] font-bold tracking-wide uppercase py-4 rounded transition-colors hover:bg-surface-tint flex justify-center items-center gap-2">
                    <CropIcon className="w-[18px] h-[18px]" />
                    Crop & Download
                 </button>
                 <button 
                    onClick={() => { setImgSrc(''); setFile(null); }}
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

function RatioButton({ label, active, icon }: { label: string, active: boolean, icon: React.ReactNode }) {
  return (
    <div className={`border rounded-lg py-3 flex flex-col items-center justify-center gap-2.5 transition-colors cursor-pointer ${
      active 
      ? 'bg-surface-container-highest border-primary text-primary shadow-sm' 
      : 'bg-background border-outline-variant hover:border-outline text-on-surface-variant '
    }`}>
      <div className="flex items-center justify-center h-8">
        {icon}
      </div>
      <span className="font-mono text-[11px] tracking-wider uppercase">{label}</span>
    </div>
  );
}
