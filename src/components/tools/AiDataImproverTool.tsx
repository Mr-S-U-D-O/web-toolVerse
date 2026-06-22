import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiDataImproverTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-data-improver" 
      name="Data Improver" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Data Improver\".\nThe user is asking you to act as a Data Improver. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
