import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiCodeEditorTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-code-editor" 
      name="Code Editor" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Code Editor\".\nThe user is asking you to act as a Code Editor. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
