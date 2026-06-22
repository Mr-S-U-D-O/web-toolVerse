import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiImageSummarizerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-image-summarizer" 
      name="Image Summarizer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Image Summarizer\".\nThe user is asking you to act as a Image Summarizer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
