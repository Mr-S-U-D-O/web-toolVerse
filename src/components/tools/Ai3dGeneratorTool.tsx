import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function Ai3dGeneratorTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-3d-generator" 
      name="3D Generator" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"3D Generator\".\nThe user is asking you to act as a 3D Generator. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
