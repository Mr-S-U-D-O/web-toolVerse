import React from 'react';
import BaseUnitConverter, { UnitOption } from './BaseUnitConverter';

const UNITS: UnitOption[] = [
  { value: 'ea', label: 'Single / Each', symbol: 'ea', toBase: val => val, fromBase: val => val },
  { value: 'pair', label: 'Pair', symbol: 'pair', toBase: val => val * 2, fromBase: val => val / 2 },
  { value: 'dz', label: 'Dozen', symbol: 'dz', toBase: val => val * 12, fromBase: val => val / 12 },
  { value: 'bdz', label: "Baker's Dozen", symbol: "b.dz", toBase: val => val * 13, fromBase: val => val / 13 },
  { value: 'score', label: 'Score', symbol: 'score', toBase: val => val * 20, fromBase: val => val / 20 },
  { value: 'gross', label: 'Gross', symbol: 'gr', toBase: val => val * 144, fromBase: val => val / 144 },
  { value: 'ggross', label: 'Great Gross', symbol: 'gg', toBase: val => val * 1728, fromBase: val => val / 1728 }
];

export default function EachConverterTool({ onBack }: { onBack?: () => void }) {
  return (
    <BaseUnitConverter
      title="Each Converter"
      description="Convert quantity measurements between singles, pairs, dozens, scores, and gross counts."
      units={UNITS}
      defaultFrom="ea"
      defaultTo="dz"
      onBack={onBack}
    />
  );
}
