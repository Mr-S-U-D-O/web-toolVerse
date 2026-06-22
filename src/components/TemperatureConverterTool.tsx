import React from 'react';
import BaseUnitConverter, { UnitOption } from './BaseUnitConverter';

const UNITS: UnitOption[] = [
  { value: 'C', label: 'Celsius', symbol: '°C', toBase: val => val, fromBase: val => val },
  { value: 'F', label: 'Fahrenheit', symbol: '°F', toBase: val => (val - 32) * 5 / 9, fromBase: val => (val * 9 / 5) + 32 },
  { value: 'K', label: 'Kelvin', symbol: 'K', toBase: val => val - 273.15, fromBase: val => val + 273.15 }
];

export default function TemperatureConverterTool({ onBack }: { onBack?: () => void }) {
  return (
    <BaseUnitConverter
      title="Temperature Converter"
      description="Convert temperatures between Celsius, Fahrenheit, and Kelvin scales."
      units={UNITS}
      defaultFrom="C"
      defaultTo="F"
      onBack={onBack}
    />
  );
}
