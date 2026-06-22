import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiImageAnalyzerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-image-analyzer" 
      name="Image Analyzer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Image Analyzer\".\nThe user is asking you to act as a Image Analyzer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
