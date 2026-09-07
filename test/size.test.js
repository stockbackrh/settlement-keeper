import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ethForUsd, minOut, overCap } from '../lib/size.mjs';

test('eth for a reward carries the buffer', () => {
  assert.ok(Math.abs(ethForUsd(3.73, 2463) - 0.0015219) < 1e-6);
});
test('minOut takes two percent by default', () => {
  assert.equal(minOut(1000000n), 980000n);
  assert.equal(minOut(1000000n, 0.005), 995000n);
});
test('cap check', () => {
  assert.equal(overCap(0.021, 0.02), true);
  assert.equal(overCap('0.019', 0.02), false);
});
test('bad price throws', () => {
  assert.throws(() => ethForUsd(5, 0));
});
