import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function Ai3dReviewerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-3d-reviewer" 
      name="3D Reviewer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"3D Reviewer\".\nThe user is asking you to act as a 3D Reviewer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
