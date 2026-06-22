import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiTextRefinerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-text-refiner" 
      name="Text Refiner" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Text Refiner\".\nThe user is asking you to act as a Text Refiner. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
