const problems = ['waiting', 'copying', 'conflict', 'expert', 'late', 'promises', 'other'];
const choices = {
  frequency: ['Every day', 'Every week', 'Every month', 'Rarely', 'Not sure yet'],
  consequence: ['Minor inconvenience', 'Work waits or a customer waits', 'Rework or extra cost', 'A missed promise or lost business', 'Safety or compliance concern', 'Not sure yet', 'Potential guest waiting or a missed promise'],
  access: ['People and artifacts are accessible', 'Some access; gaps to resolve', 'Access is blocked', 'Not sure yet'],
};

export async function saveWorksheet(request, env) {
  const origin = request.headers.get('Origin');
  const allowed = !!origin && (env.ALLOWED_ORIGINS || '').split(',').includes(origin);
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', Vary: 'Origin' };
  if (allowed) Object.assign(headers, { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' });
  const reply = (status, message) => new Response(JSON.stringify({ ok: status === 200, message }), { status, headers });
  if (!allowed) return reply(403, 'This origin is not allowed.');
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method !== 'POST') return reply(405, 'Use POST.');
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) return reply(415, 'Send JSON.');
  if (!env.WORKSHEETS || !env.CONTACT_LIMITER) return reply(503, 'Worksheet storage is temporarily unavailable.');
  try {
    const { success } = await env.CONTACT_LIMITER.limit({ key: 'worksheet:' + (request.headers.get('CF-Connecting-IP') || 'unknown') });
    if (!success) return reply(429, 'Please wait a minute before trying again.');
    const reader = request.body?.getReader();
    if (!reader) return reply(400, 'Complete your worksheet first.');
    const chunks = []; let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 48000) { await reader.cancel(); return reply(413, 'Your worksheet is too long.'); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    let data;
    try { data = JSON.parse(new TextDecoder().decode(bytes)); } catch { return reply(400, 'Invalid worksheet.'); }
    if (!data || typeof data !== 'object' || data.website || typeof data.example !== 'boolean' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.id || '') || !Array.isArray(data.incidents) || data.incidents.length < 1 || data.incidents.length > 3) return reply(400, 'Invalid worksheet.');
    const incidents = []; const seen = new Set();
    for (const item of data.incidents) {
      if (!item || !problems.includes(item.symptom) || seen.has(item.symptom)) return reply(400, 'Check your selected problems.');
      seen.add(item.symptom);
      const clean = { symptom: item.symptom };
      for (const [key, max] of Object.entries({ workflow: 120, incident: 2000, people: 500, artifacts: 500 })) {
        if (typeof item[key] !== 'string' || item[key].length > max || (['workflow', 'incident'].includes(key) && !item[key].trim())) return reply(400, 'Check your written answers.');
        clean[key] = item[key].trim();
      }
      for (const [key, allowedValues] of Object.entries(choices)) {
        if (!allowedValues.includes(item[key])) return reply(400, 'Check your comparison answers.');
        clean[key] = item[key];
      }
      incidents.push(clean);
    }
    if (!seen.has(data.chosen)) return reply(400, 'Choose a completed workflow.');
    // Parameter binding keeps free text as data. Repeated requests cannot overwrite a submission.
    const result = await env.WORKSHEETS.prepare('INSERT INTO worksheets (id, answers) VALUES (?, ?) ON CONFLICT(id) DO NOTHING')
      .bind(data.id, JSON.stringify({ chosen: data.chosen, example: data.example, incidents })).run();
    if (!result.success) return reply(503, 'Your worksheet could not be saved. Please retry.');
    return reply(200, 'Your worksheet has been shared privately with Chen.');
  } catch {
    return reply(503, 'Your worksheet could not be saved. Please retry.');
  }
}
