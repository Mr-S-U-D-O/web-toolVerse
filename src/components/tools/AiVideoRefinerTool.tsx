import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiVideoRefinerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-video-refiner" 
      name="Video Refiner" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Video Refiner\".\nThe user is asking you to act as a Video Refiner. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
