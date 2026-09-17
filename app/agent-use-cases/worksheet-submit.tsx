'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Send } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import type { Incident } from '@/lib/discovery';

export default function WorksheetSubmit({ chosen, example, incidents }: { chosen: string; example: boolean; incidents: (Incident & { symptom: string })[] }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const id = useRef('');
  const busy = useRef(false);
  const [message, setMessage] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current || state === 'sent') return;
    busy.current = true;
    const website = new FormData(event.currentTarget).get('website');
    setState('sending'); setMessage('');
    try {
      if (!id.current) {
        // getRandomValues also works while the site's HTTPS certificate is pending.
        const bytes = crypto.getRandomValues(new Uint8Array(16));
        bytes[6] = (bytes[6] & 15) | 64; bytes[8] = (bytes[8] & 63) | 128;
        const hex = Array.from(bytes, value => value.toString(16).padStart(2, '0')).join('');
        id.current = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
      }
      const response = await fetch('https://chenchenchen-contact.chen-field-notes.workers.dev/worksheet', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id.current, chosen, example, incidents, website }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok || !result || typeof result !== 'object' || !('ok' in result) || result.ok !== true) throw new Error('Submission failed');
      setState('sent'); setMessage('Shared privately with Chen. Thank you.');
      trackEvent('worksheet_submit_success', { worksheet_mode: example ? 'example' : 'own_workflow', worksheet_count: incidents.length });
    } catch {
      setState('error'); setMessage('Unable to confirm your submission. Your answers are still here. Please try again.');
    } finally { busy.current = false; }
  }
  return <form className="worksheet-submit" id="worksheet-submit" onSubmit={submit}>
    <p>Submit to share all completed answers privately with Chen for use-case research. Stored in Cloudflare, separate from Google Analytics. Please leave out personal or confidential client information.</p>
    <input className="sr-only" aria-hidden="true" tabIndex={-1} autoComplete="off" name="website" type="text"/>
    <button className="discovery-primary" disabled={state === 'sending' || state === 'sent'} type="submit"><Send size={17}/>{state === 'sending' ? 'Submitting...' : state === 'sent' ? 'Worksheet submitted' : 'Submit worksheet to Chen'}</button>
    {message && <p role={state === 'error' ? 'alert' : 'status'}>{message}</p>}
  </form>;
}
