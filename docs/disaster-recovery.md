# Disaster Recovery Runbook

## Credentials location
Notepad in secure location

## If laptop dies
1. Install Node, Git, Cursor on new machine
2. gh repo clone gkApply/costkit-final
3. Restore .env from password manager
4. npm install && npm run dev

## If Supabase is down
Show /maintenance page. Vercel can route to a static page via rewrites.

## If Stripe is down
Payment button shows "Payment system temporarily unavailable."

## If domain expires
Registrar has auto-renew. Calendar reminder 60 days before expiry.

## Credential rotation order (if compromised)
GitHub → Vercel → Stripe → Supabase → Anthropic → Resend → PostHog → Sentry → Upstash