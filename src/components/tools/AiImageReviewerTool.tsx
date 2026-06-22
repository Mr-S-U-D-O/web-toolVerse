import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiImageReviewerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-image-reviewer" 
      name="Image Reviewer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Image Reviewer\".\nThe user is asking you to act as a Image Reviewer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
