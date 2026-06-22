import React from 'react';
import BaseUnitConverter, { UnitOption } from './BaseUnitConverter';

const UNITS: UnitOption[] = [
  { value: 'pa', label: 'Pascal', symbol: 'Pa', toBase: val => val, fromBase: val => val },
  { value: 'kpa', label: 'Kilopascal', symbol: 'kPa', toBase: val => val * 1000, fromBase: val => val / 1000 },
  { value: 'bar', label: 'Bar', symbol: 'bar', toBase: val => val * 100000, fromBase: val => val / 100000 },
  { value: 'mbar', label: 'Millibar', symbol: 'mbar', toBase: val => val * 100, fromBase: val => val / 100 },
  { value: 'psi', label: 'PSI', symbol: 'psi', toBase: val => val * 6894.75729, fromBase: val => val / 6894.75729 },
  { value: 'atm', label: 'Atmosphere', symbol: 'atm', toBase: val => val * 101325, fromBase: val => val / 101325 },
  { value: 'torr', label: 'Torr (mmHg)', symbol: 'Torr', toBase: val => val * 133.322368, fromBase: val => val / 133.322368 }
];

export default function PressureConverterTool({ onBack }: { onBack?: () => void }) {
  return (
    <BaseUnitConverter
      title="Pressure Converter"
      description="Convert pressure ratings between Pascals, kilopascals, bars, PSI, atmospheres, and Torr."
      units={UNITS}
      defaultFrom="kpa"
      defaultTo="psi"
      onBack={onBack}
    />
  );
}
