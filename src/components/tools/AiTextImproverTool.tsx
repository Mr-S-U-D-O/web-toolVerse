import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiTextImproverTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-text-improver" 
      name="Text Improver" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Text Improver\".\nThe user is asking you to act as a Text Improver. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
