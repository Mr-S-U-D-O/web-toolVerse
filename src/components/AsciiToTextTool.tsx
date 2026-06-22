import React from 'react';
import BaseEncodingConverter from './BaseEncodingConverter';

export default function AsciiToTextTool({ onBack }: { onBack?: () => void }) {
  return <BaseEncodingConverter fromType="ascii" toType="text" onBack={onBack} />;
}
