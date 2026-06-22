import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function Ai3dDesignerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-3d-designer" 
      name="3D Designer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"3D Designer\".\nThe user is asking you to act as a 3D Designer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
