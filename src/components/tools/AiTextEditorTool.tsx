import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiTextEditorTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-text-editor" 
      name="Text Editor" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Text Editor\".\nThe user is asking you to act as a Text Editor. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
