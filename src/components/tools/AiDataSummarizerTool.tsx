import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiDataSummarizerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-data-summarizer" 
      name="Data Summarizer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Data Summarizer\".\nThe user is asking you to act as a Data Summarizer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
