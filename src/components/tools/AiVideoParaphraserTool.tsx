import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiVideoParaphraserTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-video-paraphraser" 
      name="Video Paraphraser" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Video Paraphraser\".\nThe user is asking you to act as a Video Paraphraser. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
