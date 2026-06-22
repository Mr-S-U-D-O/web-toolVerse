import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiTextParaphraserTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-text-paraphraser" 
      name="Text Paraphraser" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Text Paraphraser\".\nThe user is asking you to act as a Text Paraphraser. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
