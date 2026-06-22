import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiTextGeneratorTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-text-generator" 
      name="Text Generator" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Text Generator\".\nThe user is asking you to act as a Text Generator. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
