import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function Ai3dCritiqueTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-3d-critique" 
      name="3D Critique" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"3D Critique\".\nThe user is asking you to act as a 3D Critique. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
