import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AiDataUpscalerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="ai-data-upscaler" 
      name="Data Upscaler" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"Data Upscaler\".\nThe user is asking you to act as a Data Upscaler. Compute, format, or analyze the input text properly and return the exact output."}
    />
  );
}
