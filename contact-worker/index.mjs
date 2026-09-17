import { saveWorksheet } from './worksheet.mjs';

const MAX_BYTES = 16000;
const RECIPIENT = 'leave117@gmail.com';

export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname === '/worksheet') return saveWorksheet(request, env);
    const origin = request.headers.get('Origin');
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').includes(origin);
    const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', Vary: 'Origin' };
    if (allowed) Object.assign(headers, {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    const reply = (status, message) => new Response(JSON.stringify({ ok: status === 200, message }), { status, headers });
    if (new URL(request.url).pathname !== '/contact') return reply(404, 'Not found.');
    if (!allowed) return reply(403, 'This origin is not allowed.');
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (request.method !== 'POST') return reply(405, 'Use POST.');
    if (!request.headers.get('Content-Type')?.startsWith('application/json')) return reply(415, 'Send JSON.');
    if (!env.RESEND_API_KEY || !env.EMAIL_FROM || !env.CONTACT_LIMITER) return reply(503, 'Email is temporarily unavailable. Please email Chen directly.');
    try {
      const { success } = await env.CONTACT_LIMITER.limit({ key: 'contact:' + (request.headers.get('CF-Connecting-IP') || 'unknown') });
      if (!success) return reply(429, 'Too many attempts. Please wait a minute before trying again.');
      // Bound the actual stream, not just the caller-provided Content-Length.
      const reader = request.body?.getReader();
      if (!reader) return reply(400, 'Please complete the form.');
      const chunks = [];
      let size = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_BYTES) { await reader.cancel(); return reply(413, 'Your message is too long.'); }
        chunks.push(value);
      }
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
      let data;
      try { data = JSON.parse(new TextDecoder().decode(bytes)); } catch { return reply(400, 'Invalid form data.'); }
      if (!data || typeof data !== 'object' || Array.isArray(data)) return reply(400, 'Invalid form data.');
      if (data.website) return reply(400, 'Unable to submit this form.');
      const field = (key, max, required = true) => typeof data[key] === 'string' && data[key].trim().length <= max && (!required || data[key].trim().length > 0);
      if (!field('name', 120) || !field('email', 254) || !field('message', 10000) || !field('company', 160, false)) return reply(400, 'Please check the form fields.');
      const email = data.email.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /[\r\n]/.test(data.name + data.company)) return reply(400, 'Please check your name and email address.');
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(10000),
        body: JSON.stringify({
          from: env.EMAIL_FROM, to: [RECIPIENT], reply_to: email,
          subject: 'New consulting inquiry from chenchenchen.me',
          text: `Name: ${data.name.trim()}\nEmail: ${email}\nCompany: ${data.company.trim() || '(not provided)'}\n\n${data.message.trim()}`,
        }),
      });
      if (!response.ok) return reply(502, 'Email could not be sent. Please try again or email Chen directly.');
      const result = await response.json();
      if (!result.id) return reply(502, 'Email could not be confirmed. Please email Chen directly.');
      return reply(200, 'Thanks! Your inquiry has been sent.');
    } catch {
      return reply(502, 'Email could not be confirmed. Please email Chen directly if the problem continues.');
    }
  },
};
