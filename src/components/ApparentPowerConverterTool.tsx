import React from 'react';
import BaseUnitConverter, { UnitOption } from './BaseUnitConverter';

const UNITS: UnitOption[] = [
  { value: 'va', label: 'Volt-Ampere', symbol: 'VA', toBase: val => val, fromBase: val => val },
  { value: 'kva', label: 'Kilovolt-Ampere', symbol: 'kVA', toBase: val => val * 1000, fromBase: val => val / 1000 },
  { value: 'mva', label: 'Megavolt-Ampere', symbol: 'MVA', toBase: val => val * 1e6, fromBase: val => val * 1e-6 }
];

export default function ApparentPowerConverterTool({ onBack }: { onBack?: () => void }) {
  return (
    <BaseUnitConverter
      title="Apparent Power Converter"
      description="Convert apparent electrical load between Volt-Amperes (VA), kVA, and MVA."
      units={UNITS}
      defaultFrom="va"
      defaultTo="kva"
      onBack={onBack}
    />
  );
}
