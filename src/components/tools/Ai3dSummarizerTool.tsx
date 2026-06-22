import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function Ai3dSummarizerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-3d-summarizer" 
      name="3D Summarizer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"3D Summarizer\".\nThe user is asking you to act as a 3D Summarizer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
