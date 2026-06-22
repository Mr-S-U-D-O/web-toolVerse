import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiVideoEditorTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-video-editor" 
      name="Video Editor" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Video Editor\".\nThe user is asking you to act as a Video Editor. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
