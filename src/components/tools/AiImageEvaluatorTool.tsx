import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiImageEvaluatorTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-image-evaluator" 
      name="Image Evaluator" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Image Evaluator\".\nThe user is asking you to act as a Image Evaluator. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
