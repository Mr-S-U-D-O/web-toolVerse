import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function Ai3dRefinerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-3d-refiner" 
      name="3D Refiner" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"3D Refiner\".\nThe user is asking you to act as a 3D Refiner. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
