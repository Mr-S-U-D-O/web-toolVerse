import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  DragEvent,
  ChangeEvent,
} from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Upload,
  X,
  Download,
  ImageIcon,
  Zap,
  Shield,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  SlidersHorizontal,
  Archive,
  FolderOpen,
  Eye,
} from 'lucide-react';
import imageCompression from 'browser-image-compression';
import JSZip from 'jszip';

// ─── Types ───────────────────────────────────────────────────────────────────

type OutputFormat = 'original' | 'webp' | 'jpeg' | 'png';
type CompressionMode = 'lossy' | 'lossless';
type ItemStatus = 'queued' | 'compressing' | 'done' | 'error';

interface ImageItem {
  id: string;
  file: File;
  originalSize: number;
  originalBlobUrl: string; // revokeObjectURL on cleanup
  compressedBlob: Blob | null;
  compressedBlobUrl: string | null; // revokeObjectURL on cleanup
  compressedSize: number | null;
  status: ItemStatus;
  error?: string;
  outputFormat: OutputFormat;
}

interface CompressionSettings {
  mode: CompressionMode;
  quality: number; // 0.0–1.0
  outputFormat: OutputFormat;
  maxWidthOrHeight: number;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function savingsPercent(original: number, compressed: number): number {
  if (original === 0) return 0;
  return Math.round(((original - compressed) / original) * 100);
}

function getOutputMimeType(format: OutputFormat, originalType: string): string {
  switch (format) {
    case 'webp': return 'image/webp';
    case 'jpeg': return 'image/jpeg';
    case 'png': return 'image/png';
    default: return originalType;
  }
}

function getOutputExtension(format: OutputFormat, file: File): string {
  if (format !== 'original') return `.${format}`;
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  return `.${ext}`;
}

// ─── Before/After Slider Modal ────────────────────────────────────────────────

function BeforeAfterModal({
  item,
  onClose,
}: {
  item: ImageItem;
  onClose: () => void;
}) {
  const [sliderX, setSliderX] = useState(50); // percent
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updateSlider = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setSliderX(x * 100);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    updateSlider(e.clientX);
  };

  const onMouseMove = useCallback(
    (e: MouseEvent) => { if (isDragging.current) updateSlider(e.clientX); },
    [updateSlider]
  );

  const onMouseUp = useCallback(() => { isDragging.current = false; }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  // Touch support
  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    updateSlider(e.touches[0].clientX);
  };

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const savings = item.compressedSize != null
    ? savingsPercent(item.originalSize, item.compressedSize)
    : 0;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-4xl bg-surface-container-low border border-outline-variant rounded-2xl overflow-hidden"
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant">
            <div>
              <p className="font-sans font-medium text-on-surface truncate max-w-[400px]">{item.file.name}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">Before: {formatBytes(item.originalSize)}</span>
                <ChevronRight className="w-3 h-3 text-outline" />
                <span className="font-mono text-[11px] text-[#008cff] uppercase tracking-wider">After: {formatBytes(item.compressedSize ?? 0)}</span>
                <span className="font-mono text-[11px] text-emerald-400 uppercase tracking-wider">–{savings}%</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Slider */}
          <div
            ref={containerRef}
            className="relative select-none cursor-col-resize overflow-hidden"
            style={{ aspectRatio: '16/9' }}
            onMouseDown={onMouseDown}
            onTouchMove={onTouchMove}
            onTouchStart={(e) => updateSlider(e.touches[0].clientX)}
          >
            {/* After (compressed) — full width, behind */}
            <img
              src={item.compressedBlobUrl ?? ''}
              alt="Compressed"
              className="absolute inset-0 w-full h-full object-contain bg-surface-container-lowest"
              draggable={false}
            />

            {/* Before (original) — clipped to left of slider */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderX}%` }}
            >
              <img
                src={item.originalBlobUrl}
                alt="Original"
                className="absolute inset-0 w-full h-full object-contain bg-surface-container-lowest"
                draggable={false}
                style={{ width: `${containerRef.current?.offsetWidth ?? 0}px` }}
              />
            </div>

            {/* Divider line */}
            <div
              className="absolute top-0 bottom-0 w-px bg-white/80 pointer-events-none"
              style={{ left: `${sliderX}%` }}
            />

            {/* Handle */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-white shadow-lg flex items-center justify-center pointer-events-none"
              style={{ left: `${sliderX}%` }}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-black" />
            </div>

            {/* Labels */}
            <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 font-mono text-[10px] text-white uppercase tracking-widest pointer-events-none">
              Original
            </div>
            <div className="absolute top-3 right-3 px-2 py-1 rounded bg-[#008cff]/80 font-mono text-[10px] text-white uppercase tracking-widest pointer-events-none">
              Compressed
            </div>
          </div>

          {/* Footer hint */}
          <div className="px-5 py-3 border-t border-outline-variant text-center">
            <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">Drag the handle to compare • Press Esc to close</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Row Item ─────────────────────────────────────────────────────────────────

function ImageRow({
  item,
  onRemove,
  onPreview,
  onDownload,
}: {
  item: ImageItem;
  onRemove: (id: string) => void;
  onPreview: (item: ImageItem) => void;
  onDownload: (item: ImageItem) => void;
}) {
  const savings =
    item.compressedSize != null
      ? savingsPercent(item.originalSize, item.compressedSize)
      : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.18 }}
      className="flex items-center gap-4 px-5 py-4 border-b border-outline-variant last:border-b-0 group hover:bg-surface-container/50 transition-colors"
    >
      {/* Thumbnail */}
      <div className="w-10 h-10 rounded-lg border border-outline-variant overflow-hidden flex-shrink-0 bg-surface-container">
        <img
          src={item.compressedBlobUrl ?? item.originalBlobUrl}
          alt={item.file.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* File name */}
      <div className="flex-1 min-w-0">
        <p className="font-sans text-sm text-on-surface truncate">{item.file.name}</p>
        <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">
          {item.file.type.replace('image/', '')}
          {item.outputFormat !== 'original' && ` → ${item.outputFormat}`}
        </p>
      </div>

      {/* Sizes */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="text-right hidden sm:block">
          <p className="font-mono text-xs text-on-surface-variant">{formatBytes(item.originalSize)}</p>
          <p className="font-mono text-[10px] text-outline uppercase tracking-wider">original</p>
        </div>

        {item.status === 'done' && item.compressedSize != null && (
          <>
            <ChevronRight className="w-4 h-4 text-outline flex-shrink-0 hidden sm:block" />
            <div className="text-right hidden sm:block">
              <p className="font-mono text-xs text-on-surface">{formatBytes(item.compressedSize)}</p>
              <p className="font-mono text-[10px] text-outline uppercase tracking-wider">compressed</p>
            </div>
            <div className="w-16 text-right">
              <span
                className={`font-mono text-sm font-medium ${
                  savings! > 0 ? 'text-emerald-400' : 'text-on-surface-variant'
                }`}
              >
                {savings! > 0 ? `–${savings}%` : '±0%'}
              </span>
            </div>
          </>
        )}

        {item.status === 'compressing' && (
          <div className="w-24 flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-[#008cff] animate-spin flex-shrink-0" />
            <span className="font-mono text-[11px] text-[#008cff] uppercase tracking-wider">Working</span>
          </div>
        )}

        {item.status === 'queued' && (
          <div className="w-24">
            <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">Queued</span>
          </div>
        )}

        {item.status === 'error' && (
          <div className="w-24 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span className="font-mono text-[11px] text-red-400 uppercase tracking-wider truncate" title={item.error}>
              Error
            </span>
          </div>
        )}
      </div>

      {/* Status icon */}
      <div className="flex-shrink-0 w-5">
        {item.status === 'done' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {item.status === 'done' && item.compressedBlobUrl && (
          <>
            <button
              onClick={() => onPreview(item)}
              title="Before/After comparison"
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDownload(item)}
              title="Download compressed file"
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:text-[#008cff] hover:border-[#008cff]/50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </>
        )}
        <button
          onClick={() => onRemove(item.id)}
          title="Remove"
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:text-red-400 hover:border-red-400/50 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Tool ────────────────────────────────────────────────────────────────

interface ImageCompressorToolProps {
  onBack?: () => void;
}

export default function ImageCompressorTool({ onBack }: ImageCompressorToolProps) {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [settings, setSettings] = useState<CompressionSettings>({
    mode: 'lossy',
    quality: 0.75,
    outputFormat: 'original',
    maxWidthOrHeight: 4096,
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewItem, setPreviewItem] = useState<ImageItem | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dirInputRef = useRef<HTMLInputElement>(null);
  // Track all blob URLs for cleanup
  const blobUrls = useRef<Set<string>>(new Set());

  // Cleanup all blob URLs on unmount
  useEffect(() => {
    return () => {
      blobUrls.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  function createTrackedObjectUrl(blob: Blob | File): string {
    const url = URL.createObjectURL(blob);
    blobUrls.current.add(url);
    return url;
  }

  function revokeTrackedUrl(url: string) {
    URL.revokeObjectURL(url);
    blobUrls.current.delete(url);
  }

  // ── File ingestion ────────────────────────────────────────────────────────

  const addFiles = useCallback(
    (files: File[]) => {
      const imageFiles = files.filter((f) => f.type.startsWith('image/'));
      if (imageFiles.length === 0) return;

      const newItems: ImageItem[] = imageFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        originalSize: file.size,
        originalBlobUrl: createTrackedObjectUrl(file),
        compressedBlob: null,
        compressedBlobUrl: null,
        compressedSize: null,
        status: 'queued',
        outputFormat: settings.outputFormat,
      }));

      setItems((prev) => [...prev, ...newItems]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [settings.outputFormat]
  );

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  // ── Compression ───────────────────────────────────────────────────────────

  const compressAll = useCallback(async () => {
    const queued = items.filter((i) => i.status === 'queued');
    if (queued.length === 0) return;

    setIsCompressing(true);

    for (const item of queued) {
      // Mark as compressing
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: 'compressing' } : i))
      );

      try {
        const outputMime = getOutputMimeType(item.outputFormat, item.file.type);

        const options: Parameters<typeof imageCompression>[1] = {
          useWebWorker: true,
          fileType: outputMime,
          ...(settings.mode === 'lossy'
            ? {
                initialQuality: settings.quality,
                maxWidthOrHeight: settings.maxWidthOrHeight,
                alwaysKeepResolution: false,
              }
            : {
                // Lossless path: only strip EXIF, keep full resolution & max quality
                initialQuality: 1.0,
                maxWidthOrHeight: undefined,
                alwaysKeepResolution: true,
              }),
          exifOrientation: -2, // Auto-read EXIF orientation; strip other metadata
          onProgress: () => {}, // silence console logs
        };

        const compressedFile = await imageCompression(item.file, options);
        const compressedBlobUrl = createTrackedObjectUrl(compressedFile);

        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  status: 'done',
                  compressedBlob: compressedFile,
                  compressedBlobUrl,
                  compressedSize: compressedFile.size,
                }
              : i
          )
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Compression failed';
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, status: 'error', error: msg } : i
          )
        );
      }
    }

    setIsCompressing(false);
  }, [items, settings]);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) {
        revokeTrackedUrl(item.originalBlobUrl);
        if (item.compressedBlobUrl) revokeTrackedUrl(item.compressedBlobUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    setItems((prev) => {
      prev.forEach((item) => {
        revokeTrackedUrl(item.originalBlobUrl);
        if (item.compressedBlobUrl) revokeTrackedUrl(item.compressedBlobUrl);
      });
      return [];
    });
  }, []);

  // ── Individual download ───────────────────────────────────────────────────

  const downloadItem = (item: ImageItem) => {
    if (!item.compressedBlobUrl || !item.compressedBlob) return;
    const ext = getOutputExtension(item.outputFormat, item.file);
    const baseName = item.file.name.replace(/\.[^.]+$/, '');
    const a = document.createElement('a');
    a.href = item.compressedBlobUrl;
    a.download = `${baseName}_compressed${ext}`;
    a.click();
  };

  // ── ZIP export ────────────────────────────────────────────────────────────

  const downloadZip = async () => {
    const done = items.filter((i) => i.status === 'done' && i.compressedBlob);
    if (done.length === 0) return;

    setIsZipping(true);
    const zip = new JSZip();
    const folder = zip.folder('compressed-images')!;

    for (const item of done) {
      const ext = getOutputExtension(item.outputFormat, item.file);
      const baseName = item.file.name.replace(/\.[^.]+$/, '');
      folder.file(`${baseName}_compressed${ext}`, item.compressedBlob!);
    }

    try {
      const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 1 }, // low because images are already compressed
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'compressed-images.zip';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } finally {
      setIsZipping(false);
    }
  };

  // ── Derived stats ─────────────────────────────────────────────────────────

  const doneItems = items.filter((i) => i.status === 'done');
  const queuedCount = items.filter((i) => i.status === 'queued').length;
  const totalOriginal = doneItems.reduce((a, i) => a + i.originalSize, 0);
  const totalCompressed = doneItems.reduce((a, i) => a + (i.compressedSize ?? 0), 0);
  const totalSavings = savingsPercent(totalOriginal, totalCompressed);

  // ── Quality presets ───────────────────────────────────────────────────────

  const qualityPresets = [
    { label: 'High', value: 0.9 },
    { label: 'Balanced', value: 0.75 },
    { label: 'Aggressive', value: 0.5 },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface w-full">

      {/* ── Tool Header / Nav ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 w-full border-b border-outline-variant bg-background/95 backdrop-blur-sm">
        <div className="max-w-[1280px] mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-mono text-[11px] uppercase tracking-widest">web-toolVerse</span>
          </button>
          <div className="font-sans text-sm font-medium text-on-surface">Image Compressor</div>
          <div className="w-[120px] flex justify-end">
            {doneItems.length > 0 && (
              <button
                onClick={downloadZip}
                disabled={isZipping}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container text-xs font-mono uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {isZipping ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Archive className="w-3.5 h-3.5" />
                )}
                ZIP All
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-6 py-10 w-full">

        {/* ── Page Title ───────────────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold tracking-tight">Image Compressor</h1>
          <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-xl">
            100% client-side. Files never leave your device — unlimited batch, zero uploads, total privacy.
          </p>
        </div>

        {/* ── Two-column layout (settings | dropzone+list) ─────────────── */}
        <div className="flex gap-6 items-start">

          {/* Settings panel */}
          <aside className="w-64 flex-shrink-0 border border-outline-variant rounded-xl bg-surface-container-low overflow-hidden">
            {/* Mode */}
            <div className="p-4 border-b border-outline-variant">
              <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-3">Mode</p>
              <div className="flex flex-col gap-2">
                {([
                  { id: 'lossy', label: 'Lossy', sublabel: 'Max reduction', icon: Zap },
                  { id: 'lossless', label: 'Lossless', sublabel: 'Zero degradation', icon: Shield },
                ] as const).map(({ id, label, sublabel, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setSettings((s) => ({ ...s, mode: id }))}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors text-left ${
                      settings.mode === id
                        ? 'border-[#008cff]/60 bg-[#008cff]/8 text-on-surface'
                        : 'border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${settings.mode === id ? 'text-[#008cff]' : ''}`} />
                    <div>
                      <p className="text-xs font-medium font-sans">{label}</p>
                      <p className="text-[10px] font-mono text-on-surface-variant tracking-wide">{sublabel}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quality (lossy only) */}
            {settings.mode === 'lossy' && (
              <div className="p-4 border-b border-outline-variant">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">Quality</p>
                  <span className="font-mono text-xs text-on-surface">{Math.round(settings.quality * 100)}%</span>
                </div>
                {/* Presets */}
                <div className="flex gap-1.5 mb-3">
                  {qualityPresets.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => setSettings((s) => ({ ...s, quality: p.value }))}
                      className={`flex-1 py-1 rounded text-[10px] font-mono uppercase tracking-wide border transition-colors ${
                        settings.quality === p.value
                          ? 'border-[#008cff]/60 bg-[#008cff]/8 text-[#008cff]'
                          : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                {/* Slider */}
                <input
                  type="range"
                  min={20}
                  max={100}
                  step={5}
                  value={Math.round(settings.quality * 100)}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, quality: Number(e.target.value) / 100 }))
                  }
                  className="w-full accent-[#008cff]"
                />
              </div>
            )}

            {/* Output format */}
            <div className="p-4 border-b border-outline-variant">
              <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-3">Output Format</p>
              <div className="flex flex-col gap-1.5">
                {(['original', 'webp', 'jpeg', 'png'] as OutputFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setSettings((s) => ({ ...s, outputFormat: fmt }))}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-colors ${
                      settings.outputFormat === fmt
                        ? 'border-[#008cff]/60 bg-[#008cff]/8 text-on-surface'
                        : 'border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    <span className="font-mono text-[11px] uppercase tracking-wider">{fmt === 'original' ? 'Keep original' : `.${fmt}`}</span>
                    {settings.outputFormat === fmt && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#008cff]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Max dimension (lossy only) */}
            {settings.mode === 'lossy' && (
              <div className="p-4">
                <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-3">Max Dimension</p>
                <div className="flex flex-col gap-1.5">
                  {([
                    { label: 'Unlimited', val: 99999 },
                    { label: '4096 px', val: 4096 },
                    { label: '2048 px', val: 2048 },
                    { label: '1280 px', val: 1280 },
                  ]).map(({ label, val }) => (
                    <button
                      key={val}
                      onClick={() => setSettings((s) => ({ ...s, maxWidthOrHeight: val }))}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-colors ${
                        settings.maxWidthOrHeight === val
                          ? 'border-[#008cff]/60 bg-[#008cff]/8 text-on-surface'
                          : 'border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                      }`}
                    >
                      <span className="font-mono text-[11px] uppercase tracking-wider">{label}</span>
                      {settings.maxWidthOrHeight === val && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#008cff]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Right panel */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">

            {/* Drop zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors cursor-pointer ${
                isDragOver
                  ? 'border-[#008cff] bg-[#008cff]/5'
                  : 'border-outline-variant hover:border-outline bg-surface-container-low'
              }`}
              style={{ minHeight: items.length === 0 ? '260px' : '120px' }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileInput}
              />
              <input
                ref={dirInputRef}
                type="file"
                accept="image/*"
                multiple
                // @ts-ignore
                webkitdirectory=""
                className="hidden"
                onChange={handleFileInput}
              />

              <div className={`flex flex-col items-center text-center pointer-events-none transition-all ${items.length === 0 ? 'py-14' : 'py-8'}`}>
                <div className={`rounded-xl border border-outline-variant bg-surface-container p-4 mb-4 ${isDragOver ? 'border-[#008cff]/50' : ''}`}>
                  <Upload className={`w-6 h-6 ${isDragOver ? 'text-[#008cff]' : 'text-on-surface-variant'}`} />
                </div>
                <p className="font-sans text-sm font-medium text-on-surface mb-1">
                  {isDragOver ? 'Drop to add images' : 'Drop images here or click to browse'}
                </p>
                <p className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                  JPG, PNG, WebP, AVIF, GIF — batch of 50+ supported
                </p>
              </div>

              {/* Directory button — positioned separately to avoid the whole-zone click conflict */}
              {!isDragOver && (
                <button
                  className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container text-[11px] font-mono uppercase tracking-wider transition-colors pointer-events-auto"
                  onClick={(e) => { e.stopPropagation(); dirInputRef.current?.click(); }}
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  Whole folder
                </button>
              )}
            </div>

            {/* Batch list */}
            {items.length > 0 && (
              <div className="border border-outline-variant rounded-xl overflow-hidden bg-surface-container-low">
                {/* List header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-outline-variant bg-surface-container">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="w-4 h-4 text-on-surface-variant" />
                    <span className="font-mono text-[11px] uppercase tracking-widest text-on-surface-variant">
                      {items.length} image{items.length !== 1 ? 's' : ''}
                    </span>
                    {doneItems.length > 0 && (
                      <span className="font-mono text-[11px] text-emerald-400 uppercase tracking-wider">
                        {doneItems.length} done
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {queuedCount > 0 && (
                      <button
                        onClick={compressAll}
                        disabled={isCompressing}
                        className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#008cff] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#0070cc] transition-colors disabled:opacity-50"
                      >
                        {isCompressing ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Zap className="w-3.5 h-3.5" />
                        )}
                        Compress {queuedCount > 1 ? `all ${queuedCount}` : ''}
                      </button>
                    )}
                    <button
                      onClick={clearAll}
                      className="px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container text-xs font-mono uppercase tracking-wider transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Rows */}
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <ImageRow
                      key={item.id}
                      item={item}
                      onRemove={removeItem}
                      onPreview={setPreviewItem}
                      onDownload={downloadItem}
                    />
                  ))}
                </AnimatePresence>

                {/* Summary footer */}
                {doneItems.length > 0 && (
                  <div className="px-5 py-3 border-t border-outline-variant bg-surface-container flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div>
                        <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Saved </span>
                        <span className="font-mono text-sm font-medium text-emerald-400">
                          {formatBytes(totalOriginal - totalCompressed)}
                        </span>
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Reduction </span>
                        <span className="font-mono text-sm font-medium text-emerald-400">–{totalSavings}%</span>
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">{formatBytes(totalOriginal)} </span>
                        <span className="font-mono text-[10px] text-outline">→</span>
                        <span className="font-mono text-[10px] text-on-surface"> {formatBytes(totalCompressed)}</span>
                      </div>
                    </div>
                    <button
                      onClick={downloadZip}
                      disabled={isZipping}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container text-xs font-mono uppercase tracking-wider transition-colors disabled:opacity-50"
                    >
                      {isZipping ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Archive className="w-3.5 h-3.5" />}
                      Download ZIP
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Empty state */}
            {items.length === 0 && (
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Shield, title: 'Zero Uploads', body: 'Everything runs in your browser. No files ever touch a server.' },
                  { icon: Zap, title: 'Web Worker', body: 'Compression runs off the main thread — UI stays fluid no matter the batch size.' },
                  { icon: Archive, title: 'Bulk ZIP Export', body: 'Download 50 compressed images in a single click.' },
                ].map(({ icon: Icon, title, body }) => (
                  <div key={title} className="p-5 rounded-xl border border-outline-variant bg-surface-container-low">
                    <div className="w-8 h-8 rounded-lg border border-outline-variant bg-surface-container flex items-center justify-center mb-3">
                      <Icon className="w-4 h-4 text-on-surface-variant" />
                    </div>
                    <p className="font-sans text-sm font-medium text-on-surface mb-1">{title}</p>
                    <p className="font-mono text-[11px] text-on-surface-variant leading-relaxed tracking-wide">{body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>


      </main>

      {/* ── Before/After Modal ────────────────────────────────────────── */}
      {previewItem && previewItem.status === 'done' && previewItem.compressedBlobUrl && (
        <BeforeAfterModal item={previewItem} onClose={() => setPreviewItem(null)} />
      )}
    </div>
  );
}
