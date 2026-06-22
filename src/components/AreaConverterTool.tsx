import React from 'react';
import BaseUnitConverter, { UnitOption } from './BaseUnitConverter';

const UNITS: UnitOption[] = [
  { value: 'sq_mm', label: 'Square Millimeter', symbol: 'mm²', toBase: val => val * 1e-6, fromBase: val => val * 1e6 },
  { value: 'sq_cm', label: 'Square Centimeter', symbol: 'cm²', toBase: val => val * 1e-4, fromBase: val => val * 1e4 },
  { value: 'sq_m', label: 'Square Meter', symbol: 'm²', toBase: val => val, fromBase: val => val },
  { value: 'hectare', label: 'Hectare', symbol: 'ha', toBase: val => val * 10000, fromBase: val => val / 10000 },
  { value: 'sq_km', label: 'Square Kilometer', symbol: 'km²', toBase: val => val * 1e6, fromBase: val => val * 1e-6 },
  { value: 'sq_in', label: 'Square Inch', symbol: 'in²', toBase: val => val * 0.00064516, fromBase: val => val / 0.00064516 },
  { value: 'sq_ft', label: 'Square Foot', symbol: 'ft²', toBase: val => val * 0.09290304, fromBase: val => val / 0.09290304 },
  { value: 'acre', label: 'Acre', symbol: 'ac', toBase: val => val * 4046.8564224, fromBase: val => val / 4046.8564224 },
  { value: 'sq_mi', label: 'Square Mile', symbol: 'mi²', toBase: val => val * 2589988.110336, fromBase: val => val / 2589988.110336 }
];

export default function AreaConverterTool({ onBack }: { onBack?: () => void }) {
  return (
    <BaseUnitConverter
      title="Area Converter"
      description="Convert surface area metrics between metric and imperial standards (e.g. square meters, square feet, acres, hectares)."
      units={UNITS}
      defaultFrom="sq_m"
      defaultTo="sq_ft"
      onBack={onBack}
    />
  );
}
