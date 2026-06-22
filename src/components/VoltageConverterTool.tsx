import React from 'react';
import BaseUnitConverter, { UnitOption } from './BaseUnitConverter';

const UNITS: UnitOption[] = [
  { value: 'uv', label: 'Microvolt', symbol: 'µV', toBase: val => val * 1e-6, fromBase: val => val * 1e6 },
  { value: 'mv', label: 'Millivolt', symbol: 'mV', toBase: val => val * 1e-3, fromBase: val => val * 1e3 },
  { value: 'v', label: 'Volt', symbol: 'V', toBase: val => val, fromBase: val => val },
  { value: 'kv', label: 'Kilovolt', symbol: 'kV', toBase: val => val * 1e3, fromBase: val => val * 1e-3 },
  { value: 'Mv', label: 'Megavolt', symbol: 'MV', toBase: val => val * 1e6, fromBase: val => val * 1e-6 }
];

export default function VoltageConverterTool({ onBack }: { onBack?: () => void }) {
  return (
    <BaseUnitConverter
      title="Voltage Converter"
      description="Convert electric voltage/potential measurements between microvolts, millivolts, volts, and kilovolts."
      units={UNITS}
      defaultFrom="v"
      defaultTo="mv"
      onBack={onBack}
    />
  );
}
