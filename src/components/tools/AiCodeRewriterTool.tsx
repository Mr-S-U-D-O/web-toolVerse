import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiCodeRewriterTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-code-rewriter" 
      name="Code Rewriter" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Code Rewriter\".\nThe user is asking you to act as a Code Rewriter. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
