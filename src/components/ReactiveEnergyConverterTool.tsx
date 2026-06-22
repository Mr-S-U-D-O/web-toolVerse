import React from 'react';
import BaseUnitConverter, { UnitOption } from './BaseUnitConverter';

const UNITS: UnitOption[] = [
  { value: 'varh', label: 'Volt-Ampere Reactive Hour', symbol: 'VARh', toBase: val => val, fromBase: val => val },
  { value: 'kvarh', label: 'Kilovolt-Ampere Reactive Hour', symbol: 'kVARh', toBase: val => val * 1000, fromBase: val => val / 1000 },
  { value: 'mvarh', label: 'Megavolt-Ampere Reactive Hour', symbol: 'MVARh', toBase: val => val * 1e6, fromBase: val => val * 1e-6 }
];

export default function ReactiveEnergyConverterTool({ onBack }: { onBack?: () => void }) {
  return (
    <BaseUnitConverter
      title="Reactive Energy Converter"
      description="Convert reactive energy accumulation in power networks between VARh, kVARh, and MVARh."
      units={UNITS}
      defaultFrom="varh"
      defaultTo="kvarh"
      onBack={onBack}
    />
  );
}
