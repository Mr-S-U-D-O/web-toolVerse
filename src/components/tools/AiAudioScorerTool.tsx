import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiAudioScorerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-audio-scorer" 
      name="Audio Scorer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Audio Scorer\".\nThe user is asking you to act as a Audio Scorer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
