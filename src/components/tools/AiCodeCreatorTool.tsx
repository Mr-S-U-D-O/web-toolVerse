import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiCodeCreatorTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-code-creator" 
      name="Code Creator" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Code Creator\".\nThe user is asking you to act as a Code Creator. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
