import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiImageExpanderTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-image-expander" 
      name="Image Expander" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Image Expander\".\nThe user is asking you to act as a Image Expander. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
