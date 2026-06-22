import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiImageRewriterTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-image-rewriter" 
      name="Image Rewriter" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Image Rewriter\".\nThe user is asking you to act as a Image Rewriter. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
