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
  FilePlus2,
  Trash2,
  RotateCw,
  Lock,
  Scissors,
  ScanText,
  Download,
  FileText,
  ChevronRight,
  AlertCircle,
  Loader2,
  X,
  Shield,
  CheckSquare,
  Square,
  FileDown,
  Info,
  WifiOff,
  CheckCircle2,
} from 'lucide-react';
import {
  SourceDocument,
  WorkspacePage,
  loadPdfFromFile,
  getPdfPageCount,
  renderPageThumbnail,
  assemblePdf,
} from '../utils/pdfUtils';

// ─── Types ────────────────────────────────────────────────────────────────────

type ActiveOperation = 'none' | 'merge' | 'delete' | 'rotate' | 'split' | 'encrypt' | 'ocr';

interface EncryptionConfig {
  enabled: boolean;
  userPassword: string;
  ownerPassword: string;
}

interface PDFStudioToolProps {
  onBack?: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isPdfFile(file: File) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

// ─── Skeleton Thumbnail ───────────────────────────────────────────────────────

function ThumbnailSkeleton() {
  return (
    <div className="w-full h-full bg-surface-container flex items-center justify-center">
      <Loader2 className="w-5 h-5 text-on-surface-variant animate-spin" />
    </div>
  );
}

// ─── Page Card ────────────────────────────────────────────────────────────────

interface PageCardProps {
  page: WorkspacePage;
  index: number;
  activeOperation: ActiveOperation;
  isDragTarget: boolean;
  isDragging: boolean;
  onDragStart: () => void;
  onDragOver: (e: DragEvent) => void;
  onDragEnd: () => void;
  onDrop: () => void;
  onClick: () => void;
}

function PageCard({
  page,
  index,
  activeOperation,
  isDragTarget,
  isDragging,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
  onClick,
}: PageCardProps) {
  const isSelectMode = activeOperation === 'delete' || activeOperation === 'split';
  const isRotateMode = activeOperation === 'rotate';
  const isInteractive = isSelectMode || isRotateMode;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: isDragging ? 0.35 : 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.1 } }}
      transition={{ duration: 0.18 }}
      draggable={!isInteractive}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
      onClick={onClick}
      className={`relative flex flex-col rounded-lg border overflow-hidden select-none transition-all group ${
        isDragTarget
          ? 'border-[#008cff] ring-2 ring-[#008cff]/25 shadow-lg shadow-[#008cff]/10'
          : page.isSelected
          ? 'border-[#008cff]'
          : isInteractive
          ? 'border-outline-variant hover:border-[#008cff]/50 cursor-pointer'
          : 'border-outline-variant hover:border-outline cursor-grab active:cursor-grabbing'
      } bg-surface-container-lowest`}
    >
      {/* Thumbnail area — A4 aspect ratio */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '1 / 1.414' }}>
        {page.thumbnailUrl ? (
          <img
            src={page.thumbnailUrl}
            alt={`Page ${index + 1}`}
            draggable={false}
            className="absolute inset-0 w-full h-full object-contain bg-white"
          />
        ) : (
          <ThumbnailSkeleton />
        )}

        {/* Selection overlay (delete / split modes) */}
        {isSelectMode && (
          <div
            className={`absolute inset-0 flex items-center justify-center transition-colors ${
              page.isSelected
                ? 'bg-[#008cff]/20'
                : 'bg-transparent group-hover:bg-black/10'
            }`}
          >
            {page.isSelected ? (
              <CheckSquare className="w-6 h-6 text-[#008cff] drop-shadow" />
            ) : (
              <Square className="w-5 h-5 text-white drop-shadow opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        )}

        {/* Rotate mode overlay */}
        {isRotateMode && (
          <div className="absolute inset-0 flex items-center justify-center bg-transparent group-hover:bg-black/15 transition-colors">
            <RotateCw className="w-5 h-5 text-white drop-shadow opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}

        {/* Rotation badge */}
        {page.rotation !== 0 && (
          <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-[#008cff]/80 font-mono text-[9px] text-white leading-none">
            {page.rotation}°
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-2 py-1.5 border-t border-outline-variant flex items-center justify-between bg-surface-container-low">
        <span className="font-mono text-[10px] text-on-surface-variant">{index + 1}</span>
        {page.isSelected && (
          <CheckCircle2 className="w-3 h-3 text-[#008cff]" />
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PDFStudioTool({ onBack }: PDFStudioToolProps) {
  // ── Core workspace state ─────────────────────────────────────────────────
  const [sources, setSources] = useState<SourceDocument[]>([]);
  const [pages, setPages] = useState<WorkspacePage[]>([]);
  const [activeOperation, setActiveOperation] = useState<ActiveOperation>('none');
  const [encryption, setEncryption] = useState<EncryptionConfig>({
    enabled: false,
    userPassword: '',
    ownerPassword: '',
  });
  const [outputFilename, setOutputFilename] = useState('document.pdf');

  // ── UI state ─────────────────────────────────────────────────────────────
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [isBuildingOutput, setIsBuildingOutput] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isMergeDropOver, setIsMergeDropOver] = useState(false);

  // ── Drag-reorder state ───────────────────────────────────────────────────
  const [draggedPageId, setDraggedPageId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  // ── Refs ─────────────────────────────────────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mergeInputRef = useRef<HTMLInputElement>(null);
  const blobUrls = useRef<Set<string>>(new Set());
  // Stable ref so loadPdf can read current pages without stale closure
  const pagesRef = useRef<WorkspacePage[]>([]);
  pagesRef.current = pages;

  // Revoke all tracked URLs on unmount
  useEffect(() => {
    return () => {
      blobUrls.current.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  function trackUrl(url: string): string {
    blobUrls.current.add(url);
    return url;
  }
  function revokeUrl(url: string) {
    URL.revokeObjectURL(url);
    blobUrls.current.delete(url);
  }

  // ── File loading ─────────────────────────────────────────────────────────

  const loadPdf = useCallback(async (file: File, mode: 'initial' | 'merge') => {
    if (!isPdfFile(file)) {
      setError('Please select a PDF file.');
      return;
    }

    setIsLoadingFile(true);
    setError(null);

    try {
      const bytes = await loadPdfFromFile(file);
      const pageCount = await getPdfPageCount(bytes);

      const source: SourceDocument = {
        id: crypto.randomUUID(),
        filename: file.name,
        bytes,
        pageCount,
      };

      // Create placeholder page entries (thumbnails generated progressively below)
      const newPages: WorkspacePage[] = Array.from({ length: pageCount }, (_, i) => ({
        id: crypto.randomUUID(),
        sourceDocId: source.id,
        sourcePageIndex: i,
        rotation: 0,
        thumbnailUrl: null,
        isSelected: false,
      }));

      if (mode === 'initial') {
        // Revoke all existing thumbnail URLs
        pagesRef.current.forEach((p) => {
          if (p.thumbnailUrl) revokeUrl(p.thumbnailUrl);
        });
        setSources([source]);
        setPages(newPages);
        setOutputFilename(file.name);
        setActiveOperation('none');
      } else {
        setSources((prev) => [...prev, source]);
        setPages((prev) => [...prev, ...newPages]);
      }

      // Generate thumbnails in the background, 3 at a time
      generateThumbnails(source.bytes, newPages);
    } catch (e) {
      setError('Failed to load the PDF. The file may be corrupted or password-protected.');
      console.error('[PDFStudio] load error:', e);
    } finally {
      setIsLoadingFile(false);
    }
  }, []);

  async function generateThumbnails(bytes: Uint8Array, newPages: WorkspacePage[]) {
    const BATCH = 3;
    for (let i = 0; i < newPages.length; i += BATCH) {
      const batch = newPages.slice(i, i + BATCH);
      await Promise.all(
        batch.map(async (p) => {
          const url = await renderPageThumbnail(bytes, p.sourcePageIndex, 220);
          if (url) {
            trackUrl(url);
            setPages((prev) =>
              prev.map((x) => (x.id === p.id ? { ...x, thumbnailUrl: url } : x))
            );
          }
        })
      );
    }
  }

  // ── Drag and drop (file) ──────────────────────────────────────────────────

  const onMainDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const onMainDragLeave = () => setIsDragOver(false);
  const onMainDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(isPdfFile);
    if (!files.length) return;
    if (sources.length === 0) {
      await loadPdf(files[0], 'initial');
    } else {
      for (const f of files) await loadPdf(f, 'merge');
    }
  };

  const onFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      loadPdf(e.target.files[0], 'initial');
      e.target.value = '';
    }
  };
  const onMergeInput = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      for (const f of Array.from(e.target.files)) await loadPdf(f, 'merge');
      e.target.value = '';
    }
  };

  // ── Page operations ───────────────────────────────────────────────────────

  const toggleSelect = (id: string) =>
    setPages((prev) => prev.map((p) => (p.id === id ? { ...p, isSelected: !p.isSelected } : p)));

  const selectAll = () => setPages((prev) => prev.map((p) => ({ ...p, isSelected: true })));
  const deselectAll = () => setPages((prev) => prev.map((p) => ({ ...p, isSelected: false })));

  const deleteSelected = () => {
    setPages((prev) => {
      const toRemove = prev.filter((p) => p.isSelected);
      toRemove.forEach((p) => { if (p.thumbnailUrl) revokeUrl(p.thumbnailUrl); });
      return prev.filter((p) => !p.isSelected);
    });
  };

  const rotatePage = (id: string) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, rotation: ((p.rotation + 90) % 360) as 0 | 90 | 180 | 270 }
          : p
      )
    );
  };

  const rotateSelected = () => {
    setPages((prev) =>
      prev.map((p) =>
        p.isSelected
          ? { ...p, rotation: ((p.rotation + 90) % 360) as 0 | 90 | 180 | 270 }
          : p
      )
    );
  };

  // ── Drag-to-reorder ───────────────────────────────────────────────────────

  const onPageDragStart = (id: string) => setDraggedPageId(id);
  const onPageDragOver = (e: DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedPageId && draggedPageId !== targetId) setDropTargetId(targetId);
  };
  const onPageDragEnd = () => {
    setDraggedPageId(null);
    setDropTargetId(null);
  };
  const onPageDrop = (targetId: string) => {
    if (!draggedPageId || draggedPageId === targetId) return;
    setPages((prev) => {
      const arr = [...prev];
      const from = arr.findIndex((p) => p.id === draggedPageId);
      const to = arr.findIndex((p) => p.id === targetId);
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      return arr;
    });
    setDraggedPageId(null);
    setDropTargetId(null);
  };

  // ── Card click handler (context-aware) ───────────────────────────────────

  const onPageClick = (page: WorkspacePage) => {
    if (activeOperation === 'delete' || activeOperation === 'split') {
      toggleSelect(page.id);
    } else if (activeOperation === 'rotate') {
      rotatePage(page.id);
    }
  };

  // ── PDF assembly & download ───────────────────────────────────────────────

  const handleDownload = async (selectedOnly = false) => {
    const pagesToExport = selectedOnly ? pages.filter((p) => p.isSelected) : pages;
    if (!pagesToExport.length) return;

    setIsBuildingOutput(true);
    setError(null);

    try {
      const sourceMap = new Map(sources.map((s) => [s.id, s]));
      const pdfBytes = await assemblePdf(sourceMap, pagesToExport);

      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedOnly
        ? outputFilename.replace(/\.pdf$/i, '_extract.pdf')
        : outputFilename;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 8000);
    } catch (e) {
      setError('Failed to assemble the PDF. Please try again.');
      console.error('[PDFStudio] assemble error:', e);
    } finally {
      setIsBuildingOutput(false);
    }
  };

  // ── Reset workspace ───────────────────────────────────────────────────────

  const resetWorkspace = () => {
    pagesRef.current.forEach((p) => { if (p.thumbnailUrl) revokeUrl(p.thumbnailUrl); });
    setSources([]);
    setPages([]);
    setActiveOperation('none');
    setOutputFilename('document.pdf');
    setError(null);
  };

  // ── Derived values ────────────────────────────────────────────────────────

  const hasFile = sources.length > 0;
  const selectedPages = pages.filter((p) => p.isSelected);
  const totalPages = pages.length;

  // ── Operations sidebar config ─────────────────────────────────────────────

  const operations: {
    id: ActiveOperation;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    sublabel: string;
    disabled?: boolean;
  }[] = [
    { id: 'merge', icon: FilePlus2, label: 'Merge', sublabel: 'Append more PDFs' },
    { id: 'delete', icon: Trash2, label: 'Delete Pages', sublabel: 'Remove pages' },
    { id: 'rotate', icon: RotateCw, label: 'Rotate', sublabel: 'Fix orientation' },
    { id: 'split', icon: Scissors, label: 'Split / Extract', sublabel: 'Export a selection' },
    { id: 'encrypt', icon: Lock, label: 'Encrypt', sublabel: 'Password protect' },
    { id: 'ocr', icon: ScanText, label: 'Extract Text', sublabel: 'OCR — Coming Soon', disabled: true },
  ];

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background text-on-surface w-full flex flex-col">

      {/* ── Sticky Header ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 w-full border-b border-outline-variant bg-background/95 backdrop-blur-sm">
        <div className="max-w-[1280px] mx-auto px-6 h-14 flex items-center justify-between gap-4">

          {/* Left: back */}
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-mono text-[11px] uppercase tracking-widest">web-toolVerse</span>
          </button>

          {/* Centre: title + privacy badge */}
          <div className="flex items-center gap-3">
            <span className="font-sans text-sm font-medium text-on-surface">PDF Studio</span>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border border-outline-variant bg-surface-container-low">
              <WifiOff className="w-3 h-3 text-emerald-400" />
              <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider">100% Offline & Private</span>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {hasFile && (
              <>
                <button
                  onClick={resetWorkspace}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container text-xs font-mono uppercase tracking-wider transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Reset
                </button>
                <button
                  onClick={() => handleDownload(false)}
                  disabled={isBuildingOutput || totalPages === 0}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#008cff] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#0070cc] transition-colors disabled:opacity-50"
                >
                  {isBuildingOutput ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  Download
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-[1280px] mx-auto px-6 py-10 w-full">

        {/* Page title */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold tracking-tight">PDF Studio</h1>
          <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
            Merge, split, reorder, rotate and encrypt PDFs in a single workflow.
            Your files never leave your browser — no uploads, no accounts, no limits.
          </p>
        </div>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-red-400/30 bg-red-400/5 mb-6"
            >
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-400 font-sans flex-1">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-red-400/50 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden file inputs */}
        <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={onFileInput} />
        <input ref={mergeInputRef} type="file" accept=".pdf,application/pdf" multiple className="hidden" onChange={onMergeInput} />

        {/* ── Empty State ──────────────────────────────────────────────────── */}
        {!hasFile && (
          <div className="flex flex-col gap-6">

            {/* Drop zone */}
            <div
              onDragOver={onMainDragOver}
              onDragLeave={onMainDragLeave}
              onDrop={onMainDrop}
              onClick={() => !isLoadingFile && fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${
                isLoadingFile ? 'cursor-default' : 'cursor-pointer'
              } min-h-[280px] ${
                isDragOver
                  ? 'border-[#008cff] bg-[#008cff]/5'
                  : 'border-outline-variant hover:border-outline bg-surface-container-low'
              }`}
            >
              {isLoadingFile ? (
                <div className="flex flex-col items-center gap-4 py-16">
                  <Loader2 className="w-8 h-8 text-[#008cff] animate-spin" />
                  <p className="font-mono text-sm text-on-surface-variant uppercase tracking-widest">Reading PDF...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center pointer-events-none py-16 px-6">
                  <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mb-5 transition-colors ${isDragOver ? 'border-[#008cff]/50 bg-[#008cff]/10' : 'border-outline-variant bg-surface-container'}`}>
                    <FileText className={`w-7 h-7 transition-colors ${isDragOver ? 'text-[#008cff]' : 'text-on-surface-variant'}`} />
                  </div>
                  <p className="font-sans text-base font-medium text-on-surface mb-2">
                    {isDragOver ? 'Drop your PDF here' : 'Drop a PDF here or click to open'}
                  </p>
                  <p className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider max-w-sm">
                    PDF documents only — processed entirely in your browser with WebAssembly
                  </p>
                </div>
              )}
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: Shield,
                  title: 'Zero Uploads',
                  body: 'All processing happens locally via WebAssembly. Disconnect your Wi-Fi to test it.',
                },
                {
                  icon: FileDown,
                  title: 'Workflow Chaining',
                  body: 'Merge → reorder → rotate → encrypt in one session. One download at the end.',
                },
                {
                  icon: Scissors,
                  title: 'Full Control',
                  body: 'Delete or reorder individual pages. Extract a selection into a new document.',
                },
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
          </div>
        )}

        {/* ── Workspace (file loaded) ──────────────────────────────────────── */}
        {hasFile && (
          <div className="flex gap-6 items-start">

            {/* ── Left sidebar ─────────────────────────────────────────────── */}
            <aside className="w-60 flex-shrink-0 flex flex-col gap-3">

              {/* Workspace summary */}
              <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-low">
                <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-1.5">Workspace</p>
                <p className="font-sans text-sm font-medium text-on-surface truncate" title={outputFilename}>
                  {outputFilename}
                </p>
                <p className="font-mono text-[11px] text-on-surface-variant mt-1.5">
                  {totalPages} page{totalPages !== 1 ? 's' : ''}
                  {sources.length > 1 ? ` · ${sources.length} sources` : ''}
                </p>
              </div>

              {/* Operations list */}
              <div className="rounded-xl border border-outline-variant bg-surface-container-low overflow-hidden">
                <div className="px-4 py-3 border-b border-outline-variant">
                  <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">Operations</p>
                </div>
                <div className="p-2 flex flex-col gap-0.5">
                  {operations.map(({ id, icon: Icon, label, sublabel, disabled }) => (
                    <button
                      key={id}
                      disabled={!!disabled}
                      onClick={() =>
                        !disabled && setActiveOperation((prev) => (prev === id ? 'none' : id))
                      }
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left w-full transition-colors ${
                        disabled
                          ? 'border-transparent text-on-surface-variant/35 cursor-not-allowed'
                          : activeOperation === id
                          ? 'border-[#008cff]/50 bg-[#008cff]/8 text-on-surface'
                          : 'border-transparent text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 ${activeOperation === id ? 'text-[#008cff]' : ''}`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-medium font-sans leading-none">{label}</span>
                          {disabled && (
                            <span className="text-[9px] font-mono text-on-surface-variant/40 uppercase tracking-wider border border-outline-variant/40 px-1 rounded leading-tight">
                              Soon
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-mono text-on-surface-variant tracking-wide mt-0.5 truncate">
                          {sublabel}
                        </p>
                      </div>
                      {activeOperation === id && (
                        <ChevronRight className="w-3.5 h-3.5 text-[#008cff] flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contextual operation panels */}
              <AnimatePresence mode="wait">
                {activeOperation !== 'none' && activeOperation !== 'ocr' && (
                  <motion.div
                    key={activeOperation}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.14 }}
                    className="rounded-xl border border-outline-variant bg-surface-container-low overflow-hidden"
                  >

                    {/* ── Merge panel ── */}
                    {activeOperation === 'merge' && (
                      <div className="p-4">
                        <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-3">
                          Add More PDFs
                        </p>
                        <div
                          onDragOver={(e) => { e.preventDefault(); setIsMergeDropOver(true); }}
                          onDragLeave={() => setIsMergeDropOver(false)}
                          onDrop={async (e) => {
                            e.preventDefault();
                            setIsMergeDropOver(false);
                            const files = Array.from(e.dataTransfer.files).filter(isPdfFile);
                            for (const f of files) await loadPdf(f, 'merge');
                          }}
                          onClick={() => mergeInputRef.current?.click()}
                          className={`flex flex-col items-center justify-center py-7 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
                            isMergeDropOver
                              ? 'border-[#008cff] bg-[#008cff]/5'
                              : 'border-outline-variant hover:border-outline'
                          }`}
                        >
                          <Upload className="w-5 h-5 text-on-surface-variant mb-2" />
                          <p className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider text-center leading-relaxed">
                            Drop PDFs here<br />or click to browse
                          </p>
                        </div>
                        {sources.length > 1 && (
                          <div className="mt-4">
                            <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-2">
                              Sources ({sources.length})
                            </p>
                            {sources.map((s, i) => (
                              <div
                                key={s.id}
                                className="flex items-center gap-2 py-1.5 border-b border-outline-variant last:border-0"
                              >
                                <FileText className="w-3.5 h-3.5 text-on-surface-variant flex-shrink-0" />
                                <span className="font-mono text-[10px] text-on-surface-variant truncate flex-1">
                                  {s.filename}
                                </span>
                                <span className="font-mono text-[10px] text-outline flex-shrink-0">
                                  {s.pageCount}p
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── Delete panel ── */}
                    {activeOperation === 'delete' && (
                      <div className="p-4">
                        <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-3">
                          Delete Pages
                        </p>
                        <p className="font-mono text-[11px] text-on-surface-variant leading-relaxed mb-4">
                          Click thumbnails to select, then delete.
                        </p>
                        <div className="flex gap-2 mb-3">
                          <button
                            onClick={selectAll}
                            className="flex-1 py-1.5 rounded-lg border border-outline-variant text-[10px] font-mono uppercase tracking-wider text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                          >
                            All
                          </button>
                          <button
                            onClick={deselectAll}
                            className="flex-1 py-1.5 rounded-lg border border-outline-variant text-[10px] font-mono uppercase tracking-wider text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                          >
                            None
                          </button>
                        </div>
                        {selectedPages.length > 0 && (
                          <button
                            onClick={deleteSelected}
                            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-red-500/30 bg-red-500/8 text-red-400 text-[11px] font-mono uppercase tracking-wider hover:bg-red-500/15 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete {selectedPages.length} page{selectedPages.length !== 1 ? 's' : ''}
                          </button>
                        )}
                        {selectedPages.length > 0 && (
                          <p className="font-mono text-[10px] text-on-surface-variant mt-3 text-center">
                            {selectedPages.length} of {totalPages} selected
                          </p>
                        )}
                      </div>
                    )}

                    {/* ── Rotate panel ── */}
                    {activeOperation === 'rotate' && (
                      <div className="p-4">
                        <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-3">
                          Rotate Pages
                        </p>
                        <p className="font-mono text-[11px] text-on-surface-variant leading-relaxed mb-4">
                          Click any thumbnail to rotate 90° clockwise. Or select multiple pages and rotate them together.
                        </p>
                        <div className="flex gap-2 mb-3">
                          <button
                            onClick={selectAll}
                            className="flex-1 py-1.5 rounded-lg border border-outline-variant text-[10px] font-mono uppercase tracking-wider text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                          >
                            All
                          </button>
                          <button
                            onClick={deselectAll}
                            className="flex-1 py-1.5 rounded-lg border border-outline-variant text-[10px] font-mono uppercase tracking-wider text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                          >
                            None
                          </button>
                        </div>
                        {selectedPages.length > 0 && (
                          <button
                            onClick={rotateSelected}
                            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-outline-variant text-on-surface-variant text-[11px] font-mono uppercase tracking-wider hover:bg-surface-container hover:text-on-surface transition-colors"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                            Rotate {selectedPages.length} selected
                          </button>
                        )}
                      </div>
                    )}

                    {/* ── Split / Extract panel ── */}
                    {activeOperation === 'split' && (
                      <div className="p-4">
                        <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-3">
                          Extract Pages
                        </p>
                        <p className="font-mono text-[11px] text-on-surface-variant leading-relaxed mb-4">
                          Select pages in the canvas, then extract them as a separate PDF.
                        </p>
                        <div className="flex gap-2 mb-3">
                          <button
                            onClick={selectAll}
                            className="flex-1 py-1.5 rounded-lg border border-outline-variant text-[10px] font-mono uppercase tracking-wider text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                          >
                            All
                          </button>
                          <button
                            onClick={deselectAll}
                            className="flex-1 py-1.5 rounded-lg border border-outline-variant text-[10px] font-mono uppercase tracking-wider text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                          >
                            None
                          </button>
                        </div>
                        {selectedPages.length > 0 && (
                          <button
                            onClick={() => handleDownload(true)}
                            disabled={isBuildingOutput}
                            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-[#008cff]/50 text-[#008cff] text-[11px] font-mono uppercase tracking-wider hover:bg-[#008cff]/8 transition-colors disabled:opacity-50"
                          >
                            {isBuildingOutput ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Scissors className="w-3.5 h-3.5" />
                            )}
                            Extract {selectedPages.length} page{selectedPages.length !== 1 ? 's' : ''}
                          </button>
                        )}
                      </div>
                    )}

                    {/* ── Encrypt panel ── */}
                    {activeOperation === 'encrypt' && (
                      <div className="p-4">
                        <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-3">
                          Password Protect
                        </p>
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-[#008cff]/5 border border-[#008cff]/20 mb-4">
                          <Info className="w-3.5 h-3.5 text-[#008cff] flex-shrink-0 mt-0.5" />
                          <p className="font-mono text-[10px] text-[#008cff] leading-relaxed">
                            AES-256 encryption is in active development and will be available in the next update.
                            Your files remain 100% on-device.
                          </p>
                        </div>
                        <div className="flex flex-col gap-2.5">
                          <div>
                            <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider mb-1.5">
                              Open Password
                            </p>
                            <input
                              type="password"
                              placeholder="Required to open..."
                              value={encryption.userPassword}
                              onChange={(e) =>
                                setEncryption((p) => ({ ...p, userPassword: e.target.value }))
                              }
                              disabled
                              className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-xs font-mono text-on-surface outline-none disabled:opacity-30 placeholder:text-on-surface-variant"
                            />
                          </div>
                          <div>
                            <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider mb-1.5">
                              Owner Password
                            </p>
                            <input
                              type="password"
                              placeholder="Restrict printing/editing..."
                              value={encryption.ownerPassword}
                              onChange={(e) =>
                                setEncryption((p) => ({ ...p, ownerPassword: e.target.value }))
                              }
                              disabled
                              className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-xs font-mono text-on-surface outline-none disabled:opacity-30 placeholder:text-on-surface-variant"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sidebar download shortcut */}
              <button
                onClick={() => handleDownload(false)}
                disabled={isBuildingOutput || totalPages === 0}
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-outline-variant text-on-surface-variant text-xs font-mono uppercase tracking-wider hover:bg-surface-container hover:text-on-surface transition-colors disabled:opacity-40"
              >
                {isBuildingOutput ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {isBuildingOutput ? 'Building...' : `Download PDF · ${totalPages}p`}
              </button>
            </aside>

            {/* ── Main canvas ──────────────────────────────────────────────── */}
            <div className="flex-1 min-w-0 flex flex-col gap-4">

              {/* Canvas action bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-widest">
                    {totalPages} page{totalPages !== 1 ? 's' : ''}
                  </span>
                  {selectedPages.length > 0 && (
                    <span className="font-mono text-[11px] text-[#008cff]">
                      · {selectedPages.length} selected
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {selectedPages.length > 0 && (
                    <button
                      onClick={deselectAll}
                      className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider hover:text-on-surface transition-colors"
                    >
                      Clear selection
                    </button>
                  )}
                  {activeOperation === 'none' && (
                    <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                      Drag to reorder
                    </span>
                  )}
                </div>
              </div>

              {/* Page thumbnails grid */}
              {isLoadingFile && pages.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-7 h-7 text-[#008cff] animate-spin" />
                    <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-widest">
                      Reading PDF...
                    </span>
                  </div>
                </div>
              ) : (
                <div className="grid gap-3 grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  <AnimatePresence initial={false}>
                    {pages.map((page, index) => (
                      <PageCard
                        key={page.id}
                        page={page}
                        index={index}
                        activeOperation={activeOperation}
                        isDragTarget={dropTargetId === page.id}
                        isDragging={draggedPageId === page.id}
                        onDragStart={() => onPageDragStart(page.id)}
                        onDragOver={(e) => onPageDragOver(e, page.id)}
                        onDragEnd={onPageDragEnd}
                        onDrop={() => onPageDrop(page.id)}
                        onClick={() => onPageClick(page)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        )}


      </main>
    </div>
  );
}
