import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiAudioEvaluatorTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-audio-evaluator" 
      name="Audio Evaluator" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Audio Evaluator\".\nThe user is asking you to act as a Audio Evaluator. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
