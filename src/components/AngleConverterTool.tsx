import React from 'react';
import BaseUnitConverter, { UnitOption } from './BaseUnitConverter';

const UNITS: UnitOption[] = [
  { value: 'deg', label: 'Degree', symbol: '°', toBase: val => val, fromBase: val => val },
  { value: 'rad', label: 'Radian', symbol: 'rad', toBase: val => val * (180 / Math.PI), fromBase: val => val * (Math.PI / 180) },
  { value: 'grad', label: 'Gradian', symbol: 'grad', toBase: val => val * 0.9, fromBase: val => val / 0.9 },
  { value: 'arcmin', label: 'Arcminute', symbol: "'", toBase: val => val / 60, fromBase: val => val * 60 },
  { value: 'arcsec', label: 'Arcsecond', symbol: '"', toBase: val => val / 3600, fromBase: val => val * 3600 },
  { value: 'turn', label: 'Circle / Turn', symbol: 'turn', toBase: val => val * 360, fromBase: val => val / 360 }
];

export default function AngleConverterTool({ onBack }: { onBack?: () => void }) {
  return (
    <BaseUnitConverter
      title="Angle Converter"
      description="Convert geometric and physical angles between degrees, radians, gradians, and full turns."
      units={UNITS}
      defaultFrom="deg"
      defaultTo="rad"
      onBack={onBack}
    />
  );
}
