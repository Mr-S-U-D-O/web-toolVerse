import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiImageParaphraserTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-image-paraphraser" 
      name="Image Paraphraser" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Image Paraphraser\".\nThe user is asking you to act as a Image Paraphraser. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
