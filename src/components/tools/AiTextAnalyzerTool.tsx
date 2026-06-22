import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiTextAnalyzerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-text-analyzer" 
      name="Text Analyzer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Text Analyzer\".\nThe user is asking you to act as a Text Analyzer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
