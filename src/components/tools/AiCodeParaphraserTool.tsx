import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiCodeParaphraserTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-code-paraphraser" 
      name="Code Paraphraser" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Code Paraphraser\".\nThe user is asking you to act as a Code Paraphraser. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
