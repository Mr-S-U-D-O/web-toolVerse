import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiAudioTranslatorTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-audio-translator" 
      name="Audio Translator" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Audio Translator\".\nThe user is asking you to act as a Audio Translator. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
