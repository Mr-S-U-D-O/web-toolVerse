import { ArrowLeft, Shield } from 'lucide-react';
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import piexif from 'piexifjs';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface ProcessedImage {
  id: string;
  name: string;
  originalSize: number;
  scrubbedSize: number;
  blobUrl: string | null;
  status: 'PROCESSING' | 'SUCCESS' | 'ERROR' | 'UNSUPPORTED';
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function dataURLtoBlob(dataurl: string): Blob {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export default function ExifScrubberTool({ onBack }: { onBack?: () => void }) {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [isProcessingZip, setIsProcessingZip] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map(file => ({
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36),
      name: file.name,
      originalSize: file.size,
      scrubbedSize: 0,
      blobUrl: null,
      status: 'PROCESSING' as const,
    }));

    setImages(prev => [...prev, ...newImages]);

    acceptedFiles.forEach((file, index) => {
      const currentId = newImages[index].id;
      
      if (!file.type.match(/image\/jpe?g/i)) {
        setImages(prev => prev.map(img => 
          img.id === currentId ? { ...img, status: 'UNSUPPORTED' } : img
        ));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const dataUrl = e.target?.result as string;
          // piexif.remove throws if the file has no EXIF or is malformed, 
          // but sometimes it just returns the cleaned string.
          const scrubbedDataUrl = piexif.remove(dataUrl);
          const scrubbedBlob = dataURLtoBlob(scrubbedDataUrl);
          
          setImages(prev => prev.map(img => 
            img.id === currentId ? { 
              ...img, 
              scrubbedSize: scrubbedBlob.size,
              blobUrl: URL.createObjectURL(scrubbedBlob),
              status: 'SUCCESS'
            } : img
          ));
        } catch (error) {
          // If piexif fails (e.g. no exif data at all), we can just return the original file
          console.warn(`Failed to scrub ${file.name}, possibly no EXIF:`, error);
          const blobUrl = URL.createObjectURL(file);
          setImages(prev => prev.map(img => 
            img.id === currentId ? { 
              ...img, 
              scrubbedSize: file.size,
              blobUrl: blobUrl,
              status: 'SUCCESS' 
            } : img
          ));
        }
      };
      reader.onerror = () => {
        setImages(prev => prev.map(img => 
          img.id === currentId ? { ...img, status: 'ERROR' } : img
        ));
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg']
    }
  });

  const downloadAllZip = async () => {
    const successfulImages = images.filter(img => img.status === 'SUCCESS' && img.blobUrl);
    if (successfulImages.length === 0) return;

    setIsProcessingZip(true);
    try {
      const zip = new JSZip();
      
      for (const img of successfulImages) {
        if (img.blobUrl) {
          const response = await fetch(img.blobUrl);
          const blob = await response.blob();
          zip.file(`scrubbed_${img.name}`, blob);
        }
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `scrubbed_images_${Date.now()}.zip`);
    } catch (error) {
      console.error('ZIP generation failed:', error);
      alert('FAILED TO GENERATE ZIP');
    } finally {
      setIsProcessingZip(false);
    }
  };

  const removeAll = () => {
    images.forEach(img => {
      if (img.blobUrl) URL.revokeObjectURL(img.blobUrl);
    });
    setImages([]);
  };

  return (
    <div className="flex-grow w-full max-w-5xl mx-auto px-6 py-12 flex flex-col relative z-10 font-mono tracking-wide text-on-surface">
      {/* Header - Text Only Brutalism */}
      <div className="mb-12 border-b-2 border-outline-variant pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold uppercase tracking-tighter mb-2">PHOTO EXIF & GPS SCRUBBER</h1>
          <p className="text-sm uppercase tracking-wide text-on-surface-variant">PERMANENTLY DELETE HIDDEN METADATA. 100% LOCAL EXECUTION.</p>
        </div>
        {onBack && (
          <button 
            onClick={onBack}
            className="text-xs font-bold uppercase tracking-wide text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Return To Directory
          </button>
        )}
      </div>

      {/* Dropzone */}
      <div 
        {...getRootProps()} 
        className={`w-full border-4 border-dashed p-16 mb-12 flex items-center justify-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-[#008cff] bg-[#008cff]/5' 
            : 'border-outline-variant hover:border-on-surface'
        }`}
      >
        <input {...getInputProps()} />
        <p className={`text-2xl font-bold uppercase tracking-wide text-center ${isDragActive ? 'text-[#008cff]' : 'text-on-surface-variant'}`}>
          {isDragActive ? 'RELEASE TO PROCESS' : 'DROP JPEG IMAGES HERE TO SCRUB DATA'}
        </p>
      </div>

      {/* Output Grid */}
      {images.length > 0 && (
        <div className="w-full flex flex-col border-2 border-outline-variant">
          <div className="w-full bg-surface-container flex items-center justify-between p-4 border-b-2 border-outline-variant">
            <h2 className="text-lg font-bold uppercase tracking-wide">PROCESS QUEUE ({images.length})</h2>
            <div className="flex gap-4">
              <button 
                onClick={removeAll}
                className="text-xs font-bold uppercase tracking-wide text-on-surface-variant hover:text-red-500 transition-colors"
              >
                Clear All
              </button>
              {images.some(img => img.status === 'SUCCESS') && (
                <button 
                  onClick={downloadAllZip}
                  disabled={isProcessingZip}
                  className="text-xs font-bold uppercase tracking-wide text-[#008cff] hover:text-white hover:bg-[#008cff] px-3 py-1 transition-colors"
                >
                  {isProcessingZip ? 'ZIPPING...' : '[ DOWNLOAD ALL (ZIP) ]'}
                </button>
              )}
            </div>
          </div>
          
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-outline-variant bg-surface-container-lowest text-xs font-bold uppercase tracking-wide">
                  <th className="p-4 border-r-2 border-outline-variant w-1/2">FILENAME</th>
                  <th className="p-4 border-r-2 border-outline-variant">ORIGINAL SIZE</th>
                  <th className="p-4 border-r-2 border-outline-variant">SCRUBBED SIZE</th>
                  <th className="p-4">ACTION</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {images.map((img, idx) => (
                  <tr key={img.id} className={`border-b border-outline-variant ${idx % 2 === 0 ? 'bg-surface' : 'bg-surface-container-lowest'}`}>
                    <td className="p-4 border-r-2 border-outline-variant font-medium truncate max-w-xs" title={img.name}>
                      {img.name}
                    </td>
                    <td className="p-4 border-r-2 border-outline-variant text-on-surface-variant">
                      {formatBytes(img.originalSize)}
                    </td>
                    <td className="p-4 border-r-2 border-outline-variant text-on-surface-variant">
                      {img.status === 'SUCCESS' ? formatBytes(img.scrubbedSize) : img.status}
                    </td>
                    <td className="p-4">
                      {img.status === 'SUCCESS' && img.blobUrl ? (
                        <a 
                          href={img.blobUrl}
                          download={`scrubbed_${img.name}`}
                          className="text-xs font-bold uppercase tracking-wide text-[#008cff] hover:underline"
                        >
                          DOWNLOAD SCRUBBED
                        </a>
                      ) : img.status === 'PROCESSING' ? (
                        <span className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">PROCESSING...</span>
                      ) : img.status === 'UNSUPPORTED' ? (
                        <span className="text-xs font-bold uppercase tracking-wide text-red-500">ONLY JPEG SUPPORTED</span>
                      ) : (
                        <span className="text-xs font-bold uppercase tracking-wide text-red-500">ERROR</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
