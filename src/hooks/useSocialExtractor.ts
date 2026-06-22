import { useState, useRef, useCallback } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

export interface YtDlpFormat {
  format_id: string;
  format_note?: string;
  ext: string;
  url: string;
  vcodec: string;
  acodec: string;
  width?: number;
  height?: number;
  filesize?: number;
  filesize_approx?: number;
  fps?: number;
}

export interface YtDlpResponse {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  extractor: string;
  webpage_url: string;
  formats: YtDlpFormat[];
}

export interface CategorizedFormats {
  combined: YtDlpFormat[];
  videoOnly: YtDlpFormat[];
  audioOnly: YtDlpFormat[];
}

export type ExtractorStatus = 'idle' | 'extracting' | 'ready' | 'merging' | 'done' | 'error';

// Memory Limit: 1.5 GB in bytes
const MAX_FILE_SIZE = 1500000000;

export function useSocialExtractor(platformName: string) {
  const [status, setStatus] = useState<ExtractorStatus>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<YtDlpResponse | null>(null);
  const [formats, setFormats] = useState<CategorizedFormats | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  const ffmpegRef = useRef<FFmpeg | null>(null);

  const extract = useCallback(async (url: string) => {
    setStatus('extracting');
    setErrorMsg(null);
    setMetadata(null);
    setFormats(null);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setOutputUrl(null);

    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Extraction failed on server.');
      }

      const data: YtDlpResponse = await res.json();
      setMetadata(data);

      const combined: YtDlpFormat[] = [];
      const videoOnly: YtDlpFormat[] = [];
      const audioOnly: YtDlpFormat[] = [];

      data.formats.forEach((f) => {
        const hasVideo = f.vcodec && f.vcodec !== 'none';
        const hasAudio = f.acodec && f.acodec !== 'none';

        // Filter out m3u8 manifests or non-direct stream URLs if possible, 
        // but yt-dlp usually resolves these. We prioritize mp4/webm.
        if (hasVideo && hasAudio) {
          combined.push(f);
        } else if (hasVideo && !hasAudio) {
          videoOnly.push(f);
        } else if (!hasVideo && hasAudio) {
          audioOnly.push(f);
        }
      });

      // Sort by quality (rough estimation using width/height or filesize)
      const sortByQuality = (a: YtDlpFormat, b: YtDlpFormat) => 
        ((b.height || 0) * (b.width || 0)) - ((a.height || 0) * (a.width || 0)) || 
        ((b.filesize || b.filesize_approx || 0) - (a.filesize || a.filesize_approx || 0));

      setFormats({
        combined: combined.sort(sortByQuality),
        videoOnly: videoOnly.sort(sortByQuality),
        audioOnly: audioOnly.sort(sortByQuality),
      });

      setStatus('ready');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error during extraction.');
    }
  }, [outputUrl]);

  const loadFFmpeg = async () => {
    if (ffmpegRef.current) return ffmpegRef.current;
    
    const ffmpeg = new FFmpeg();
    ffmpegRef.current = ffmpeg;

    ffmpeg.on('progress', ({ progress: p }) => {
      setProgress(Math.min(100, Math.max(0, Math.round(p * 100))));
    });

    const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@0.12.6/dist/esm';
    const coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript');
    const wasmURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm');
    const workerURL = await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript');

    await ffmpeg.load({ coreURL, wasmURL, workerURL });
    return ffmpeg;
  };

  const mergeStreams = useCallback(async (videoFormat: YtDlpFormat, audioFormat: YtDlpFormat) => {
    const estimatedSize = (videoFormat.filesize || videoFormat.filesize_approx || 0) + 
                          (audioFormat.filesize || audioFormat.filesize_approx || 0);
    
    if (estimatedSize > MAX_FILE_SIZE) {
      setStatus('error');
      setErrorMsg('Combined file exceeds 1.5GB memory limit. Browser WASM will crash.');
      return;
    }

    setStatus('merging');
    setProgress(0);
    setErrorMsg(null);

    try {
      const ffmpeg = await loadFFmpeg();

      // Download streams via our proxy
      const fetchStream = async (url: string) => {
        const res = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
        if (!res.ok) throw new Error('Failed to fetch stream from proxy.');
        return new Uint8Array(await res.arrayBuffer());
      };

      setProgress(5); // Arbitrary loading progress

      const [videoData, audioData] = await Promise.all([
        fetchStream(videoFormat.url),
        fetchStream(audioFormat.url)
      ]);

      setProgress(20); // Finished downloading

      const ext = videoFormat.ext || 'mp4';
      const vName = `video.${videoFormat.ext}`;
      const aName = `audio.${audioFormat.ext}`;
      const outName = `output.${ext}`;

      await ffmpeg.writeFile(vName, videoData);
      await ffmpeg.writeFile(aName, audioData);

      // Dash Merge: copy codecs
      await ffmpeg.exec(['-i', vName, '-i', aName, '-c', 'copy', outName]);

      const data = await ffmpeg.readFile(outName);
      
      // Cleanup
      await ffmpeg.deleteFile(vName);
      await ffmpeg.deleteFile(aName);
      await ffmpeg.deleteFile(outName);

      const blob = new Blob([data], { type: `video/${ext}` });
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
      setStatus('done');
      
      // Auto download
      const a = document.createElement('a');
      a.href = url;
      a.download = `${metadata?.title || platformName}_Merged.${ext}`;
      a.click();

    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Merge failed.');
    }
  }, [metadata, platformName]);

  const downloadDirect = useCallback((format: YtDlpFormat) => {
    const a = document.createElement('a');
    // Using proxy to download avoids CORS blocks and forces download vs playback
    a.href = `/api/proxy?url=${encodeURIComponent(format.url)}`;
    a.download = `${metadata?.title || platformName}_Direct.${format.ext}`;
    a.target = '_blank';
    a.click();
  }, [metadata, platformName]);

  return {
    status,
    progress,
    errorMsg,
    metadata,
    formats,
    outputUrl,
    extract,
    mergeStreams,
    downloadDirect,
  };
}
