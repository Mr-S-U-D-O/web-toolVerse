import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function AudioAacBpmTool({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="audio-aac-bpm" 
      name="AAC BPM" 
      onBack={onBack} 
      systemPrompt={"You are an advanced software tool named \"AAC BPM\".\nYou are an audio engineering assistant. The user will ask you to compute, process, converter, or analyze audio metadata or signals. Provide the computed results accurately. Treat the user input as context for FFMPEG/Librosa analysis or commands."}
    />
  );
}
