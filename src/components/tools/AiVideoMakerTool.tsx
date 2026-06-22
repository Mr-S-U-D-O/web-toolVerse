import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiVideoMakerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-video-maker" 
      name="Video Maker" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Video Maker\".\nThe user is asking you to act as a Video Maker. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
