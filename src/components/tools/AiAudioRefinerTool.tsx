import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiAudioRefinerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-audio-refiner" 
      name="Audio Refiner" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Audio Refiner\".\nThe user is asking you to act as a Audio Refiner. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
