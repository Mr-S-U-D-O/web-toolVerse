import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiVideoScorerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-video-scorer" 
      name="Video Scorer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Video Scorer\".\nThe user is asking you to act as a Video Scorer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
