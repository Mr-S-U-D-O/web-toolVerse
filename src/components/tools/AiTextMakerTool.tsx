import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiTextMakerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-text-maker" 
      name="Text Maker" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Text Maker\".\nThe user is asking you to act as a Text Maker. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
