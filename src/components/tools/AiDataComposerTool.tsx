import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiDataComposerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-data-composer" 
      name="Data Composer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Data Composer\".\nThe user is asking you to act as a Data Composer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
