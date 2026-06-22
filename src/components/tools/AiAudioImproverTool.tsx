import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiAudioImproverTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-audio-improver" 
      name="Audio Improver" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Audio Improver\".\nThe user is asking you to act as a Audio Improver. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
