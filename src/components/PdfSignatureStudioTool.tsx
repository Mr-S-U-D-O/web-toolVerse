import { ArrowLeft, Shield } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';
import SignaturePad from 'signature_pad';

// Set up pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export default function PdfSignatureStudioTool({ onBack }: { onBack: () => void }) {
  // State
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [stampPosition, setStampPosition] = useState<{ xPercent: number; yPercent: number } | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);
  const previewImgRef = useRef<HTMLImageElement>(null);

  // Initialize Signature Pad
  useEffect(() => {
    if (signatureCanvasRef.current && !signaturePadRef.current) {
      signaturePadRef.current = new SignaturePad(signatureCanvasRef.current, {
        minWidth: 1,
        maxWidth: 3,
        penColor: 'black',
      });
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
    }
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (signaturePadRef.current) {
        signaturePadRef.current.off();
        signaturePadRef.current = null;
      }
    };
  }, []);

  const resizeCanvas = () => {
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      // We don't want to lose signature if we resize, but for simplicity, we clear
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext('2d')?.scale(ratio, ratio);
      signaturePadRef.current?.clear();
    }
  };

  // Handle PDF load
  const handlePdfLoad = async (file: File) => {
    setLoading(true);
    setError(null);
    setPdfFile(file);
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      setPdfBytes(bytes);
      await renderPagePreview(bytes, 1);
    } catch (err: any) {
      setError(err.message || 'Failed to load PDF');
      setPdfFile(null);
      setPdfBytes(null);
    } finally {
      setLoading(false);
    }
  };

  // Render a specific page to data URL
  const renderPagePreview = async (bytes: Uint8Array, pageNum: number) => {
    try {
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      setNumPages(pdf.numPages);
      setCurrentPage(pageNum);

      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 }); // Good resolution for preview

      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('No 2d context');

      await page.render({ canvasContext: ctx as any, viewport }).promise;
      setPreviewUrl(canvas.toDataURL('image/jpeg', 0.8));
    } catch (err: any) {
      setError(err.message || 'Failed to render PDF page');
    }
  };

  const handlePrevPage = () => {
    if (pdfBytes && currentPage > 1) {
      renderPagePreview(pdfBytes, currentPage - 1);
      setStampPosition(null); // Reset stamp position on page change
    }
  };

  const handleNextPage = () => {
    if (pdfBytes && currentPage < numPages) {
      renderPagePreview(pdfBytes, currentPage + 1);
      setStampPosition(null);
    }
  };

  const handleClearSignature = () => {
    signaturePadRef.current?.clear();
    setSignatureData(null);
  };

  const handleSaveSignature = () => {
    if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
      // Create a copy of the canvas to crop the whitespace
      // For a simple implementation, we just get the whole canvas data url.
      // But let's make it a transparent PNG
      const dataUrl = signaturePadRef.current.toDataURL('image/png');
      setSignatureData(dataUrl);
    } else {
      setError('PLEASE DRAW A SIGNATURE FIRST.');
    }
  };

  const handlePreviewClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!previewImgRef.current) return;
    const rect = previewImgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setStampPosition({
      xPercent: x / rect.width,
      yPercent: y / rect.height,
    });
  };

  const handleApplySignature = async () => {
    if (!pdfFile || !pdfBytes || !signatureData || !stampPosition) {
      setError('MISSING PDF, SIGNATURE, OR STAMP POSITION.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      const page = pages[currentPage - 1]; // 0-indexed

      // Embed the signature PNG
      const pngImage = await pdfDoc.embedPng(signatureData);
      
      // Calculate dimensions (we'll scale the signature to a reasonable size, e.g. 150px wide)
      const sigWidth = 150;
      const dims = pngImage.scale(sigWidth / pngImage.width);

      // pdf-lib origin (0,0) is bottom-left. 
      const pageWidth = page.getWidth();
      const pageHeight = page.getHeight();

      const x = stampPosition.xPercent * pageWidth;
      // yPercent from top. So yPercent * height is distance from top.
      // Distance from bottom is height - (yPercent * height)
      // Also we want to center the signature on the clicked point, so subtract half height/width.
      const yFromBottom = pageHeight - (stampPosition.yPercent * pageHeight);
      
      const xCentered = x - (dims.width / 2);
      const yCentered = yFromBottom - (dims.height / 2);

      page.drawImage(pngImage, {
        x: xCentered,
        y: yCentered,
        width: dims.width,
        height: dims.height,
      });

      const modifiedPdfBytes = await pdfDoc.save();
      const blob = new Blob([modifiedPdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = pdfFile.name.replace('.pdf', '_signed.pdf');
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'Failed to sign PDF');
    } finally {
      setLoading(false);
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
            <div className="font-sans text-sm font-medium text-on-surface">PDF Signature Studio</div>
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
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">PDF Signature Studio</h1>
            <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
              Draw and stamp your signature onto PDF documents securely. 100% offline, keeping sensitive contracts private.
            </p>
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="border border-red-500 bg-red-500/5 text-red-500 p-4 text-xs font-bold uppercase tracking-wider">
            ERROR: {error}
          </div>
        )}

        {/* Global Loading Spinner */}
        {loading && (
          <div className="border border-[#008cff] bg-[#008cff]/5 text-[#008cff] p-4 text-xs font-bold uppercase tracking-wide text-center">
            PROCESSING SECURELY IN MEMORY...
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Side: Document Preview & Stamp Controller */}
          <div className="flex flex-col gap-4">
            <div className="text-xs uppercase font-bold tracking-wide text-on-surface-variant border-b border-outline-variant pb-2">
              DOCUMENT PREVIEW
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handlePdfLoad(e.target.files[0])}
            />

            {!pdfFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-outline-variant hover:border-[#008cff] bg-surface-container-low p-20 text-center cursor-pointer transition-all h-[400px] flex items-center justify-center"
              >
                <span className="text-xs uppercase font-bold tracking-wide text-on-surface-variant">
                  Drop Pdf Contract Here
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-4 border border-outline-variant bg-surface-container-lowest p-4">
                <div className="flex justify-between items-center bg-surface-container-low border border-outline-variant p-2 text-xs font-bold uppercase">
                  <span className="truncate max-w-[200px]">{pdfFile.name}</span>
                  <div className="flex items-center gap-4">
                    <button onClick={handlePrevPage} disabled={currentPage <= 1} className="hover:text-[#008cff] disabled:opacity-30">[ &lt; ]</button>
                    <span>PAGE {currentPage} / {numPages}</span>
                    <button onClick={handleNextPage} disabled={currentPage >= numPages} className="hover:text-[#008cff] disabled:opacity-30">[ &gt; ]</button>
                    <button onClick={() => { setPdfFile(null); setPdfBytes(null); setPreviewUrl(null); setStampPosition(null); }} className="text-red-500 hover:text-red-600 ml-4">Clear File</button>
                  </div>
                </div>

                <div className="relative border border-outline-variant bg-white flex items-center justify-center min-h-[500px] overflow-hidden">
                  {previewUrl ? (
                    <div className="relative inline-block cursor-crosshair">
                      <img
                        ref={previewImgRef}
                        src={previewUrl}
                        alt="PDF Preview"
                        className="max-w-full max-h-[700px] object-contain"
                        onClick={handlePreviewClick}
                        draggable={false}
                      />
                      {/* Stamp Position Indicator */}
                      {stampPosition && (
                        <div 
                          className="absolute w-4 h-4 rounded-full border-2 border-[#008cff] bg-[#008cff]/20 pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                          style={{
                            left: `${stampPosition.xPercent * 100}%`,
                            top: `${stampPosition.yPercent * 100}%`
                          }}
                        />
                      )}
                    </div>
                  ) : (
                    <span className="text-xs font-bold uppercase text-on-surface-variant">RENDERING...</span>
                  )}
                </div>
                
                {stampPosition ? (
                  <div className="text-xs text-[#008cff] font-bold uppercase text-center border border-[#008cff]/30 p-2 bg-[#008cff]/5">
                    COORDINATES LOCKED. READY TO STAMP.
                  </div>
                ) : (
                  <div className="text-xs text-on-surface-variant font-bold uppercase text-center border border-outline-variant p-2">
                    CLICK ANYWHERE ON THE DOCUMENT TO SET SIGNATURE POSITION.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Side: Signature Pad & Execution */}
          <div className="flex flex-col gap-4">
            <div className="text-xs uppercase font-bold tracking-wide text-on-surface-variant border-b border-outline-variant pb-2">
              SIGNATURE PAD
            </div>

            <div className="border border-outline-variant bg-white relative w-full h-[250px]">
              <div className="absolute top-2 left-0 right-0 text-center text-xs uppercase font-bold text-gray-300 pointer-events-none">
                Draw Signature Here
              </div>
              <canvas
                ref={signatureCanvasRef}
                className="w-full h-full cursor-crosshair"
                style={{ touchAction: 'none' }}
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleClearSignature}
                className="flex-1 py-3 border border-outline-variant hover:border-on-surface text-xs font-bold uppercase tracking-wide transition-all text-on-surface-variant hover:text-on-surface"
              >
                Clear Pad
              </button>
              <button
                onClick={handleSaveSignature}
                className="flex-1 py-3 border border-[#008cff] bg-[#008cff]/5 hover:bg-[#008cff]/10 text-[#008cff] text-xs font-bold uppercase tracking-wide transition-all"
              >
                Save Signature
              </button>
            </div>

            {signatureData && (
              <div className="mt-6 flex flex-col gap-4">
                <div className="text-xs uppercase font-bold tracking-wide text-on-surface-variant border-b border-outline-variant pb-2">
                  STORED SIGNATURE
                </div>
                <div className="border border-outline-variant bg-white p-4 flex justify-center items-center h-[120px]">
                  <img src={signatureData} alt="Saved Signature" className="max-h-full object-contain filter contrast-125" />
                </div>
                
                <button
                  onClick={handleApplySignature}
                  disabled={!pdfFile || !stampPosition}
                  className={`w-full py-4 text-white text-xs font-bold uppercase tracking-wide transition-all ${
                    !pdfFile || !stampPosition
                      ? 'bg-outline-variant cursor-not-allowed opacity-50'
                      : 'bg-[#008cff] hover:bg-[#0070cc]'
                  }`}
                >
                  Bind Signature And Download
                </button>
              </div>
            )}
            
          </div>
        </div>
      </main>
    </div>
  );
}
