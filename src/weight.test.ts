import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { getEffectiveWeight } from './weight';

describe('getEffectiveWeight (massa rijklaar basis, effective 1 July 2026)', () => {
  test('prefers massa_rijklaar when present', () => {
    assert.equal(getEffectiveWeight({ massa_rijklaar: '1500', massa_ledig_voertuig: '1400' }), 1500);
  });

  test('falls back to massa_ledig_voertuig + 100 when massa_rijklaar is absent', () => {
    assert.equal(getEffectiveWeight({ massa_ledig_voertuig: '1400' }), 1500);
  });

  test('falls back when massa_rijklaar is an empty string', () => {
    assert.equal(getEffectiveWeight({ massa_rijklaar: '', massa_ledig_voertuig: '1400' }), 1500);
  });

  test('falls back when massa_rijklaar is not a number', () => {
    assert.equal(getEffectiveWeight({ massa_rijklaar: 'n/a', massa_ledig_voertuig: '1400' }), 1500);
  });

  test('returns null when neither field is present', () => {
    assert.equal(getEffectiveWeight({}), null);
  });

  test('returns null when both fields are zero', () => {
    assert.equal(getEffectiveWeight({ massa_rijklaar: '0', massa_ledig_voertuig: '0' }), null);
  });
});
