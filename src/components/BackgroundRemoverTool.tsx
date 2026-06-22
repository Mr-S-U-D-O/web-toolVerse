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
  Cpu,
  Zap,
  CheckCircle2,
  AlertCircle,
  Loader2,
  SlidersHorizontal,
  Archive,
  Sparkles,
  Shield,
  Eye,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import JSZip from 'jszip';

// ─── Types ────────────────────────────────────────────────────────────────────

type ModelState = 'idle' | 'downloading' | 'ready' | 'error';
type ItemStatus = 'queued' | 'processing' | 'done' | 'error';

interface BgRemoveItem {
  id: string;
  file: File;
  originalBlobUrl: string;
  resultBlob: Blob | null;
  resultBlobUrl: string | null;
  status: ItemStatus;
  error?: string;
}

// Worker message shapes (outbound from worker)
interface WorkerProgressMsg {
  type: 'progress';
  stage: 'download' | 'inference';
  value: number;
  text: string;
}
interface WorkerReadyMsg {
  type: 'ready';
  device: string;
}
interface WorkerResultMsg {
  type: 'result';
  id: string;
  blob: Blob;
}
interface WorkerErrorMsg {
  type: 'error';
  id: string;
  message: string;
}
interface WorkerGlobalErrorMsg {
  type: 'global_error';
  message: string;
}
type WorkerMsg =
  | WorkerProgressMsg
  | WorkerReadyMsg
  | WorkerResultMsg
  | WorkerErrorMsg
  | WorkerGlobalErrorMsg;

// ─── Utilities ────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// ─── Checkerboard CSS (shows transparency in before/after) ────────────────────

const CHECKER_STYLE: React.CSSProperties = {
  backgroundImage: `
    linear-gradient(45deg, #3a3a3a 25%, transparent 25%),
    linear-gradient(-45deg, #3a3a3a 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #3a3a3a 75%),
    linear-gradient(-45deg, transparent 75%, #3a3a3a 75%)
  `,
  backgroundSize: '20px 20px',
  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
  backgroundColor: '#2a2a2a',
};

// ─── Before/After Slider Modal ────────────────────────────────────────────────

function BeforeAfterModal({
  item,
  onClose,
}: {
  item: BgRemoveItem;
  onClose: () => void;
}) {
  const [sliderX, setSliderX] = useState(50);
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
    [updateSlider],
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

  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    updateSlider(e.touches[0].clientX);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-4xl bg-surface-container-low border border-outline-variant rounded-2xl overflow-hidden shadow-2xl"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant">
            <div>
              <p className="font-sans font-medium text-on-surface truncate max-w-[400px]">
                {item.file.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                  {formatBytes(item.file.size)} original
                </span>
                <ChevronRight className="w-3 h-3 text-outline" />
                <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider">
                  Transparent PNG
                </span>
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
            {/* After — transparent PNG with checkerboard */}
            <div className="absolute inset-0" style={CHECKER_STYLE}>
              <img
                src={item.resultBlobUrl ?? ''}
                alt="Result"
                className="absolute inset-0 w-full h-full object-contain"
                draggable={false}
              />
            </div>

            {/* Before — original, clipped to left of slider */}
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

            {/* Divider */}
            <div
              className="absolute top-0 bottom-0 w-px bg-white/80 pointer-events-none"
              style={{ left: `${sliderX}%` }}
            />
            {/* Handle */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white border-2 border-white shadow-xl flex items-center justify-center pointer-events-none"
              style={{ left: `${sliderX}%` }}
            >
              <SlidersHorizontal className="w-4 h-4 text-black" />
            </div>

            {/* Labels */}
            <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 font-mono text-[10px] text-white uppercase tracking-widest pointer-events-none">
              Original
            </div>
            <div className="absolute top-3 right-3 px-2 py-1 rounded bg-emerald-500/80 font-mono text-[10px] text-white uppercase tracking-widest pointer-events-none">
              No Background
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-outline-variant text-center">
            <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
              Drag handle to compare • Checkerboard = transparent • Esc to close
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Item Row ─────────────────────────────────────────────────────────────────

function ImageRow({
  item,
  onRemove,
  onPreview,
  onDownload,
}: {
  item: BgRemoveItem;
  onRemove: (id: string) => void;
  onPreview: (item: BgRemoveItem) => void;
  onDownload: (item: BgRemoveItem) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.18 }}
      className="flex items-center gap-4 px-5 py-3.5 border-b border-outline-variant last:border-b-0 group hover:bg-surface-container/50 transition-colors"
    >
      {/* Thumbnail — shows result on checkerboard if done, else original */}
      <div
        className="w-10 h-10 rounded-lg border border-outline-variant overflow-hidden flex-shrink-0"
        style={item.status === 'done' ? CHECKER_STYLE : undefined}
      >
        <img
          src={item.resultBlobUrl ?? item.originalBlobUrl}
          alt={item.file.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="font-sans text-sm text-on-surface truncate">{item.file.name}</p>
        <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">
          {formatBytes(item.file.size)}
        </p>
      </div>

      {/* Status */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {item.status === 'queued' && (
          <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
            Queued
          </span>
        )}
        {item.status === 'processing' && (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-violet-400 animate-spin flex-shrink-0" />
            <span className="font-mono text-[11px] text-violet-400 uppercase tracking-wider">
              Removing…
            </span>
          </div>
        )}
        {item.status === 'done' && (
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-[11px] text-emerald-400 uppercase tracking-wider">
              Done
            </span>
          </div>
        )}
        {item.status === 'error' && (
          <div className="flex items-center gap-1.5" title={item.error}>
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span className="font-mono text-[11px] text-red-400 uppercase tracking-wider truncate max-w-[120px]">
              Failed
            </span>
          </div>
        )}
      </div>

      {/* Actions (hover reveal) */}
      <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {item.status === 'done' && item.resultBlobUrl && (
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
              title="Download transparent PNG"
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:text-violet-400 hover:border-violet-400/50 transition-colors"
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

// ─── Cold Start / Downloading UI ──────────────────────────────────────────────

function ModelLoadingPanel({
  progress,
  progressText,
  modelError,
  onRetry,
}: {
  progress: number;
  progressText: string;
  modelError: string | null;
  onRetry: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-2xl overflow-hidden border border-violet-500/30"
      style={{ background: 'rgba(139,92,246,0.06)' }}
    >
      <div className="p-8 flex flex-col items-center gap-6 text-center">
        {/* Icon */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(139,92,246,0.15)' }}>
            {modelError ? (
              <AlertCircle className="w-8 h-8 text-red-400" />
            ) : (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-8 h-8 text-violet-400" />
              </motion.div>
            )}
          </div>
          {/* Pulsing ring */}
          {!modelError && (
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-violet-400/40"
              animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>

        {/* Text */}
        {modelError ? (
          <>
            <div>
              <h3 className="font-heading text-lg font-semibold text-red-400 mb-2">Model Load Failed</h3>
              <p className="text-sm text-on-surface-variant max-w-sm">{modelError}</p>
            </div>
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-sm uppercase tracking-wider text-white transition-all hover:bg-violet-700"
              style={{ background: '#7c3aed' }}
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </>
        ) : (
          <>
            <div>
              <h3 className="font-heading text-xl font-semibold text-on-surface mb-2">
                Downloading AI Model
              </h3>
              <p className="text-sm text-on-surface-variant max-w-sm leading-relaxed">
                This only happens <strong className="text-on-surface">once</strong>. After caching,
                processing is <strong className="text-on-surface">instant, offline, and completely private</strong>.
                Your images never leave your device.
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider truncate">
                  {progressText || 'Initialising…'}
                </span>
                <span className="font-mono text-xs text-violet-400 ml-2 flex-shrink-0">
                  {progress}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-surface-container overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-violet-600"
                  animate={{ width: `${Math.max(4, progress)}%` }}
                  transition={{ ease: 'easeOut', duration: 0.4 }}
                />
              </div>
            </div>

            {/* Privacy badges */}
            <div className="flex items-center gap-4 flex-wrap justify-center">
              {[
                { icon: Shield, label: '100% Private' },
                { icon: Cpu, label: 'On-Device AI' },
                { icon: Zap, label: 'Cached Forever' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-on-surface-variant">
                  <Icon className="w-3.5 h-3.5 text-violet-400" />
                  <span className="font-mono text-[11px] uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface BackgroundRemoverToolProps {
  onBack?: () => void;
}

export default function BackgroundRemoverTool({ onBack }: BackgroundRemoverToolProps) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [modelState, setModelState] = useState<ModelState>('idle');
  const [modelError, setModelError] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [inferenceProgress, setInferenceProgress] = useState(0);
  const [activeDevice, setActiveDevice] = useState<string>('wasm');

  const [items, setItems] = useState<BgRemoveItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewItem, setPreviewItem] = useState<BgRemoveItem | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // ── Refs ───────────────────────────────────────────────────────────────────
  const workerRef = useRef<Worker | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const blobUrls = useRef<Set<string>>(new Set());
  // Queue: IDs waiting to be processed
  const processingQueue = useRef<string[]>([]);
  const currentlyProcessing = useRef<string | null>(null);

  // ── Blob URL tracking ──────────────────────────────────────────────────────

  function createTrackedUrl(blob: Blob | File): string {
    const url = URL.createObjectURL(blob);
    blobUrls.current.add(url);
    return url;
  }

  function revokeTrackedUrl(url: string) {
    URL.revokeObjectURL(url);
    blobUrls.current.delete(url);
  }

  // ── Worker lifecycle ───────────────────────────────────────────────────────

  const initWorker = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
    }

    const worker = new Worker(
      new URL('./workers/bgRemover.worker.ts', import.meta.url),
      { type: 'module' },
    );

    worker.onmessage = (event: MessageEvent<WorkerMsg>) => {
      const msg = event.data;

      switch (msg.type) {
        case 'progress': {
          if (msg.stage === 'download') {
            setModelState('downloading');
            setDownloadProgress(msg.value);
            setProgressText(msg.text);
          } else {
            setInferenceProgress(msg.value);
          }
          break;
        }
        case 'ready': {
          setModelState('ready');
          setDownloadProgress(100);
          setActiveDevice(msg.device);
          break;
        }
        case 'result': {
          const resultBlob = msg.blob;
          const resultBlobUrl = createTrackedUrl(resultBlob);

          setItems((prev) =>
            prev.map((item) =>
              item.id === msg.id
                ? { ...item, status: 'done', resultBlob, resultBlobUrl }
                : item,
            ),
          );

          currentlyProcessing.current = null;
          // Kick off next in queue
          processNextInQueue();
          break;
        }
        case 'error': {
          setItems((prev) =>
            prev.map((item) =>
              item.id === msg.id
                ? { ...item, status: 'error', error: msg.message }
                : item,
            ),
          );
          currentlyProcessing.current = null;
          processNextInQueue();
          break;
        }
        case 'global_error': {
          setModelState('error');
          setModelError(msg.message);
          break;
        }
      }
    };

    worker.onerror = (e) => {
      setModelState('error');
      setModelError(e.message || 'Worker crashed unexpectedly');
    };

    workerRef.current = worker;
    setModelState('downloading');
    setModelError(null);
    setDownloadProgress(0);
    worker.postMessage({ type: 'init' });
  }, []);

  // On mount: start the worker immediately so the model begins downloading
  useEffect(() => {
    initWorker();

    return () => {
      // Cleanup on unmount
      workerRef.current?.terminate();
      blobUrls.current.forEach((url) => URL.revokeObjectURL(url));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Queue processing ───────────────────────────────────────────────────────

  const processNextInQueue = useCallback(() => {
    if (currentlyProcessing.current) return; // already busy
    if (processingQueue.current.length === 0) {
      setIsProcessing(false);
      return;
    }

    const nextId = processingQueue.current.shift()!;
    currentlyProcessing.current = nextId;

    setItems((prev) =>
      prev.map((item) =>
        item.id === nextId ? { ...item, status: 'processing' } : item,
      ),
    );

    // Get file from items by id — we need to create a bitmap for the worker
    setItems((prev) => {
      const target = prev.find((i) => i.id === nextId);
      if (!target || !workerRef.current) return prev;

      createImageBitmap(target.file).then((bitmap) => {
        workerRef.current!.postMessage({ type: 'process', id: nextId, bitmap }, [bitmap]);
      }).catch((err) => {
        const message = err instanceof Error ? err.message : 'Failed to decode image';
        setItems((p) =>
          p.map((item) => item.id === nextId ? { ...item, status: 'error', error: message } : item),
        );
        currentlyProcessing.current = null;
        processNextInQueue();
      });

      return prev;
    });
  }, []);

  const runAll = useCallback(() => {
    if (modelState !== 'ready') return;

    const queued = items.filter((i) => i.status === 'queued');
    if (queued.length === 0) return;

    // Push all queued IDs into the processing queue
    queued.forEach((item) => processingQueue.current.push(item.id));
    setIsProcessing(true);
    processNextInQueue();
  }, [items, modelState, processNextInQueue]);

  // ── File ingestion ─────────────────────────────────────────────────────────

  const addFiles = useCallback((files: File[]) => {
    const imageFiles = files.filter((f) => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    const newItems: BgRemoveItem[] = imageFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      originalBlobUrl: createTrackedUrl(file),
      resultBlob: null,
      resultBlobUrl: null,
      status: 'queued',
    }));

    setItems((prev) => [...prev, ...newItems]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // ── Item management ────────────────────────────────────────────────────────

  const removeItem = useCallback((id: string) => {
    // Remove from queue if waiting
    processingQueue.current = processingQueue.current.filter((qid) => qid !== id);

    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) {
        revokeTrackedUrl(item.originalBlobUrl);
        if (item.resultBlobUrl) revokeTrackedUrl(item.resultBlobUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearAll = useCallback(() => {
    processingQueue.current = [];
    setItems((prev) => {
      prev.forEach((item) => {
        revokeTrackedUrl(item.originalBlobUrl);
        if (item.resultBlobUrl) revokeTrackedUrl(item.resultBlobUrl);
      });
      return [];
    });
    setIsProcessing(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Downloads ──────────────────────────────────────────────────────────────

  const downloadItem = (item: BgRemoveItem) => {
    if (!item.resultBlobUrl) return;
    const baseName = item.file.name.replace(/\.[^.]+$/, '');
    const a = document.createElement('a');
    a.href = item.resultBlobUrl;
    a.download = `${baseName}_no-bg.png`;
    a.click();
  };

  const downloadZip = async () => {
    const done = items.filter((i) => i.status === 'done' && i.resultBlob);
    if (done.length === 0) return;

    setIsZipping(true);
    const zip = new JSZip();
    const folder = zip.folder('removed-backgrounds')!;

    for (const item of done) {
      const baseName = item.file.name.replace(/\.[^.]+$/, '');
      folder.file(`${baseName}_no-bg.png`, item.resultBlob!);
    }

    try {
      const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 1 },
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'removed-backgrounds.zip';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } finally {
      setIsZipping(false);
    }
  };

  // ── Derived ────────────────────────────────────────────────────────────────

  const doneItems = items.filter((i) => i.status === 'done');
  const queuedCount = items.filter((i) => i.status === 'queued').length;
  const hasItems = items.length > 0;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background text-on-surface w-full">

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

          {/* Title + device badge */}
          <div className="flex items-center gap-3">
            <div className="font-sans text-sm font-medium text-on-surface">Background Remover</div>
            {modelState === 'ready' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono uppercase tracking-wider"
                style={
                  activeDevice === 'webgpu'
                    ? { borderColor: 'rgba(139,92,246,0.4)', background: 'rgba(139,92,246,0.08)', color: '#a78bfa' }
                    : { borderColor: 'rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.07)', color: '#60a5fa' }
                }
              >
                {activeDevice === 'webgpu' ? <Zap className="w-3 h-3" /> : <Cpu className="w-3 h-3" />}
                {activeDevice === 'webgpu' ? 'GPU Accelerated' : 'CPU (WASM)'}
              </motion.div>
            )}
          </div>

          {/* ZIP button */}
          <div className="w-[120px] flex justify-end">
            {doneItems.length > 0 && (
              <button
                onClick={downloadZip}
                disabled={isZipping}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container text-xs font-mono uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {isZipping ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Archive className="w-3.5 h-3.5" />}
                ZIP All
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-6 py-10 w-full">

        {/* ── Page Title ────────────────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold tracking-tight">Background Remover</h1>
          <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-xl">
            On-device AI removes backgrounds at full resolution. No server, no upload, no account — total privacy, forever free.
          </p>
        </div>

        {/* ── Model loading state ────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {(modelState === 'downloading' || modelState === 'error') && (
            <motion.div
              key="loading-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-8"
            >
              <ModelLoadingPanel
                progress={downloadProgress}
                progressText={progressText}
                modelError={modelError}
                onRetry={initWorker}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Drop zone ─────────────────────────────────────────────────── */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="relative rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden"
          style={{
            minHeight: hasItems ? '100px' : '280px',
            borderColor: isDragOver
              ? 'rgba(139,92,246,0.7)'
              : modelState === 'ready'
                ? 'rgba(139,92,246,0.3)'
                : 'rgba(255,255,255,0.1)',
            background: isDragOver
              ? 'rgba(139,92,246,0.06)'
              : 'rgba(139,92,246,0.02)',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />

          <AnimatePresence mode="wait">
            {isDragOver ? (
              <motion.div
                key="drag-active"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-3"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(139,92,246,0.2)' }}
                >
                  <Upload className="w-7 h-7 text-violet-400" />
                </div>
                <p className="font-mono text-sm text-violet-400 uppercase tracking-wider">Drop to add images</p>
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
                {/* Drop zone icon */}
                <motion.div
                  className="relative w-20 h-20 rounded-3xl flex items-center justify-center"
                  style={{ background: 'rgba(139,92,246,0.12)' }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <ImageIcon className="w-9 h-9 text-violet-400" />
                  <motion.div
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center bg-violet-600"
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Sparkles className="w-3 h-3 text-white" />
                  </motion.div>
                </motion.div>

                <div className="text-center">
                  <p className="font-sans text-base font-medium text-on-surface mb-1">
                    {modelState === 'ready'
                      ? 'Drop images here to remove backgrounds'
                      : 'AI model loading — drop images to queue them'}
                  </p>
                  <p className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                    JPG, PNG, WebP, AVIF • Unlimited batch • Full resolution output
                  </p>
                </div>

                {/* Pill badges */}
                <div className="flex items-center gap-3 flex-wrap justify-center">
                  {[
                    { icon: Shield, label: 'Zero Uploads' },
                    { icon: Zap, label: 'Full Resolution' },
                    { icon: Cpu, label: 'On-Device AI' },
                  ].map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-outline-variant/50 text-on-surface-variant"
                    >
                      <Icon className="w-3 h-3 text-violet-400" />
                      <span className="font-mono text-[10px] uppercase tracking-wider">{label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Action bar ────────────────────────────────────────────────── */}
        <AnimatePresence>
          {hasItems && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center justify-between mt-4 mb-2"
            >
              <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                {items.length} image{items.length !== 1 ? 's' : ''} —{' '}
                {doneItems.length} done
                {isProcessing && currentlyProcessing.current ? `, processing…` : ''}
              </span>

              <div className="flex items-center gap-2">
                {queuedCount > 0 && (
                  <button
                    onClick={runAll}
                    disabled={modelState !== 'ready' || isProcessing}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-mono uppercase tracking-wider text-white bg-violet-600 hover:bg-violet-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    {isProcessing
                      ? `Processing ${processingQueue.current.length + (currentlyProcessing.current ? 1 : 0)} left…`
                      : `Remove ${queuedCount} Background${queuedCount !== 1 ? 's' : ''}`}
                  </button>
                )}
                <button
                  onClick={clearAll}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono uppercase tracking-wider text-on-surface-variant hover:text-on-surface border border-outline-variant hover:bg-surface-container transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Per-item inference progress ────────────────────────────────── */}
        <AnimatePresence>
          {isProcessing && inferenceProgress > 0 && inferenceProgress < 100 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 overflow-hidden"
            >
              <div className="px-4 py-3 rounded-xl border border-violet-500/20 bg-violet-500/5 flex items-center gap-3">
                <Loader2 className="w-3.5 h-3.5 text-violet-400 animate-spin flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="h-1.5 rounded-full bg-surface-container overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-violet-600"
                      animate={{ width: `${inferenceProgress}%` }}
                      transition={{ ease: 'easeOut', duration: 0.3 }}
                    />
                  </div>
                </div>
                <span className="font-mono text-[10px] text-violet-400 uppercase tracking-wider flex-shrink-0">
                  {inferenceProgress}%
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Image list ────────────────────────────────────────────────── */}
        <AnimatePresence>
          {hasItems && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-outline-variant bg-surface-container-low overflow-hidden"
            >
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Privacy footer ────────────────────────────────────────────── */}
        {!hasItems && modelState === 'ready' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex items-start gap-4 p-5 rounded-xl border border-outline-variant/50 bg-surface-container-low"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: 'rgba(139,92,246,0.1)' }}
            >
              <Shield className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <p className="font-sans text-sm font-medium text-on-surface mb-1">
                Built to disrupt remove.bg
              </p>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                This tool runs the <strong className="text-on-surface">briaai/RMBG-1.4</strong> model entirely on your hardware using{' '}
                <strong className="text-on-surface">@huggingface/transformers</strong> with{' '}
                {activeDevice === 'webgpu' ? (
                  <strong className="text-violet-400">WebGPU acceleration</strong>
                ) : (
                  <strong className="text-[#60a5fa]">WebAssembly (CPU)</strong>
                )}
                . No account. No upload. No watermarks. No resolution limits. No freemium.
                The model is cached in your browser — subsequent uses are instant and fully offline.
              </p>
            </div>
          </motion.div>
        )}
      </main>

      {/* ── Before/After Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {previewItem && (
          <BeforeAfterModal
            item={previewItem}
            onClose={() => setPreviewItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
