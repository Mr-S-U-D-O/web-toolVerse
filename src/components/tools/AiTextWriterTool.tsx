import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiTextWriterTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-text-writer" 
      name="Text Writer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Text Writer\".\nThe user is asking you to act as a Text Writer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
