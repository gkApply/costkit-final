# PROJECT_STRUCTURE.md
## Codebase Architecture for Professional Commercial Websites
## Stack: Vite + React + TypeScript + Tailwind + Supabase + Stripe + Resend

This document defines the complete folder structure, file architecture, and
content organisation for every project. The core principle is separation of
concerns: ALL text content lives in one file, ALL design tokens live in one
file, ALL page structure is composed from reusable sections. Changing the
look, feel, or copy of any page means editing ONE file, not hunting through
fifteen components.

---

## PART 1 — FULL FOLDER STRUCTURE

```
your-project/
│
├── public/
│   ├── og-image.png          1200x630 — Open Graph image for social sharing
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   ├── robots.txt
│   └── sitemap.xml           Generated or maintained manually
│
├── src/
│   │
│   ├── config/               ← THE MOST IMPORTANT FOLDER
│   │   ├── site.ts           ALL text content for every page (nav, hero,
│   │   │                     features, pricing, footer, SEO meta)
│   │   └── tokens.ts         Re-exports design token values as JS constants
│   │                         for use in components if needed
│   │
│   ├── styles/
│   │   ├── globals.css       Tailwind directives, CSS variables, base resets,
│   │   │                     prefers-reduced-motion rule, font imports
│   │   └── typography.css    Optional: @layer base overrides for prose styles
│   │
│   ├── lib/
│   │   ├── supabase.ts       Supabase client — single instance, used everywhere
│   │   ├── stripe.ts         Stripe client initialisation
│   │   ├── email.ts          Resend email sending functions
│   │   ├── logger.ts         Structured logger (not console.log)
│   │   ├── ratelimit.ts      Upstash Redis rate limiting helpers
│   │   └── utils.ts          cn() helper, formatters, shared utilities
│   │
│   ├── types/
│   │   ├── database.ts       Supabase generated types (from supabase gen types)
│   │   ├── auth.ts           User, Session, Profile types
│   │   └── index.ts          Re-exports all types
│   │
│   ├── hooks/
│   │   ├── useAuth.ts        Current user, session, loading state
│   │   ├── useProfile.ts     User profile data from Supabase profiles table
│   │   ├── useSubscription.ts Stripe subscription status
│   │   └── useToast.ts       Toast notification hook
│   │
│   ├── components/
│   │   │
│   │   ├── ui/               shadcn/ui components — DO NOT edit these directly
│   │   │   ├── button.tsx    (installed via: npx shadcn@latest add button)
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── sheet.tsx     Used for mobile nav drawer
│   │   │   ├── toast.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── card.tsx
│   │   │   ├── separator.tsx
│   │   │   └── ...           Add as needed via npx shadcn@latest add [name]
│   │   │
│   │   ├── layout/           Structural components used on every page
│   │   │   ├── Navbar.tsx    Desktop nav + hamburger mobile nav
│   │   │   ├── Footer.tsx    Footer with links, legal, social
│   │   │   ├── PageContainer.tsx  max-w-7xl wrapper used on every page
│   │   │   ├── Section.tsx   Consistent section padding + optional bg
│   │   │   ├── AuthGuard.tsx Redirects unauthenticated users to /login
│   │   │   └── PageMeta.tsx  <title>, <meta description>, OG tags per page
│   │   │
│   │   ├── sections/         Full-width page sections, composed into pages
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── HowItWorksSection.tsx
│   │   │   ├── PricingSection.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   ├── FAQSection.tsx
│   │   │   ├── CTASection.tsx
│   │   │   ├── LogoBarSection.tsx    Trusted by / social proof logos
│   │   │   └── StatsSection.tsx      Numbers that show product value
│   │   │
│   │   ├── cards/            Reusable card components
│   │   │   ├── FeatureCard.tsx
│   │   │   ├── PricingCard.tsx
│   │   │   ├── TestimonialCard.tsx
│   │   │   └── BlogCard.tsx
│   │   │
│   │   ├── forms/            Form components with validation
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   ├── ForgotPasswordForm.tsx
│   │   │   ├── ResetPasswordForm.tsx
│   │   │   ├── ProfileForm.tsx
│   │   │   ├── ContactForm.tsx
│   │   │   └── FeedbackForm.tsx
│   │   │
│   │   └── shared/           Small reusable components
│   │       ├── Logo.tsx      Your logo as a component
│   │       ├── Badge.tsx     Custom styled badge/pill
│   │       ├── Skeleton.tsx  Loading skeleton shapes
│   │       ├── ErrorState.tsx  Error display with retry
│   │       ├── EmptyState.tsx  Empty list / no data state
│   │       └── LoadingSpinner.tsx
│   │
│   ├── pages/                Route-level components — compose sections
│   │   │
│   │   ├── public/           Accessible without login
│   │   │   ├── HomePage.tsx
│   │   │   ├── PricingPage.tsx
│   │   │   ├── AboutPage.tsx
│   │   │   ├── ContactPage.tsx
│   │   │   ├── BlogPage.tsx
│   │   │   ├── BlogPostPage.tsx
│   │   │   └── legal/
│   │   │       ├── TermsPage.tsx
│   │   │       ├── PrivacyPage.tsx
│   │   │       ├── RefundPage.tsx
│   │   │       └── AcceptableUsePage.tsx
│   │   │
│   │   ├── auth/             Authentication pages
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   ├── ForgotPasswordPage.tsx
│   │   │   └── ResetPasswordPage.tsx
│   │   │
│   │   └── app/              Protected — requires login
│   │       ├── DashboardPage.tsx
│   │       ├── AccountPage.tsx
│   │       ├── BillingPage.tsx
│   │       ├── SettingsPage.tsx
│   │       ├── ToolPage.tsx      Your AI tool or core feature
│   │       └── FeedbackPage.tsx
│   │
│   ├── api/                  Server-side API route handlers
│   │   ├── generate.ts       AI generation endpoint with rate limiting
│   │   ├── create-checkout.ts  Stripe checkout session
│   │   ├── webhook.ts        Stripe webhook handler
│   │   ├── customer-portal.ts  Stripe customer portal
│   │   └── health.ts         Health check endpoint
│   │
│   ├── App.tsx               Router setup — all routes defined here
│   └── main.tsx              Entry point — Sentry, PostHog, React root
│
├── docs/
│   ├── brief.md              Product brief from Phase 1 office-hours
│   ├── design-tokens.md      Design decisions and token rationale
│   └── disaster-recovery.md  Recovery runbook
│
├── .cursorrules              AI editor conventions
├── CLAUDE.md                 Project memory — updated every session
├── FRONTEND_STANDARDS.md     Frontend rules — AI reads this every session
├── PROJECT_STRUCTURE.md      This file
├── CHANGELOG.md              Public-facing changelog
├── .env.example              Shape of .env without real values
├── tailwind.config.ts        ALL design tokens — colours, fonts, spacing
├── vite.config.ts
├── tsconfig.json
├── package.json
└── vercel.json               Security headers, redirects
```

---

## PART 2 — THE TWO FILES YOU EDIT MOST

These two files control everything visual and textual about your site.
Changing copy, colours, fonts, or page text means editing ONLY these files.

---

### FILE: src/config/site.ts
### PURPOSE: Every word of content on every public page lives here.
### HOW TO USE: Import { siteConfig } and use siteConfig.nav.links[0].label etc.

```typescript
// src/config/site.ts
// ─────────────────────────────────────────────────────────────────────────────
// MASTER CONTENT FILE
// Change any text on your site by editing this file.
// Do not hardcode text in page or section components.
// ─────────────────────────────────────────────────────────────────────────────

export const siteConfig = {

  // ── GLOBAL ─────────────────────────────────────────────────────────────────
  name: 'Your App',
  tagline: 'Short punchy tagline under the logo',
  url: 'https://yourapp.com',
  description: '160 character meta description for SEO. Clear, benefit-led, no fluff.',
  ogImage: '/og-image.png',

  // ── NAVIGATION ─────────────────────────────────────────────────────────────
  nav: {
    links: [
      { label: 'Features',  href: '/#features'  },
      { label: 'Pricing',   href: '/pricing'    },
      { label: 'About',     href: '/about'      },
      { label: 'Blog',      href: '/blog'       },
    ],
    cta: {
      label: 'Get started',
      href:  '/signup',
    },
    login: {
      label: 'Log in',
      href:  '/login',
    },
  },

  // ── HERO SECTION ──────────────────────────────────────────────────────────
  hero: {
    badge:       'Now in public beta',        // small pill above headline (optional)
    headline:    'The headline that makes\nyour customer say "yes"',
    subheadline: 'One or two sentences explaining what you do and for whom. Focus on the outcome the customer gets, not the features you built.',
    cta: {
      primary:   { label: 'Start for free',   href: '/signup' },
      secondary: { label: 'See how it works', href: '/#how-it-works' },
    },
    social_proof: 'Trusted by 2,000+ teams worldwide',   // under CTAs
    image: {
      src: '/images/hero-screenshot.webp',
      alt: 'Screenshot of the product dashboard showing key metrics',
      width: 1200,
      height: 750,
    },
  },

  // ── LOGO BAR (social proof logos) ─────────────────────────────────────────
  logoBar: {
    heading: 'Trusted by teams at',
    logos: [
      { name: 'Company One', src: '/logos/company-one.svg', width: 120, height: 32 },
      { name: 'Company Two', src: '/logos/company-two.svg', width: 100, height: 32 },
      // add more as needed
    ],
  },

  // ── FEATURES SECTION ──────────────────────────────────────────────────────
  features: {
    badge:       'Features',
    heading:     'Everything you need to [outcome]',
    subheading:  'A sentence or two that frames what the features section proves.',
    items: [
      {
        icon:        'Zap',          // Lucide icon name — find at lucide.dev
        title:       'Feature one',
        description: 'Two sentences explaining what this feature does and why the customer will care. Benefit-led, not technical.',
      },
      {
        icon:        'Shield',
        title:       'Feature two',
        description: 'Two sentences. Keep each description roughly the same length for visual balance.',
      },
      {
        icon:        'BarChart',
        title:       'Feature three',
        description: 'Two sentences. Avoid jargon. Write as if explaining to a smart non-technical person.',
      },
      {
        icon:        'Clock',
        title:       'Feature four',
        description: 'Two sentences.',
      },
      {
        icon:        'Globe',
        title:       'Feature five',
        description: 'Two sentences.',
      },
      {
        icon:        'Lock',
        title:       'Feature six',
        description: 'Two sentences.',
      },
    ],
  },

  // ── HOW IT WORKS SECTION ─────────────────────────────────────────────────
  howItWorks: {
    badge:      'How it works',
    heading:    'Up and running in minutes',
    subheading: 'A sentence explaining the simplicity of getting started.',
    steps: [
      {
        number:      '01',
        title:       'Create your account',
        description: 'Sign up in under 60 seconds. No credit card required.',
      },
      {
        number:      '02',
        title:       'Connect your data',
        description: 'Link your [whatever they connect] in two clicks.',
      },
      {
        number:      '03',
        title:       'Get results',
        description: 'See [outcome] immediately. No configuration required.',
      },
    ],
  },

  // ── STATS SECTION ─────────────────────────────────────────────────────────
  stats: {
    heading: 'Numbers that matter',
    items: [
      { value: '10,000+', label: 'Active users'   },
      { value: '99.9%',   label: 'Uptime'         },
      { value: '2 min',   label: 'Setup time'     },
      { value: '4.9/5',   label: 'Customer rating' },
    ],
  },

  // ── TESTIMONIALS SECTION ─────────────────────────────────────────────────
  testimonials: {
    badge:      'What customers say',
    heading:    'Don\'t take our word for it',
    subheading: 'Real results from real teams.',
    items: [
      {
        quote:   'The specific outcome or transformation this person experienced. Make it concrete and numbers-driven where possible.',
        author:  'First Last',
        role:    'Job Title, Company Name',
        avatar:  '/avatars/person-one.webp',
        rating:  5,
      },
      {
        quote:   'Another specific outcome. Different angle from the first testimonial.',
        author:  'First Last',
        role:    'Job Title, Company Name',
        avatar:  '/avatars/person-two.webp',
        rating:  5,
      },
      {
        quote:   'A third testimonial addressing a different concern or use case.',
        author:  'First Last',
        role:    'Job Title, Company Name',
        avatar:  '/avatars/person-three.webp',
        rating:  5,
      },
    ],
  },

  // ── PRICING SECTION ───────────────────────────────────────────────────────
  pricing: {
    badge:      'Pricing',
    heading:    'Simple, transparent pricing',
    subheading: 'No hidden fees. Cancel any time.',
    toggle: {
      monthly: 'Monthly',
      annual:  'Annual',
      savings: 'Save 20%',    // shown next to annual toggle
    },
    plans: [
      {
        name:          'Starter',
        description:   'For individuals and small projects.',
        price: {
          monthly:     '$0',
          annual:      '$0',
        },
        stripePriceId: {
          monthly:     '',    // leave empty for free tier
          annual:      '',
        },
        cta:           'Get started free',
        ctaHref:       '/signup',
        highlighted:   false,
        badge:         '',    // e.g. 'Most popular' — leave empty for no badge
        features: [
          '5 projects',
          '1,000 requests / month',
          'Basic analytics',
          'Email support',
        ],
        unavailable: [        // Features NOT included — shown with X mark
          'Advanced analytics',
          'API access',
          'Priority support',
        ],
      },
      {
        name:          'Pro',
        description:   'For growing teams that need more.',
        price: {
          monthly:     '$29',
          annual:      '$23',
        },
        stripePriceId: {
          monthly:     'price_xxxxx_monthly',
          annual:      'price_xxxxx_annual',
        },
        cta:           'Start free trial',
        ctaHref:       '/signup?plan=pro',
        highlighted:   true,       // This plan gets visual emphasis
        badge:         'Most popular',
        features: [
          'Unlimited projects',
          '50,000 requests / month',
          'Advanced analytics',
          'API access',
          'Priority support',
          'Custom domain',
        ],
        unavailable:   [],
      },
      {
        name:          'Enterprise',
        description:   'For large teams with custom needs.',
        price: {
          monthly:     'Custom',
          annual:      'Custom',
        },
        stripePriceId: {
          monthly:     '',
          annual:      '',
        },
        cta:           'Contact sales',
        ctaHref:       '/contact',
        highlighted:   false,
        badge:         '',
        features: [
          'Everything in Pro',
          'Unlimited requests',
          'SLA guarantee',
          'Dedicated support',
          'Custom contracts',
          'SSO / SAML',
        ],
        unavailable:   [],
      },
    ],
    faq: [
      {
        question: 'Can I change plans later?',
        answer:   'Yes. You can upgrade or downgrade at any time from your account settings. Changes take effect immediately.',
      },
      {
        question: 'Is there a free trial?',
        answer:   'Yes. All paid plans include a 14-day free trial with no credit card required.',
      },
      {
        question: 'What payment methods do you accept?',
        answer:   'We accept all major credit and debit cards via Stripe. Bank transfers are available on Enterprise plans.',
      },
      {
        question: 'What is your refund policy?',
        answer:   'If you are not satisfied within the first 30 days, contact us and we will issue a full refund. No questions asked.',
      },
    ],
  },

  // ── FAQ SECTION ───────────────────────────────────────────────────────────
  faq: {
    badge:      'FAQ',
    heading:    'Common questions',
    subheading: 'Everything you need to know before you start.',
    items: [
      {
        question: 'Your most common question here?',
        answer:   'The honest, specific answer. Avoid vague corporate-speak.',
      },
      {
        question: 'Second most common question?',
        answer:   'The answer.',
      },
      // add more as needed
    ],
  },

  // ── CTA SECTION (bottom of page) ─────────────────────────────────────────
  cta: {
    heading:    'Ready to get started?',
    subheading: 'Join thousands of teams using [product] to [outcome].',
    primary:    { label: 'Start for free',  href: '/signup'  },
    secondary:  { label: 'Book a demo',     href: '/contact' },
    note:       'No credit card required. Free forever on Starter.',
  },

  // ── FOOTER ────────────────────────────────────────────────────────────────
  footer: {
    tagline: 'Short description of what your product does.',
    columns: [
      {
        heading: 'Product',
        links: [
          { label: 'Features', href: '/#features' },
          { label: 'Pricing',  href: '/pricing'   },
          { label: 'Changelog', href: '/changelog' },
          { label: 'Roadmap',  href: '/roadmap'   },
        ],
      },
      {
        heading: 'Company',
        links: [
          { label: 'About',   href: '/about'   },
          { label: 'Blog',    href: '/blog'    },
          { label: 'Contact', href: '/contact' },
        ],
      },
      {
        heading: 'Legal',
        links: [
          { label: 'Terms of Service',   href: '/terms'          },
          { label: 'Privacy Policy',     href: '/privacy'        },
          { label: 'Refund Policy',      href: '/refund-policy'  },
          { label: 'Acceptable Use',     href: '/acceptable-use' },
        ],
      },
    ],
    social: [
      { platform: 'Twitter',  href: 'https://twitter.com/yourapp',  icon: 'Twitter'  },
      { platform: 'LinkedIn', href: 'https://linkedin.com/company/yourapp', icon: 'Linkedin' },
      { platform: 'GitHub',   href: 'https://github.com/yourapp',   icon: 'Github'   },
    ],
    legal: '© 2026 Your Company Name. All rights reserved.',
  },

  // ── PER-PAGE SEO META ─────────────────────────────────────────────────────
  // Used by PageMeta.tsx — every page gets a unique title and description
  meta: {
    home: {
      title:       'Your App — Tagline that explains what you do',
      description: '160 chars max. What you do, for whom, and the key benefit.',
    },
    pricing: {
      title:       'Pricing — Your App',
      description: 'Simple pricing for every stage. Free tier available. No credit card required.',
    },
    about: {
      title:       'About — Your App',
      description: 'The story of why we built this and what we believe.',
    },
    login: {
      title:       'Log in — Your App',
      description: 'Sign in to your Your App account.',
    },
    signup: {
      title:       'Get started — Your App',
      description: 'Create your free account. No credit card required.',
    },
    dashboard: {
      title:       'Dashboard — Your App',
      description: '',    // no meta needed for authenticated pages
    },
  },

} // end siteConfig

// ── TYPE EXPORTS ──────────────────────────────────────────────────────────────
export type SiteConfig   = typeof siteConfig
export type NavLink      = typeof siteConfig.nav.links[number]
export type FeatureItem  = typeof siteConfig.features.items[number]
export type PricingPlan  = typeof siteConfig.pricing.plans[number]
export type Testimonial  = typeof siteConfig.testimonials.items[number]
export type FooterColumn = typeof siteConfig.footer.columns[number]
```

---

### FILE: tailwind.config.ts
### PURPOSE: Every design token — colours, fonts, spacing, radius — lives here.
### HOW TO USE: Change brand colour here and it updates everywhere automatically.

```typescript
// tailwind.config.ts
// ─────────────────────────────────────────────────────────────────────────────
// MASTER DESIGN TOKENS FILE
// Change colours, fonts, spacing, and border radius here.
// These values cascade through the entire site automatically.
// ─────────────────────────────────────────────────────────────────────────────

import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {

      // ── COLOURS ────────────────────────────────────────────────────────────
      // Change brand.500 to change your primary colour everywhere.
      // Only edit the brand ramp to rebrand. Neutral and semantic rarely change.
      colors: {

        brand: {
          50:  '#eff6ff',   // very light tint — page backgrounds, subtle fills
          100: '#dbeafe',   // light tint — hover backgrounds
          200: '#bfdbfe',   // borders in light contexts
          300: '#93c5fd',   // light icons, decorative
          400: '#60a5fa',   // mid tone — avoid for text (low contrast)
          500: '#3b82f6',   // ← PRIMARY BRAND COLOUR — buttons, links, key UI
          600: '#2563eb',   // hover state for brand-500
          700: '#1d4ed8',   // active/pressed state
          800: '#1e40af',   // text on brand-50 background
          900: '#1e3a8a',   // dark text on brand-100 background
          950: '#172554',   // very dark — footer on dark backgrounds
        },

        neutral: {
          50:  '#f9fafb',   // page backgrounds
          100: '#f3f4f6',   // card backgrounds, input fills, skeleton
          200: '#e5e7eb',   // borders, dividers, subtle separators
          300: '#d1d5db',   // disabled borders
          400: '#9ca3af',   // placeholder text, disabled text, secondary icons
          500: '#6b7280',   // tertiary text
          600: '#4b5563',   // secondary body text
          700: '#374151',   // primary body text
          800: '#1f2937',   // strong body text
          900: '#111827',   // headings, primary text
          950: '#030712',   // near-black — use sparingly
        },

        // Semantic colours — use these for status, not raw red/green/etc.
        success: {
          50:  '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        warning: {
          50:  '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        danger: {
          50:  '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        info: {
          50:  '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
        },
      },

      // ── TYPOGRAPHY ─────────────────────────────────────────────────────────
      // Change the font name here. Must also update the Google Fonts import
      // in src/styles/globals.css.
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        // Uncomment to add a display font for headings:
        // display: ['Cal Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },

      // ── FONT SIZES ─────────────────────────────────────────────────────────
      // These extend Tailwind's defaults. Use text-display for hero headlines.
      fontSize: {
        // All values: [size, { lineHeight, letterSpacing }]
        'display': ['3.75rem', { lineHeight: '1.1',  letterSpacing: '-0.04em' }], // 60px
        '5xl':     ['3rem',    { lineHeight: '1.15', letterSpacing: '-0.03em' }], // 48px
        '4xl':     ['2.25rem', { lineHeight: '1.2',  letterSpacing: '-0.025em'}], // 36px
        '3xl':     ['1.875rem',{ lineHeight: '1.25', letterSpacing: '-0.02em' }], // 30px
        '2xl':     ['1.5rem',  { lineHeight: '1.35', letterSpacing: '-0.01em' }], // 24px
        'xl':      ['1.25rem', { lineHeight: '1.4',  letterSpacing: '0'       }], // 20px
        'lg':      ['1.125rem',{ lineHeight: '1.5',  letterSpacing: '0'       }], // 18px
        'base':    ['1rem',    { lineHeight: '1.625',letterSpacing: '0'       }], // 16px
        'sm':      ['0.875rem',{ lineHeight: '1.5',  letterSpacing: '0'       }], // 14px
        'xs':      ['0.75rem', { lineHeight: '1.5',  letterSpacing: '0.01em' }],  // 12px
      },

      // ── BORDER RADIUS ──────────────────────────────────────────────────────
      // Change 'DEFAULT' to change the feel of the whole site.
      // sm = subtle, md = modern, lg = rounded/friendly, full = pill
      borderRadius: {
        'none': '0',
        'sm':   '0.25rem',    //  4px
        'DEFAULT': '0.5rem',  //  8px — used for inputs, small cards
        'md':   '0.5rem',     //  8px
        'lg':   '0.75rem',    // 12px — used for cards, modals
        'xl':   '1rem',       // 16px — used for larger containers
        '2xl':  '1.5rem',     // 24px — used for hero images, feature visuals
        'full': '9999px',     // pill — used for badges, toggles, avatars
      },

      // ── SHADOWS ────────────────────────────────────────────────────────────
      // Minimal shadow system. Use sparingly — flat is better for most elements.
      boxShadow: {
        'xs':  '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        'sm':  '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)',
        'DEFAULT': '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)',
        'md':  '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)',
        'lg':  '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)',
        'xl':  '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.08)',
        'none':'none',
      },

      // ── SPACING ────────────────────────────────────────────────────────────
      // Tailwind's 4px base scale is already correct. Add named shortcuts here
      // for common section padding values so they're readable in components.
      spacing: {
        'section-sm':  '3rem',    //  48px — tight sections
        'section':     '5rem',    //  80px — standard section padding (mobile)
        'section-lg':  '7rem',    // 112px — generous section padding (desktop)
        'container':   '1.25rem', //  20px — horizontal padding mobile
      },

      // ── MAX WIDTHS ─────────────────────────────────────────────────────────
      maxWidth: {
        'container': '80rem',  // 1280px — same as max-w-7xl, your standard container
        'content':   '65ch',   // prose max line length — same as max-w-prose
        'narrow':    '48rem',  // 768px — for auth pages, legal pages
        'wide':      '90rem',  // 1440px — for very wide dashboard layouts
      },

      // ── ANIMATION ──────────────────────────────────────────────────────────
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)'   },
        },
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)'    },
        },
        'skeleton': {
          '0%, 100%': { opacity: '1'   },
          '50%':      { opacity: '0.5' },
        },
      },
      animation: {
        'fade-in':     'fade-in 0.3s ease-out',
        'fade-in-up':  'fade-in-up 0.4s ease-out',
        'pulse-slow':  'skeleton 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

    } // end extend
  }, // end theme

  plugins: [
    require('@tailwindcss/typography'),   // adds prose class for rich text
    require('@tailwindcss/forms'),        // better default form styling
    require('tailwindcss-animate'),       // shadcn animations
  ],
}

export default config
```

---

## PART 3 — KEY FILE TEMPLATES

---

### FILE: src/styles/globals.css
### PURPOSE: Font loading, Tailwind directives, CSS variables, motion preferences.

```css
/* src/styles/globals.css */

/* ── FONT IMPORT ─────────────────────────────────────────────────────────────
   Only import the weights you use. Check tailwind.config.ts fontFamily
   and match the weights loaded here.
   font-display: swap prevents invisible text while font loads.
────────────────────────────────────────────────────────────────────────────── */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* ── TAILWIND ─────────────────────────────────────────────────────────────── */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ── CSS VARIABLES (shadcn/ui compatibility) ──────────────────────────────── */
@layer base {
  :root {
    --background:   0 0% 100%;
    --foreground:   222.2 84% 4.9%;
    --card:         0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover:      0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary:      221.2 83.2% 53.3%;   /* brand-500 */
    --primary-foreground: 210 40% 98%;
    --secondary:    210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted:        210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent:       210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive:  0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border:       214.3 31.8% 91.4%;
    --input:        214.3 31.8% 91.4%;
    --ring:         221.2 83.2% 53.3%;   /* brand-500 */
    --radius:       0.5rem;
  }

  .dark {
    --background:   222.2 84% 4.9%;
    --foreground:   210 40% 98%;
    --card:         222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --primary:      217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary:    217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted:        217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --border:       217.2 32.6% 17.5%;
    --input:        217.2 32.6% 17.5%;
    --ring:         224.3 76.3% 48%;
  }
}

/* ── BASE RESETS ─────────────────────────────────────────────────────────── */
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  html {
    scroll-behavior: smooth;
  }
}

/* ── REDUCED MOTION — REQUIRED ───────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* ── FOCUS VISIBLE — GLOBAL OVERRIDE ────────────────────────────────────── */
/* Removes default browser outline only when replaced by our own ring style */
:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}
:focus:not(:focus-visible) {
  outline: none;
}
```

---

### FILE: src/components/layout/PageContainer.tsx
### PURPOSE: Wraps every page's content with consistent max-width and padding.

```tsx
// src/components/layout/PageContainer.tsx
// Use this on every page. Never write max-w-7xl mx-auto px-4 directly in pages.

interface PageContainerProps {
  children: React.ReactNode
  size?: 'narrow' | 'default' | 'wide'
  className?: string
}

export function PageContainer({
  children,
  size = 'default',
  className = '',
}: PageContainerProps) {
  const widths = {
    narrow:  'max-w-3xl',    // 768px  — auth pages, legal, blog posts
    default: 'max-w-7xl',    // 1280px — most pages
    wide:    'max-w-[90rem]',// 1440px — dashboards
  }

  return (
    <div className={`${widths[size]} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}
```

---

### FILE: src/components/layout/Section.tsx
### PURPOSE: Consistent section padding. Every public section uses this.

```tsx
// src/components/layout/Section.tsx

interface SectionProps {
  children: React.ReactNode
  id?: string
  background?: 'white' | 'neutral' | 'brand' | 'dark'
  size?: 'sm' | 'default' | 'lg'
  className?: string
}

export function Section({
  children,
  id,
  background = 'white',
  size = 'default',
  className = '',
}: SectionProps) {
  const backgrounds = {
    white:   'bg-white',
    neutral: 'bg-neutral-50',
    brand:   'bg-brand-500',
    dark:    'bg-neutral-900',
  }
  const paddings = {
    sm:      'py-12 md:py-16',
    default: 'py-16 md:py-24',
    lg:      'py-20 md:py-32',
  }

  return (
    <section
      id={id}
      className={`${backgrounds[background]} ${paddings[size]} ${className}`}
    >
      {children}
    </section>
  )
}
```

---

### FILE: src/components/layout/PageMeta.tsx
### PURPOSE: Sets title, description, and OG tags per page.

```tsx
// src/components/layout/PageMeta.tsx
// Import siteConfig and pass the meta key for each page.

import { Helmet } from 'react-helmet-async'
import { siteConfig } from '@/config/site'

interface PageMetaProps {
  title?: string
  description?: string
  image?: string
  noIndex?: boolean
}

export function PageMeta({
  title,
  description,
  image = siteConfig.ogImage,
  noIndex = false,
}: PageMetaProps) {
  const fullTitle = title
    ? `${title} — ${siteConfig.name}`
    : `${siteConfig.name} — ${siteConfig.tagline}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description ?? siteConfig.description} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description ?? siteConfig.description} />
      <meta property="og:image"       content={`${siteConfig.url}${image}`} />
      <meta property="og:url"         content={siteConfig.url} />
      <meta property="og:type"        content="website" />

      {/* Twitter */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description ?? siteConfig.description} />
      <meta name="twitter:image"       content={`${siteConfig.url}${image}`} />
    </Helmet>
  )
}
```

---

### FILE: src/pages/public/HomePage.tsx
### PURPOSE: Shows how pages are built by composing sections. No text here.

```tsx
// src/pages/public/HomePage.tsx
// Pages ONLY compose sections. No text or styling in page files.
// All text comes from siteConfig. All styling is in section components.

import { PageMeta }            from '@/components/layout/PageMeta'
import { HeroSection }         from '@/components/sections/HeroSection'
import { LogoBarSection }      from '@/components/sections/LogoBarSection'
import { FeaturesSection }     from '@/components/sections/FeaturesSection'
import { HowItWorksSection }   from '@/components/sections/HowItWorksSection'
import { StatsSection }        from '@/components/sections/StatsSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { PricingSection }      from '@/components/sections/PricingSection'
import { FAQSection }          from '@/components/sections/FAQSection'
import { CTASection }          from '@/components/sections/CTASection'
import { siteConfig }          from '@/config/site'

export default function HomePage() {
  return (
    <>
      <PageMeta
        title={siteConfig.meta.home.title}
        description={siteConfig.meta.home.description}
      />
      <main>
        <HeroSection />
        <LogoBarSection />
        <FeaturesSection />
        <HowItWorksSection />
        <StatsSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
    </>
  )
}
```

---

### FILE: src/components/sections/HeroSection.tsx
### PURPOSE: Shows how a section reads from siteConfig and uses layout components.

```tsx
// src/components/sections/HeroSection.tsx
// All text comes from siteConfig.hero — change it there, not here.

import { Link }          from 'react-router-dom'
import { ArrowRight }    from 'lucide-react'
import { Button }        from '@/components/ui/button'
import { Section }       from '@/components/layout/Section'
import { PageContainer } from '@/components/layout/PageContainer'
import { siteConfig }    from '@/config/site'

export function HeroSection() {
  const { hero } = siteConfig

  return (
    <Section size="lg" background="white" id="hero">
      <PageContainer>
        <div className="mx-auto max-w-4xl text-center">

          {/* Badge */}
          {hero.badge && (
            <div className="mb-6 inline-flex items-center gap-2 rounded-full
                            border border-brand-200 bg-brand-50
                            px-4 py-1.5 text-sm font-medium text-brand-700">
              {hero.badge}
            </div>
          )}

          {/* Headline — split on \n for line breaks */}
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900
                         md:text-5xl lg:text-display">
            {hero.headline.split('\n').map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed
                        text-neutral-600 md:text-xl">
            {hero.subheadline}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row
                          sm:justify-center">
            <Button asChild size="lg" className="min-h-[48px] px-8">
              <Link to={hero.cta.primary.href}>
                {hero.cta.primary.label}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg"
                    className="min-h-[48px] px-8">
              <Link to={hero.cta.secondary.href}>
                {hero.cta.secondary.label}
              </Link>
            </Button>
          </div>

          {/* Social proof */}
          {hero.social_proof && (
            <p className="mt-6 text-sm text-neutral-500">
              {hero.social_proof}
            </p>
          )}

          {/* Hero image */}
          <div className="mt-16 overflow-hidden rounded-2xl border border-neutral-200
                          shadow-xl">
            <img
              src={hero.image.src}
              alt={hero.image.alt}
              width={hero.image.width}
              height={hero.image.height}
              loading="eager"
              fetchPriority="high"
              className="w-full"
            />
          </div>

        </div>
      </PageContainer>
    </Section>
  )
}
```

---

## PART 4 — APP ROUTER SETUP

### FILE: src/App.tsx
### PURPOSE: All routes in one place. Clean, readable, protected routes clear.

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider }               from 'react-helmet-async'
import { Suspense, lazy }               from 'react'
import { Navbar }     from '@/components/layout/Navbar'
import { Footer }     from '@/components/layout/Footer'
import { AuthGuard }  from '@/components/layout/AuthGuard'
import { PageSkeleton } from '@/components/shared/Skeleton'

// Public pages — lazy loaded
const HomePage       = lazy(() => import('@/pages/public/HomePage'))
const PricingPage    = lazy(() => import('@/pages/public/PricingPage'))
const AboutPage      = lazy(() => import('@/pages/public/AboutPage'))
const ContactPage    = lazy(() => import('@/pages/public/ContactPage'))
const TermsPage      = lazy(() => import('@/pages/public/legal/TermsPage'))
const PrivacyPage    = lazy(() => import('@/pages/public/legal/PrivacyPage'))

// Auth pages
const LoginPage          = lazy(() => import('@/pages/auth/LoginPage'))
const SignupPage          = lazy(() => import('@/pages/auth/SignupPage'))
const ForgotPasswordPage  = lazy(() => import('@/pages/auth/ForgotPasswordPage'))

// Protected app pages
const DashboardPage  = lazy(() => import('@/pages/app/DashboardPage'))
const AccountPage    = lazy(() => import('@/pages/app/AccountPage'))
const BillingPage    = lazy(() => import('@/pages/app/BillingPage'))
const ToolPage       = lazy(() => import('@/pages/app/ToolPage'))

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={<PageSkeleton />}>
          <Routes>

            {/* Public layout — with Navbar and Footer */}
            <Route element={<PublicLayout />}>
              <Route path="/"         element={<HomePage />}    />
              <Route path="/pricing"  element={<PricingPage />} />
              <Route path="/about"    element={<AboutPage />}   />
              <Route path="/contact"  element={<ContactPage />} />
              <Route path="/terms"    element={<TermsPage />}   />
              <Route path="/privacy"  element={<PrivacyPage />} />
            </Route>

            {/* Auth layout — no Navbar/Footer, centred card */}
            <Route element={<AuthLayout />}>
              <Route path="/login"           element={<LoginPage />}          />
              <Route path="/signup"          element={<SignupPage />}         />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            {/* Protected app layout — sidebar or top nav */}
            <Route element={<AuthGuard><AppLayout /></AuthGuard>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/account"   element={<AccountPage />}   />
              <Route path="/billing"   element={<BillingPage />}   />
              <Route path="/tool"      element={<ToolPage />}      />
            </Route>

          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  )
}
```

---

## PART 5 — THE EDITING GUIDE

### How to change specific things without touching the wrong file

| What you want to change        | File to edit                        | What to change                          |
|-------------------------------|------------------------------------|-----------------------------------------|
| Hero headline                  | src/config/site.ts                  | siteConfig.hero.headline                |
| Navigation links               | src/config/site.ts                  | siteConfig.nav.links                    |
| Pricing plan features          | src/config/site.ts                  | siteConfig.pricing.plans[n].features   |
| Pricing prices                 | src/config/site.ts                  | siteConfig.pricing.plans[n].price      |
| Testimonials                   | src/config/site.ts                  | siteConfig.testimonials.items          |
| Footer links                   | src/config/site.ts                  | siteConfig.footer.columns              |
| Page meta title/description    | src/config/site.ts                  | siteConfig.meta.[pagename]             |
| Primary brand colour           | tailwind.config.ts                  | colors.brand.500 (and the ramp)        |
| Font family                    | tailwind.config.ts + globals.css    | fontFamily.sans + @import URL          |
| Border radius (whole site)     | tailwind.config.ts                  | borderRadius.DEFAULT                   |
| Section vertical spacing       | tailwind.config.ts                  | spacing.section values                 |
| Font sizes                     | tailwind.config.ts                  | fontSize object                        |
| Section background colour      | The specific Section component      | background prop on <Section>           |
| Layout of a section            | src/components/sections/[name].tsx  | The JSX and Tailwind classes inside    |
| Order of sections on homepage  | src/pages/public/HomePage.tsx       | Order of <XSection /> components      |
| Remove a section from homepage | src/pages/public/HomePage.tsx       | Delete the <XSection /> line           |

### The golden rule
If you find yourself typing actual words (copy, labels, descriptions) inside a
component file, stop. Put the words in site.ts and reference them.

If you find yourself typing a colour hex or a pixel value inside a component
file, stop. Put the token in tailwind.config.ts and use the class name.

---

## PART 6 — WHAT TO TELL AI AT THE START OF EVERY SESSION

Paste this at the start of any Cursor or Claude session:

```
Read FRONTEND_STANDARDS.md, PROJECT_STRUCTURE.md, and CLAUDE.md
before writing any code.

Key rules for this project:
1. All page text lives in src/config/site.ts — never hardcode strings in
   components. Import siteConfig and reference it.
2. All design tokens (colours, fonts, radius) live in tailwind.config.ts —
   never use arbitrary values or hardcoded hex in components.
3. Pages only compose sections. No layout or text in page files.
4. Section components read from siteConfig and use Section + PageContainer
   layout components for consistent spacing.
5. Every interactive element needs hover, focus-visible ring, active,
   and disabled states — see FRONTEND_STANDARDS.md section 6.
6. All font sizes via Tailwind text-* classes (rem). No px for typography.
7. Mobile-first. Hamburger nav at md breakpoint.
8. Images always have width, height, alt, and loading attributes.
```
