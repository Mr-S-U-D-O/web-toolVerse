import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiTextBuilderTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-text-builder" 
      name="Text Builder" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Text Builder\".\nThe user is asking you to act as a Text Builder. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
