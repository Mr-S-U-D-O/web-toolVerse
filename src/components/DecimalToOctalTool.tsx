import React from 'react';
import BaseEncodingConverter from './BaseEncodingConverter';

export default function DecimalToOctalTool({ onBack }: { onBack?: () => void }) {
  return <BaseEncodingConverter fromType="decimal" toType="octal" onBack={onBack} />;
}
