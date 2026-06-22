import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiImageEditorTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-image-editor" 
      name="Image Editor" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Image Editor\".\nThe user is asking you to act as a Image Editor. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
