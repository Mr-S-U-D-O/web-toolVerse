import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiImageUpscalerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-image-upscaler" 
      name="Image Upscaler" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Image Upscaler\".\nThe user is asking you to act as a Image Upscaler. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
