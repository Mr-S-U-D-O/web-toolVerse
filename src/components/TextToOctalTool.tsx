import React from 'react';
import BaseEncodingConverter from './BaseEncodingConverter';

export default function TextToOctalTool({ onBack }: { onBack?: () => void }) {
  return <BaseEncodingConverter fromType="text" toType="octal" onBack={onBack} />;
}
