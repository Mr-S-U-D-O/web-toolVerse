import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiAudioReviewerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-audio-reviewer" 
      name="Audio Reviewer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Audio Reviewer\".\nThe user is asking you to act as a Audio Reviewer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
