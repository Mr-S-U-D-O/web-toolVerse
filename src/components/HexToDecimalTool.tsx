import React from 'react';
import BaseEncodingConverter from './BaseEncodingConverter';

export default function HexToDecimalTool({ onBack }: { onBack?: () => void }) {
  return <BaseEncodingConverter fromType="hex" toType="decimal" onBack={onBack} />;
}
