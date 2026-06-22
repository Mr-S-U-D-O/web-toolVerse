import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiCodeExpanderTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-code-expander" 
      name="Code Expander" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Code Expander\".\nThe user is asking you to act as a Code Expander. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
