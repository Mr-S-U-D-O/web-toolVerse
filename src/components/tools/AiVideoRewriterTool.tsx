import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiVideoRewriterTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-video-rewriter" 
      name="Video Rewriter" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Video Rewriter\".\nThe user is asking you to act as a Video Rewriter. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
