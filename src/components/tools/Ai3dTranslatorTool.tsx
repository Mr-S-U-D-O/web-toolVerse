import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function Ai3dTranslatorTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-3d-translator" 
      name="3D Translator" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"3D Translator\".\nThe user is asking you to act as a 3D Translator. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
