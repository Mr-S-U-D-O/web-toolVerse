import React from 'react';
import BaseUnitConverter, { UnitOption } from './BaseUnitConverter';

const UNITS: UnitOption[] = [
  { value: 'j', label: 'Joule', symbol: 'J', toBase: val => val, fromBase: val => val },
  { value: 'kj', label: 'Kilojoule', symbol: 'kJ', toBase: val => val * 1000, fromBase: val => val / 1000 },
  { value: 'mj', label: 'Megajoule', symbol: 'MJ', toBase: val => val * 1e6, fromBase: val => val * 1e-6 },
  { value: 'cal', label: 'Calorie', symbol: 'cal', toBase: val => val * 4.184, fromBase: val => val / 4.184 },
  { value: 'kcal', label: 'Kilocalorie', symbol: 'kcal', toBase: val => val * 4184, fromBase: val => val / 4184 },
  { value: 'wh', label: 'Watt-hour', symbol: 'Wh', toBase: val => val * 3600, fromBase: val => val / 3600 },
  { value: 'kwh', label: 'Kilowatt-hour', symbol: 'kWh', toBase: val => val * 3.6e6, fromBase: val => val / 3.6e6 },
  { value: 'btu', label: 'BTU', symbol: 'BTU', toBase: val => val * 1055.05585, fromBase: val => val / 1055.05585 },
  { value: 'ev', label: 'Electronvolt', symbol: 'eV', toBase: val => val * 1.602176634e-19, fromBase: val => val / 1.602176634e-19 }
];

export default function EnergyConverterTool({ onBack }: { onBack?: () => void }) {
  return (
    <BaseUnitConverter
      title="Energy Converter"
      description="Convert energy units including Joules, calories, BTUs, watt-hours, and kilowatt-hours (kWh) offline."
      units={UNITS}
      defaultFrom="j"
      defaultTo="kwh"
      onBack={onBack}
    />
  );
}
