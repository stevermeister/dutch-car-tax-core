import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { mapRdwFuelType } from './fuel-mapping';

describe('mapRdwFuelType', () => {
  test('plain petrol maps to Benzine', () => {
    assert.equal(mapRdwFuelType(['Benzine']), 'Benzine');
  });

  test('plain diesel maps to Diesel', () => {
    assert.equal(mapRdwFuelType(['Diesel']), 'Diesel');
  });

  test('LPG maps to LPG3', () => {
    assert.equal(mapRdwFuelType(['LPG']), 'LPG3');
  });

  test('full EV (electric only, no displacement) maps to Elektrisch', () => {
    assert.equal(mapRdwFuelType(['Elektriciteit']), 'Elektrisch');
  });

  test('PHEV (electric + combustion) maps to Benzine', () => {
    assert.equal(mapRdwFuelType(['Elektriciteit', 'Benzine']), 'Benzine');
  });

  test('electric with nonzero displacement (self-charging hybrid) maps to Benzine', () => {
    assert.equal(mapRdwFuelType(['Elektriciteit'], '1500'), 'Benzine');
  });

  test('electric with zero displacement stays Elektrisch', () => {
    assert.equal(mapRdwFuelType(['Elektriciteit'], '0'), 'Elektrisch');
  });

  test('hydrogen maps to Elektrisch', () => {
    assert.equal(mapRdwFuelType(['Waterstof']), 'Elektrisch');
  });

  test('empty or missing fuels returns null', () => {
    assert.equal(mapRdwFuelType(undefined), null);
    assert.equal(mapRdwFuelType([]), null);
  });

  test('unrecognized fuel returns null', () => {
    assert.equal(mapRdwFuelType(['Alcohol']), null);
  });
});
