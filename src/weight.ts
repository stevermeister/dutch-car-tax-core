export interface RdwWeightFields {
  massa_rijklaar?: string;
  massa_ledig_voertuig?: string;
}

// MRB weight basis switched from massa ledig voertuig to massa rijklaar on 1 July 2026.
// massa_rijklaar is ~100 kg above massa_ledig_voertuig (fuel, fluids, driver); fall back
// to that approximation when RDW hasn't published massa_rijklaar for a vehicle.
export function getEffectiveWeight(vehicle: RdwWeightFields): number | null {
  const rijklaar = +(vehicle.massa_rijklaar as string);
  if (vehicle.massa_rijklaar && !isNaN(rijklaar) && rijklaar > 0) {
    return rijklaar;
  }
  const ledig = +(vehicle.massa_ledig_voertuig as string);
  if (vehicle.massa_ledig_voertuig && !isNaN(ledig) && ledig > 0) {
    return ledig + 100;
  }
  return null;
}
