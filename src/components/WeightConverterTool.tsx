import React from 'react';
import BaseUnitConverter, { UnitOption } from './BaseUnitConverter';

const UNITS: UnitOption[] = [
  { value: 'mg', label: 'Milligram', symbol: 'mg', toBase: val => val / 1000, fromBase: val => val * 1000 },
  { value: 'g', label: 'Gram', symbol: 'g', toBase: val => val, fromBase: val => val },
  { value: 'kg', label: 'Kilogram', symbol: 'kg', toBase: val => val * 1000, fromBase: val => val / 1000 },
  { value: 't', label: 'Metric Ton', symbol: 't', toBase: val => val * 1e6, fromBase: val => val * 1e-6 },
  { value: 'oz', label: 'Ounce', symbol: 'oz', toBase: val => val * 28.349523125, fromBase: val => val / 28.349523125 },
  { value: 'lb', label: 'Pound', symbol: 'lb', toBase: val => val * 453.59237, fromBase: val => val / 453.59237 },
  { value: 'st', label: 'Stone', symbol: 'st', toBase: val => val * 6350.29318, fromBase: val => val / 6350.29318 }
];

export default function WeightConverterTool({ onBack }: { onBack?: () => void }) {
  return (
    <BaseUnitConverter
      title="Weight Converter"
      description="Convert mass and weight between metric and imperial units including grams, kilograms, pounds, and ounces."
      units={UNITS}
      defaultFrom="kg"
      defaultTo="lb"
      onBack={onBack}
    />
  );
}
