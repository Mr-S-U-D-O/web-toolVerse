import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiTextUpscalerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-text-upscaler" 
      name="Text Upscaler" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Text Upscaler\".\nThe user is asking you to act as a Text Upscaler. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
