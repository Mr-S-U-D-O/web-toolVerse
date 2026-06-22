import React from 'react';
import BaseEncodingConverter from './BaseEncodingConverter';

export default function DecimalToBinaryTool({ onBack }: { onBack?: () => void }) {
  return <BaseEncodingConverter fromType="decimal" toType="binary" onBack={onBack} />;
}
