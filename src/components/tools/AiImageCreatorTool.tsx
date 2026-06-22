import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiImageCreatorTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-image-creator" 
      name="Image Creator" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Image Creator\".\nThe user is asking you to act as a Image Creator. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
