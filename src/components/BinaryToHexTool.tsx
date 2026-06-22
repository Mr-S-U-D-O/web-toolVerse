import React from 'react';
import BaseEncodingConverter from './BaseEncodingConverter';

export default function BinaryToHexTool({ onBack }: { onBack?: () => void }) {
  return <BaseEncodingConverter fromType="binary" toType="hex" onBack={onBack} />;
}
