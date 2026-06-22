import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiCodeSummarizerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-code-summarizer" 
      name="Code Summarizer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Code Summarizer\".\nThe user is asking you to act as a Code Summarizer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
