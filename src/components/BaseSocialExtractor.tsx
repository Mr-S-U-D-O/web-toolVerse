import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Search,
  Download,
  AlertCircle,
  Loader2,
  Settings2,
  Video,
  Music,
  ExternalLink,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSocialExtractor, YtDlpFormat } from '../hooks/useSocialExtractor';

interface BaseSocialExtractorProps {
  platformName: string;
  platformColorClass: string;
  platformBgClass: string;
  platformBorderClass: string;
  platformIcon: React.ReactNode;
  urlPattern: RegExp;
  redirects: Array<{ pattern: RegExp; toolPath: string; toolName: string }>;
  onBack?: () => void;
}

function formatBytes(bytes?: number): string {
  if (!bytes) return 'Unknown';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function BaseSocialExtractor({
  platformName,
  platformColorClass,
  platformBgClass,
  platformBorderClass,
  platformIcon,
  urlPattern,
  redirects,
  onBack
}: BaseSocialExtractorProps) {
  const [url, setUrl] = useState('');
  const [redirectPrompt, setRedirectPrompt] = useState<{ path: string; name: string } | null>(null);
  const [expertMode, setExpertMode] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<YtDlpFormat | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<YtDlpFormat | null>(null);

  const navigate = useNavigate();
  const { status, progress, errorMsg, metadata, formats, outputUrl, extract, mergeStreams, downloadDirect } = useSocialExtractor(platformName);

  // Auto-select best video and audio for DASH
  useEffect(() => {
    if (formats) {
      if (formats.videoOnly.length > 0) setSelectedVideo(formats.videoOnly[0]);
      if (formats.audioOnly.length > 0) setSelectedAudio(formats.audioOnly[0]);
    }
  }, [formats]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUrl(val);
    setRedirectPrompt(null);

    // Check redirects
    for (const redir of redirects) {
      if (redir.pattern.test(val)) {
        setRedirectPrompt({ path: redir.toolPath, name: redir.toolName });
        return;
      }
    }
  };

  const handleInputClick = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && urlPattern.test(text) && url === '') {
        setUrl(text);
      }
    } catch (e) {
      // Ignore clipboard read errors
    }
  };

  const handleExtract = () => {
    if (!urlPattern.test(url) && !redirectPrompt) {
      // Force extract anyway, yt-dlp might handle it, but warn
    }
    extract(url);
  };

  const handleMerge = () => {
    if (selectedVideo && selectedAudio) {
      mergeStreams(selectedVideo, selectedAudio);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface w-full pb-20">
      <header className="sticky top-0 z-30 w-full border-b border-outline-variant bg-background/95 backdrop-blur-sm">
        <div className="max-w-[1000px] mx-auto px-6 h-14 flex items-center justify-between">
          <button onClick={onBack} className="group flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-mono text-[11px] uppercase tracking-widest">web-toolVerse</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="font-sans text-sm font-medium text-on-surface">{platformName} Downloader</div>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${platformBgClass} ${platformBorderClass} border text-[10px] font-mono uppercase tracking-wider ${platformColorClass}`}>
              {platformIcon}
              Powered by yt-dlp
            </div>
          </div>
          <div className="w-[120px]" />
        </div>
      </header>

      <main className="max-w-[1000px] mx-auto px-6 py-12 w-full">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="font-heading text-4xl font-bold tracking-tight mb-4">{platformName} Extractor</h1>
          <p className="text-on-surface-variant font-sans max-w-xl mx-auto leading-relaxed">
            Extract videos and audio directly to your device. 
            No cloud limits. High-res DASH multiplexing via WebAssembly.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative mb-12">
          <div className="relative flex items-center">
            <input
              type="text"
              value={url}
              onClick={handleInputClick}
              onChange={handleUrlChange}
              placeholder={`Paste ${platformName} URL here...`}
              className="w-full bg-surface-container border border-outline-variant rounded-2xl py-4 pl-12 pr-32 text-on-surface focus:outline-none focus:border-[#008cff] transition-colors"
              disabled={status === 'extracting'}
            />
            <Search className="absolute left-4 w-5 h-5 text-on-surface-variant" />
            
            <button
              onClick={handleExtract}
              disabled={!url || status === 'extracting'}
              className="absolute right-2 px-6 py-2 bg-[#008cff] hover:bg-[#0070cc] text-white rounded-xl font-mono text-sm uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              {status === 'extracting' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
            </button>
          </div>

          {/* Redirect Prompt */}
          <AnimatePresence>
            {redirectPrompt && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-sans text-yellow-100">
                    This looks like a {redirectPrompt.name} link.
                  </span>
                </div>
                <button
                  onClick={() => navigate(redirectPrompt.path)}
                  className="px-4 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors"
                >
                  Go to {redirectPrompt.name} Tool
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          {status === 'error' && errorMsg && (
            <div className="mt-4 flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{errorMsg}</p>
            </div>
          )}
        </div>

        {/* Metadata Preview & Format Matrix */}
        <AnimatePresence>
          {metadata && formats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8"
            >
              {/* Preview Sidebar */}
              <div className="space-y-4">
                <div className="aspect-video bg-surface-container rounded-xl overflow-hidden border border-outline-variant">
                  <img src={metadata.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                </div>
                <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant">
                  <h3 className="font-sans font-medium text-on-surface line-clamp-2 leading-snug" title={metadata.title}>
                    {metadata.title}
                  </h3>
                  <div className="mt-4 flex items-center justify-between font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                    <span>{metadata.extractor}</span>
                    <span>{Math.floor(metadata.duration / 60)}:{(metadata.duration % 60).toString().padStart(2, '0')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">Expert Mode</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={expertMode} onChange={(e) => setExpertMode(e.target.checked)} />
                    <div className="w-9 h-5 bg-surface-container border border-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface-variant peer-checked:after:bg-[#008cff] after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:border-[#008cff]/30"></div>
                  </label>
                </div>
              </div>

              {/* Format Matrix */}
              <div className="space-y-6">
                
                {/* ── Combined Formats (Ready to Download) ── */}
                <div className="bg-surface-container-low rounded-2xl border border-outline-variant overflow-hidden">
                  <div className="p-4 border-b border-outline-variant/50 bg-surface-container-lowest/50 flex items-center gap-2">
                    <Download className="w-4 h-4 text-[#008cff]" />
                    <h3 className="font-heading text-sm font-semibold uppercase tracking-wider">Direct Downloads (Combined)</h3>
                  </div>
                  {formats.combined.length === 0 ? (
                    <div className="p-6 text-center text-sm text-on-surface-variant italic">No combined formats available.</div>
                  ) : (
                    <div className="divide-y divide-outline-variant/30 max-h-[300px] overflow-y-auto">
                      {formats.combined.map((f) => (
                        <div key={f.format_id} className="p-4 flex items-center justify-between hover:bg-surface-container/30 transition-colors">
                          <div>
                            <div className="font-mono text-sm text-on-surface">{f.format_note || f.ext.toUpperCase()}</div>
                            <div className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">
                              {f.vcodec} + {f.acodec} • {formatBytes(f.filesize || f.filesize_approx)}
                            </div>
                          </div>
                          <button
                            onClick={() => downloadDirect(f)}
                            className="flex items-center gap-2 px-4 py-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant rounded-xl text-xs font-mono uppercase tracking-wider transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Direct
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Expert Mode: DASH WASM Merging ── */}
                {expertMode && formats.videoOnly.length > 0 && formats.audioOnly.length > 0 && (
                  <div className="bg-surface-container-low rounded-2xl border border-[#008cff]/20 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#008cff]"></div>
                    <div className="p-4 border-b border-outline-variant/50 bg-surface-container-lowest/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Settings2 className="w-4 h-4 text-[#008cff]" />
                        <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-[#008cff]">WASM DASH Muxer</h3>
                      </div>
                      <span className="font-mono text-[10px] text-[#008cff]/70 uppercase tracking-wider">Browser Merging</span>
                    </div>
                    
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="flex items-center gap-2 font-mono text-[11px] text-on-surface-variant uppercase tracking-wider mb-2">
                          <Video className="w-3.5 h-3.5" /> Video Stream
                        </label>
                        <select 
                          className="w-full bg-surface-container border border-outline-variant rounded-xl p-3 text-sm focus:border-[#008cff] focus:outline-none"
                          value={selectedVideo?.format_id || ''}
                          onChange={(e) => setSelectedVideo(formats.videoOnly.find(f => f.format_id === e.target.value) || null)}
                          disabled={status === 'merging'}
                        >
                          {formats.videoOnly.map(f => (
                            <option key={f.format_id} value={f.format_id}>
                              {f.format_note || f.ext} • {f.vcodec} • {formatBytes(f.filesize || f.filesize_approx)}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="flex items-center gap-2 font-mono text-[11px] text-on-surface-variant uppercase tracking-wider mb-2">
                          <Music className="w-3.5 h-3.5" /> Audio Stream
                        </label>
                        <select 
                          className="w-full bg-surface-container border border-outline-variant rounded-xl p-3 text-sm focus:border-[#008cff] focus:outline-none"
                          value={selectedAudio?.format_id || ''}
                          onChange={(e) => setSelectedAudio(formats.audioOnly.find(f => f.format_id === e.target.value) || null)}
                          disabled={status === 'merging'}
                        >
                          {formats.audioOnly.map(f => (
                            <option key={f.format_id} value={f.format_id}>
                              {f.ext} • {f.acodec} • {formatBytes(f.filesize || f.filesize_approx)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="p-4 border-t border-outline-variant/50 bg-surface-container/20">
                      {status === 'merging' ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-mono text-[#008cff] uppercase tracking-wider flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Merging Streams...
                            </span>
                            <span className="font-mono text-on-surface font-bold">{progress}%</span>
                          </div>
                          <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                            <motion.div className="h-full bg-[#008cff] rounded-full" animate={{ width: `${progress}%` }} transition={{ ease: 'easeOut', duration: 0.3 }} />
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={handleMerge}
                          disabled={!selectedVideo || !selectedAudio}
                          className="w-full flex items-center justify-center gap-2 py-3 bg-[#008cff] hover:bg-[#0070cc] text-white rounded-xl font-mono text-sm uppercase tracking-wider transition-colors disabled:opacity-50"
                        >
                          Download & Merge Locally
                        </button>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
