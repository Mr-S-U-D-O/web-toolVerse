import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiCodeUpscalerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-code-upscaler" 
      name="Code Upscaler" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Code Upscaler\".\nThe user is asking you to act as a Code Upscaler. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
