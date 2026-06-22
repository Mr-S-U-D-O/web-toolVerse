import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiCodeMakerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-code-maker" 
      name="Code Maker" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Code Maker\".\nThe user is asking you to act as a Code Maker. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
