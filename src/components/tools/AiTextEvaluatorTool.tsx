import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiTextEvaluatorTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-text-evaluator" 
      name="Text Evaluator" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Text Evaluator\".\nThe user is asking you to act as a Text Evaluator. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
