import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiVideoImproverTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-video-improver" 
      name="Video Improver" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Video Improver\".\nThe user is asking you to act as a Video Improver. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
