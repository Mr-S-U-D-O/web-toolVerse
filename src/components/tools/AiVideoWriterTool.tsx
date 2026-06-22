import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiVideoWriterTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-video-writer" 
      name="Video Writer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Video Writer\".\nThe user is asking you to act as a Video Writer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
