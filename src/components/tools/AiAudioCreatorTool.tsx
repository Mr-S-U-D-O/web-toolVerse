import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiAudioCreatorTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-audio-creator" 
      name="Audio Creator" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Audio Creator\".\nThe user is asking you to act as a Audio Creator. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
