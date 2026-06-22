import React from 'react';
import BaseUnitConverter, { UnitOption } from './BaseUnitConverter';

const UNITS: UnitOption[] = [
  { value: 'mm', label: 'Millimeter', symbol: 'mm', toBase: val => val / 1000, fromBase: val => val * 1000 },
  { value: 'cm', label: 'Centimeter', symbol: 'cm', toBase: val => val / 100, fromBase: val => val * 100 },
  { value: 'm', label: 'Meter', symbol: 'm', toBase: val => val, fromBase: val => val },
  { value: 'km', label: 'Kilometer', symbol: 'km', toBase: val => val * 1000, fromBase: val => val / 1000 },
  { value: 'in', label: 'Inch', symbol: 'in', toBase: val => val * 0.0254, fromBase: val => val / 0.0254 },
  { value: 'ft', label: 'Foot', symbol: 'ft', toBase: val => val * 0.3048, fromBase: val => val / 0.3048 },
  { value: 'yd', label: 'Yard', symbol: 'yd', toBase: val => val * 0.9144, fromBase: val => val / 0.9144 },
  { value: 'mi', label: 'Mile', symbol: 'mi', toBase: val => val * 1609.344, fromBase: val => val / 1609.344 }
];

export default function LengthConverterTool({ onBack }: { onBack?: () => void }) {
  return (
    <BaseUnitConverter
      title="Length Converter"
      description="Convert between metric and imperial lengths, heights, and distances instantly. Runs 100% offline."
      units={UNITS}
      defaultFrom="m"
      defaultTo="in"
      onBack={onBack}
    />
  );
}
