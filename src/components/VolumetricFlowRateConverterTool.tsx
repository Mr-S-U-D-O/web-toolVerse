import React from 'react';
import BaseUnitConverter, { UnitOption } from './BaseUnitConverter';

const UNITS: UnitOption[] = [
  { value: 'l_s', label: 'Liter per second', symbol: 'L/s', toBase: val => val, fromBase: val => val },
  { value: 'l_min', label: 'Liter per minute', symbol: 'L/min', toBase: val => val / 60, fromBase: val => val * 60 },
  { value: 'm3_s', label: 'Cubic meter per second', symbol: 'm³/s', toBase: val => val * 1000, fromBase: val => val / 1000 },
  { value: 'm3_h', label: 'Cubic meter per hour', symbol: 'm³/h', toBase: val => val * (1000 / 3600), fromBase: val => val / (1000 / 3600) },
  { value: 'ft3_s', label: 'Cubic foot per second', symbol: 'ft³/s', toBase: val => val * 28.316846592, fromBase: val => val / 28.316846592 },
  { value: 'gpm', label: 'Gallon per minute (US)', symbol: 'GPM', toBase: val => val * (3.785411784 / 60), fromBase: val => val / (3.785411784 / 60) }
];

export default function VolumetricFlowRateConverterTool({ onBack }: { onBack?: () => void }) {
  return (
    <BaseUnitConverter
      title="Volumetric Flow Rate Converter"
      description="Convert fluid and gas volume flow rates between metric, imperial, and industrial flow capacities."
      units={UNITS}
      defaultFrom="l_s"
      defaultTo="gpm"
      onBack={onBack}
    />
  );
}
