import React from 'react';
import BaseEncodingConverter from './BaseEncodingConverter';

export default function BinaryToDecimalTool({ onBack }: { onBack?: () => void }) {
  return <BaseEncodingConverter fromType="binary" toType="decimal" onBack={onBack} />;
}
