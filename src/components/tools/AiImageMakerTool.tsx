import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiImageMakerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-image-maker" 
      name="Image Maker" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Image Maker\".\nThe user is asking you to act as a Image Maker. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
