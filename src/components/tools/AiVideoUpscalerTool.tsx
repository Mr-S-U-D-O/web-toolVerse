import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiVideoUpscalerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-video-upscaler" 
      name="Video Upscaler" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Video Upscaler\".\nThe user is asking you to act as a Video Upscaler. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
