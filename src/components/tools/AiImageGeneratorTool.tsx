import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiImageGeneratorTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-image-generator" 
      name="Image Generator" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Image Generator\".\nThe user is asking you to act as a Image Generator. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
