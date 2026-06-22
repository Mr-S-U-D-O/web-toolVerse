import React, { useState, useRef, useEffect, DragEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Upload,
  X,
  Download,
  Video as VideoIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Shield,
  Zap,
  Settings2,
  FileVideo
} from 'lucide-react';
import { useFFmpeg, TranscodeFormat } from '../hooks/useFFmpeg';

// Memory Limit: 1.5 GB in bytes
const MAX_FILE_SIZE = 1500000000;

const FORMAT_OPTIONS: { label: string; value: TranscodeFormat; ext: string }[] = [
  { label: 'MP4 (H.264)', value: 'mp4', ext: 'mp4' },
  { label: 'WebM (VP9)', value: 'webm', ext: 'webm' },
  { label: 'GIF (Animated)', value: 'gif', ext: 'gif' },
];

const QUALITY_OPTIONS = [
  { label: 'High Quality', value: 18, desc: 'Larger file size, virtually lossless' },
  { label: 'Balanced', value: 23, desc: 'Good balance of size and quality' },
  { label: 'Low Quality', value: 28, desc: 'Smallest file size, noticeable compression' },
];

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

interface VideoTranscoderToolProps {
  onBack?: () => void;
}

export default function VideoTranscoderTool({ onBack }: VideoTranscoderToolProps) {
  const { status, progress, errorMsg, load, transcodeVideo } = useFFmpeg();

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  
  const [targetFormat, setTargetFormat] = useState<TranscodeFormat>('mp4');
  const [qualityCrf, setQualityCrf] = useState<number>(23);

  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize FFmpeg on mount
  useEffect(() => {
    load();
  }, [load]);

  // Cleanup blob URL on unmount or when output changes
  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  // ─── File Handling ──────────────────────────────────────────────────────────

  const handleFileSelect = (selectedFile: File) => {
    setFileError(null);
    if (outputUrl) {
      URL.revokeObjectURL(outputUrl);
      setOutputUrl(null);
    }

    if (!selectedFile.type.startsWith('video/')) {
      setFileError('Please select a valid video file.');
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setFileError('File too large for browser memory. Max 1.5GB.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
    setFileError(null);
    if (outputUrl) {
      URL.revokeObjectURL(outputUrl);
      setOutputUrl(null);
    }
  };

  // ─── Conversion ─────────────────────────────────────────────────────────────

  const handleConvert = async () => {
    if (!file || status !== 'ready') return;
    
    // Revoke previous if exists
    if (outputUrl) {
      URL.revokeObjectURL(outputUrl);
      setOutputUrl(null);
    }

    const resultBlob = await transcodeVideo(file, targetFormat, qualityCrf);
    
    if (resultBlob) {
      setOutputUrl(URL.createObjectURL(resultBlob));
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background text-on-surface w-full pb-20">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 w-full border-b border-outline-variant bg-background/95 backdrop-blur-sm">
        <div className="max-w-[1000px] mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-mono text-[11px] uppercase tracking-widest">web-toolVerse</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="font-sans text-sm font-medium text-on-surface">Video Transcoder</div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] font-mono uppercase tracking-wider text-violet-400">
              <Shield className="w-3 h-3" />
              100% Local Processing
            </div>
          </div>
          <div className="w-[120px]" />
        </div>
      </header>

      <main className="max-w-[1000px] mx-auto px-6 py-10 w-full">
        {/* ── Page Title ────────────────────────────────────────────────── */}
        <div className="mb-10 text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight mb-4">Video Transcoder</h1>
          <p className="text-on-surface-variant text-base font-sans max-w-2xl mx-auto leading-relaxed">
            Convert MP4, WebM, and GIF entirely in your browser using multi-threaded WebAssembly.
            <strong className="text-on-surface block mt-1">Uncapped by Cloud Limits. No Server Uploads. Total Privacy.</strong>
          </p>
        </div>

        {/* ── Engine Loading State ──────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {(status === 'loading' || status === 'error' && !file) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
              className="mb-8"
            >
              <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-outline-variant bg-surface-container-low text-center">
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-8 h-8 text-violet-400 animate-spin mb-4" />
                    <h3 className="font-sans font-medium text-on-surface mb-2">Loading FFmpeg Engine...</h3>
                    <p className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider max-w-sm">
                      Downloading WebAssembly core from CDN. This only happens once.
                    </p>
                  </>
             ) : (
                  <>
                    <AlertCircle className="w-8 h-8 text-red-400 mb-4" />
                    <h3 className="font-sans font-medium text-red-400 mb-2">Engine Load Failed</h3>
                    <p className="font-mono text-sm text-on-surface-variant">{errorMsg}</p>
                    <button onClick={load} className="mt-4 px-4 py-2 bg-surface-container border border-outline-variant hover:bg-surface-container-high rounded-lg text-sm transition-colors">
                      Retry
                    </button>
                  </>
             )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-8 items-start">
          
          {/* ── Left Column: Dropzone & Player ────────────────────────────── */}
          <div className="space-y-6">
            {!file ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="relative rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center min-h-[360px]"
                style={{
                  borderColor: isDragOver ? 'rgba(139,92,246,0.7)' : fileError ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.1)',
                  background: isDragOver ? 'rgba(139,92,246,0.06)' : fileError ? 'rgba(248,113,113,0.05)' : 'rgba(139,92,246,0.02)',
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleFileInput}
                />
                
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center bg-violet-500/10 mb-6">
                  <VideoIcon className="w-10 h-10 text-violet-400" />
                </div>
                
                <p className="font-sans text-lg font-medium text-on-surface mb-2">
                  Drop a video file here
                </p>
                <p className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider mb-6">
                  MP4, MOV, WebM, AVI • Max 1.5GB
                </p>

                {fileError && (
                  <div className="flex items-center gap-2 text-red-400 bg-red-400/10 px-4 py-2 rounded-lg text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {fileError}
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-outline-variant bg-surface-container-low overflow-hidden relative group">
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <button 
                    onClick={clearFile}
                    disabled={status === 'processing'}
                    className="p-2 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur text-white border border-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Remove Video"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="aspect-video bg-black flex items-center justify-center overflow-hidden">
                  {outputUrl ? (
                    <video src={outputUrl} controls className="w-full h-full" />
                  ) : (
                    <video src={URL.createObjectURL(file)} controls className="w-full h-full opacity-80" />
                  )}
                </div>

                <div className="p-4 border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-sans text-sm font-medium text-on-surface truncate pr-4">
                      {outputUrl ? 'Converted Output' : file.name}
                    </p>
                    <p className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider mt-1">
                      {outputUrl ? 'Ready to download' : formatBytes(file.size)}
                    </p>
                  </div>
                  {outputUrl && (
                    <a
                      href={outputUrl}
                      download={`converted_${file.name.split('.')[0]}.${targetFormat}`}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-mono uppercase tracking-wider transition-colors flex-shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      Save
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Right Column: Settings & Progress ─────────────────────────── */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-outline-variant bg-surface-container-low">
              <div className="flex items-center gap-2 mb-6 text-on-surface">
                <Settings2 className="w-5 h-5 text-violet-400" />
                <h2 className="font-heading text-lg font-semibold">Conversion Settings</h2>
              </div>

              {/* Format Select */}
              <div className="mb-6">
                <label className="block font-mono text-[11px] text-on-surface-variant uppercase tracking-wider mb-3">
                  Target Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {FORMAT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setTargetFormat(opt.value)}
                      disabled={status === 'processing'}
                      className={`py-2 px-1 text-sm font-sans rounded-lg border transition-colors disabled:opacity-50 ${
                        targetFormat === opt.value
                          ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                          : 'bg-surface-container border-outline-variant text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality Select */}
              <div className="mb-8">
                <label className="block font-mono text-[11px] text-on-surface-variant uppercase tracking-wider mb-3">
                  Quality Preset
                </label>
                <div className="space-y-2">
                  {QUALITY_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setQualityCrf(opt.value)}
                      disabled={status === 'processing' || targetFormat === 'gif'}
                      className={`w-full text-left p-3 rounded-lg border transition-colors disabled:opacity-50 ${
                        qualityCrf === opt.value && targetFormat !== 'gif'
                          ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                          : 'bg-surface-container border-outline-variant text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      <div className="font-medium text-sm mb-1">{opt.label}</div>
                      <div className="font-mono text-[10px] uppercase opacity-70 tracking-wide">{opt.desc}</div>
                    </button>
                  ))}
                </div>
                {targetFormat === 'gif' && (
                  <p className="mt-2 text-xs text-on-surface-variant/70 italic">Quality preset ignored for GIF.</p>
                )}
              </div>

              {/* Convert Button & Progress */}
              <div>
                {status === 'processing' ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-mono text-violet-400 uppercase tracking-wider flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </span>
                      <span className="font-mono text-on-surface font-bold">{progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-violet-600 rounded-full"
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: 'easeOut', duration: 0.3 }}
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleConvert}
                    disabled={!file || status !== 'ready'}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-mono uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20"
                  >
                    <Zap className="w-5 h-5" />
                    Start Conversion
                  </button>
                )}
              </div>
              
              {/* Error display */}
              {status === 'error' && errorMsg && (
                <div className="mt-4 flex items-start gap-2 text-red-400 bg-red-400/10 px-4 py-3 rounded-lg text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="break-words">{errorMsg}</p>
                </div>
              )}
            </div>
            
            {/* ── Privacy Note ─────────────────────────────────────────── */}
            <div className="flex items-start gap-3 p-4 rounded-xl border border-outline-variant/50 bg-surface-container-low">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-violet-500/10">
                <Shield className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <p className="font-sans text-sm font-medium text-on-surface mb-1">
                  100% Secure & Offline
                </p>
                <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                  Your video never leaves your device. The entire conversion happens locally using your CPU. Multi-threading is enabled via `SharedArrayBuffer` for maximum performance.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
