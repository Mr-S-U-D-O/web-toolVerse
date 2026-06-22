import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiDataGeneratorTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-data-generator" 
      name="Data Generator" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Data Generator\".\nThe user is asking you to act as a Data Generator. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
