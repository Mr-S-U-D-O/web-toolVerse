import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function Ai3dWriterTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-3d-writer" 
      name="3D Writer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"3D Writer\".\nThe user is asking you to act as a 3D Writer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
