import React, { useState, useCallback, useRef, useEffect, DragEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Upload,
  X,
  Download,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Archive,
  Shield,
  Zap,
  Cpu,
  FileImage,
  RefreshCw
} from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { convertImage, TargetFormat } from '../utils/imageConverter';

// ─── Types & State ────────────────────────────────────────────────────────────

export type ConversionStatus = 'queued' | 'processing' | 'done' | 'error';

export interface ConversionItem {
  id: string;
  file: File;
  originalFormat: string;
  originalSize: number;
  originalBlobUrl: string;
  targetFormat: TargetFormat;
  status: ConversionStatus;
  convertedBlob: Blob | null;
  convertedBlobUrl: string | null;
  convertedSize: number | null;
  error?: string;
}

const FORMAT_OPTIONS: { label: string; value: TargetFormat; ext: string }[] = [
  { label: 'JPG', value: 'image/jpeg', ext: 'jpg' },
  { label: 'PNG', value: 'image/png', ext: 'png' },
  { label: 'WebP', value: 'image/webp', ext: 'webp' },
];

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ImageConverterToolProps {
  onBack?: () => void;
}

export default function ImageConverterTool({ onBack }: ImageConverterToolProps) {
  const [items, setItems] = useState<ConversionItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [globalTargetFormat, setGlobalTargetFormat] = useState<TargetFormat>('image/jpeg');
  const [isProcessingGlobal, setIsProcessingGlobal] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const blobUrls = useRef<Set<string>>(new Set());

  // ── Memory Management ───────────────────────────────────────────────────────

  function createTrackedUrl(blob: Blob | File): string {
    const url = URL.createObjectURL(blob);
    blobUrls.current.add(url);
    return url;
  }

  function revokeTrackedUrl(url: string | null) {
    if (!url) return;
    URL.revokeObjectURL(url);
    blobUrls.current.delete(url);
  }

  useEffect(() => {
    return () => {
      // Cleanup all blob URLs on unmount
      blobUrls.current.forEach((url) => URL.revokeObjectURL(url));
      blobUrls.current.clear();
    };
  }, []);

  // ── File Handling ───────────────────────────────────────────────────────────

  const addFiles = useCallback((files: File[]) => {
    // Filter to known images and HEIC
    const imageFiles = files.filter(
      (f) =>
        f.type.startsWith('image/') ||
        f.name.toLowerCase().endsWith('.heic') ||
        f.name.toLowerCase().endsWith('.heif')
    );

    if (imageFiles.length === 0) return;

    setItems((prev) => {
      const newItems = imageFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        originalFormat: file.type || 'image/heic',
        originalSize: file.size,
        originalBlobUrl: createTrackedUrl(file),
        targetFormat: globalTargetFormat,
        status: 'queued' as ConversionStatus,
        convertedBlob: null,
        convertedBlobUrl: null,
        convertedSize: null,
      }));
      return [...prev, ...newItems];
    });
  }, [globalTargetFormat]);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) {
        revokeTrackedUrl(target.originalBlobUrl);
        revokeTrackedUrl(target.convertedBlobUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const clearAll = () => {
    setItems((prev) => {
      prev.forEach((item) => {
        revokeTrackedUrl(item.originalBlobUrl);
        revokeTrackedUrl(item.convertedBlobUrl);
      });
      return [];
    });
  };

  // ── Conversion Logic ────────────────────────────────────────────────────────

  const processSingleItem = async (item: ConversionItem) => {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: 'processing' } : i))
    );

    try {
      const blob = await convertImage(item.file, item.targetFormat, 0.9);
      const url = createTrackedUrl(blob);

      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                status: 'done',
                convertedBlob: blob,
                convertedBlobUrl: url,
                convertedSize: blob.size,
              }
            : i
        )
      );
    } catch (error) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                status: 'error',
                error: error instanceof Error ? error.message : 'Unknown error',
              }
            : i
        )
      );
    }
  };

  const convertAll = async () => {
    if (isProcessingGlobal) return;
    setIsProcessingGlobal(true);

    const queuedItems = items.filter((i) => i.status === 'queued' || i.status === 'error');
    
    // Process sequentially to prevent UI freezing on massive batches
    for (const item of queuedItems) {
      await processSingleItem(item);
    }

    setIsProcessingGlobal(false);
  };

  // ── Downloading ─────────────────────────────────────────────────────────────

  const downloadSingle = (item: ConversionItem) => {
    if (!item.convertedBlob) return;
    const ext = FORMAT_OPTIONS.find((o) => o.value === item.targetFormat)?.ext || 'jpg';
    const baseName = item.file.name.replace(/\.[^.]+$/, '');
    saveAs(item.convertedBlob, `${baseName}_converted.${ext}`);
  };

  const downloadZip = async () => {
    const doneItems = items.filter((i) => i.status === 'done' && i.convertedBlob);
    if (doneItems.length === 0) return;

    setIsZipping(true);
    const zip = new JSZip();
    const folder = zip.folder('converted-images')!;

    for (const item of doneItems) {
      const ext = FORMAT_OPTIONS.find((o) => o.value === item.targetFormat)?.ext || 'jpg';
      const baseName = item.file.name.replace(/\.[^.]+$/, '');
      folder.file(`${baseName}_converted.${ext}`, item.convertedBlob!);
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'converted-images.zip');
    setIsZipping(false);
  };

  // ── UI Helpers ──────────────────────────────────────────────────────────────

  const updateItemFormat = (id: string, format: TargetFormat) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          // Reset status if format changes so they can convert again
          const needsReset = i.status === 'done' || i.status === 'error';
          if (needsReset) {
            revokeTrackedUrl(i.convertedBlobUrl);
          }
          return {
            ...i,
            targetFormat: format,
            status: needsReset ? 'queued' : i.status,
            convertedBlob: needsReset ? null : i.convertedBlob,
            convertedBlobUrl: needsReset ? null : i.convertedBlobUrl,
            convertedSize: needsReset ? null : i.convertedSize,
          };
        }
        return i;
      })
    );
  };

  const handleGlobalFormatChange = (format: TargetFormat) => {
    setGlobalTargetFormat(format);
    // Apply to all queued items
    setItems((prev) =>
      prev.map((i) => (i.status === 'queued' ? { ...i, targetFormat: format } : i))
    );
  };

  const hasItems = items.length > 0;
  const queuedCount = items.filter((i) => i.status === 'queued').length;
  const doneCount = items.filter((i) => i.status === 'done').length;

  return (
    <div className="min-h-screen bg-background text-on-surface w-full pb-20">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 w-full border-b border-outline-variant bg-background/95 backdrop-blur-sm">
        <div className="max-w-[1280px] mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-mono text-[11px] uppercase tracking-widest">web-toolVerse</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="font-sans text-sm font-medium text-on-surface">Image Converter</div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono uppercase tracking-wider text-emerald-400">
              <Shield className="w-3 h-3" />
              100% Offline Processing
            </div>
          </div>

          <div className="w-[120px]" />
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-6 py-10 w-full">
        {/* ── Page Title ────────────────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold tracking-tight">Image Converter</h1>
          <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
            Lightning fast, fully private image conversion. Handles HEIC natively. 
            Zero server uploads, infinite bulk processing.
          </p>
        </div>

        {/* ── Drop Zone ─────────────────────────────────────────────────── */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="relative rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden mb-8"
          style={{
            minHeight: hasItems ? '100px' : '240px',
            borderColor: isDragOver
              ? 'rgba(59,130,246,0.7)'
              : 'rgba(255,255,255,0.1)',
            background: isDragOver
              ? 'rgba(59,130,246,0.06)'
              : 'rgba(59,130,246,0.02)',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.heic,.heif"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />

          <AnimatePresence mode="wait">
            {isDragOver ? (
              <motion.div
                key="drag"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-3"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-500/20">
                  <Upload className="w-7 h-7 text-blue-400" />
                </div>
                <p className="font-mono text-sm text-blue-400 uppercase tracking-wider">Drop files here</p>
              </motion.div>
            ) : hasItems ? (
              <motion.div
                key="compact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-3 py-6"
              >
                <Upload className="w-4 h-4 text-on-surface-variant" />
                <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                  Drop more images or click to add
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-5"
              >
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center bg-blue-500/10">
                  <FileImage className="w-9 h-9 text-blue-400" />
                </div>
                <div className="text-center">
                  <p className="font-sans text-base font-medium text-on-surface mb-1">
                    Drop images here to convert
                  </p>
                  <p className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                    JPG, PNG, WebP, HEIC • Native Canvas Speed
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Toolbar & Action Bar ──────────────────────────────────────── */}
        <AnimatePresence>
          {hasItems && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                    Convert to:
                  </span>
                  <select
                    value={globalTargetFormat}
                    onChange={(e) => handleGlobalFormatChange(e.target.value as TargetFormat)}
                    disabled={isProcessingGlobal}
                    className="bg-surface-container border border-outline-variant rounded-lg px-3 py-1.5 text-sm font-sans text-on-surface focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
                  >
                    {FORMAT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="h-6 w-px bg-outline-variant" />

                <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                  {items.length} file{items.length !== 1 ? 's' : ''} • {doneCount} ready
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={clearAll}
                  disabled={isProcessingGlobal}
                  className="px-3 py-2 rounded-xl text-xs font-mono uppercase tracking-wider text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50"
                >
                  Clear All
                </button>
                
                {doneCount > 0 && (
                  <button
                    onClick={downloadZip}
                    disabled={isZipping || isProcessingGlobal}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-mono uppercase tracking-wider bg-surface-container border border-outline-variant hover:border-emerald-500/50 hover:text-emerald-400 transition-colors disabled:opacity-50"
                  >
                    {isZipping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Archive className="w-4 h-4" />}
                    ZIP Ready
                  </button>
                )}

                {queuedCount > 0 && (
                  <button
                    onClick={convertAll}
                    disabled={isProcessingGlobal}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-mono uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isProcessingGlobal ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    Convert {queuedCount}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── File List ─────────────────────────────────────────────────── */}
        <AnimatePresence>
          {hasItems && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-outline-variant bg-surface-container-low overflow-hidden"
            >
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-lowest/50">
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-on-surface-variant w-12">File</th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">Name</th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-on-surface-variant w-32">Target Format</th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-on-surface-variant w-32">Status</th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-on-surface-variant w-32 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.tr
                        key={item.id}
                        layout
                        initial={{ opacity: 0, backgroundColor: 'rgba(59,130,246,0.1)' }}
                        animate={{ opacity: 1, backgroundColor: 'transparent' }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="border-b border-outline-variant/50 last:border-b-0 hover:bg-surface-container/30 transition-colors group"
                      >
                        {/* Thumbnail */}
                        <td className="px-4 py-3">
                          <div className="w-10 h-10 rounded border border-outline-variant overflow-hidden bg-surface-container">
                            <img
                              src={item.convertedBlobUrl || item.originalBlobUrl}
                              alt="thumb"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>

                        {/* Name & Size Info */}
                        <td className="px-4 py-3">
                          <p className="font-sans text-sm text-on-surface truncate max-w-[300px]">
                            {item.file.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-mono text-[10px] text-on-surface-variant uppercase">
                              {formatBytes(item.originalSize)}
                            </span>
                            {item.status === 'done' && item.convertedSize && (
                              <>
                                <span className="text-on-surface-variant/50">→</span>
                                <span className="font-mono text-[10px] text-emerald-400 uppercase">
                                  {formatBytes(item.convertedSize)}
                                </span>
                              </>
                            )}
                          </div>
                        </td>

                        {/* Format Select */}
                        <td className="px-4 py-3">
                          <select
                            value={item.targetFormat}
                            onChange={(e) => updateItemFormat(item.id, e.target.value as TargetFormat)}
                            disabled={isProcessingGlobal || item.status === 'processing'}
                            className="bg-transparent border border-outline-variant rounded px-2 py-1 text-xs font-sans text-on-surface focus:outline-none focus:border-blue-500 disabled:opacity-50"
                          >
                            {FORMAT_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {item.status === 'queued' && (
                              <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                                Ready
                              </span>
                            )}
                            {item.status === 'processing' && (
                              <>
                                <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                                <span className="font-mono text-[11px] text-blue-400 uppercase tracking-wider">
                                  Converting
                                </span>
                              </>
                            )}
                            {item.status === 'done' && (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="font-mono text-[11px] text-emerald-400 uppercase tracking-wider">
                                  Done
                                </span>
                              </>
                            )}
                            {item.status === 'error' && (
                              <div title={item.error} className="flex items-center gap-1.5 cursor-help">
                                <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                                <span className="font-mono text-[11px] text-red-400 uppercase tracking-wider max-w-[80px] truncate">
                                  Failed
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.status === 'done' && (
                              <button
                                onClick={() => downloadSingle(item)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:text-blue-400 hover:border-blue-400/50 transition-colors"
                                title="Download"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => removeItem(item.id)}
                              disabled={isProcessingGlobal && item.status === 'processing'}
                              className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:text-red-400 hover:border-red-400/50 transition-colors disabled:opacity-30"
                              title="Remove"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
