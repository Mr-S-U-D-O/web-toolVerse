import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiVideoAnalyzerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-video-analyzer" 
      name="Video Analyzer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Video Analyzer\".\nThe user is asking you to act as a Video Analyzer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
