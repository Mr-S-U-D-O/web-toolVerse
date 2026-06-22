import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiTextDesignerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-text-designer" 
      name="Text Designer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Text Designer\".\nThe user is asking you to act as a Text Designer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
