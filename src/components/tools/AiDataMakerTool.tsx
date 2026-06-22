import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiDataMakerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-data-maker" 
      name="Data Maker" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Data Maker\".\nThe user is asking you to act as a Data Maker. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
