import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiVideoCritiqueTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-video-critique" 
      name="Video Critique" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Video Critique\".\nThe user is asking you to act as a Video Critique. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
