import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiVideoEnhancerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-video-enhancer" 
      name="Video Enhancer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Video Enhancer\".\nThe user is asking you to act as a Video Enhancer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
