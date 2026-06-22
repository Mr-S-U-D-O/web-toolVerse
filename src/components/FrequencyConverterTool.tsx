import React from 'react';
import BaseUnitConverter, { UnitOption } from './BaseUnitConverter';

const UNITS: UnitOption[] = [
  { value: 'hz', label: 'Hertz', symbol: 'Hz', toBase: val => val, fromBase: val => val },
  { value: 'khz', label: 'Kilohertz', symbol: 'kHz', toBase: val => val * 1000, fromBase: val => val / 1000 },
  { value: 'mhz', label: 'Megahertz', symbol: 'MHz', toBase: val => val * 1e6, fromBase: val => val / 1e6 },
  { value: 'ghz', label: 'Gigahertz', symbol: 'GHz', toBase: val => val * 1e9, fromBase: val => val / 1e9 },
  { value: 'thz', label: 'Terahertz', symbol: 'THz', toBase: val => val * 1e12, fromBase: val => val / 1e12 },
  { value: 'rad_s', label: 'Radian per second', symbol: 'rad/s', toBase: val => val / (2 * Math.PI), fromBase: val => val * 2 * Math.PI }
];

export default function FrequencyConverterTool({ onBack }: { onBack?: () => void }) {
  return (
    <BaseUnitConverter
      title="Frequency Converter"
      description="Convert frequency cycles and rotational speeds between Hertz, kilohertz, megahertz, and radians/second."
      units={UNITS}
      defaultFrom="hz"
      defaultTo="khz"
      onBack={onBack}
    />
  );
}
