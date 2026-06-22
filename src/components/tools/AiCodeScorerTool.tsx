import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiCodeScorerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-code-scorer" 
      name="Code Scorer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Code Scorer\".\nThe user is asking you to act as a Code Scorer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
