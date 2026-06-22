import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiImageScorerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-image-scorer" 
      name="Image Scorer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Image Scorer\".\nThe user is asking you to act as a Image Scorer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
