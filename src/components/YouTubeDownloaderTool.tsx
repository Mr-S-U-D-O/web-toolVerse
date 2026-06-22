import React from 'react';
import { Youtube } from 'lucide-react';
import BaseSocialExtractor from './BaseSocialExtractor';

const REDIRECTS = [
  { pattern: /facebook\.com|fb\.watch/i, toolPath: '/tools/facebook-downloader', toolName: 'Facebook' },
  { pattern: /tiktok\.com/i, toolPath: '/tools/tiktok-downloader', toolName: 'TikTok' },
  { pattern: /instagram\.com/i, toolPath: '/tools/instagram-downloader', toolName: 'Instagram' },
];

export default function YoutubeDownloaderTool({ onBack }: { onBack?: () => void }) {
  return (
    <BaseSocialExtractor
      platformName="YouTube"
      platformColorClass="text-red-500"
      platformBgClass="bg-red-500/10"
      platformBorderClass="border-red-500/20"
      platformIcon={<Youtube className="w-3 h-3" />}
      urlPattern={/youtube\.com|youtu\.be/i}
      redirects={REDIRECTS}
      onBack={onBack}
    />
  );
}
