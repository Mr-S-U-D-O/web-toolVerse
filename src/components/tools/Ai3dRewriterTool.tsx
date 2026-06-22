import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function Ai3dRewriterTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-3d-rewriter" 
      name="3D Rewriter" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"3D Rewriter\".\nThe user is asking you to act as a 3D Rewriter. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
