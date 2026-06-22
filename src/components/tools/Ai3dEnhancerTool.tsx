import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function Ai3dEnhancerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-3d-enhancer" 
      name="3D Enhancer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"3D Enhancer\".\nThe user is asking you to act as a 3D Enhancer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
