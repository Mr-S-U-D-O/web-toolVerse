import React from 'react';
import BaseEncodingConverter from './BaseEncodingConverter';

export default function BinaryToOctalTool({ onBack }: { onBack?: () => void }) {
  return <BaseEncodingConverter fromType="binary" toType="octal" onBack={onBack} />;
}
