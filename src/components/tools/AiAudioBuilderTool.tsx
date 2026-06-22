import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiAudioBuilderTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-audio-builder" 
      name="Audio Builder" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Audio Builder\".\nThe user is asking you to act as a Audio Builder. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
