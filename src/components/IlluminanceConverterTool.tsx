import React from 'react';
import BaseUnitConverter, { UnitOption } from './BaseUnitConverter';

const UNITS: UnitOption[] = [
  { value: 'lx', label: 'Lux', symbol: 'lx', toBase: val => val, fromBase: val => val },
  { value: 'fc', label: 'Foot-candle', symbol: 'fc', toBase: val => val * 10.7639104, fromBase: val => val / 10.7639104 },
  { value: 'ph', label: 'Phot', symbol: 'ph', toBase: val => val * 10000, fromBase: val => val / 10000 }
];

export default function IlluminanceConverterTool({ onBack }: { onBack?: () => void }) {
  return (
    <BaseUnitConverter
      title="Illuminance Converter"
      description="Convert light levels and luminous flux density between lux, foot-candles, and phot."
      units={UNITS}
      defaultFrom="lx"
      defaultTo="fc"
      onBack={onBack}
    />
  );
}
