import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiVideoComposerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-video-composer" 
      name="Video Composer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Video Composer\".\nThe user is asking you to act as a Video Composer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
