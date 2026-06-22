import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiAudioWriterTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-audio-writer" 
      name="Audio Writer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Audio Writer\".\nThe user is asking you to act as a Audio Writer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
