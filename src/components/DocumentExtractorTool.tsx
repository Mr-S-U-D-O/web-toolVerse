import { ArrowLeft, Shield } from 'lucide-react';
import React, { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs-dist worker
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
  ).href;
} catch {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '';
}

interface DocumentExtractorToolProps {
  onBack?: () => void;
}

export default function DocumentExtractorTool({ onBack }: DocumentExtractorToolProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [metrics, setMetrics] = useState<{ pages: number; words: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLoadFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a PDF document.');
      return;
    }

    setError(null);
    setLoading(true);
    setExtractedText('');
    setMetrics(null);

    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const loadingTask = pdfjsLib.getDocument({ data: bytes });
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      let wordCount = 0;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += `--- PAGE ${i} ---\n${pageText}\n\n`;
        
        // Simple word count parsing
        const words = pageText.trim().split(/\s+/).filter(Boolean);
        wordCount += words.length;
      }

      setExtractedText(fullText.trim());
      setMetrics({
        pages: pdf.numPages,
        words: wordCount,
      });
    } catch (err) {
      console.error(err);
      setError('Failed to extract text. The PDF might be corrupted or secured.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!extractedText) return;
    try {
      await navigator.clipboard.writeText(extractedText);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDownload = () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted_text.txt';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
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
            <div className="font-sans text-sm font-medium text-on-surface">PDF Text Extractor</div>
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
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">PDF Text Extractor</h1>
            <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
              Instantly strip and extract all readable text from any PDF document. 100% offline, preserving data privacy.
            </p>
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="border border-red-500 bg-red-500/5 text-red-500 p-4 text-xs font-bold uppercase tracking-wider">
            ERROR: {error}
          </div>
        )}

        {/* Dropzone */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleLoadFile(e.target.files[0])}
        />

        {!extractedText && !loading && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-outline-variant hover:border-[#008cff] bg-surface-container-low p-20 text-center cursor-pointer transition-all"
          >
            <span className="text-xs uppercase font-bold tracking-wide text-on-surface-variant">
              Drop Pdf To Extract Text
            </span>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="border border-[#008cff] bg-[#008cff]/5 text-[#008cff] p-12 text-xs font-bold uppercase tracking-wide text-center">
            EXTRACTING TEXT LAYER IN MEMORY...
          </div>
        )}

        {/* Output Canvas */}
        {extractedText && (
          <div className="flex flex-col gap-4">
            
            {/* Metrics and Controls Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant pb-3">
              {metrics && (
                <div className="text-xs font-bold tracking-wide uppercase text-on-surface-variant">
                  PAGES: [{metrics.pages}] | WORDS: [{metrics.words}]
                </div>
              )}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setExtractedText('');
                    setMetrics(null);
                  }}
                  className="text-xs font-bold tracking-wide uppercase text-red-500 hover:text-red-600"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Read-only output textarea */}
            <textarea
              readOnly
              value={extractedText}
              rows={18}
              className="w-full bg-surface-container-low border border-outline-variant p-4 text-sm text-on-surface font-mono outline-none focus:border-[#008cff] focus:ring-1 focus:ring-[#008cff] transition-all resize-y"
            />

            {/* Actions Footer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <button
                onClick={handleCopy}
                className="w-full py-3.5 border border-outline-variant bg-surface-container-low hover:bg-surface-container hover:border-[#008cff] text-xs font-bold uppercase tracking-wider transition-all"
              >
                Copy To Clipboard
              </button>
              <button
                onClick={handleDownload}
                className="w-full py-3.5 bg-[#008cff] text-white hover:bg-[#0070cc] text-xs font-bold uppercase tracking-wider transition-all"
              >
                [ DOWNLOAD .TXT ]
              </button>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
