import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiTextEnhancerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-text-enhancer" 
      name="Text Enhancer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Text Enhancer\".\nThe user is asking you to act as a Text Enhancer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
