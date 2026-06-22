import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiAudioRewriterTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-audio-rewriter" 
      name="Audio Rewriter" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Audio Rewriter\".\nThe user is asking you to act as a Audio Rewriter. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
