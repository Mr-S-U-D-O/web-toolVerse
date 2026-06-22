import React from 'react';
import BaseEncodingConverter from './BaseEncodingConverter';

export default function HexToTextTool({ onBack }: { onBack?: () => void }) {
  return <BaseEncodingConverter fromType="hex" toType="text" onBack={onBack} />;
}
