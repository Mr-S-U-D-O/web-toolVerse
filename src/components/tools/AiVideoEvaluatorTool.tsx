import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiVideoEvaluatorTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-video-evaluator" 
      name="Video Evaluator" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Video Evaluator\".\nThe user is asking you to act as a Video Evaluator. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
