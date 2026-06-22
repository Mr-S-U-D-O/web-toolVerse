import React from 'react';
import BaseUnitConverter, { UnitOption } from './BaseUnitConverter';

const UNITS: UnitOption[] = [
  { value: 'ms', label: 'Millisecond', symbol: 'ms', toBase: val => val / 1000, fromBase: val => val * 1000 },
  { value: 's', label: 'Second', symbol: 's', toBase: val => val, fromBase: val => val },
  { value: 'min', label: 'Minute', symbol: 'min', toBase: val => val * 60, fromBase: val => val / 60 },
  { value: 'hr', label: 'Hour', symbol: 'hr', toBase: val => val * 3600, fromBase: val => val / 3600 },
  { value: 'day', label: 'Day', symbol: 'day', toBase: val => val * 86400, fromBase: val => val / 86400 },
  { value: 'wk', label: 'Week', symbol: 'wk', toBase: val => val * 604800, fromBase: val => val / 604800 },
  { value: 'mo', label: 'Month (Avg)', symbol: 'mo', toBase: val => val * 2592000, fromBase: val => val / 2592000 },
  { value: 'yr', label: 'Year (365d)', symbol: 'yr', toBase: val => val * 31536000, fromBase: val => val / 31536000 },
  { value: 'dec', label: 'Decade', symbol: 'dec', toBase: val => val * 315360000, fromBase: val => val / 315360000 },
  { value: 'cen', label: 'Century', symbol: 'cen', toBase: val => val * 3153600000, fromBase: val => val / 3153600000 }
];

export default function TimeConverterTool({ onBack }: { onBack?: () => void }) {
  return (
    <BaseUnitConverter
      title="Time Converter"
      description="Convert time durations between milliseconds, seconds, minutes, hours, days, weeks, months, and years."
      units={UNITS}
      defaultFrom="hr"
      defaultTo="min"
      onBack={onBack}
    />
  );
}
