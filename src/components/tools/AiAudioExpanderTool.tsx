import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiAudioExpanderTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-audio-expander" 
      name="Audio Expander" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Audio Expander\".\nThe user is asking you to act as a Audio Expander. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
