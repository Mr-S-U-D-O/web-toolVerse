import React from 'react';
import BaseUnitConverter, { UnitOption } from './BaseUnitConverter';

const UNITS: UnitOption[] = [
  { value: 'mw', label: 'Milliwatt', symbol: 'mW', toBase: val => val * 1e-3, fromBase: val => val * 1e3 },
  { value: 'w', label: 'Watt', symbol: 'W', toBase: val => val, fromBase: val => val },
  { value: 'kw', label: 'Kilowatt', symbol: 'kW', toBase: val => val * 1000, fromBase: val => val / 1000 },
  { value: 'Mw', label: 'Megawatt', symbol: 'MW', toBase: val => val * 1e6, fromBase: val => val * 1e-6 },
  { value: 'hp', label: 'Horsepower (Mechanical)', symbol: 'hp', toBase: val => val * 745.699872, fromBase: val => val / 745.699872 },
  { value: 'btu_h', label: 'BTU per hour', symbol: 'BTU/h', toBase: val => val * 0.29307107, fromBase: val => val / 0.29307107 }
];

export default function PowerConverterTool({ onBack }: { onBack?: () => void }) {
  return (
    <BaseUnitConverter
      title="Power Converter"
      description="Convert electric and mechanical power between watts, kilowatts, megawatts, horsepower, and BTU/hour."
      units={UNITS}
      defaultFrom="kw"
      defaultTo="hp"
      onBack={onBack}
    />
  );
}
