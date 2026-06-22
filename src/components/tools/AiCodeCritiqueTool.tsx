import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiCodeCritiqueTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-code-critique" 
      name="Code Critique" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Code Critique\".\nThe user is asking you to act as a Code Critique. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
