import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiTextReviewerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-text-reviewer" 
      name="Text Reviewer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Text Reviewer\".\nThe user is asking you to act as a Text Reviewer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
