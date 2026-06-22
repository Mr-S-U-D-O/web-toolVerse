import React from 'react';
import BaseUnitConverter, { UnitOption } from './BaseUnitConverter';

const UNITS: UnitOption[] = [
  { value: 'var', label: 'Volt-Ampere Reactive', symbol: 'VAR', toBase: val => val, fromBase: val => val },
  { value: 'kvar', label: 'Kilovolt-Ampere Reactive', symbol: 'kVAR', toBase: val => val * 1000, fromBase: val => val / 1000 },
  { value: 'mvar', label: 'Megavolt-Ampere Reactive', symbol: 'MVAR', toBase: val => val * 1e6, fromBase: val => val * 1e-6 }
];

export default function ReactivePowerConverterTool({ onBack }: { onBack?: () => void }) {
  return (
    <BaseUnitConverter
      title="Reactive Power Converter"
      description="Convert reactive power measurements in AC electrical systems between VAR, kVAR, and MVAR."
      units={UNITS}
      defaultFrom="var"
      defaultTo="kvar"
      onBack={onBack}
    />
  );
}
