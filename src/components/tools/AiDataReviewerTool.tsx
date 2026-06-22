import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiDataReviewerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-data-reviewer" 
      name="Data Reviewer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Data Reviewer\".\nThe user is asking you to act as a Data Reviewer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
