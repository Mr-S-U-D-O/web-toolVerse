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
    <div className="min-h-screen bg-background text-on-surface w-full flex flex-col font-mono selection:bg-[#008cff] selection:text-white">
      
      {/* Brutalist Sticky Header */}
      <header className="sticky top-0 z-30 w-full border-b border-outline-variant bg-background/95 backdrop-blur-sm">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-on-surface-variant hover:text-[#008cff] transition-colors uppercase tracking-widest font-bold text-xs"
          >
            [ BACK TO CABINET ]
          </button>
          <span className="font-bold uppercase tracking-wider text-sm">
            PDF TEXT EXTRACTOR
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-[900px] mx-auto w-full px-6 py-12 flex flex-col gap-10">
        
        {/* Title Block */}
        <div className="border-b border-outline-variant pb-6">
          <h1 className="text-3xl font-black uppercase tracking-tight text-on-surface mb-2">
            PDF TEXT EXTRACTOR
          </h1>
          <p className="text-on-surface-variant text-sm font-sans tracking-wide">
            Instantly extract and strip all readable text layers from any PDF. 100% offline and secure.
          </p>
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
            <span className="text-xs uppercase font-bold tracking-widest text-on-surface-variant">
              [ DROP PDF TO EXTRACT TEXT ]
            </span>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="border border-[#008cff] bg-[#008cff]/5 text-[#008cff] p-12 text-xs font-bold uppercase tracking-widest text-center">
            EXTRACTING TEXT LAYER IN MEMORY...
          </div>
        )}

        {/* Output Canvas */}
        {extractedText && (
          <div className="flex flex-col gap-4">
            
            {/* Metrics and Controls Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant pb-3">
              {metrics && (
                <div className="text-xs font-bold tracking-widest uppercase text-on-surface-variant">
                  PAGES: [{metrics.pages}] | WORDS: [{metrics.words}]
                </div>
              )}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setExtractedText('');
                    setMetrics(null);
                  }}
                  className="text-xs font-bold tracking-widest uppercase text-red-500 hover:text-red-600"
                >
                  [ CLEAR ]
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
                [ COPY TO CLIPBOARD ]
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
