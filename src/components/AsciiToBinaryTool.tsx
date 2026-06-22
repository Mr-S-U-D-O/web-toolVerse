import React from 'react';
import BaseEncodingConverter from './BaseEncodingConverter';

export default function AsciiToBinaryTool({ onBack }: { onBack?: () => void }) {
  return <BaseEncodingConverter fromType="ascii" toType="binary" onBack={onBack} />;
}
