// Maps RDW's raw brandstof_omschrijving values (from dataset 8ys7-d773) to the
// fuel-type keys used by FUEL_CONFIG/calculatePrice. cilinderinhoud (engine
// displacement, dataset m9d7-ebf2) disambiguates a PHEV (has both an electric
// and a combustion fuel entry) from a full EV.
export function mapRdwFuelType(fuels: string[] | undefined, cilinderinhoud?: string | number | null): string | null {
  if (!fuels || fuels.length === 0) return null;
  const hasElectric = fuels.includes('Elektriciteit');
  const hasNonElectric = fuels.some(f => f !== 'Elektriciteit');
  const displacement = +(cilinderinhoud as string);

  // Hybrid (incl. self-charging) -> same rate as Benzine since 2026, map to Benzine
  if (hasElectric && hasNonElectric) return 'Benzine';
  if (hasElectric && cilinderinhoud && !isNaN(displacement) && displacement > 0) return 'Benzine';
  if (hasElectric) return 'Elektrisch';
  if (fuels.includes('Benzine')) return 'Benzine';
  if (fuels.includes('Diesel')) return 'Diesel';
  if (fuels.includes('LPG')) return 'LPG3';
  if (fuels.some(f => /waterstof/i.test(f))) return 'Elektrisch';
  return null;
}
