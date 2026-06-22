import React from 'react';
import BaseUnitConverter, { UnitOption } from './BaseUnitConverter';

const UNITS: UnitOption[] = [
  { value: 'ml', label: 'Milliliter', symbol: 'mL', toBase: val => val / 1000, fromBase: val => val * 1000 },
  { value: 'l', label: 'Liter', symbol: 'L', toBase: val => val, fromBase: val => val },
  { value: 'c_m', label: 'Cubic Meter', symbol: 'm³', toBase: val => val * 1000, fromBase: val => val / 1000 },
  { value: 'tsp', label: 'Teaspoon (US)', symbol: 'tsp', toBase: val => val * 0.00492892, fromBase: val => val / 0.00492892 },
  { value: 'tbsp', label: 'Tablespoon (US)', symbol: 'tbsp', toBase: val => val * 0.0147868, fromBase: val => val / 0.0147868 },
  { value: 'fl_oz', label: 'Fluid Ounce (US)', symbol: 'fl oz', toBase: val => val * 0.0295735, fromBase: val => val / 0.0295735 },
  { value: 'cup', label: 'Cup (US)', symbol: 'cup', toBase: val => val * 0.236588, fromBase: val => val / 0.236588 },
  { value: 'pt', label: 'Pint (US)', symbol: 'pt', toBase: val => val * 0.473176, fromBase: val => val / 0.473176 },
  { value: 'qt', label: 'Quart (US)', symbol: 'qt', toBase: val => val * 0.946353, fromBase: val => val / 0.946353 },
  { value: 'gal', label: 'Gallon (US)', symbol: 'gal', toBase: val => val * 3.785411784, fromBase: val => val / 3.785411784 }
];

export default function VolumeConverterTool({ onBack }: { onBack?: () => void }) {
  return (
    <BaseUnitConverter
      title="Volume Converter"
      description="Convert volumetric measurements between metric units and US imperial standards."
      units={UNITS}
      defaultFrom="l"
      defaultTo="gal"
      onBack={onBack}
    />
  );
}
