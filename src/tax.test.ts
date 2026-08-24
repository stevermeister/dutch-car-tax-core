import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculatePrice, FUEL_CONFIG } from './tax';
import { GRID } from './grid';
import { FormValue, Grid } from './types';

function price(provinceKey: string, fuelType: string, volume: number): number {
  return calculatePrice(GRID as Grid, { provinceKey, fuelType, volume } as FormValue);
}

describe('calculatePrice (2026 MRB rates, massa rijklaar basis since 1 July 2026)', () => {
  // Reference: official belastingdienst.nl 2026 JS tariff file (massa ledig voertuig basis).
  // Bracket lower bounds are 100 kg higher on the massa rijklaar basis, so the reference
  // 1551 kg bracket now starts at 1651 kg.
  test('NH Benzine 1651 = 280 (reference from belastingdienst.nl 2026)', () => {
    assert.equal(price('NH', 'Benzine', 1651), 280);
  });

  test('DR Benzine 1651 = 291 (2026 official rate)', () => {
    assert.equal(price('DR', 'Benzine', 1651), 291);
  });

  test('DR Benzine 1700 = 291 (same bracket as 1651)', () => {
    assert.equal(price('DR', 'Benzine', 1700), 291);
  });

  test('DR Benzine 1750 = 291 (top of bracket)', () => {
    assert.equal(price('DR', 'Benzine', 1750), 291);
  });

  test('DR Benzine 1751 moves to next bracket', () => {
    assert.ok(price('DR', 'Benzine', 1751) > 291);
  });

  test('NH Benzine 600 uses the lowest bracket', () => {
    assert.equal(price('NH', 'Benzine', 600), 33);
  });

  test('NH Benzine 1 uses the lowest bracket', () => {
    assert.equal(price('NH', 'Benzine', 1), 33);
  });

  test('NH Benzine 650 still in lowest bracket', () => {
    assert.equal(price('NH', 'Benzine', 650), 33);
  });

  test('NH Benzine 651 enters the 651-750 bracket', () => {
    assert.ok(price('NH', 'Benzine', 651) > 33);
  });

  test('NH Benzine 1650 is in the 1551-1650 bracket', () => {
    const at1650 = price('NH', 'Benzine', 1650);
    const at1651 = price('NH', 'Benzine', 1651);
    assert.ok(at1651 > at1650);
  });

  test('NH Diesel 1651 matches grid', () => {
    assert.equal(price('NH', 'Diesel', 1651), 549);
  });

  test('NH LPG3 1651 matches grid', () => {
    assert.equal(price('NH', 'LPG3', 1651), 432);
  });

  test('NH LPG 1651 matches grid', () => {
    assert.equal(price('NH', 'LPG', 1651), 579);
  });

  test('NH Elektrisch 1651 = 70% of Benzine (floored, matching belastingdienst.nl)', () => {
    const benzine = price('NH', 'Benzine', 1651);
    const electric = price('NH', 'Elektrisch', 1651);
    assert.equal(electric, Math.floor(benzine * 0.70));
  });

  test('Hybride and Benzine return the same price', () => {
    assert.equal(price('NH', 'Hybride', 1651), price('NH', 'Benzine', 1651));
  });

  test('ZH Benzine 1651 > DR Benzine 1651 (ZH has highest opcenten)', () => {
    assert.ok(price('ZH', 'Benzine', 1651) > price('DR', 'Benzine', 1651));
  });

  test('NH Benzine 1651 <= all other provinces (NH has lowest opcenten)', () => {
    const nhPrice = price('NH', 'Benzine', 1651);
    ['DR', 'FL', 'FR', 'GL', 'GR', 'LI', 'NB', 'OV', 'UT', 'ZL', 'ZH'].forEach((p) => {
      assert.ok(price(p, 'Benzine', 1651) >= nhPrice);
    });
  });

  // Weight basis migration (effective 1 July 2026): massa_rijklaar is ~100 kg above the old
  // massa_ledig_voertuig basis, so the same physical vehicle must produce the same euro amount.
  test('NH Benzine 1100 kg rijklaar returns the same quarterly amount as 1000 kg did before the change', () => {
    assert.equal(price('NH', 'Benzine', 1100), 119);
  });

  test('FUEL_CONFIG has entries for all supported fuel types', () => {
    ['Benzine', 'Diesel', 'Elektrisch', 'LPG3', 'LPG', 'Hybride'].forEach((fuel) => {
      assert.ok(FUEL_CONFIG[fuel]);
    });
  });
});
