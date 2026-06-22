import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiCodeBuilderTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-code-builder" 
      name="Code Builder" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Code Builder\".\nThe user is asking you to act as a Code Builder. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
