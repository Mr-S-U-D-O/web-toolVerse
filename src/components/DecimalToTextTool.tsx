import React from 'react';
import BaseEncodingConverter from './BaseEncodingConverter';

export default function DecimalToTextTool({ onBack }: { onBack?: () => void }) {
  return <BaseEncodingConverter fromType="decimal" toType="text" onBack={onBack} />;
}
