export type TargetFormat = 'image/jpeg' | 'image/png' | 'image/webp';

import heic2any from 'heic2any';

/**
 * Converts an image file to a specified format using the browser's native Canvas API.
 * Automatically intercepts and processes Apple HEIC/HEIF files via heic2any.
 *
 * @param file The original image File.
 * @param targetFormat The MIME type to convert to.
 * @param quality Quality for JPEG/WebP (0.0 to 1.0). Default is 0.9.
 * @returns A promise resolving to the converted Blob.
 */
export async function convertImage(
  file: File,
  targetFormat: TargetFormat,
  quality: number = 0.9
): Promise<Blob> {
  let sourceBlob: Blob = file;

  // ── Step 1: HEIC Interception ───────────────────────────────────────────────
  const isHeic =
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    file.name.toLowerCase().endsWith('.heic') ||
    file.name.toLowerCase().endsWith('.heif');

  if (isHeic) {
    // Convert to PNG intermediary so the browser Image object can load it without loss
    const converted = await heic2any({
      blob: file,
      toType: 'image/png',
    });
    sourceBlob = Array.isArray(converted) ? converted[0] : converted;
  }

  // ── Step 2: Load into native Image object ──────────────────────────────────
  const imgUrl = URL.createObjectURL(sourceBlob);
  const img = new Image();

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to load image for conversion'));
    img.src = imgUrl;
  });

  URL.revokeObjectURL(imgUrl);

  // ── Step 3: Draw to Off-screen Canvas ──────────────────────────────────────
  const canvas = document.createElement('canvas');
  // Preserve original resolution strictly
  canvas.width = img.width;
  canvas.height = img.height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D canvas context');
  }

  // ── Step 4: White Background Fix ───────────────────────────────────────────
  // If we are converting a transparent PNG/WebP to JPEG, the transparent pixels 
  // default to black. We must explicitly fill with white first.
  if (targetFormat === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Draw the image onto the canvas
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // ── Step 5: Export to target format ────────────────────────────────────────
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, targetFormat, quality);
  });

  if (!blob) {
    throw new Error(`Failed to convert canvas to ${targetFormat}`);
  }

  return blob;
}
