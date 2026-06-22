import React from 'react';
import BaseUnitConverter, { UnitOption } from './BaseUnitConverter';

const UNITS: UnitOption[] = [
  { value: 'min_km', label: 'Minutes per kilometer', symbol: 'min/km', toBase: val => val * (60 / 1000), fromBase: val => val / (60 / 1000) },
  { value: 'min_mi', label: 'Minutes per mile', symbol: 'min/mi', toBase: val => val * (60 / 1609.344), fromBase: val => val / (60 / 1609.344) },
  { value: 's_m', label: 'Seconds per meter', symbol: 's/m', toBase: val => val, fromBase: val => val },
  { value: 's_ft', label: 'Seconds per foot', symbol: 's/ft', toBase: val => val / 0.3048, fromBase: val => val * 0.3048 }
];

export default function PaceConverterTool({ onBack }: { onBack?: () => void }) {
  return (
    <BaseUnitConverter
      title="Pace Converter"
      description="Convert running or walking pace measurements between minutes/km, minutes/mile, and seconds/meter."
      units={UNITS}
      defaultFrom="min_km"
      defaultTo="min_mi"
      onBack={onBack}
    />
  );
}
