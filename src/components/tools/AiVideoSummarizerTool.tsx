import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiVideoSummarizerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-video-summarizer" 
      name="Video Summarizer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Video Summarizer\".\nThe user is asking you to act as a Video Summarizer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
