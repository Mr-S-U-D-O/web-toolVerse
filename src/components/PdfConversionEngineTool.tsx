import { ArrowLeft, Shield } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import html2pdf from 'html2pdf.js';

// Configure pdfjs-dist worker
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
  ).href;
} catch {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '';
}

interface PdfConversionEngineToolProps {
  onBack?: () => void;
}

type ViewType = 'PDF_TO_IMAGES' | 'HTML_TO_PDF';

interface ExtractedImage {
  pageNum: number;
  dataUrl: string;
}

export default function PdfConversionEngineTool({ onBack }: PdfConversionEngineToolProps) {
  const [activeTab, setActiveTab] = useState<ViewType>('PDF_TO_IMAGES');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── PDF to Images state ───────────────────────────────────────────────────
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [extractedImages, setExtractedImages] = useState<ExtractedImage[]>([]);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // ─── HTML to PDF state ─────────────────────────────────────────────────────
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: monospace;
      padding: 40px;
      color: #000000;
      background: #ffffff;
    }
    h1 {
      border-bottom: 2px solid #000000;
      padding-bottom: 10px;
      text-transform: uppercase;
    }
    p {
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <h1>PREMIUM EXPORT</h1>
  <p>This document is generated client-side using html2pdf.js and our brutalist converter suite.</p>
</body>
</html>`);

  const previewFrameRef = useRef<HTMLIFrameElement>(null);

  // Update iframe preview on code change
  useEffect(() => {
    if (activeTab === 'HTML_TO_PDF' && previewFrameRef.current) {
      const doc = previewFrameRef.current.contentDocument || previewFrameRef.current.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(htmlCode);
        doc.close();
      }
    }
  }, [htmlCode, activeTab]);

  const handlePdfLoad = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a PDF document.');
      return;
    }
    setError(null);
    setLoading(true);
    setExtractedImages([]);
    setPdfFile(file);

    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const loadingTask = pdfjsLib.getDocument({ data: bytes });
      const pdf = await loadingTask.promise;
      const imagesList: ExtractedImage[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // Render at 2.0 scale for high res

        const canvas = document.createElement('canvas');
        canvas.width = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);

        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({
          canvasContext: ctx as unknown as CanvasRenderingContext2D,
          viewport: viewport,
          canvas,
        } as unknown as Parameters<typeof page.render>[0]).promise;

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        imagesList.push({
          pageNum: i,
          dataUrl,
        });
      }

      setExtractedImages(imagesList);
    } catch (err) {
      console.error(err);
      setError('Failed to extract pages from PDF.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAllAsZip = async () => {
    if (extractedImages.length === 0) return;
    setLoading(true);
    try {
      const zip = new JSZip();
      extractedImages.forEach((img) => {
        const base64Data = img.dataUrl.split(',')[1];
        zip.file(`page_${img.pageNum}.jpg`, base64Data, { base64: true });
      });
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = pdfFile ? `${pdfFile.name.replace(/\.pdf$/i, '')}_images.zip` : 'extracted_images.zip';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (err) {
      console.error(err);
      setError('Failed to generate ZIP file.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSingleImage = (img: ExtractedImage) => {
    const a = document.createElement('a');
    a.href = img.dataUrl;
    a.download = `page_${img.pageNum}.jpg`;
    a.click();
  };

  const handleGeneratePdf = () => {
    setError(null);
    try {
      const element = previewFrameRef.current?.contentDocument?.body || previewFrameRef.current?.contentWindow?.document.body;
      if (!element) {
        setError('Preview element not found.');
        return;
      }
      
      const opt = {
        margin: 10,
        filename: 'converted_document.pdf',
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm' as const, format: 'a4', orientation: 'portrait' as const }
      };

      html2pdf().from(element).set(opt).save();
    } catch (err) {
      console.error(err);
      setError('Failed to convert HTML to PDF.');
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
            <div className="font-sans text-sm font-medium text-on-surface">PDF Conversion Engine</div>
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
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">PDF Conversion Engine</h1>
            <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
              Extract high-resolution JPG images from PDF pages, or convert raw HTML code directly into a formatted PDF document.
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
            CONVERTING IN CLIENT MEMORY...
          </div>
        )}

        {/* ─── VIEW: PDF TO IMAGES ────────────────────────────────────────────── */}
        {activeTab === 'PDF_TO_IMAGES' && (
          <div className="flex flex-col gap-6">
            <input
              ref={pdfInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handlePdfLoad(e.target.files[0])}
            />

            {!pdfFile ? (
              <div
                onClick={() => pdfInputRef.current?.click()}
                className="border-2 border-dashed border-outline-variant hover:border-[#008cff] bg-surface-container-low p-20 text-center cursor-pointer transition-all"
              >
                <span className="text-xs uppercase font-bold tracking-wide text-on-surface-variant">
                  Drop Pdf Document To Extract Jpg Images
                </span>
              </div>
            ) : (
              <div className="border border-outline-variant bg-surface-container-low p-6 flex justify-between items-center">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">SELECTED FILE</div>
                  <div className="text-sm font-bold mt-1">{pdfFile.name}</div>
                  <div className="text-xs text-on-surface-variant mt-1">{extractedImages.length} PAGES CONVERTED</div>
                </div>
                <button
                  onClick={() => {
                    setPdfFile(null);
                    setExtractedImages([]);
                  }}
                  className="text-red-500 hover:text-red-600 uppercase font-bold tracking-wider text-xs"
                >
                  Change
                </button>
              </div>
            )}

            {extractedImages.length > 0 && (
              <div className="flex flex-col gap-6">
                <button
                  onClick={handleDownloadAllAsZip}
                  className="w-full py-4 bg-[#008cff] hover:bg-[#0070cc] text-white text-xs font-bold uppercase tracking-wide transition-all"
                >
                  Download All As Zip
                </button>

                {/* Images Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {extractedImages.map((img) => (
                    <div key={img.pageNum} className="border border-outline-variant bg-surface-container-lowest p-2 flex flex-col gap-2">
                      <div className="aspect-[1/1.414] overflow-hidden bg-white border border-outline-variant flex items-center justify-center">
                        <img
                          src={img.dataUrl}
                          alt={`Page ${img.pageNum}`}
                          className="object-contain w-full h-full"
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span>PAGE {img.pageNum}</span>
                        <button
                          onClick={() => handleDownloadSingleImage(img)}
                          className="text-[#008cff] hover:text-[#0070cc] uppercase"
                        >
                          Get
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── VIEW: HTML TO PDF ──────────────────────────────────────────────── */}
        {activeTab === 'HTML_TO_PDF' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            {/* Left: HTML Code Input */}
            <div className="flex flex-col gap-4">
              <div className="text-xs uppercase font-bold tracking-wide text-on-surface-variant">
                HTML / CSS SOURCE CODE
              </div>
              <textarea
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                rows={18}
                className="w-full flex-grow bg-surface-container-low border border-outline-variant p-4 text-xs font-mono text-on-surface outline-none focus:border-[#008cff] focus:ring-1 focus:ring-[#008cff] transition-all resize-y"
              />
              <button
                onClick={handleGeneratePdf}
                className="w-full py-4 bg-[#008cff] hover:bg-[#0070cc] text-white text-xs font-bold uppercase tracking-wide transition-all"
              >
                Generate Pdf
              </button>
            </div>

            {/* Right: IFrame Preview */}
            <div className="flex flex-col gap-4">
              <div className="text-xs uppercase font-bold tracking-wide text-on-surface-variant">
                LIVE PRINT PREVIEW
              </div>
              <div className="w-full border border-outline-variant bg-white flex-grow min-h-[400px] overflow-hidden relative">
                <iframe
                  ref={previewFrameRef}
                  title="html-preview"
                  className="w-full h-full bg-white border-0"
                />
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
