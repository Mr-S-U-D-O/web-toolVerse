import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function Ai3dEvaluatorTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-3d-evaluator" 
      name="3D Evaluator" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"3D Evaluator\".\nThe user is asking you to act as a 3D Evaluator. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
