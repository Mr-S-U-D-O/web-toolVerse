import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiTextScorerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-text-scorer" 
      name="Text Scorer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Text Scorer\".\nThe user is asking you to act as a Text Scorer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
