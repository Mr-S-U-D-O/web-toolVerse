import React from 'react';
import BaseUnitConverter, { UnitOption } from './BaseUnitConverter';

const UNITS: UnitOption[] = [
  { value: 'bit', label: 'Bit', symbol: 'b', toBase: val => val / 8, fromBase: val => val * 8 },
  { value: 'byte', label: 'Byte', symbol: 'B', toBase: val => val, fromBase: val => val },
  { value: 'kb', label: 'Kilobit', symbol: 'Kb', toBase: val => (val * 1024) / 8, fromBase: val => (val * 8) / 1024 },
  { value: 'KB', label: 'Kilobyte', symbol: 'KB', toBase: val => val * 1024, fromBase: val => val / 1024 },
  { value: 'mb', label: 'Megabit', symbol: 'Mb', toBase: val => (val * Math.pow(1024, 2)) / 8, fromBase: val => (val * 8) / Math.pow(1024, 2) },
  { value: 'MB', label: 'Megabyte', symbol: 'MB', toBase: val => val * Math.pow(1024, 2), fromBase: val => val / Math.pow(1024, 2) },
  { value: 'gb', label: 'Gigabit', symbol: 'Gb', toBase: val => (val * Math.pow(1024, 3)) / 8, fromBase: val => (val * 8) / Math.pow(1024, 3) },
  { value: 'GB', label: 'Gigabyte', symbol: 'GB', toBase: val => val * Math.pow(1024, 3), fromBase: val => val / Math.pow(1024, 3) },
  { value: 'tb', label: 'Terabit', symbol: 'Tb', toBase: val => (val * Math.pow(1024, 4)) / 8, fromBase: val => (val * 8) / Math.pow(1024, 4) },
  { value: 'TB', label: 'Terabyte', symbol: 'TB', toBase: val => val * Math.pow(1024, 4), fromBase: val => val / Math.pow(1024, 4) },
  { value: 'PB', label: 'Petabyte', symbol: 'PB', toBase: val => val * Math.pow(1024, 5), fromBase: val => val / Math.pow(1024, 5) }
];

export default function DigitalConverterTool({ onBack }: { onBack?: () => void }) {
  return (
    <BaseUnitConverter
      title="Digital Converter"
      description="Convert data sizes between bits, bytes, kilobytes, megabytes, gigabytes, and terabytes (binary base 1024)."
      units={UNITS}
      defaultFrom="GB"
      defaultTo="MB"
      onBack={onBack}
    />
  );
}
