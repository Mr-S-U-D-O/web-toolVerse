import React from 'react';
import BaseEncodingConverter from './BaseEncodingConverter';

export default function BinaryToTextTool({ onBack }: { onBack?: () => void }) {
  return <BaseEncodingConverter fromType="binary" toType="text" onBack={onBack} />;
}
