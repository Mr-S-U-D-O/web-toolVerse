import React from 'react';
import BaseUnitConverter, { UnitOption } from './BaseUnitConverter';

const UNITS: UnitOption[] = [
  { value: 'c', label: 'Coulomb', symbol: 'C', toBase: val => val, fromBase: val => val },
  { value: 'mc', label: 'Millicoulomb', symbol: 'mC', toBase: val => val * 1e-3, fromBase: val => val * 1e3 },
  { value: 'uc', label: 'Microcoulomb', symbol: 'µC', toBase: val => val * 1e-6, fromBase: val => val * 1e6 },
  { value: 'nc', label: 'Nanocoulomb', symbol: 'nC', toBase: val => val * 1e-9, fromBase: val => val * 1e9 },
  { value: 'ah', label: 'Ampere-hour', symbol: 'Ah', toBase: val => val * 3600, fromBase: val => val / 3600 },
  { value: 'mah', label: 'Milliampere-hour', symbol: 'mAh', toBase: val => val * 3.6, fromBase: val => val / 3.6 },
  { value: 'faraday', label: 'Faraday', symbol: 'F', toBase: val => val * 96485.33212, fromBase: val => val / 96485.33212 }
];

export default function ChargeConverterTool({ onBack }: { onBack?: () => void }) {
  return (
    <BaseUnitConverter
      title="Charge Converter"
      description="Convert electric charge metrics between coulombs, ampere-hours, milliampere-hours (battery capacity), and faradays."
      units={UNITS}
      defaultFrom="c"
      defaultTo="mah"
      onBack={onBack}
    />
  );
}
