import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiImageEnhancerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-image-enhancer" 
      name="Image Enhancer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Image Enhancer\".\nThe user is asking you to act as a Image Enhancer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
