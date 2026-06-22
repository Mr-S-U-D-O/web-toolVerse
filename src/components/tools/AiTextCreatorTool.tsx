import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiTextCreatorTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-text-creator" 
      name="Text Creator" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Text Creator\".\nThe user is asking you to act as a Text Creator. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
