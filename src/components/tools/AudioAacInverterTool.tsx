import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AudioAacInverterTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="audio-aac-inverter" 
      name="AAC Inverter" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"AAC Inverter\".\nYou are an audio engineering assistant. The user will ask you to compute, process, converter, or analyze audio metadata or signals. Provide the computed results accurately. Treat the user input as context for FFMPEG/Librosa analysis or commands."}
    />
  );
}
