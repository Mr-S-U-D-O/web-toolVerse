import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiTextCritiqueTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-text-critique" 
      name="Text Critique" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Text Critique\".\nThe user is asking you to act as a Text Critique. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
