import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiImageComposerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-image-composer" 
      name="Image Composer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Image Composer\".\nThe user is asking you to act as a Image Composer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
