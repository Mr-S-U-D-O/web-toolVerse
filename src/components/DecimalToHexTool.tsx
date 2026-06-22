import React from 'react';
import BaseEncodingConverter from './BaseEncodingConverter';

export default function DecimalToHexTool({ onBack }: { onBack?: () => void }) {
  return <BaseEncodingConverter fromType="decimal" toType="hex" onBack={onBack} />;
}
