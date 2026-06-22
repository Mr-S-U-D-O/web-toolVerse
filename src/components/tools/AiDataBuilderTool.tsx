import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiDataBuilderTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-data-builder" 
      name="Data Builder" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Data Builder\".\nThe user is asking you to act as a Data Builder. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
