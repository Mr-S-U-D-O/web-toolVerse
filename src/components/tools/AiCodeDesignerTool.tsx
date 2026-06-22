import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiCodeDesignerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-code-designer" 
      name="Code Designer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Code Designer\".\nThe user is asking you to act as a Code Designer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
