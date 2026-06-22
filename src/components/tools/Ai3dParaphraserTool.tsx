import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function Ai3dParaphraserTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-3d-paraphraser" 
      name="3D Paraphraser" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"3D Paraphraser\".\nThe user is asking you to act as a 3D Paraphraser. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
