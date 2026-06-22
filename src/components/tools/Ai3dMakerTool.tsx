import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function Ai3dMakerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-3d-maker" 
      name="3D Maker" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"3D Maker\".\nThe user is asking you to act as a 3D Maker. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
