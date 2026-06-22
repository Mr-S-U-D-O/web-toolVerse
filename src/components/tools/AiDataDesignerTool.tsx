import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiDataDesignerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-data-designer" 
      name="Data Designer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Data Designer\".\nThe user is asking you to act as a Data Designer. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
