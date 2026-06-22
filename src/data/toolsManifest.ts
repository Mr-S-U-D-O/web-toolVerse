export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  status: 'active';
}

export const ALL_TOOLS: Tool[] = [
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    description:
      'Compress JPG, PNG, WebP and more — 100% client-side, no uploads, unlimited batch with ZIP export.',
    category: 'Image',
    icon: null,
    status: 'active',
  },
  {
    id: 'pdf-studio',
    name: 'PDF Studio',
    description:
      'Merge, split, reorder, rotate and encrypt PDFs in one workflow. No uploads. 100% client-side.',
    category: 'PDF',
    icon: null,
    status: 'active',
  },
  {
    id: 'background-remover',
    name: 'Background Remover',
    description:
      'Remove image backgrounds instantly using on-device AI. 100% private — no uploads, no limits, full-resolution transparent PNG.',
    category: 'Image',
    icon: null,
    status: 'active',
  },
  {
    id: 'image-converter',
    name: 'Image Converter',
    description:
      'Convert JPG, PNG, WebP, and HEIC offline. Instant native canvas processing, no server uploads.',
    category: 'Image',
    icon: null,
    status: 'active',
  },
  {
    id: 'video-transcoder',
    name: 'Video Transcoder',
    description:
      'Convert MP4, WebM, and GIF entirely in your browser using multi-threaded WebAssembly. No cloud limits.',
    category: 'Video',
    icon: null,
    status: 'active',
  },
  {
    id: 'youtube-downloader',
    name: 'YouTube Downloader',
    description: 'Extract YouTube videos and audio up to 4K using our Hybrid WASM architecture.',
    category: 'Video',
    icon: null,
    status: 'active',
  },
  {
    id: 'facebook-downloader',
    name: 'Facebook Downloader',
    description: 'Extract Facebook videos natively in your browser.',
    category: 'Video',
    icon: null,
    status: 'active',
  },
  {
    id: 'tiktok-downloader',
    name: 'TikTok Downloader',
    description: 'Download TikToks seamlessly without watermarks.',
    category: 'Video',
    icon: null,
    status: 'active',
  },
  {
    id: 'instagram-downloader',
    name: 'Instagram Downloader',
    description: 'Extract Instagram Reels and Posts safely and securely.',
    category: 'Video',
    icon: null,
    status: 'active',
  },
  {
    id: 'comma-separator',
    name: 'Comma Separator',
    description: 'Format lists of items with commas or custom delimiters.',
    category: 'Text',
    icon: null,
    status: 'active',
  },
  {
    id: 'text-sorter',
    name: 'Text Sorter',
    description: 'Sort lines of text alphabetically, numerically, or by length.',
    category: 'Text',
    icon: null,
    status: 'active',
  },
  {
    id: 'remove-line-breaks',
    name: 'Remove Line Breaks',
    description: 'Clean up text by removing line breaks and replacing them with spaces.',
    category: 'Text',
    icon: null,
    status: 'active',
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text case to UPPERCASE, lowercase, Title Case, camelCase, etc.',
    category: 'Text',
    icon: null,
    status: 'active',
  },
  {
    id: 'text-to-slug',
    name: 'Text to Slug',
    description: 'Generate URL-friendly, clean slugs from any text input.',
    category: 'Text',
    icon: null,
    status: 'active',
  },
  {
    id: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    description: 'Generate mock paragraphs, sentences, or lists for layout testing.',
    category: 'Text',
    icon: null,
    status: 'active',
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    description: 'Get real-time character, word, line, and sentence counts, reading times, and keyword density.',
    category: 'Text',
    icon: null,
    status: 'active',
  },
  {
    id: 'random-word-generator',
    name: 'Random Word Generator',
    description: 'Generate random English words based on category, count, and filters.',
    category: 'Text',
    icon: null,
    status: 'active',
  },
  {
    id: 'text-repeater',
    name: 'Text Repeater',
    description: 'Repeat a block of text a specified number of times with custom delimiters.',
    category: 'Text',
    icon: null,
    status: 'active',
  },
];
