import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiTextExpanderTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-text-expander" 
      name="Text Expander" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Text Expander\".\nThe user is asking you to act as a Text Expander. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
