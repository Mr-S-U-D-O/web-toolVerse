import React from 'react';
import BaseEncodingConverter from './BaseEncodingConverter';

export default function OctalToHexTool({ onBack }: { onBack?: () => void }) {
  return <BaseEncodingConverter fromType="octal" toType="hex" onBack={onBack} />;
}
