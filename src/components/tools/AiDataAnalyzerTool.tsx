import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiDataAnalyzerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-data-analyzer" 
      name="Data Analyzer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Data Analyzer\".\nThe user is asking you to act as a Data Analyzer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
