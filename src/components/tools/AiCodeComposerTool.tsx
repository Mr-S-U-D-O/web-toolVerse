import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiCodeComposerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-code-composer" 
      name="Code Composer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Code Composer\".\nThe user is asking you to act as a Code Composer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
