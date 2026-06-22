import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AudioAacEqualizerTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="audio-aac-equalizer" 
      name="AAC Equalizer" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"AAC Equalizer\".\nYou are an audio engineering assistant. The user will ask you to compute, process, converter, or analyze audio metadata or signals. Provide the computed results accurately. Treat the user input as context for FFMPEG/Librosa analysis or commands."}
    />
  );
}
