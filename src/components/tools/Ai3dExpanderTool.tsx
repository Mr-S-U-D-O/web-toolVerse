import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function Ai3dExpanderTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-3d-expander" 
      name="3D Expander" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"3D Expander\".\nThe user is asking you to act as a 3D Expander. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
