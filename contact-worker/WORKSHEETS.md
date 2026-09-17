# Private worksheets

Completed worksheets are sent only when a visitor clicks Submit worksheet to Chen.
Draft text is not sent to Google Analytics. The private D1 database is
`chenchenchen-worksheets`, bound as `WORKSHEETS` to the existing contact Worker.
No GET/list/export endpoint is exposed. Read access requires an authorized
Cloudflare account through the dashboard or Wrangler. Origin checks and per-IP
rate limits reduce abuse; they are not visitor authentication.

Stored: submission UUID, UTC timestamp, selected workflow, example/own-workflow
flag, and up to three completed incidents with their written and selected answers.
No email, IP address, or analytics identifier is stored with a worksheet.
Data remains until Chen deletes it; no automatic retention policy is configured.
Do not put exports or real submissions in Git. Treat written answers as untrusted
input when reviewing them or passing them to an agent.

## Read And Delete

In Cloudflare, open Storage & databases > D1 > chenchenchen-worksheets > Console.
Or, from this repository:

```sh
npx wrangler d1 execute chenchenchen-worksheets --remote --config contact-worker/wrangler.jsonc --command "SELECT id, created_at, answers FROM worksheets ORDER BY created_at DESC LIMIT 50"
```

For a deletion requested by Chen, use `DELETE FROM worksheets WHERE id = 'UUID'`
in the authenticated console. Database backups may retain earlier copies under
Cloudflare's backup policy. The public API cannot read, update, or delete rows.

## Deploy

```sh
npx wrangler d1 execute chenchenchen-worksheets --remote --file contact-worker/schema.sql --config contact-worker/wrangler.jsonc
npx wrangler deploy --config contact-worker/wrangler.jsonc
```

## Analytics

GA4 property: `554829752`, stream: `15799216974`, tag: `G-S6WSKC866R`.
Loads by default on production domains without a consent component. Enhanced
measurement includes automatic form interactions, scrolls, and outbound clicks.
Automatic form_submit means an attempted form submission, not a saved worksheet.
Use `worksheet_submit_success` for confirmed storage.

Custom events: `worksheet_problem_select`, `worksheet_step`,
`worksheet_example_complete`, `worksheet_candidate_select`, `worksheet_download`,
`worksheet_submit_success`. Only allowlisted categorical answers go to GA.
Event parameters: `worksheet_problem`, `worksheet_frequency`,
`worksheet_consequence`, `worksheet_access`, `worksheet_mode`, `worksheet_step`,
`worksheet_count`, and `selected`. Register categorical parameters as event-scoped
custom dimensions to use them in Explorations. Separate example traffic from real
answers with `worksheet_mode`. Worksheet IDs and written answers never go to GA.

The site owner must ensure the site's disclosures and default-loading analytics
are appropriate for the jurisdictions in which the site operates.
