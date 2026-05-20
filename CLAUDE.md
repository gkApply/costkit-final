# CLAUDE.md — v3.2

> **What this is.** Project memory and architectural reference for Claude Code / Cursor.
> Read at the start of every session. Update after every session where something new is learned, decided, or deferred.
>
> This file is committed to the repo. Everyone working on the project (human or AI) reads this first.
>
> **v3.2 note.** API routes live at `/api/*.ts` at repo ROOT (Vercel convention), not `src/api/`. `profiles` uses a single `id` column. PostHog session replay masks all inputs. Migrations go through `supabase/migrations/`, not the SQL Editor. 7 pre-launch gates (added cross-browser gate).

**Last updated:** `2026-04-27`

---

## PRODUCT

**One-sentence description:**
A Canada-focused SaaS workspace that brings financial tools, valuation inputs, and reference data into one place for analysts and CBV firms.

**Target customer:**
Canadian valuation professionals — especially family-law CBVs and small-to-mid-sized CBV firms — who need cost of capital tools, reference datasets, and analyst workflow support without paying for multiple expensive platforms.

**Value proposition:**
A cheaper, Canada-first, more accessible alternative to scattered sources and premium U.S.-centric platforms, putting core valuation workflows and supporting data in one place.

**Business model:**
Freemium. Free tier with limited public tools and lookups. Pro Firm: C$79/month or C$790/year. Future team/advanced tier planned at ~C$139/month.

**Current stage:** `pre-launch`

---

## SUCCESS METRICS

### North Star

**Weekly Active Output Accounts** — number of firm accounts generating at least 3 substantive analyst outputs in a rolling 7-day period.

- Current value: `0 (pre-launch)`
- 30-day target: `[set after first users onboard]`
- 90-day target: `[set after first users onboard]`

### Supporting metrics

1. % of new accounts completing the activation event within 7 days
2. Week-over-week Pro Firm subscriber growth (paid seats)
3. 30-day retention: % of Pro Firm accounts still active one billing cycle after subscribing

### Activation event

A new user is activated when they, **within 7 days of signup**, do all three:

1. Create or open a project/file
2. Generate one cost-of-capital or premium analysis output
3. Export or copy a usable work-product artifact

### Churn leading indicator

Pro Firm accounts that don't generate any output in a 14-day window are high-risk for churn the following billing cycle.

---

## ARCHITECTURE

### Stack

- **Frontend:** Vite + React + TypeScript (strict) + **Tailwind CSS v4** (CSS-first config via `@theme` in `src/index.css` — NO `tailwind.config.ts`)
- **Tailwind plugin:** `@tailwindcss/vite` (no PostCSS config)
- **Animations:** `tw-animate-css` (replaces `tailwindcss-animate`)
- **UI primitives:** shadcn/ui new-york style (in `src/components/ui/` — do not edit; barrel-exported via `index.ts`)
- **Icons:** lucide-react only
- **Routing:** react-router-dom **^6** (pinned; v7 imports change but our patterns work as-is)
- **SEO:** `usePageMeta` hook (direct `document.title` + meta updates — NO `react-helmet-async`)
- **State management:**
  - **Server data** (anything from Supabase or APIs): **TanStack Query** (`useQuery`, `useMutation`). Install by default at Phase 6.
  - **UI-only state** (modals, toggles, form inputs before submit): React `useState`. No library.
  - **Global client state** (user session, theme): React Context or Zustand. Add only if prop-drilling reaches 3+ levels.
  - **Redux:** not used in this project. Do not add.
- **Database + Auth:** Supabase (region: `ca-central-1` — Canadian data residency for Canadian clients)
- **Payments:** Stripe (live mode after launch, test mode for development); subscription lifecycle tested with test clock (Phase 7B.4)
- **Email:** Resend (from `gaurav@applyout.com` until `hello@costkit.com` is live — update when domain is registered)
- **AI:** Anthropic `claude-sonnet-4-6` (or current — verify at docs.anthropic.com/models)
- **Rate limiting:** Upstash Redis via `@upstash/ratelimit` — TWO layers: IP-keyed (catches floods + throwaway accounts) + user-keyed (per-tier)
- **Error tracking:** Sentry v10 (`@sentry/react` + `@sentry/vite-plugin` as devDep)
- **Analytics:** PostHog (only loaded after cookie consent, session replay masks all inputs)
- **Uptime:** UptimeRobot monitoring homepage, `/api/health`, `/api/webhook`
- **Hosting:** Vercel (project: `costkit-web`); staging environment from Phase 7B
- **Domain:** `costkit.com` — NOT YET REGISTERED. Register before Phase 10. Recommended registrar: Porkbun or Cloudflare Registrar.
- **Node:** 22 LTS (active until April 2027) — pinned in `.nvmrc`
- **ESLint:** v9 flat config (`eslint.config.js`)

### Development origin

This project was scaffolded locally in Cursor (Phase 4 of playbook v3.2). Every commit comes from this repo. There was no external scaffold fork or Lovable import step. The folder structure was created according to `PROJECT_STRUCTURE.md` from the very first commit.

### API routes location (critical)

API routes live at **`/api/*.ts` at the REPO ROOT**, NOT inside `src/`.

- `/api/generate.ts` ✅ (deploys as Vercel serverless function)
- `src/api/generate.ts` ❌ (bundled into static dist/, never executes as a function — silent failure)

This is a Vercel convention. If you see a file in `src/api/`, it's wrong. Move it.

### TypeScript configuration

`tsconfig.json` enforces strict mode with:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

Never disable any of these without documenting why in the decisions log. Never use `// @ts-ignore` — use `// @ts-expect-error` with a comment explaining the reason.

### Key files

**Configuration (split for maintainability):**

- `src/config/site.ts` — brand identity, nav, per-route meta tags, social links
- `src/config/content.ts` — all visible page copy (hero, features, testimonials, faq, etc.)
- `src/config/pricing.ts` — plans, prices, Stripe price IDs
- `src/config/env.ts` — env var validation; throws clear errors at startup if any required var is missing

**Design system:**

- `src/index.css` — **ALL ATOMIC DESIGN TOKENS** via Tailwind v4 `@theme` block. Colours, fonts, radius.
- `src/components/ui/variants.ts` — **ALL COMPONENT TOKENS**. CVA configs for buttonVariants, cardVariants, badgeVariants, inputVariants, navTabVariants, linkVariants. Never style these inline.
- `src/components/ui/index.ts` — barrel export of shadcn primitives

**App entry:**

- `vercel.json` — function timeouts + security headers (incl. CSP)
- `src/App.tsx` — router setup. NO HelmetProvider (we use `usePageMeta` hook).
- `src/main.tsx` — Sentry init (first import) + createRoot with React 19 error handlers

**Library:**

- `src/lib/supabase.ts` — Supabase client singleton (anon key from env.ts)
- `src/lib/stripe.ts` — Stripe SDK + helpers
- `src/lib/email.ts` — Resend wrapper, transactional email senders
- `src/lib/ratelimit.ts` — Upstash instances (IP-keyed + per-tier user-keyed)
- `src/lib/logger.ts` — structured logger (JSON in prod, pretty in dev). NEVER use console.log.
- `src/lib/analytics.ts` — PostHog wrapper (guarded by consent, masks all inputs on session replay)
- `src/lib/sentry.ts` — Sentry init module (imported first in main.tsx)

**Database:**

- `supabase/migrations/` — SQL migrations. All schema changes go through here, never the SQL Editor.

**API routes (at repo root):**

- `api/generate.ts` — AI generation endpoint (IP rate limit + auth + user rate limit + subscription gate + usage tracking)
- `api/webhook.ts` — Stripe webhook handler (idempotent, signature-verified, raw body)
- `api/create-checkout.ts` — Stripe Checkout Session creator (monthly/annual)
- `api/customer-portal.ts` — Stripe Billing Portal redirect
- `api/delete-account.ts` — GDPR account deletion (cancel Stripe, purge data, delete auth user)
- `api/feedback.ts` — public feedback form endpoint
- `api/health.ts` — UptimeRobot health check endpoint
- `api/cron/onboarding.ts` — Vercel cron for Day 2 + Day 5 onboarding emails

**Layout:**

- `src/components/layout/AuthGuard.tsx` — wraps protected routes
- `src/components/layout/PageMeta.tsx` — `usePageMeta` hook (direct `document.title` + meta tag updates)

### Supabase tables

> Fill in product-specific tables at Phase 6 checkpoint.

| Table                     | RLS                                                                                                                                     | Purpose                                                |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `profiles`                | ✅ on — SELECT/UPDATE scoped to `auth.uid() = id`; single `id` column REFERENCES auth.users; auto-created via `handle_new_user` trigger | User profile + subscription status                     |
| `ai_usage`                | ✅ on — SELECT/INSERT scoped to `auth.uid() = user_id`, no UPDATE/DELETE                                                                | Per-request AI cost tracking                           |
| `stripe_events`           | ✅ on — no policies for `authenticated` role (service-role only)                                                                        | Webhook idempotency                                    |
| `feedback`                | ✅ on — INSERT public, SELECT service-role only                                                                                         | User feedback submissions                              |
| `[projects / workspaces]` | `[TBD — Phase 6]`                                                                                                                       | User valuation projects/files                          |
| `[outputs / analyses]`    | `[TBD — Phase 6]`                                                                                                                       | Generated cost-of-capital and premium analysis outputs |

Every table has RLS enabled from creation. No exceptions. The `handle_new_user` trigger auto-creates a `profiles` row on every signup.

### Design system

> Fill in at Phase 5 checkpoint after Phase 3 token generation is complete.

- **Brand:** primary `[TBD — Phase 3]` (brand-500), neutral ramp `[TBD]`
- **Headings:** `[TBD — Phase 3]`
- **Body:** `[TBD — Phase 3]`
- **Border radius style:** `[TBD — Phase 3]`
- **Personality:** professional, trustworthy, Canada-first

---

## SUBSCRIPTION MODEL

### Tiers

| Tier              | Price               | Rate limit          | Key features                                                                |
| ----------------- | ------------------- | ------------------- | --------------------------------------------------------------------------- |
| **Free**          | C$0                 | 5 AI outputs/month  | Limited public tools + lookups; no export; no project saving                |
| **Pro Firm**      | C$79/mo or C$790/yr | 50 AI outputs/month | Full cost-of-capital tools, reference datasets, export/copy, project saving |
| **Team (future)** | ~C$139/mo           | TBD                 | Multi-user firm seats, advanced features — not in v1                        |

### Subscription status flow

`free` → (upgrades) → `trialing` → `active` → `past_due` → `canceled`

- `past_due`: show payment failed banner + Stripe portal link; gate premium features
- `canceled`: redirect to /pricing with "Your subscription has ended" message

### Stripe price IDs

> Fill in at Phase 7B after creating products in Stripe dashboard.

- `STRIPE_PRICE_ID_PRO_MONTHLY` = `[TODO — Phase 7B]`
- `STRIPE_PRICE_ID_PRO_ANNUAL` = `[TODO — Phase 7B]`

---

## ENVIRONMENT VARIABLES

> Never put actual values here. This is the map of what exists and where it's used.
> Actual values live in `.env` (local, gitignored) and Vercel environment variables (production).

| Variable                        | Used in                                    | When added |
| ------------------------------- | ------------------------------------------ | ---------- |
| `VITE_SUPABASE_URL`             | `src/config/env.ts`, `src/lib/supabase.ts` | Phase 6    |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `src/config/env.ts`, `src/lib/supabase.ts` | Phase 6    |
| `SUPABASE_SECRET_KEY`           | API routes only (server-side)              | Phase 6    |
| `ANTHROPIC_API_KEY`             | `api/generate.ts`                          | Phase 7A   |
| `UPSTASH_REDIS_REST_URL`        | `src/lib/ratelimit.ts`                     | Phase 7A   |
| `UPSTASH_REDIS_REST_TOKEN`      | `src/lib/ratelimit.ts`                     | Phase 7A   |
| `VITE_STRIPE_PUBLISHABLE_KEY`   | `src/lib/stripe.ts` (client-side)          | Phase 7B   |
| `STRIPE_SECRET_KEY`             | API routes                                 | Phase 7B   |
| `STRIPE_WEBHOOK_SECRET`         | `api/webhook.ts`                           | Phase 7B   |
| `STRIPE_PRICE_ID_PRO_MONTHLY`   | `api/create-checkout.ts`                   | Phase 7B   |
| `STRIPE_PRICE_ID_PRO_ANNUAL`    | `api/create-checkout.ts`                   | Phase 7B   |
| `RESEND_API_KEY`                | `src/lib/email.ts`                         | Phase 7C   |
| `EMAIL_FROM`                    | `src/lib/email.ts`                         | Phase 7C   |
| `VITE_SENTRY_DSN`               | `src/lib/sentry.ts`                        | Phase 7D   |
| `SENTRY_AUTH_TOKEN`             | `vite.config.ts` (source maps upload)      | Phase 7D   |
| `VITE_POSTHOG_KEY`              | `src/lib/analytics.ts`                     | Phase 7D   |
| `VITE_POSTHOG_HOST`             | `src/lib/analytics.ts`                     | Phase 7D   |
| `VITE_APP_VERSION`              | `src/lib/sentry.ts`                        | Phase 7D   |

---

## ROUTES MAP

### Public routes (no auth required)

| Path              | Page                    | Notes                               |
| ----------------- | ----------------------- | ----------------------------------- |
| `/`               | `HomePage.tsx`          | Composes all marketing sections     |
| `/pricing`        | `PricingPage.tsx`       | Shows Free vs Pro Firm tiers        |
| `/about`          | `AboutPage.tsx`         | Product story, Canadian focus, team |
| `/contact`        | `ContactPage.tsx`       | Contact form → `api/feedback.ts`    |
| `/feedback`       | `FeedbackPage.tsx`      | Public feedback form                |
| `/changelog`      | `ChangelogPage.tsx`     | Reads `CHANGELOG.md`                |
| `/terms`          | `TermsPage.tsx`         | Terms of Service                    |
| `/privacy`        | `PrivacyPage.tsx`       | Privacy Policy                      |
| `/refund-policy`  | `RefundPolicyPage.tsx`  | Refund Policy                       |
| `/acceptable-use` | `AcceptableUsePage.tsx` | Acceptable Use Policy               |

### Auth routes

| Path               | Page                     | Notes                |
| ------------------ | ------------------------ | -------------------- |
| `/login`           | `LoginPage.tsx`          | Email + Google OAuth |
| `/signup`          | `SignupPage.tsx`         | Email + Google OAuth |
| `/forgot-password` | `ForgotPasswordPage.tsx` | Sends reset email    |
| `/reset-password`  | `ResetPasswordPage.tsx`  | Handles reset token  |

### App routes (AuthGuard — redirects to /login if not authenticated)

| Path         | Page                | Notes                                    |
| ------------ | ------------------- | ---------------------------------------- |
| `/dashboard` | `DashboardPage.tsx` | Home screen after login; recent projects |
| `/workspace` | `ToolPage.tsx`      | Main AI-powered valuation workspace      |
| `/account`   | `AccountPage.tsx`   | Profile, password, account deletion      |
| `/billing`   | `BillingPage.tsx`   | Subscription status, upgrade, portal     |

---

## GIT TAGS (phase gates)

```bash
git tag -a phase-4-scaffold     -m "Scaffold complete, all routes render, tooling in place"
git tag -a phase-5-static-pages -m "All public pages built, ready for feedback"
git tag -a phase-5.5-preview    -m "Static preview deployed, feedback collected"
git tag -a phase-6-auth         -m "Auth + DB working, RLS verified"
git tag -a phase-7a-ai          -m "AI route + tool page working"
git tag -a phase-7b-stripe      -m "Stripe checkout + webhook working, staging live"
git tag -a phase-7c-email       -m "Email + DNS + onboarding sequence working"
git tag -a phase-7-commercial   -m "All commercial features working"
git tag -a phase-9-gates        -m "All 7 pre-launch gates passed"
git tag -a v1.0.0               -m "Launch"
git push --tags
```

---

## LEGAL PAGES

All four policies are drafted in `docs/legal/` and rendered from markdown at these routes:

- `/terms` — Terms of Service
- `/privacy` — Privacy Policy
- `/refund-policy` — Refund Policy
- `/acceptable-use` — Acceptable Use Policy

**Canadian legal note:** Policy drafts should be reviewed by a Canadian lawyer before launch, particularly regarding PIPEDA/Law 25 (Quebec) privacy obligations for Canadian clients.

---

## KNOWN ISSUES

> Update this list every session. Remove items when fixed.

- `[No known issues yet — pre-scaffold]` — tracking starts when first code is written

---

## LESSONS LEARNED

> Add every non-obvious thing you (or the AI) learned. Keeps future sessions from relearning.

- `[e.g. Stripe webhook must receive raw body, not parsed JSON — configured at route level]`
- `[e.g. iOS Safari zooms inputs with font-size < 16px — every input got text-base minimum]`
- `[e.g. usePageMeta hook needs to run inside route components, not above the router; otherwise meta updates lag a navigation behind]`
- `[e.g. Supabase client needs detectSessionInUrl: true for password-reset redirect links to work]`
- **Domain not yet registered** — all domain-dependent features (email, production deploy, DNS) deferred until costkit.com is acquired. Register this before Phase 10.

---

## DECISIONS LOG

> Architectural decisions, with date and reason. Future-you will thank present-you.

- **2026-04-25 — Canada-focused product scope (not generic global).** Reason: Canadian valuation professionals (CBVs) face a specific gap — U.S.-centric platforms don't serve Canadian data, regulations, or practice conventions well. Narrowing to Canada is the wedge, not the ceiling.
- **2026-04-25 — Supabase region: ca-central-1.** Reason: Canadian data residency is a legitimate selling point and reduces friction with Canadian firm privacy obligations (PIPEDA, Law 25). Most competitors are US-hosted.
- **2026-04-25 — Freemium model with Pro Firm at C$79/mo.** Reason: Lower than U.S. competitors, priced in CAD so no FX friction for target customers, free tier creates low-risk trial path.
- **2026-04-25 — Built locally in Cursor from day one (no Lovable).** Reason: Full control of code from first commit, no fork/merge overhead, same developer experience throughout project lifetime.
- **2026-04-25 — Static preview deployed before backend (Phase 5.5).** Reason: Validate messaging with real valuation professionals before investing in auth/payment code. CBV community is small and specific — positioning must be right.
- **2026-04-25 — No dark mode in v1.** Reason: Adds ~30% more visual QA work, professional tools audience typically works in light mode. Revisit if users request it post-launch.
- **2026-04-25 — Domain not yet registered.** Reason: Continuing build-first, register costkit.com before Phase 10 deploy. Monitor availability.
- **2026-04-25 — Temporary "from" email: gaurav@applyout.com.** Reason: costkit.com not yet registered. Switch to hello@costkit.com after domain is acquired and Resend DNS is configured.
- **2026-04-25 — Set html font-size to 14px as a deliberate design decision.** Reason: CostKit targets professional analyst users working in dense tool interfaces (comparable to Bloomberg, Refinitiv, and financial modeling software), where a 14px base is common. This intentionally deviates from FS Section 2.1 (consumer-web defaults) while preserving rem-based scaling and design-system predictability.
- `[add more as decisions are made]`

- 2026-04-28 — Implemented Supabase Auth (Phase 6). Email/password + Google OAuth.
  Supabase new key format: VITE_SUPABASE_PUBLISHABLE_KEY replaces VITE_SUPABASE_ANON_KEY.
  SUPABASE_SECRET_KEY replaces SUPABASE_SERVICE_ROLE_KEY.
  handle_new_user trigger auto-creates profiles row on every signup.
  AuthGuard redirects unauthenticated users to /login?next=[path].
  Email confirmation required before login. Google OAuth in Testing mode.
  Default Supabase email has rate limits — switch to Resend in Phase 7C.

- 2026-04-28 — AppLayout uses AuthGuard wrapping Outlet. All protected routes
  (/dashboard, /account, /billing) are gated. Auth pages use AuthLayout which
  includes Navbar and Footer.

---

## NOT BUILDING (v1 scope limit)

Explicit list of features we will **NOT** build in v1. Review when asked for additions — everything on this list is a "no" until v1 ships and gets traction.

- AI valuation report drafting (full narrative generation)
- CanLII decision summaries as a core launch feature
- Broad multi-product platform covering everything equally — v1 is the cost-of-capital / valuation wedge only
- Full enterprise workflow / admin complexity (role management, audit logs, org hierarchy)
- Deep collaboration features beyond basic firm-seat access
- Custom proprietary salary dataset built from scratch
- Marketplace or community features
- Heavy automation of analyst judgment for all cost-of-capital decisions — the tool supports, not replaces, professional judgment
- Giant all-in-one library with 20 equal-priority tools
- Anything outside the Canada-focused valuation / analyst workflow wedge

When someone asks for one of these, the answer is "not until v1 ships and proves traction."

---

## PRE-LAUNCH GATE STATUS

From Phase 9 of the Stage Playbook v3.2. All seven must be PASS before launch.

- [ ] **Gate 1 — Security:** RLS verified, no secrets in code, headers configured, rate limits enforced, webhook signature verification tested
- [ ] **Gate 2 — Performance:** Lighthouse 85+ mobile on `/`, `/pricing`, `/workspace`; LCP < 2.5s, INP < 200ms, CLS < 0.1
- [ ] **Gate 3 — Frontend standards:** `FRONTEND_STANDARDS.md` Section 29 audit returns READY (zero critical fails)
- [ ] **Gate 4 — Accessibility:** axe clean; full keyboard test pass; WCAG 2.2 AA
- [ ] **Gate 5 — SEO:** unique titles + descriptions on every page; OG images; robots.txt; sitemap; structured data
- [ ] **Gate 6 — Full QA flow:** real payment end-to-end works; account deletion works; activation event flow tested
- [ ] **Gate 7 — Cross-browser:** smoke test passed on Chrome, Firefox, Safari desktop, iOS Safari (real device), Android Chrome (real device)

---

## FRONTEND STANDARDS — SUMMARY REFERENCE

This is a compressed summary of `FRONTEND_STANDARDS.md` for quick reference. The full document is in the repo root.

1. **Tokens only.** No arbitrary Tailwind values or hardcoded hex.
2. **All 5 interactive states** on every button/link/input: default, hover, focus-visible:ring-2, active, disabled:opacity-50.
3. **Type scale** in rem. Body text minimum text-base (16px) on mobile.
4. **Mobile-first.** 375px first, then md: (768) and lg: (1024).
5. **Semantic HTML first.** `<button>` for actions, `<a href>` for navigation. ARIA only when native semantics fall short.
6. **WCAG 2.2 AA.** 4.5:1 body contrast, 3:1 UI contrast.
7. **Images:** every `<img>` has width, height, alt, loading. Prevents CLS and serves screen readers.
8. **Forms:** every `<input>` has a visible `<label>`, correct type, autoComplete. Placeholder is NEVER a label.
9. **Loading states:** skeleton or spinner with aria-busy. No blank screens on load.
10. **Error states:** specific messages not generic ("Error"). Actionable next step.
11. **Empty states:** explanation + primary CTA. Never a blank page.
12. **Modals:** focus trap, Esc to close, scroll lock on body, return focus to trigger on close.
13. **Motion:** 150–200ms transitions. Respect `prefers-reduced-motion`.
14. **Typography pairing:** max 2 font families. Display for headings, sans for body.
15. **Colour system:** brand ramp 50–950, neutral ramp, semantic colours (success/warning/danger/info).
16. **Spacing:** 4px base. Section padding responsive (py-16 md:py-20 lg:py-24).
17. **Z-index:** tokens only. Never z-[9999].
18. **Performance:** LCP < 2.5s mobile, INP < 200ms, CLS < 0.1. Bundle < 170KB gzipped.
19. **SEO:** unique title + description per page, OG image, canonical, JSON-LD.
20. **Touch targets:** 44x44px minimum on mobile.

Full prose in `FRONTEND_STANDARDS.md`. Bring specific sections into Cursor with audit or single-section mode.

---

## AI INSTRUCTIONS FOR THIS PROJECT

When Claude Code / Cursor works on this project:

1. Read `FRONTEND_STANDARDS.md`, `PROJECT_STRUCTURE.md`, and this file at session start.
2. Confirm rules understanding before writing code.
3. Non-trivial tasks: produce a plan first, wait for approval.
4. Iron Law on bugs: explain root cause before fixing.
5. After each session, propose updates to this CLAUDE.md — new lessons, new decisions, changed architecture.
6. Never hardcode: brand/nav/meta in `site.ts`, section copy in `content.ts`, pricing in `pricing.ts`, atomic tokens in `src/index.css` `@theme`, component shapes in `src/components/ui/variants.ts`.
7. Never skip: all 5 interactive states, RLS on new tables, rate limiting on user-input APIs.
8. If asked to violate a rule, push back — your job is to protect quality and security.
9. Use conventional commits: `feat/fix/chore/docs/style/refactor/test/perf/ci` with optional scope.
10. Never parse JSON body in `/api/webhook` — raw body is required for Stripe signature verification.
11. **Product context:** This is a professional valuation tool for Canadian CBVs. Output language should be precise and technical where appropriate. Never suggest oversimplifying financial terminology for the target audience — they are professionals.

---

## CHANGELOG OF THIS FILE

- `2026-04-25` — Initial version from v3.2 template, filled with CostKit product details
- `[YYYY-MM-DD]` — Phase 5 checkpoint: fill in completed sections, copy file structure, brand tokens
- `[YYYY-MM-DD]` — Phase 6 checkpoint: schema, RLS policies, auth flow, env var names
- `[YYYY-MM-DD]` — Phase 7B checkpoint: Stripe env vars, webhook events, subscription status flow

---

## CHECKPOINT INSTRUCTIONS

This file gets updated at three explicit checkpoints during the build.

**End of Phase 5 (static pages built):**

- Confirm split config files (`site.ts` / `content.ts` / `pricing.ts`) match what was actually built
- Fill in real brand colour values, radius style, font names in the Design system section above
- Note any sections added or removed vs the scaffold prompt
- Note any patterns established (e.g. "all sections wrap in `<Section>`, all use `<PageContainer>`")

**End of Phase 6 (auth + DB):**

- Fill in the Supabase tables with actual columns and RLS policies
- Note auth flow architecture (redirect target after login, how AuthGuard works)
- Confirm `.env` variable names match what `env.ts` expects
- Add any product-specific tables created (projects, outputs, etc.)

**End of Phase 7B (Stripe):**

- Fill in Stripe price IDs (monthly and annual)
- List all webhook events handled and what each updates in the DB
- Document subscription status state machine edge cases found in testing
- Note customer portal + checkout route paths

## Phase 6 + FX Tool — Completed May 2026

### Auth status

- Supabase project: bdlzerxbneewlxpjkddq (Canada Central, Nano)
- Google OAuth client created April 28 — NOT YET wired into Supabase Auth providers
- Auth pages exist: Login, Signup, ForgotPassword, ResetPassword
- AuthGuard, AuthContext, useAuth all built
- Initial schema migration: 20260425000001_initial_schema.sql pushed

### FX Rate Tool — completed

- Migration: supabase/migrations/20260429000002_fx_rates.sql
- Tables: fx_currencies (27 rows seeded), fx_rates_daily (~100k rows), fx_fetch_log
- RPC function: get_fx_rate_table(p_currency_code, p_selected_date, p_basis)
- Data: legacy noon rates 2010–2017, current daily rates 2017–present
- Weekly cron: api/cron/fx-update.ts — runs Saturday 5 AM UTC
- Tool page: src/pages/tools/macro/ExchangeRatePage.tsx
- Route: /macro/exchange-rate
- Tool card: added to tools.ts under macro/Rates

### Env vars

- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- CRON_SECRET
  All four set in Vercel Production environment.

### Known issues / decisions

- vercel.json functions block: only list api/cron/fx-update.ts — other Phase 7 routes
  do not exist yet, adding them breaks the build
- supabase.ts reads VITE_SUPABASE_ANON_KEY (not PUBLISHABLE_KEY)
- ExchangeRatePage uses native <select> not shadcn Select — avoids z-index
  conflict with navbar
- CLAUDE.md last updated: May 2026 after Phase 6 + FX tool

### Next: Phase 6 remaining

- Wire Google OAuth into Supabase Auth → Providers → Google
- Test full auth flow end to end
- Account deletion route (api/delete-account.ts)
- Security review per playbook Step 6.10
