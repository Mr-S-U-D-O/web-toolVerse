import React from 'react';
import BaseEncodingConverter from './BaseEncodingConverter';

export default function TextToHexTool({ onBack }: { onBack?: () => void }) {
  return <BaseEncodingConverter fromType="text" toType="hex" onBack={onBack} />;
}
