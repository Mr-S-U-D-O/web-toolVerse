import React from 'react';
import BaseEncodingConverter from './BaseEncodingConverter';

export default function TextToDecimalTool({ onBack }: { onBack?: () => void }) {
  return <BaseEncodingConverter fromType="text" toType="decimal" onBack={onBack} />;
}
