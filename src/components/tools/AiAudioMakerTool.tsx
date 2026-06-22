import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiAudioMakerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-audio-maker" 
      name="Audio Maker" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Audio Maker\".\nThe user is asking you to act as a Audio Maker. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
