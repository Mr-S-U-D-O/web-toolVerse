import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiVideoGeneratorTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-video-generator" 
      name="Video Generator" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Video Generator\".\nThe user is asking you to act as a Video Generator. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
