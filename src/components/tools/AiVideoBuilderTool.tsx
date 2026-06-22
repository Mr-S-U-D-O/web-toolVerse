import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiVideoBuilderTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-video-builder" 
      name="Video Builder" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Video Builder\".\nThe user is asking you to act as a Video Builder. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
