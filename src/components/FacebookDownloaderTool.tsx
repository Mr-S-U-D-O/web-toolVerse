import React from 'react';
import { Facebook } from 'lucide-react';
import BaseSocialExtractor from './BaseSocialExtractor';

const REDIRECTS = [
  { pattern: /youtube\.com|youtu\.be/i, toolPath: '/tools/youtube-downloader', toolName: 'YouTube' },
  { pattern: /tiktok\.com/i, toolPath: '/tools/tiktok-downloader', toolName: 'TikTok' },
  { pattern: /instagram\.com/i, toolPath: '/tools/instagram-downloader', toolName: 'Instagram' },
];

export default function FacebookDownloaderTool({ onBack }: { onBack?: () => void }) {
  return (
    <BaseSocialExtractor
      platformName="Facebook"
      platformColorClass="text-blue-500"
      platformBgClass="bg-blue-500/10"
      platformBorderClass="border-blue-500/20"
      platformIcon={<Facebook className="w-3 h-3" />}
      urlPattern={/facebook\.com|fb\.watch/i}
      redirects={REDIRECTS}
      onBack={onBack}
    />
  );
}
