import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiTextSummarizerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-text-summarizer" 
      name="Text Summarizer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Text Summarizer\".\nThe user is asking you to act as a Text Summarizer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
