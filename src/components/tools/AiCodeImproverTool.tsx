import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiCodeImproverTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-code-improver" 
      name="Code Improver" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Code Improver\".\nThe user is asking you to act as a Code Improver. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
