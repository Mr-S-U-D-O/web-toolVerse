import React from 'react';
import BaseEncodingConverter from './BaseEncodingConverter';

export default function HexToOctalTool({ onBack }: { onBack?: () => void }) {
  return <BaseEncodingConverter fromType="hex" toType="octal" onBack={onBack} />;
}
