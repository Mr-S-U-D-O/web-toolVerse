import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiAudioSummarizerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-audio-summarizer" 
      name="Audio Summarizer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Audio Summarizer\".\nThe user is asking you to act as a Audio Summarizer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
