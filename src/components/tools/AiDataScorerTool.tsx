import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiDataScorerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-data-scorer" 
      name="Data Scorer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Data Scorer\".\nThe user is asking you to act as a Data Scorer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
