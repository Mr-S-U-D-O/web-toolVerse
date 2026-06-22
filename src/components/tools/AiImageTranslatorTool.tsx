import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiImageTranslatorTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-image-translator" 
      name="Image Translator" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Image Translator\".\nThe user is asking you to act as a Image Translator. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
