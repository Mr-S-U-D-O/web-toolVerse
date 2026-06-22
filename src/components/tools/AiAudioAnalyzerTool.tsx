import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiAudioAnalyzerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-audio-analyzer" 
      name="Audio Analyzer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Audio Analyzer\".\nThe user is asking you to act as a Audio Analyzer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
