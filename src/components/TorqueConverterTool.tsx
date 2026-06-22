import React from 'react';
import BaseUnitConverter, { UnitOption } from './BaseUnitConverter';

const UNITS: UnitOption[] = [
  { value: 'n_m', label: 'Newton-meter', symbol: 'N·m', toBase: val => val, fromBase: val => val },
  { value: 'kn_m', label: 'Kilonewton-meter', symbol: 'kN·m', toBase: val => val * 1000, fromBase: val => val / 1000 },
  { value: 'lb_ft', label: 'Pound-foot', symbol: 'lb·ft', toBase: val => val * 1.3558179483, fromBase: val => val / 1.3558179483 },
  { value: 'lb_in', label: 'Pound-inch', symbol: 'lb·in', toBase: val => val * 0.112984829, fromBase: val => val / 0.112984829 },
  { value: 'kg_m', label: 'Kilogram-meter', symbol: 'kg·m', toBase: val => val * 9.80665, fromBase: val => val / 9.80665 }
];

export default function TorqueConverterTool({ onBack }: { onBack?: () => void }) {
  return (
    <BaseUnitConverter
      title="Torque Converter"
      description="Convert rotational force measurements (torque) between Newton-meters, foot-pounds, and inch-pounds."
      units={UNITS}
      defaultFrom="n_m"
      defaultTo="lb_ft"
      onBack={onBack}
    />
  );
}
