import React from 'react';
import BaseEncodingConverter from './BaseEncodingConverter';

export default function HexToBinaryTool({ onBack }: { onBack?: () => void }) {
  return <BaseEncodingConverter fromType="hex" toType="binary" onBack={onBack} />;
}
