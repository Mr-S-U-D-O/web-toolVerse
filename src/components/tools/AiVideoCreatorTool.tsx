import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiVideoCreatorTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-video-creator" 
      name="Video Creator" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Video Creator\".\nThe user is asking you to act as a Video Creator. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
