import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiVideoTranslatorTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-video-translator" 
      name="Video Translator" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Video Translator\".\nThe user is asking you to act as a Video Translator. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
