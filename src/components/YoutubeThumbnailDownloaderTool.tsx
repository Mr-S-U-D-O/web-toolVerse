import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, Shield, Search, Download, Youtube, Play, AlertCircle } from 'lucide-react';

function extractVideoId(url: string): string | null {
  const trimmed = url.trim();
  if (trimmed.length === 11) return trimmed;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/|music.youtube.com\/watch\?v=)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

interface ThumbnailQuality {
  id: string;
  name: string;
  resolution: string;
  url: string;
}

export default function YoutubeThumbnailDownloaderTool({ onBack }: { onBack?: () => void }) {
  const [inputUrl, setInputUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [thumbnails, setThumbnails] = useState<ThumbnailQuality[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleExtract = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setVideoId(null);
    setThumbnails([]);

    const id = extractVideoId(inputUrl);
    if (!id) {
      setErrorMsg('Invalid YouTube URL or Video ID. Please check the address.');
      return;
    }

    setVideoId(id);
    setThumbnails([
      {
        id: 'maxres',
        name: 'Maximum Resolution (Ultra HD)',
        resolution: '1280 x 720',
        url: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
      },
      {
        id: 'standard',
        name: 'Standard Definition (HD)',
        resolution: '640 x 480',
        url: `https://img.youtube.com/vi/${id}/sddefault.jpg`,
      },
      {
        id: 'hq',
        name: 'High Quality (HQ)',
        resolution: '480 x 360',
        url: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      },
      {
        id: 'mq',
        name: 'Medium Quality',
        resolution: '320 x 180',
        url: `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
      },
      {
        id: 'default',
        name: 'Default Quality',
        resolution: '120 x 90',
        url: `https://img.youtube.com/vi/${id}/default.jpg`,
      },
    ]);
  };

  const handleDownload = async (url: string, qualityName: string) => {
    if (!videoId) return;
    setDownloadingId(qualityName);
    try {
      const filename = `yt-thumbnail-${videoId}-${qualityName}.jpg`;
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
      
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error('CORS proxy download failed');
      const blob = await response.blob();
      
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error(err);
      // Fallback: direct window open
      window.open(url, '_blank');
    } finally {
      setDownloadingId(null);
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
            <span className="font-mono text-[11px] uppercase tracking-widest">web-toolVerse</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="font-sans text-sm font-medium text-on-surface">YouTube Thumbnail Downloader</div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#008cff]/10 border border-[#008cff]/20 text-[10px] font-mono uppercase tracking-wider text-[#008cff]">
              <Shield className="w-3 h-3" />
              100% Client-Side
            </div>
          </div>
          <div className="w-[120px]" />
        </div>
      </header>

      <main className="max-w-[1000px] mx-auto px-6 py-10 w-full">
        {/* Title */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff] flex items-center gap-3">
            <Youtube className="w-8 h-8 text-red-500" />
            YouTube Thumbnail Downloader
          </h1>
          <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
            Extract and download cover art images from any YouTube video in multiple resolutions (Ultra HD, HD, HQ, standard size).
          </p>
        </div>

        {/* Input box */}
        <form onSubmit={handleExtract} className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant mb-10">
          <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant block mb-2">
            YouTube Video Link or 11-char ID
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              className="flex-grow bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#008cff] transition-all font-mono"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-[#008cff] hover:bg-[#0070cc] text-white font-mono text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-sm flex-shrink-0"
            >
              <Search className="w-4 h-4" />
              Extract Thumbnails
            </button>
          </div>

          {errorMsg && (
            <div className="mt-4 text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-2 font-sans animate-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </form>

        {videoId && thumbnails.length > 0 && (
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Summary details */}
            <div className="bg-surface-container-low border border-outline-variant p-4 rounded-xl flex items-center justify-between font-mono text-xs text-on-surface-variant">
              <span>Parsed Video ID: <strong className="text-white select-all">{videoId}</strong></span>
              <a
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#008cff] hover:underline flex items-center gap-1"
              >
                <Play className="w-3.5 h-3.5 fill-[#008cff]" />
                Watch Video
              </a>
            </div>

            {/* Grid display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {thumbnails.map((thumb) => {
                const isDownloading = downloadingId === thumb.id;
                return (
                  <div
                    key={thumb.id}
                    className="bg-surface-container-low border border-outline-variant rounded-2xl overflow-hidden group flex flex-col justify-between"
                  >
                    {/* Visual Preview */}
                    <div className="aspect-video w-full bg-surface-container-lowest border-b border-outline-variant overflow-hidden relative flex items-center justify-center">
                      <img
                        src={thumb.url}
                        alt={thumb.name}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs font-mono text-[10px] text-white">
                        {thumb.resolution}
                      </div>
                    </div>

                    {/* Meta info & Action */}
                    <div className="p-4 flex items-center justify-between gap-4">
                      <div className="overflow-hidden">
                        <h3 className="font-heading text-xs font-semibold text-white truncate">
                          {thumb.name}
                        </h3>
                        <span className="font-mono text-[10px] text-on-surface-variant">
                          Format: JPEG
                        </span>
                      </div>

                      <button
                        onClick={() => handleDownload(thumb.url, thumb.id)}
                        disabled={isDownloading}
                        className={`flex items-center gap-1.5 px-4 py-2 border rounded-xl text-xs font-mono uppercase tracking-wider transition-all select-none ${
                          isDownloading
                            ? 'border-outline-variant bg-surface-container text-outline'
                            : 'border-outline-variant bg-surface-container hover:bg-surface-container-high hover:border-[#008cff] text-[#008cff]'
                        }`}
                      >
                        <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce' : ''}`} />
                        {isDownloading ? 'Downloading...' : 'Download'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
