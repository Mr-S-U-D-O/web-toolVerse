import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiDataRefinerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-data-refiner" 
      name="Data Refiner" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Data Refiner\".\nThe user is asking you to act as a Data Refiner. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
