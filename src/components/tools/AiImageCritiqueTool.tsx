import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiImageCritiqueTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-image-critique" 
      name="Image Critique" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Image Critique\".\nThe user is asking you to act as a Image Critique. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
