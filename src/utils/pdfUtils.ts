import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, degrees } from 'pdf-lib';

// ─── Worker Setup ─────────────────────────────────────────────────────────────
// Vite resolves `new URL('...', import.meta.url)` as a static asset at build time.
// This is the officially recommended way to configure pdfjs-dist in Vite projects.
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
  ).href;
} catch {
  // Fallback: disable worker (slower, but functional)
  pdfjsLib.GlobalWorkerOptions.workerSrc = '';
}

// ─── Shared Types ─────────────────────────────────────────────────────────────

/**
 * A loaded source PDF. The raw bytes are kept as the ground truth so
 * pdf-lib can copy individual pages on demand at download time.
 */
export interface SourceDocument {
  id: string;
  filename: string;
  bytes: Uint8Array;   // raw PDF bytes — never mutated
  pageCount: number;
}

/**
 * One entry in the current workspace page manifest.
 * All reorder / delete / rotate operations are instant array mutations
 * against this type — zero PDF processing until download.
 */
export interface WorkspacePage {
  id: string;
  sourceDocId: string;
  sourcePageIndex: number;           // 0-based index in the source document
  rotation: 0 | 90 | 180 | 270;    // cumulative user-applied rotation (CW)
  thumbnailUrl: string | null;       // createObjectURL — must be revoked on cleanup
  isSelected: boolean;
}

// ─── File I/O ─────────────────────────────────────────────────────────────────

export async function loadPdfFromFile(file: File): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  return new Uint8Array(buffer);
}

export async function getPdfPageCount(bytes: Uint8Array): Promise<number> {
  // Use pdf-lib for page count — it's faster than pdfjs for metadata-only reads
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  return doc.getPageCount();
}

// ─── Thumbnail Generation ─────────────────────────────────────────────────────

/**
 * Renders a single PDF page to a canvas and returns a blob Object URL.
 * Caller is responsible for calling URL.revokeObjectURL on the returned string.
 *
 * @param bytes     - Raw PDF bytes (a COPY is taken internally to avoid pdfjs ownership issues)
 * @param pageIndex - 0-based page index
 * @param targetWidth - target render width in pixels (height is derived from page aspect ratio)
 */
export async function renderPageThumbnail(
  bytes: Uint8Array,
  pageIndex: number,
  targetWidth = 220
): Promise<string | null> {
  const loadingTask = pdfjsLib.getDocument({ data: bytes.slice(0) });

  try {
    const pdfProxy = await loadingTask.promise;

    const page = await pdfProxy.getPage(pageIndex + 1); // pdfjs is 1-indexed
    const naturalViewport = page.getViewport({ scale: 1 });
    const scale = targetWidth / naturalViewport.width;
    const scaledViewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(scaledViewport.width);
    canvas.height = Math.round(scaledViewport.height);

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // PDF pages assume a white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // pdfjs-dist v4: RenderParameters requires explicit `canvas`
    await page.render({
      canvasContext: ctx as unknown as CanvasRenderingContext2D,
      viewport: scaledViewport,
      canvas,
    } as unknown as Parameters<typeof page.render>[0]).promise;

    return await new Promise<string>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(URL.createObjectURL(blob));
          else reject(new Error('canvas.toBlob returned null'));
        },
        'image/jpeg',
        0.82
      );
    });
  } catch (err) {
    console.warn(`[pdfUtils] Thumbnail failed for page ${pageIndex}:`, err);
    return null;
  } finally {
    // pdfjs-dist v4: clean up via the loading task
    loadingTask.destroy().catch(() => {});
  }
}

// ─── PDF Assembly ─────────────────────────────────────────────────────────────

/**
 * Assembles the final PDF from the page manifest.
 *
 * This is the ONLY place pdf-lib does real work. It runs once, at download time.
 * Pages are copied from their source documents in order, rotations applied.
 */
export async function assemblePdf(
  sourceMap: Map<string, SourceDocument>,
  pages: WorkspacePage[]
): Promise<Uint8Array> {
  const outputDoc = await PDFDocument.create();

  // Cache parsed PDFDocuments so each source is only parsed once per export
  const docCache = new Map<string, PDFDocument>();

  for (const page of pages) {
    let srcDoc = docCache.get(page.sourceDocId);
    if (!srcDoc) {
      const src = sourceMap.get(page.sourceDocId);
      if (!src) continue;
      srcDoc = await PDFDocument.load(src.bytes, { ignoreEncryption: true });
      docCache.set(page.sourceDocId, srcDoc);
    }

    const [copied] = await outputDoc.copyPages(srcDoc, [page.sourcePageIndex]);

    if (page.rotation !== 0) {
      const existing = copied.getRotation().angle;
      copied.setRotation(degrees((existing + page.rotation) % 360));
    }

    outputDoc.addPage(copied);
  }

  return outputDoc.save();
}
