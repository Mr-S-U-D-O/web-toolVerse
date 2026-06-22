import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function Ai3dScorerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-3d-scorer" 
      name="3D Scorer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"3D Scorer\".\nThe user is asking you to act as a 3D Scorer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
