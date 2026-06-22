import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiTextTranslatorTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-text-translator" 
      name="Text Translator" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Text Translator\".\nThe user is asking you to act as a Text Translator. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
