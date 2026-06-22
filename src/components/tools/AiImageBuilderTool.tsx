import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiImageBuilderTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-image-builder" 
      name="Image Builder" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Image Builder\".\nThe user is asking you to act as a Image Builder. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
