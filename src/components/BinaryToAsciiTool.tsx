import React from 'react';
import BaseEncodingConverter from './BaseEncodingConverter';

export default function BinaryToAsciiTool({ onBack }: { onBack?: () => void }) {
  return <BaseEncodingConverter fromType="binary" toType="ascii" onBack={onBack} />;
}
