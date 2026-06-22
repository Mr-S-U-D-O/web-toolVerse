import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function Ai3dBuilderTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-3d-builder" 
      name="3D Builder" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"3D Builder\".\nThe user is asking you to act as a 3D Builder. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
