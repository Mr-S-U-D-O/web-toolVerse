import React from 'react';
import BaseEncodingConverter from './BaseEncodingConverter';

export default function OctalToTextTool({ onBack }: { onBack?: () => void }) {
  return <BaseEncodingConverter fromType="octal" toType="text" onBack={onBack} />;
}
