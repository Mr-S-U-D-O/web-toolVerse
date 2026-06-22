import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiAudioGeneratorTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-audio-generator" 
      name="Audio Generator" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Audio Generator\".\nThe user is asking you to act as a Audio Generator. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
