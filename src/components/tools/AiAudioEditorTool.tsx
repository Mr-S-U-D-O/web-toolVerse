import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiAudioEditorTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-audio-editor" 
      name="Audio Editor" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Audio Editor\".\nThe user is asking you to act as a Audio Editor. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
