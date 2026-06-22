import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiDataEvaluatorTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-data-evaluator" 
      name="Data Evaluator" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Data Evaluator\".\nThe user is asking you to act as a Data Evaluator. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
