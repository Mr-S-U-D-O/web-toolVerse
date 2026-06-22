import React from 'react';
import BaseUnitConverter, { UnitOption } from './BaseUnitConverter';

const UNITS: UnitOption[] = [
  { value: 'ua', label: 'Microampere', symbol: 'µA', toBase: val => val * 1e-6, fromBase: val => val * 1e6 },
  { value: 'ma', label: 'Milliampere', symbol: 'mA', toBase: val => val * 1e-3, fromBase: val => val * 1e3 },
  { value: 'a', label: 'Ampere', symbol: 'A', toBase: val => val, fromBase: val => val },
  { value: 'ka', label: 'Kiloampere', symbol: 'kA', toBase: val => val * 1e3, fromBase: val => val * 1e-3 },
  { value: 'Ma', label: 'Megaampere', symbol: 'MA', toBase: val => val * 1e6, fromBase: val => val * 1e-6 }
];

export default function CurrentConverterTool({ onBack }: { onBack?: () => void }) {
  return (
    <BaseUnitConverter
      title="Current Converter"
      description="Convert electric current between microamperes, milliamperes, amperes, and kiloamperes."
      units={UNITS}
      defaultFrom="a"
      defaultTo="ma"
      onBack={onBack}
    />
  );
}
