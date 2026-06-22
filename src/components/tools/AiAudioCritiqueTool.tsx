import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiAudioCritiqueTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-audio-critique" 
      name="Audio Critique" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Audio Critique\".\nThe user is asking you to act as a Audio Critique. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
