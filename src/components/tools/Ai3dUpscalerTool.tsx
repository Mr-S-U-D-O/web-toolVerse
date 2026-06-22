import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function Ai3dUpscalerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-3d-upscaler" 
      name="3D Upscaler" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"3D Upscaler\".\nThe user is asking you to act as a 3D Upscaler. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
