import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiVideoExpanderTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-video-expander" 
      name="Video Expander" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Video Expander\".\nThe user is asking you to act as a Video Expander. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
