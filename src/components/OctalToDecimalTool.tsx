import React from 'react';
import BaseEncodingConverter from './BaseEncodingConverter';

export default function OctalToDecimalTool({ onBack }: { onBack?: () => void }) {
  return <BaseEncodingConverter fromType="octal" toType="decimal" onBack={onBack} />;
}
