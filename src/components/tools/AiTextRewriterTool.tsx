import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiTextRewriterTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-text-rewriter" 
      name="Text Rewriter" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Text Rewriter\".\nThe user is asking you to act as a Text Rewriter. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
