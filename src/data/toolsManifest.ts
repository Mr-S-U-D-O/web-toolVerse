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
];
