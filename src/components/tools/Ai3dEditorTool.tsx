import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function Ai3dEditorTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-3d-editor" 
      name="3D Editor" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"3D Editor\".\nThe user is asking you to act as a 3D Editor. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
