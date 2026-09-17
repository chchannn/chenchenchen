# Contact email endpoint

No database. The Worker validates and rate-limits JSON submissions, then sends
plain-text email to the fixed recipient leave117@gmail.com via Resend.

## Deployment

- Worker: `chenchenchen-contact`
- Endpoint: `https://chenchenchen-contact.chen-field-notes.workers.dev/contact`
- Sender: `Chen Website <inquiries@chenchenchen.me>`
- Secret: `RESEND_API_KEY`, stored in Cloudflare, never in this repository.
- DNS at Squarespace: Resend DKIM TXT at `resend._domainkey`, and CNAMEs
  `rsend` -> `rsend.forge.rmta.net`, `send` -> `send.forge.rmta.net`.
- Receiving is disabled. Existing website and email-security records are preserved.

Do not enable the frontend until sender verification and HTTPS endpoint checks
pass. Confirm delivery with a live form submission before declaring it active.

## Setup

1. Sign in with `npx wrangler login`.
2. Verify chenchenchen.me in Resend using its supplied DNS records.
3. Store a sending-only Resend key with
   `npx wrangler secret put RESEND_API_KEY --config contact-worker/wrangler.jsonc`.
4. Deploy with `npx wrangler deploy --config contact-worker/wrangler.jsonc`.
5. The frontend defaults to the endpoint above. To use another Worker, set
   `NEXT_PUBLIC_CONTACT_ENDPOINT` when running `npm run build:pages`, then
   publish `dist/client`. An empty value disables submission.

Never put the Resend key in public environment variables or source control.
The unconfigured form offers direct email and does not pretend it can send.

## Verification

Run `node --test contact-worker/index.test.mjs`. Test real delivery after account
setup; API acceptance alone is not evidence that a message reached the inbox.
The per-IP limit is a lightweight abuse control and can group shared networks.
Add Turnstile if automated abuse becomes a problem.
