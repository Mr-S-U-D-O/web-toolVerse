import { useState, useRef, useCallback } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export type TranscodeStatus = 'idle' | 'loading' | 'ready' | 'processing' | 'done' | 'error';
export type TranscodeFormat = 'mp4' | 'webm' | 'gif';

export function useFFmpeg() {
  const [status, setStatus] = useState<TranscodeStatus>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const ffmpegRef = useRef<FFmpeg | null>(null);

  const load = useCallback(async () => {
    // If already loaded/loading, skip
    if (ffmpegRef.current || status === 'loading' || status === 'ready') return;

    setStatus('loading');
    try {
      const ffmpeg = new FFmpeg();
      ffmpegRef.current = ffmpeg;

      ffmpeg.on('progress', ({ progress: p }) => {
        // progress is 0.0 to 1.0. Cap it at 100%.
        setProgress(Math.min(100, Math.max(0, Math.round(p * 100))));
      });

      // Load core files dynamically from jsdelivr (faster globally than unpkg)
      const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@0.12.6/dist/esm';
      const coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript');
      const wasmURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm');
      const workerURL = await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript');

      await ffmpeg.load({
        coreURL,
        wasmURL,
        workerURL,
      });

      setStatus('ready');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Failed to load FFmpeg engine.');
      ffmpegRef.current = null;
    }
  }, [status]);

  const transcodeVideo = useCallback(
    async (
      file: File,
      targetFormat: TranscodeFormat,
      qualityCrf: number // e.g., 18 (High), 23 (Medium), 28 (Low)
    ): Promise<Blob | null> => {
      const ffmpeg = ffmpegRef.current;
      if (!ffmpeg) throw new Error('FFmpeg not loaded');

      setStatus('processing');
      setProgress(0);
      setErrorMsg(null);

      // Unique names to prevent VFS collisions
      const ext = file.name.split('.').pop() || 'mp4';
      const inputName = `input_${Date.now()}.${ext}`;
      const outputName = `output_${Date.now()}.${targetFormat}`;

      try {
        // Write file to FFmpeg's virtual file system
        await ffmpeg.writeFile(inputName, await fetchFile(file));

        // Construct FFmpeg command
        const args = ['-i', inputName];

        if (targetFormat === 'mp4') {
          // Standard H.264 encode
          args.push('-c:v', 'libx264', '-crf', qualityCrf.toString(), '-preset', 'fast');
        } else if (targetFormat === 'webm') {
          // VP9 encode
          args.push('-c:v', 'libvpx-vp9', '-crf', qualityCrf.toString(), '-b:v', '0');
        } else if (targetFormat === 'gif') {
          // Basic GIF
          args.push('-vf', 'fps=15,scale=480:-1:flags=lanczos');
        }

        args.push(outputName);

        // Execute command
        await ffmpeg.exec(args);

        // Read output file
        const data = await ffmpeg.readFile(outputName);

        // Cleanup virtual file system to free memory!
        await ffmpeg.deleteFile(inputName);
        await ffmpeg.deleteFile(outputName);

        setStatus('ready');
        setProgress(100);

        return new Blob([data], { type: `video/${targetFormat === 'gif' ? 'gif' : targetFormat}` });
      } catch (err) {
        console.error(err);
        setStatus('error');
        setErrorMsg(err instanceof Error ? err.message : 'Conversion failed');
        
        // Attempt cleanup on failure
        try {
          await ffmpeg.deleteFile(inputName);
          await ffmpeg.deleteFile(outputName);
        } catch (e) {
          // Ignore cleanup errors
        }
        
        return null;
      }
    },
    []
  );

  return {
    status,
    progress,
    errorMsg,
    load,
    transcodeVideo,
  };
}
