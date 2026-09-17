import test from 'node:test';
import assert from 'node:assert/strict';
import { toggleSymptom, isComplete, room100, makeBrief } from './discovery.ts';

test('selection is reversible and capped at three', () => {
  assert.deepEqual(toggleSymptom([], 'waiting'), ['waiting']);
  assert.deepEqual(toggleSymptom(['waiting'], 'waiting'), []);
  assert.deepEqual(toggleSymptom(['waiting', 'conflict', 'expert'], 'late'), ['waiting', 'conflict', 'expert']);
});
test('comparison requires a concrete incident and all three judgments', () => {
  assert.equal(isComplete({ ...room100.conflict, incident: '  ' }), false);
  assert.equal(isComplete({ ...room100.conflict, access: '' }), false);
  assert.equal(isComplete(room100.conflict), true);
});
test('export preserves the chosen evidence without inventing a score or solution', () => {
  const brief = makeBrief('Conflicting information', room100.conflict, true);
  assert.match(brief, /Room 100/);
  assert.match(brief, /Composite/);
  assert.match(brief, /Next investigation/);
  assert.match(brief, /process change/);
  assert.doesNotMatch(brief, /\d+%/);
});
