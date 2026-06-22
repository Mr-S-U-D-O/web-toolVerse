import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiTextComposerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-text-composer" 
      name="Text Composer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Text Composer\".\nThe user is asking you to act as a Text Composer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
