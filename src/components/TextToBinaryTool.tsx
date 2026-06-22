import React from 'react';
import BaseEncodingConverter from './BaseEncodingConverter';

export default function TextToBinaryTool({ onBack }: { onBack?: () => void }) {
  return <BaseEncodingConverter fromType="text" toType="binary" onBack={onBack} />;
}
