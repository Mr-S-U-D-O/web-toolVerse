import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiAudioParaphraserTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-audio-paraphraser" 
      name="Audio Paraphraser" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Audio Paraphraser\".\nThe user is asking you to act as a Audio Paraphraser. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
