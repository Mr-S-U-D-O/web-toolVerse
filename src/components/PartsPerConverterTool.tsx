import React from 'react';
import BaseUnitConverter, { UnitOption } from './BaseUnitConverter';

const UNITS: UnitOption[] = [
  { value: 'pct', label: 'Percent', symbol: '%', toBase: val => val, fromBase: val => val },
  { value: 'pm', label: 'Permille', symbol: '‰', toBase: val => val / 10, fromBase: val => val * 10 },
  { value: 'ppm', label: 'Parts per million', symbol: 'ppm', toBase: val => val / 10000, fromBase: val => val * 10000 },
  { value: 'ppb', label: 'Parts per billion', symbol: 'ppb', toBase: val => val / 10000000, fromBase: val => val * 10000000 },
  { value: 'ppt', label: 'Parts per trillion', symbol: 'ppt', toBase: val => val / 10000000000, fromBase: val => val * 10000000000 }
];

export default function PartsPerConverterTool({ onBack }: { onBack?: () => void }) {
  return (
    <BaseUnitConverter
      title="Parts Per Converter"
      description="Convert fractional parts and concentrations between percent (%), permille (‰), parts per million (ppm), and parts per billion (ppb)."
      units={UNITS}
      defaultFrom="pct"
      defaultTo="ppm"
      onBack={onBack}
    />
  );
}
