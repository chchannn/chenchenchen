'use client';

import { ArrowUpRight } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function ContactForm() {
  const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!endpoint || state === 'sending') return;
    const form = event.currentTarget;
    setState('sending'); setMessage('');
    try {
      const response = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!result || typeof result !== 'object' || !('ok' in result)) throw new Error('Unable to confirm delivery. Please try again.');
      const responseMessage = 'message' in result && typeof result.message === 'string' ? result.message : '';
      if (!response.ok || result.ok !== true) throw new Error(responseMessage || 'Unable to send. Please try again.');
      setState('sent'); setMessage(responseMessage || 'Your inquiry has been sent.'); form.reset();
    } catch (error) {
      setState('error'); setMessage(error instanceof Error && error.name !== 'TimeoutError' && error.name !== 'TypeError' ? error.message : 'Unable to confirm delivery. Please email Chen directly or try again.');
    }
  }
  return <form className="inquiry-form" onSubmit={submit}>
    <input type="text" name="website" tabIndex={-1} autoComplete="off" className="form-honeypot" aria-hidden="true"/>
    <div className="form-pair">
      <div className="form-field"><label htmlFor="inquiry-name">Your name</label><Input id="inquiry-name" name="name" autoComplete="name" required maxLength={120}/></div>
      <div className="form-field"><label htmlFor="inquiry-email">Email address</label><Input id="inquiry-email" type="email" name="email" autoComplete="email" required maxLength={254}/></div>
    </div>
    <div className="form-field"><label htmlFor="inquiry-company">Company <span>(optional)</span></label><Input id="inquiry-company" name="company" autoComplete="organization" maxLength={160}/></div>
    <div className="form-field"><label htmlFor="inquiry-message">What can I help with?</label><Textarea id="inquiry-message" name="message" required rows={7} maxLength={10000}/></div>
    <div className="form-submit"><Button className="inquiry-submit" type="submit" disabled={!endpoint || state === 'sending'}>{state === 'sending' ? 'Sending...' : 'Send inquiry'} <ArrowUpRight size={18}/></Button>
      {!endpoint && <p>The form is being connected. Please email <a href="mailto:leave117@gmail.com">leave117@gmail.com</a> directly for now.</p>}
      {message && <p role={state === 'error' ? 'alert' : 'status'}>{message}</p>}
    </div>
  </form>;
}
