import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiImageImproverTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-image-improver" 
      name="Image Improver" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Image Improver\".\nThe user is asking you to act as a Image Improver. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
