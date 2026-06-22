import React from 'react';
import BaseEncodingConverter from './BaseEncodingConverter';

export default function OctalToBinaryTool({ onBack }: { onBack?: () => void }) {
  return <BaseEncodingConverter fromType="octal" toType="binary" onBack={onBack} />;
}
