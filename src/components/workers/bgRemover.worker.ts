/**
 * bgRemover.worker.ts
 *
 * Isolated Web Worker for AI background removal.
 * Runs entirely off the main thread — zero UI jank.
 *
 * Architecture:
 *  1. On 'init': download + cache briaai/RMBG-1.4 (quantized ONNX ~45 MB)
 *     via @huggingface/transformers with WebGPU → WASM fallback.
 *  2. On 'process': run segmentation inference, composite the alpha mask
 *     onto the original image using OffscreenCanvas, return a full-res PNG blob.
 *
 * Message Protocol
 * ─────────────────
 * Main → Worker:
 *   { type: 'init' }
 *   { type: 'process'; id: string; bitmap: ImageBitmap }
 *
 * Worker → Main:
 *   { type: 'progress'; stage: 'download'|'inference'; value: number; text: string }
 *   { type: 'ready'; device: string }
 *   { type: 'result'; id: string; blob: Blob }
 *   { type: 'error'; id: string; message: string }
 *   { type: 'global_error'; message: string }
 */

import {
  pipeline,
  env,
  RawImage,
} from '@huggingface/transformers';

// ─── Transformers.js environment config ───────────────────────────────────────

// Always prefer cached weights; do not re-download if already cached.
env.useBrowserCache = true;
// Allow remote model download on first use.
env.allowRemoteModels = true;

// ─── Types ────────────────────────────────────────────────────────────────────

type Segmenter = Awaited<ReturnType<typeof pipeline>>;

// ─── State ────────────────────────────────────────────────────────────────────

let segmenter: Segmenter | null = null;
let activeDevice = 'wasm';

// ─── Progress callback ────────────────────────────────────────────────────────

/**
 * Called by transformers.js during model download.
 * Maps the raw progress event to a 0–100 value for the UI progress bar.
 */
function onModelProgress(event: { status: string; name?: string; file?: string; progress?: number; loaded?: number; total?: number }) {
  if (event.status === 'downloading' || event.status === 'progress') {
    const pct = event.progress != null
      ? Math.round(event.progress)
      : event.loaded != null && event.total != null && event.total > 0
        ? Math.round((event.loaded / event.total) * 100)
        : 0;

    self.postMessage({
      type: 'progress',
      stage: 'download',
      value: pct,
      text: `Downloading AI model… ${pct}%`,
    });
  } else if (event.status === 'loading' || event.status === 'loaded') {
    self.postMessage({
      type: 'progress',
      stage: 'download',
      value: 100,
      text: 'Loading model into memory…',
    });
  }
}

// ─── Init ─────────────────────────────────────────────────────────────────────

async function init() {
  if (segmenter) {
    self.postMessage({ type: 'ready', device: activeDevice });
    return;
  }

  try {
    // Try WebGPU first for GPU-accelerated inference.
    // transformers.js v3 auto-falls back to WASM if WebGPU unavailable.
    let pipe: Segmenter;

    const deviceHint = 'webgpu';

    try {
      pipe = await pipeline(
        'image-segmentation',
        'briaai/RMBG-1.4',
        {
          device: deviceHint,
          dtype: 'fp32',                        // RMBG-1.4 requires fp32
          progress_callback: onModelProgress,
        } as any,
      );
      activeDevice = 'webgpu';
    } catch {
      // WebGPU failed — fall back to WASM (CPU)
      self.postMessage({
        type: 'progress',
        stage: 'download',
        value: 0,
        text: 'WebGPU unavailable — loading CPU (WASM) backend…',
      });

      pipe = await pipeline(
        'image-segmentation',
        'briaai/RMBG-1.4',
        {
          device: 'wasm',
          dtype: 'fp32',
          progress_callback: onModelProgress,
        } as any,
      );
      activeDevice = 'wasm';
    }

    segmenter = pipe;
    self.postMessage({ type: 'ready', device: activeDevice });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to load AI model';
    self.postMessage({ type: 'global_error', message: msg });
  }
}

// ─── Process ──────────────────────────────────────────────────────────────────

/**
 * Core inference + compositing function.
 *
 * Strategy:
 *  1. Convert ImageBitmap → RawImage for the model (library handles resize internally)
 *  2. Run segmentation pipeline → get alpha mask (1024×1024 RawImage, grayscale)
 *  3. Composite the mask onto the original image using OffscreenCanvas:
 *       - Draw original at full resolution
 *       - Iterate every pixel; look up mask value using nearest-neighbor:
 *           maskX = floor(px / origW * maskW)
 *           maskY = floor(py / origH * maskH)
 *       - Set pixel alpha to mask value
 *  4. Export canvas as a full-resolution transparent PNG blob
 */
async function processImage(id: string, bitmap: ImageBitmap) {
  if (!segmenter) {
    self.postMessage({ type: 'error', id, message: 'Model not loaded yet.' });
    return;
  }

  try {
    // ── Step 1: Convert bitmap to RawImage ────────────────────────────────
    self.postMessage({
      type: 'progress',
      stage: 'inference',
      value: 10,
      text: 'Preparing image…',
    });

    // Draw to a small OffscreenCanvas to get pixel data for RawImage
    const srcCanvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const srcCtx = srcCanvas.getContext('2d')!;
    srcCtx.drawImage(bitmap, 0, 0);
    const srcData = srcCtx.getImageData(0, 0, bitmap.width, bitmap.height);

    // Build a RawImage from RGBA pixel data
    const rawInput = new RawImage(
      srcData.data,
      bitmap.width,
      bitmap.height,
      4, // RGBA channels
    );

    // ── Step 2: Run inference ─────────────────────────────────────────────
    self.postMessage({
      type: 'progress',
      stage: 'inference',
      value: 30,
      text: 'Running AI background removal…',
    });

    // The pipeline returns an array of segmentation results;
    // RMBG-1.4 returns a single result with a 'mask' RawImage.
    const results = await (segmenter as any)(rawInput) as Array<{ label: string; score: number; mask: RawImage }>;

    self.postMessage({
      type: 'progress',
      stage: 'inference',
      value: 75,
      text: 'Applying mask at full resolution…',
    });

    if (!results || results.length === 0 || !results[0].mask) {
      throw new Error('Model returned no segmentation mask.');
    }

    const mask = results[0].mask; // RawImage: width=1024, height=1024, channels=1

    // ── Step 3: Composite on OffscreenCanvas ──────────────────────────────
    const origW = bitmap.width;
    const origH = bitmap.height;
    const maskW = mask.width;
    const maskH = mask.height;

    const outCanvas = new OffscreenCanvas(origW, origH);
    const outCtx = outCanvas.getContext('2d')!;

    // Draw original image at full resolution
    outCtx.drawImage(bitmap, 0, 0);

    // Retrieve pixel data to manipulate alpha channel
    const imageData = outCtx.getImageData(0, 0, origW, origH);
    const data = imageData.data; // Uint8ClampedArray [R,G,B,A, R,G,B,A, ...]
    const maskData = mask.data as Uint8Array | Float32Array;

    for (let py = 0; py < origH; py++) {
      for (let px = 0; px < origW; px++) {
        // Nearest-neighbor lookup into the 1024×1024 mask
        const maskX = Math.floor((px / origW) * maskW);
        const maskY = Math.floor((py / origH) * maskH);
        const maskIdx = maskY * maskW + maskX;

        // Mask data may be Uint8 (0–255) or Float32 (0.0–1.0)
        let alphaValue: number;
        if (maskData instanceof Float32Array) {
          alphaValue = Math.round(maskData[maskIdx] * 255);
        } else {
          alphaValue = maskData[maskIdx];
        }

        // Set alpha in RGBA buffer (index of alpha byte = pixel*4 + 3)
        data[(py * origW + px) * 4 + 3] = alphaValue;
      }
    }

    outCtx.putImageData(imageData, 0, 0);

    // ── Step 4: Export PNG blob ───────────────────────────────────────────
    self.postMessage({
      type: 'progress',
      stage: 'inference',
      value: 95,
      text: 'Encoding PNG…',
    });

    const blob = await outCanvas.convertToBlob({ type: 'image/png' });

    // Clean up the source bitmap — caller is responsible for closing it
    bitmap.close();

    self.postMessage({
      type: 'result',
      id,
      blob,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Inference failed';
    self.postMessage({ type: 'error', id, message: msg });
  }
}

// ─── Message handler ──────────────────────────────────────────────────────────

self.onmessage = async (event: MessageEvent) => {
  const msg = event.data;

  switch (msg.type) {
    case 'init':
      await init();
      break;
    case 'process':
      await processImage(msg.id, msg.bitmap);
      break;
    default:
      console.warn('[bgRemover.worker] Unknown message type:', msg.type);
  }
};
