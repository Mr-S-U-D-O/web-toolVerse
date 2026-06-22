/**
 * bgRemover.worker.ts
 *
 * Isolated Web Worker for AI background removal using briaai/RMBG-1.4.
 *
 * IMPORTANT: RMBG-1.4 is a SegformerForSemanticSegmentation model and is NOT
 * compatible with pipeline('image-segmentation'). We must load it directly
 * via AutoModel + AutoProcessor to bypass pipeline task validation.
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
  AutoModel,
  AutoProcessor,
  RawImage,
  env,
} from '@huggingface/transformers';

// ─── Transformers.js environment config ───────────────────────────────────────

env.useBrowserCache = true;
env.allowRemoteModels = true;

// ─── State ────────────────────────────────────────────────────────────────────

let model: Awaited<ReturnType<typeof AutoModel.from_pretrained>> | null = null;
let processor: Awaited<ReturnType<typeof AutoProcessor.from_pretrained>> | null = null;
let activeDevice = 'wasm';

// ─── Progress callback ────────────────────────────────────────────────────────

function onDownloadProgress(event: {
  status: string;
  progress?: number;
  loaded?: number;
  total?: number;
}) {
  if (event.status === 'downloading' || event.status === 'progress') {
    const pct =
      event.progress != null
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
  if (model && processor) {
    self.postMessage({ type: 'ready', device: activeDevice });
    return;
  }

  try {
    self.postMessage({
      type: 'progress',
      stage: 'download',
      value: 0,
      text: 'Initialising AI model…',
    });

    // ── Model ──────────────────────────────────────────────────────────────
    // We use AutoModel directly because RMBG-1.4 is SegformerForSemanticSegmentation
    // and is unsupported by pipeline('image-segmentation') in transformers.js.
    // Setting model_type:'custom' bypasses task-class validation and loads the
    // ONNX graph directly.
    let loadedModel: typeof model;
    let loadedDevice = 'wasm';

    try {
      loadedModel = await AutoModel.from_pretrained('briaai/RMBG-1.4', {
        config: { model_type: 'custom' },
        device: 'webgpu',
        progress_callback: onDownloadProgress,
      } as any);
      loadedDevice = 'webgpu';
    } catch {
      // WebGPU not available — fall back to WASM (CPU)
      self.postMessage({
        type: 'progress',
        stage: 'download',
        value: 0,
        text: 'WebGPU unavailable — using CPU backend…',
      });
      loadedModel = await AutoModel.from_pretrained('briaai/RMBG-1.4', {
        config: { model_type: 'custom' },
        device: 'wasm',
        progress_callback: onDownloadProgress,
      } as any);
      loadedDevice = 'wasm';
    }

    // ── Processor ──────────────────────────────────────────────────────────
    // RMBG-1.4's preprocessor_config.json may not be present; supply defaults.
    const loadedProcessor = await AutoProcessor.from_pretrained('briaai/RMBG-1.4', {
      config: {
        do_normalize: true,
        do_pad: false,
        do_rescale: true,
        do_resize: true,
        image_mean: [0.5, 0.5, 0.5],
        feature_extractor_type: 'ImageFeatureExtractor',
        image_std: [1, 1, 1],
        resample: 2,
        rescale_factor: 0.00392156862745098, // 1/255
        size: { width: 1024, height: 1024 },
      },
    } as any);

    model = loadedModel;
    processor = loadedProcessor;
    activeDevice = loadedDevice;

    self.postMessage({ type: 'ready', device: activeDevice });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to load AI model';
    self.postMessage({ type: 'global_error', message: msg });
  }
}

// ─── Process ──────────────────────────────────────────────────────────────────

/**
 * Inference + high-resolution compositing.
 *
 *  1. Create RawImage from the ImageBitmap (already on worker via transfer)
 *  2. Pre-process: processor resizes to 1024×1024, normalises pixel values
 *  3. Run model: output tensor [1, 1, 1024, 1024] (sigmoid alpha, 0–1)
 *  4. Convert output[0] to a grayscale RawImage and resize to original dimensions
 *  5. Draw original image on OffscreenCanvas (full resolution)
 *  6. Apply mask as alpha channel: pixel-by-pixel from the resized mask
 *  7. Export full-resolution transparent PNG
 */
async function processImage(id: string, bitmap: ImageBitmap) {
  if (!model || !processor) {
    self.postMessage({ type: 'error', id, message: 'Model not loaded yet.' });
    return;
  }

  try {
    const origW = bitmap.width;
    const origH = bitmap.height;

    // ── Step 1: Build RawImage from bitmap ────────────────────────────────
    self.postMessage({ type: 'progress', stage: 'inference', value: 10, text: 'Decoding image…' });

    const srcCanvas = new OffscreenCanvas(origW, origH);
    const srcCtx = srcCanvas.getContext('2d')!;
    srcCtx.drawImage(bitmap, 0, 0);
    const srcData = srcCtx.getImageData(0, 0, origW, origH);
    const rawImage = new RawImage(srcData.data, origW, origH, 4);

    // ── Step 2: Preprocess (resize to 1024×1024, normalise) ───────────────
    self.postMessage({ type: 'progress', stage: 'inference', value: 25, text: 'Preprocessing…' });
    const { pixel_values } = await (processor as any)(rawImage);

    // ── Step 3: Run inference ─────────────────────────────────────────────
    self.postMessage({ type: 'progress', stage: 'inference', value: 40, text: 'Running AI inference…' });
    const { output } = await (model as any)({ input: pixel_values });

    // ── Step 4: Build resized alpha mask ──────────────────────────────────
    self.postMessage({ type: 'progress', stage: 'inference', value: 75, text: 'Applying mask at full resolution…' });

    // output.dims = [1, 1, 1024, 1024]; output[0] gives [1, 1024, 1024]
    // Multiply by 255 to go from [0,1] float to [0,255] uint8
    const maskImg = await RawImage.fromTensor(
      (output[0] as any).mul(255).to('uint8'),
    );
    // Resize mask to original image dimensions (nearest-neighbor effectively)
    const resizedMask = await maskImg.resize(origW, origH);

    // ── Step 5 & 6: Draw original + apply alpha mask ──────────────────────
    const outCanvas = new OffscreenCanvas(origW, origH);
    const outCtx = outCanvas.getContext('2d')!;
    outCtx.drawImage(bitmap, 0, 0);

    const imageData = outCtx.getImageData(0, 0, origW, origH);
    const pixels = imageData.data; // RGBA, length = origW * origH * 4
    const maskData = resizedMask.data; // Uint8Array, length = origW * origH (1 channel)

    for (let i = 0; i < maskData.length; i++) {
      pixels[i * 4 + 3] = maskData[i]; // write alpha channel
    }

    outCtx.putImageData(imageData, 0, 0);

    // ── Step 7: Export PNG ────────────────────────────────────────────────
    self.postMessage({ type: 'progress', stage: 'inference', value: 95, text: 'Encoding PNG…' });

    const blob = await outCanvas.convertToBlob({ type: 'image/png' });
    bitmap.close();

    self.postMessage({ type: 'result', id, blob });
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
