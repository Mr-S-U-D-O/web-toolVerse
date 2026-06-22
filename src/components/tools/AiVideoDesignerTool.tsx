import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiVideoDesignerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-video-designer" 
      name="Video Designer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Video Designer\".\nThe user is asking you to act as a Video Designer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
