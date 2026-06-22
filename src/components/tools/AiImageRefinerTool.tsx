import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiImageRefinerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-image-refiner" 
      name="Image Refiner" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Image Refiner\".\nThe user is asking you to act as a Image Refiner. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
