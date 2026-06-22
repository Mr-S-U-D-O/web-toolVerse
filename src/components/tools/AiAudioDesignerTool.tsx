import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiAudioDesignerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-audio-designer" 
      name="Audio Designer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Audio Designer\".\nThe user is asking you to act as a Audio Designer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
