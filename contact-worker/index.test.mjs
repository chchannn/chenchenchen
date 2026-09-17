import test from 'node:test';
import assert from 'node:assert/strict';
import worker from './index.mjs';

const env = { ALLOWED_ORIGINS: 'https://chenchenchen.me', RESEND_API_KEY: 'test-only', EMAIL_FROM: 'test@example.com', CONTACT_LIMITER: { limit: async () => ({ success: true }) } };
const data = { name: 'Visitor', email: 'visitor@example.com', company: '', message: 'Can you help with an agent workflow?', website: '' };
const request = (body = data, origin = 'https://chenchenchen.me') => new Request('https://contact.example/contact', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

test('rejects unexpected origins and malformed inputs before emailing', async () => {
  assert.equal((await worker.fetch(request(data, 'https://other.example'), env)).status, 403);
  assert.equal((await worker.fetch(request({ ...data, email: 'invalid' }), env)).status, 400);
  assert.equal((await worker.fetch(request({ ...data, website: 'spam' }), env)).status, 400);
  assert.equal((await worker.fetch(request({ ...data, message: 'x'.repeat(17000) }), env)).status, 413);
});
test('fails closed without configuration and enforces request limits', async () => {
  assert.equal((await worker.fetch(request(), { ...env, RESEND_API_KEY: '' })).status, 503);
  assert.equal((await worker.fetch(request(), { ...env, CONTACT_LIMITER: { limit: async () => ({ success: false }) } })).status, 429);
});
test('handles CORS preflight', async () => {
  const r = await worker.fetch(new Request('https://contact.example/contact', { method: 'OPTIONS', headers: { Origin: 'https://chenchenchen.me' } }), env);
  assert.equal(r.status, 204);
  assert.equal(r.headers.get('Access-Control-Allow-Origin'), 'https://chenchenchen.me');
});
test('sends only to Chen, sets reply-to, and never reports provider errors as success', async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async (url, options) => {
      assert.equal(url, 'https://api.resend.com/emails');
      const sent = JSON.parse(options.body);
      assert.deepEqual(sent.to, ['leave117@gmail.com']);
      assert.equal(sent.reply_to, data.email);
      return Response.json({ id: 'test-id' });
    };
    assert.equal((await worker.fetch(request({ ...data, to: 'attacker@example.com' }), env)).status, 200);
    globalThis.fetch = async () => Response.json({ message: 'upstream error' }, { status: 500 });
    assert.equal((await worker.fetch(request(), env)).status, 502);
  } finally { globalThis.fetch = original; }
});
