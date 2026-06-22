import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiCodeTranslatorTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-code-translator" 
      name="Code Translator" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Code Translator\".\nThe user is asking you to act as a Code Translator. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
