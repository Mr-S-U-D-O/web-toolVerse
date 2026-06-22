import React from 'react';
import BaseEncodingConverter from './BaseEncodingConverter';

export default function TextToAsciiTool({ onBack }: { onBack?: () => void }) {
  return <BaseEncodingConverter fromType="text" toType="ascii" onBack={onBack} />;
}
