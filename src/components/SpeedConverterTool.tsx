import React from 'react';
import BaseUnitConverter, { UnitOption } from './BaseUnitConverter';

const UNITS: UnitOption[] = [
  { value: 'm_s', label: 'Meter per second', symbol: 'm/s', toBase: val => val, fromBase: val => val },
  { value: 'km_h', label: 'Kilometer per hour', symbol: 'km/h', toBase: val => val / 3.6, fromBase: val => val * 3.6 },
  { value: 'mi_h', label: 'Mile per hour', symbol: 'mph', toBase: val => val * 0.44704, fromBase: val => val / 0.44704 },
  { value: 'knot', label: 'Knot', symbol: 'kt', toBase: val => val * 0.514444, fromBase: val => val / 0.514444 },
  { value: 'mach', label: 'Mach', symbol: 'Mach', toBase: val => val * 343, fromBase: val => val / 343 },
  { value: 'c', label: 'Speed of Light', symbol: 'c', toBase: val => val * 299792458, fromBase: val => val / 299792458 }
];

export default function SpeedConverterTool({ onBack }: { onBack?: () => void }) {
  return (
    <BaseUnitConverter
      title="Speed Converter"
      description="Convert velocity measurements between metric, imperial, nautical, and physical speeds (e.g. speed of light, Mach)."
      units={UNITS}
      defaultFrom="km_h"
      defaultTo="mi_h"
      onBack={onBack}
    />
  );
}
