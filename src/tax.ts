import { Grid, FormValue } from './types';

// Grid columns: weight#benzine#diesel#lpg3#lpg
// 2026 MRB rates: electric = 70% of benzine, hybrid/PHEV = 100% of benzine (discount abolished)
export const FUEL_CONFIG: Record<string, { col: number; multiplier: number }> = {
  Benzine:    { col: 1, multiplier: 1.00 },
  Diesel:     { col: 2, multiplier: 1.00 },
  Elektrisch: { col: 1, multiplier: 0.70 },
  LPG3:       { col: 3, multiplier: 1.00 },
  LPG:        { col: 4, multiplier: 1.00 },
  Hybride:    { col: 1, multiplier: 1.00 },
};

// Weight brackets are on a massa rijklaar basis (since 1 July 2026); bracket lower
// bounds are 100 kg higher than the old massa ledig voertuig grid (101/651/751/... vs 1/551/651/...).
export function calculatePrice(grid: Grid, value: FormValue): number {
  const { col, multiplier } = FUEL_CONFIG[value.fuelType] ?? { col: 1, multiplier: 1 };

  if (value.volume < 651) {
    return Math.floor(+grid[value.provinceKey][0].split('#')[col] * multiplier);
  }

  const provinceGrid = grid[value.provinceKey];
  const index = Math.floor(value.volume / 100 - 5);
  const weight = +provinceGrid[index].split('#')[0];
  const row = value.volume < weight ? index - 1 : index;

  return Math.floor(+provinceGrid[row].split('#')[col] * multiplier);
}
