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
];
