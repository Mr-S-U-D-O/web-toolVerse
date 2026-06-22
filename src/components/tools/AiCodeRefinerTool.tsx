import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiCodeRefinerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-code-refiner" 
      name="Code Refiner" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Code Refiner\".\nThe user is asking you to act as a Code Refiner. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
