import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiCodeEvaluatorTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-code-evaluator" 
      name="Code Evaluator" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Code Evaluator\".\nThe user is asking you to act as a Code Evaluator. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
