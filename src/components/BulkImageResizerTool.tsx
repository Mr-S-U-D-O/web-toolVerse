import React, { useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ArrowLeft, UploadCloud, Settings, Image as ImageIcon, Download, Trash2, X, Loader2, ImagePlus } from 'lucide-react';

type FitMode = 'cover' | 'contain' | 'stretch';
type Position = 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export default function BulkImageResizerTool({ onBack }: { onBack?: () => void }) {
  const [images, setImages] = useState<File[]>([]);
  const [targetWidth, setTargetWidth] = useState<number>(1080);
  const [targetHeight, setTargetHeight] = useState<number>(1080);
  const [fitMode, setFitMode] = useState<FitMode>('cover');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  
  const [watermarkFile, setWatermarkFile] = useState<File | null>(null);
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(50);
  const [watermarkPosition, setWatermarkPosition] = useState<Position>('bottom-right');
  const [watermarkScale, setWatermarkScale] = useState<number>(20); // % of target width
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const watermarkInputRef = useRef<HTMLInputElement>(null);

  const onDrop = (acceptedFiles: File[]) => {
    setImages((prev) => [...prev, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  });

  const handleWatermarkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setWatermarkFile(e.target.files[0]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Helper to load an image from a File
  const loadImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error(`Failed to load image ${file.name}`));
      };
      img.src = url;
    });
  };

  const processImages = async () => {
    if (images.length === 0 || !targetWidth || !targetHeight) return;
    
    setIsProcessing(true);
    setProgress(0);

    try {
      const zip = new JSZip();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error("Could not get canvas context");

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Load watermark if exists
      let wmImg: HTMLImageElement | null = null;
      if (watermarkFile) {
        wmImg = await loadImage(watermarkFile);
      }

      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const img = await loadImage(file);
        
        // Clear and fill background
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        // Calculate fit
        const tw = targetWidth;
        const th = targetHeight;
        const ow = img.width;
        const oh = img.height;
        
        let dx = 0, dy = 0, dw = tw, dh = th;

        if (fitMode === 'cover') {
          const scale = Math.max(tw / ow, th / oh);
          dw = ow * scale;
          dh = oh * scale;
          dx = (tw - dw) / 2;
          dy = (th - dh) / 2;
        } else if (fitMode === 'contain') {
          const scale = Math.min(tw / ow, th / oh);
          dw = ow * scale;
          dh = oh * scale;
          dx = (tw - dw) / 2;
          dy = (th - dh) / 2;
        }

        ctx.drawImage(img, dx, dy, dw, dh);
        URL.revokeObjectURL(img.src);

        // Draw Watermark
        if (wmImg) {
          ctx.globalAlpha = watermarkOpacity / 100;
          
          // Calculate watermark size based on scale %
          const wmTargetWidth = tw * (watermarkScale / 100);
          const wmScale = wmTargetWidth / wmImg.width;
          const ww = wmImg.width * wmScale;
          const wh = wmImg.height * wmScale;
          
          let wx = 0, wy = 0;
          const padding = tw * 0.05; // 5% padding
          
          if (watermarkPosition.includes('left')) wx = padding;
          else if (watermarkPosition.includes('right')) wx = tw - ww - padding;
          else wx = (tw - ww) / 2; // center
          
          if (watermarkPosition.includes('top')) wy = padding;
          else if (watermarkPosition.includes('bottom')) wy = th - wh - padding;
          else wy = (th - wh) / 2; // center

          ctx.drawImage(wmImg, wx, wy, ww, wh);
        }

        // Extract Blob
        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, 'image/jpeg', 0.95);
        });

        if (blob) {
          const nameParts = file.name.split('.');
          nameParts.pop(); // remove original extension
          zip.file(`${nameParts.join('.')}_resized.jpg`, blob);
        }

        setProgress(Math.round(((i + 1) / images.length) * 100));
      }

      if (wmImg) URL.revokeObjectURL(wmImg.src);

      // Generate ZIP
      const zipContent = await zip.generateAsync({ type: 'blob' });
      saveAs(zipContent, `resized_images_${Date.now()}.zip`);

    } catch (error) {
      console.error("Error processing images", error);
      alert("An error occurred while processing the images.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className="flex-grow w-full max-w-7xl mx-auto px-6 py-8 flex flex-col relative z-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        {onBack && (
          <button 
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
            title="Back to Directory"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold font-heading tracking-tight text-on-surface flex items-center gap-2">
            <ImagePlus className="w-6 h-6 text-[#008cff]" />
            Bulk Image Resizer
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">Batch resize, crop, and watermark completely offline.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column: Dropzone & Image List */}
        <div className="w-full lg:w-3/5 flex flex-col gap-6">
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-[#008cff] bg-[#008cff]/5' : 'border-outline-variant bg-surface-container-low hover:bg-surface-container-highest'
            }`}
          >
            <input {...getInputProps()} />
            <div className="w-16 h-16 bg-[#008cff]/10 rounded-full flex items-center justify-center mb-4">
              <UploadCloud className="w-8 h-8 text-[#008cff]" />
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-2">Drag & drop your images here</h3>
            <p className="text-sm text-on-surface-variant">or click to select multiple files</p>
          </div>

          {images.length > 0 && (
            <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold font-heading tracking-wider uppercase text-on-surface-variant">
                  {images.length} Image{images.length !== 1 && 's'} Selected
                </h2>
                <button 
                  onClick={() => setImages([])}
                  className="text-xs font-medium text-red-500 hover:text-red-400 hover:underline"
                >
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-outline-variant p-1">
                {images.map((file, idx) => {
                  const url = URL.createObjectURL(file);
                  return (
                    <div key={`${file.name}-${idx}`} className="relative group aspect-square bg-surface-container rounded-lg overflow-hidden border border-outline-variant">
                      <img 
                        src={url} 
                        alt={file.name} 
                        className="w-full h-full object-cover"
                        onLoad={() => URL.revokeObjectURL(url)}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          onClick={() => removeImage(idx)}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Settings & Export */}
        <div className="w-full lg:w-2/5 flex flex-col gap-6 sticky top-6">
          <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col gap-6">
            
            <h2 className="text-sm font-bold font-heading tracking-wider uppercase text-on-surface-variant flex items-center gap-2">
              <Settings className="w-4 h-4" /> Processing Settings
            </h2>

            {/* Dimensions */}
            <div>
              <label className="block text-sm font-medium text-on-surface mb-3">Target Dimensions (px)</label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input 
                    type="number"
                    value={targetWidth}
                    onChange={(e) => setTargetWidth(Number(e.target.value))}
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-[#008cff]"
                    placeholder="Width"
                  />
                  <div className="text-xs text-on-surface-variant text-center mt-1">Width</div>
                </div>
                <div className="text-on-surface-variant font-bold">×</div>
                <div className="flex-1">
                  <input 
                    type="number"
                    value={targetHeight}
                    onChange={(e) => setTargetHeight(Number(e.target.value))}
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-[#008cff]"
                    placeholder="Height"
                  />
                  <div className="text-xs text-on-surface-variant text-center mt-1">Height</div>
                </div>
              </div>
            </div>

            {/* Fit Mode */}
            <div>
              <label className="block text-sm font-medium text-on-surface mb-3">Fit Mode</label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-surface-container rounded-lg">
                {(['cover', 'contain', 'stretch'] as FitMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setFitMode(mode)}
                    className={`py-2 px-1 rounded-md text-sm font-medium transition-all capitalize ${
                      fitMode === mode 
                        ? 'bg-surface-container-low text-[#008cff] shadow-sm ring-1 ring-outline-variant/50' 
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest/50'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              {fitMode === 'contain' && (
                <div className="mt-4 flex items-center gap-3">
                  <label className="text-sm text-on-surface-variant">Pad Color:</label>
                  <input 
                    type="color" 
                    value={bgColor} 
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-outline-variant"
                  />
                </div>
              )}
            </div>

            <div className="h-px w-full bg-outline-variant" />

            {/* Watermark Section */}
            <div>
              <label className="block text-sm font-medium text-on-surface mb-3 flex items-center justify-between">
                Watermark Overlay
                {watermarkFile && (
                  <button onClick={() => setWatermarkFile(null)} className="text-red-500 hover:text-red-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <X className="w-3 h-3" /> Remove
                  </button>
                )}
              </label>
              
              {!watermarkFile ? (
                <div>
                  <input 
                    type="file" 
                    accept="image/png, image/jpeg, image/svg+xml" 
                    ref={watermarkInputRef}
                    onChange={handleWatermarkUpload}
                    className="hidden"
                  />
                  <button 
                    onClick={() => watermarkInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 bg-surface-container hover:bg-surface-container-highest border border-outline-variant border-dashed rounded-lg px-4 py-3 text-on-surface-variant hover:text-on-surface transition-colors text-sm font-medium"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Upload Watermark (PNG/SVG)
                  </button>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center gap-3 p-3 bg-surface-container rounded-lg border border-outline-variant">
                    <div className="w-12 h-12 bg-surface-container-lowest rounded overflow-hidden flex items-center justify-center p-1 relative">
                       {/* Safe mini-preview */}
                       <img 
                         src={URL.createObjectURL(watermarkFile)} 
                         alt="Watermark" 
                         className="max-w-full max-h-full object-contain"
                         onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                       />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-on-surface truncate">{watermarkFile.name}</p>
                      <p className="text-xs text-on-surface-variant">{(watermarkFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-on-surface-variant">Opacity</span>
                      <span className="font-bold text-[#008cff]">{watermarkOpacity}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" max="100" 
                      value={watermarkOpacity} 
                      onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                      className="w-full accent-[#008cff]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-on-surface-variant">Scale (% of Target Width)</span>
                      <span className="font-bold text-[#008cff]">{watermarkScale}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" max="100" 
                      value={watermarkScale} 
                      onChange={(e) => setWatermarkScale(Number(e.target.value))}
                      className="w-full accent-[#008cff]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-2">Position Grid</label>
                    <div className="grid grid-cols-3 gap-2 bg-surface-container p-2 rounded-lg aspect-video">
                      {(['top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'] as Position[]).map((pos) => (
                        <button
                          key={pos}
                          onClick={() => setWatermarkPosition(pos)}
                          className={`w-full h-full rounded border-2 transition-all ${
                            watermarkPosition === pos 
                              ? 'border-[#008cff] bg-[#008cff]/20' 
                              : 'border-transparent hover:border-outline-variant bg-surface-container-low'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="pt-2">
              <button 
                onClick={processImages}
                disabled={isProcessing || images.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-[#008cff] text-white hover:bg-[#0070cc] disabled:bg-surface-container-highest disabled:text-on-surface-variant font-medium tracking-wide px-6 py-4 rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.98]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing {progress}%
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Process & Download ZIP
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
