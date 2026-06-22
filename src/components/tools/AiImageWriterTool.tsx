import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiImageWriterTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-image-writer" 
      name="Image Writer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Image Writer\".\nThe user is asking you to act as a Image Writer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
