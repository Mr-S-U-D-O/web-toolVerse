import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiDataCreatorTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-data-creator" 
      name="Data Creator" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Data Creator\".\nThe user is asking you to act as a Data Creator. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
