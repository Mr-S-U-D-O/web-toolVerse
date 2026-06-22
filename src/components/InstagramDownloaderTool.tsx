import React from 'react';
import { Instagram } from 'lucide-react';
import BaseSocialExtractor from './BaseSocialExtractor';

const REDIRECTS = [
  { pattern: /youtube\.com|youtu\.be/i, toolPath: '/tools/youtube-downloader', toolName: 'YouTube' },
  { pattern: /facebook\.com|fb\.watch/i, toolPath: '/tools/facebook-downloader', toolName: 'Facebook' },
  { pattern: /tiktok\.com/i, toolPath: '/tools/tiktok-downloader', toolName: 'TikTok' },
];

export default function InstagramDownloaderTool({ onBack }: { onBack?: () => void }) {
  return (
    <BaseSocialExtractor
      platformName="Instagram"
      platformColorClass="text-pink-500"
      platformBgClass="bg-pink-500/10"
      platformBorderClass="border-pink-500/20"
      platformIcon={<Instagram className="w-3 h-3" />}
      urlPattern={/instagram\.com/i}
      redirects={REDIRECTS}
      onBack={onBack}
    />
  );
}
