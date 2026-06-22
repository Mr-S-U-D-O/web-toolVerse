import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiDataCritiqueTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-data-critique" 
      name="Data Critique" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Data Critique\".\nThe user is asking you to act as a Data Critique. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
