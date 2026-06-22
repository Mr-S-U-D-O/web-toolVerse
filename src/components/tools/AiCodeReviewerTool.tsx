import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiCodeReviewerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-code-reviewer" 
      name="Code Reviewer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Code Reviewer\".\nThe user is asking you to act as a Code Reviewer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
