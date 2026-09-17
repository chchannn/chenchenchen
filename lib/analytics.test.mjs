import test from 'node:test';
import assert from 'node:assert/strict';
import { analyticsPage, worksheetAnswers } from './analytics.ts';

test('worksheet events include categorical answers but never written fields', () => {
  assert.deepEqual(worksheetAnswers('waiting', {
    workflow: 'private@example.com', incident: 'Confidential client incident', people: 'Jane',
    frequency: 'Every week', consequence: 'Rework or extra cost', access: 'Access is blocked',
  }, false), {
    worksheet_problem: 'waiting', worksheet_frequency: 'Every week',
    worksheet_consequence: 'Rework or extra cost', worksheet_access: 'Access is blocked', worksheet_mode: 'own_workflow',
  });
});
test('unexpected categorical values cannot send arbitrary text to analytics', () => {
  const result = worksheetAnswers('secret@example.com', { frequency: 'Jane', consequence: 'Client X', access: 'private' }, true);
  assert.deepEqual(Object.values(result), ['unspecified', 'unspecified', 'unspecified', 'unspecified', 'example']);
});
test('analytics strips query strings, fragments and referrer paths', () => {
  assert.deepEqual(analyticsPage('https://chenchenchen.me/contact?email=private@example.com#secret', 'https://example.com/private/path?token=secret'), {
    page_location: 'https://chenchenchen.me/contact', page_referrer: 'https://example.com/',
  });
  assert.equal(analyticsPage('http://chenchenchen.me/', '').page_referrer, '');
});
