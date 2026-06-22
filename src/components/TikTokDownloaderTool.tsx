import React from 'react';
import { Smartphone } from 'lucide-react'; // Using Smartphone as proxy for TikTok icon
import BaseSocialExtractor from './BaseSocialExtractor';

const REDIRECTS = [
  { pattern: /youtube\.com|youtu\.be/i, toolPath: '/tools/youtube-downloader', toolName: 'YouTube' },
  { pattern: /facebook\.com|fb\.watch/i, toolPath: '/tools/facebook-downloader', toolName: 'Facebook' },
  { pattern: /instagram\.com/i, toolPath: '/tools/instagram-downloader', toolName: 'Instagram' },
];

export default function TikTokDownloaderTool({ onBack }: { onBack?: () => void }) {
  return (
    <BaseSocialExtractor
      platformName="TikTok"
      platformColorClass="text-teal-400"
      platformBgClass="bg-teal-400/10"
      platformBorderClass="border-teal-400/20"
      platformIcon={<Smartphone className="w-3 h-3" />}
      urlPattern={/tiktok\.com/i}
      redirects={REDIRECTS}
      onBack={onBack}
    />
  );
}
