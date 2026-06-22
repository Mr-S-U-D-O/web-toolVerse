import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function Ai3dComposerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-3d-composer" 
      name="3D Composer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"3D Composer\".\nThe user is asking you to act as a 3D Composer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
