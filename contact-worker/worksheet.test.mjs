import test from 'node:test';
import assert from 'node:assert/strict';
import worker from './index.mjs';

const payload = () => ({ id: crypto.randomUUID(), chosen: 'waiting', example: false, website: '', incidents: [{ symptom: 'waiting', workflow: 'Prepare a room', incident: 'The room statuses disagreed.', people: 'Front desk', artifacts: 'Room status', frequency: 'Every week', consequence: 'Rework or extra cost', access: 'People and artifacts are accessible' }] });
const request = (body, options = {}) => new Request('https://example.com/worksheet', {
  method: 'POST', headers: { Origin: 'https://chenchenchen.me', 'Content-Type': 'application/json' }, body: JSON.stringify(body), ...options,
});
function environment() {
  const rows = new Map();
  return { rows, ALLOWED_ORIGINS: 'https://chenchenchen.me', CONTACT_LIMITER: { limit: async () => ({ success: true }) },
    WORKSHEETS: { prepare: () => ({ bind: (id, json) => ({ run: async () => { if (!rows.has(id)) rows.set(id, JSON.parse(json)); return { success: true }; } }) }) },
  };
}
test('stores a complete worksheet without requiring email credentials', async () => {
  const env = environment(); const body = payload();
  assert.equal((await worker.fetch(request(body), env)).status, 200);
  assert.equal(env.rows.get(body.id).incidents[0].incident, body.incidents[0].incident);
});
test('retries use the same submission id', async () => {
  const env = environment(); const body = payload();
  await worker.fetch(request(body), env); await worker.fetch(request(body), env);
  assert.equal(env.rows.size, 1);
});
test('rejects invalid, incomplete, oversize, and injected choice data', async () => {
  for (const change of [b => b.chosen = 'other', b => b.incidents[0].incident = '', b => b.incidents[0].workflow = 'a'.repeat(121), b => b.incidents[0].frequency = 'SQL injection', b => b.website = 'spam', b => b.incidents.push(b.incidents[0]), b => b.id = 'bad']) {
    const env = environment(); const body = payload(); change(body);
    assert.equal((await worker.fetch(request(body), env)).status, 400);
    assert.equal(env.rows.size, 0);
  }
  assert.equal((await worker.fetch(request({ extra: 'x'.repeat(50000) }), environment())).status, 413);
});
test('does not allow public reads or foreign origins', async () => {
  const env = environment();
  assert.equal((await worker.fetch(request(undefined, { method: 'GET' }), env)).status, 405);
  assert.equal((await worker.fetch(request(payload(), { headers: { Origin: 'https://evil.test', 'Content-Type': 'application/json' } }), env)).status, 403);
  const preflight = await worker.fetch(request(undefined, { method: 'OPTIONS' }), env);
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get('Access-Control-Allow-Origin'), 'https://chenchenchen.me');
});
test('rate limit and storage failure never report success', async () => {
  const env = environment(); env.CONTACT_LIMITER.limit = async () => ({ success: false });
  assert.equal((await worker.fetch(request(payload()), env)).status, 429);
  env.CONTACT_LIMITER.limit = async () => ({ success: true });
  env.WORKSHEETS.prepare = () => { throw Error('private storage error'); };
  const response = await worker.fetch(request(payload()), env);
  assert.equal(response.status, 503);
  assert.equal((await response.text()).includes('private storage error'), false);
});
