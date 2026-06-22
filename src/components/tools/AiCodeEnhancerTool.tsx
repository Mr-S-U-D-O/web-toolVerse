import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiCodeEnhancerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-code-enhancer" 
      name="Code Enhancer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Code Enhancer\".\nThe user is asking you to act as a Code Enhancer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
