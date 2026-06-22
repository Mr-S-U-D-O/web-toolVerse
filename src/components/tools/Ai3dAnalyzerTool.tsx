import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function Ai3dAnalyzerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-3d-analyzer" 
      name="3D Analyzer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"3D Analyzer\".\nThe user is asking you to act as a 3D Analyzer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
