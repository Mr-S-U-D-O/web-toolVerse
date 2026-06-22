import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function Ai3dImproverTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-3d-improver" 
      name="3D Improver" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"3D Improver\".\nThe user is asking you to act as a 3D Improver. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
