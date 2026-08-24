import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { isOldtimerExempt } from './oldtimer';

describe('isOldtimerExempt (oldtimerregeling: 40 years or older = exempt)', () => {
  const now = new Date(2026, 7, 5); // 2026-08-05

  test('a car registered exactly 40 years ago today is exempt', () => {
    assert.equal(isOldtimerExempt('19860805', now), true);
  });

  test('a car registered 41 years ago is exempt', () => {
    assert.equal(isOldtimerExempt('19850101', now), true);
  });

  test('a car that turns 40 tomorrow is not yet exempt', () => {
    assert.equal(isOldtimerExempt('19860806', now), false);
  });

  test('a car registered 10 years ago is not exempt', () => {
    assert.equal(isOldtimerExempt('20160101', now), false);
  });

  test('missing registration date is not exempt', () => {
    assert.equal(isOldtimerExempt(undefined, now), false);
    assert.equal(isOldtimerExempt('', now), false);
  });

  test('malformed registration date is not exempt', () => {
    assert.equal(isOldtimerExempt('1986', now), false);
  });
});
