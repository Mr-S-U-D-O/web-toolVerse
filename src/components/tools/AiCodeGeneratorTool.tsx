import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiCodeGeneratorTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-code-generator" 
      name="Code Generator" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Code Generator\".\nThe user is asking you to act as a Code Generator. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
