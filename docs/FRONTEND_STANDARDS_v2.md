# FRONTEND_STANDARDS.md — v2
## Professional Frontend Standards for AI-Assisted Development

This document is a standing brief. Load it into context at the start of every session (Cursor reads `CLAUDE.md` / `.cursorrules` automatically — Lovable, Claude Code, Copilot, and ChatGPT accept it as a system/initial message).

**Apply every rule here to every piece of code you write or modify.** Do not skip sections. Do not approximate. If something conflicts with a user instruction, flag the conflict and ask before proceeding.

This is version 2. It consolidates:
- v1 of FRONTEND_STANDARDS.md (typography, color, spacing, layout, responsiveness, interactive states, visual hierarchy, images, motion, accessibility, performance, components, patterns)
- The Frontend Master Checklist (compiled from thedaviddias Front-End / Performance / Design checklists and Divensky's design-to-code checklist)
- Modern web platform standards current as of 2026 (dynamic viewport units, container queries, `:has()`, `text-wrap: balance`, logical properties, `color-mix`, `prefers-*` media queries, view transitions)

Stack assumed: **Next.js 14+ App Router (or Vite + React) / TypeScript strict / Tailwind CSS / shadcn/ui / lucide-react**. Code examples use these. If the stack differs, translate the class names and components, but the rules still apply.

---

# HOW THE AI SHOULD USE THIS DOCUMENT

Three usage modes:

**Mode 1 — Build mode.** When starting a new page or component: the AI reads this document once at session start, then produces code that already conforms. No checklist passes needed afterward.

**Mode 2 — Audit mode.** When reviewing existing code: the AI walks every section and reports `PASS / FAIL / PARTIAL / N/A` against each rule with file:line, and produces exact code fixes for every failure.

**Mode 3 — Single-section mode.** When working on one area (forms, dark mode, responsive review): the AI loads only the relevant section and enforces it precisely.

Paste this into the AI at the start of any session:

```
Read FRONTEND_STANDARDS.md v2 before writing any code. Apply every rule. When I ask you to build or modify frontend code:

1. Use only values from the token systems defined here (colors, type scale, spacing, shadows, radii, z-index). Never produce arbitrary pixel values.
2. Produce all five interactive states (default, hover, focus-visible, active, disabled) on every interactive element — no exceptions.
3. Every image has width, height, alt, and correct loading attribute.
4. Every form input has a visible label, correct type, autocomplete, and aria attributes.
5. Mobile-first responsive with the breakpoints defined here. Test mentally at 375 / 768 / 1280.
6. Semantic HTML first, ARIA only when native semantics can't express the meaning.
7. After writing any non-trivial component, append a one-paragraph summary of: responsive behavior, accessibility decisions, loading/error/empty states handled.

If you want to deviate from any rule, state the deviation and ask before proceeding. If I ask you to audit code, walk every section and report PASS / FAIL / PARTIAL / N/A with file:line and the exact fix.

Confirm you understand, then ask which page/component we're building or auditing.
```

---

# SECTION 1 — DESIGN TOKENS (THE FOUNDATION)

Every styling decision in this codebase must originate from a defined token. There are seven token systems, and all seven must exist in `tailwind.config.ts` (or equivalent) before the first component is built.

1. **Color** (Section 3)
2. **Typography** (Section 2 — scale, weights, line-heights, letter-spacing, font families)
3. **Spacing** (Section 4 — 4px base scale)
4. **Shadows / elevation** (Section 5)
5. **Border radius** (Section 6)
6. **Z-index** (Section 7)
7. **Motion** (Section 14 — durations and easings)

If you reach for an arbitrary value (e.g. `p-[13px]`, `text-[17px]`, `text-[#3c3c3c]`, `shadow-[0_2px_5px_rgba(0,0,0,0.08)]`), stop and either (a) use the closest token, or (b) if the existing tokens genuinely do not cover the need, add a new token and use it.

shadcn/ui's `cn()` + CSS variables pattern is the recommended mechanism — it gives you semantic aliases (`bg-background`, `text-foreground`, `border`) that automatically adapt to dark mode.

---

# SECTION 2 — TYPOGRAPHY

## 2.1 Units

**Always** use `rem` for font sizes. Never `px` for type.

- `1rem = 16px` browser default. **Never change the root font size.**
- Use `em` only for values that should scale with the local font size (e.g. `letter-spacing`, some padding on buttons).
- Line-heights: unitless values (e.g. `1.625`, not `26px` or `1.625rem`).

## 2.2 Type Scale — Use Only These Sizes

| Utility | Size | Use |
|---|---|---|
| `text-xs` | 0.75rem (12px) | Captions, labels, fine print only |
| `text-sm` | 0.875rem (14px) | Secondary text, metadata, helper text |
| `text-base` | 1rem (16px) | Body text — the default for all prose |
| `text-lg` | 1.125rem (18px) | Slightly emphasised body, lead paragraphs |
| `text-xl` | 1.25rem (20px) | Card headings, list section titles |
| `text-2xl` | 1.5rem (24px) | Subheadings (h3) |
| `text-3xl` | 1.875rem (30px) | Section headings (h2) |
| `text-4xl` | 2.25rem (36px) | Page headings (h1) |
| `text-5xl` | 3rem (48px) | Hero headlines only |
| `text-6xl` | 3.75rem (60px) | Display text — use sparingly |

- Never use more than **5 sizes on a single page**.
- Never use arbitrary sizes like `text-[17px]` or `text-[22px]`.
- Mobile inputs and form elements: minimum `text-base` (16px) to prevent iOS Safari zoom on focus.

## 2.3 Font Weight

Use exactly two or three weights per project. Standard system:

| Weight | Value | Use |
|---|---|---|
| `font-normal` | 400 | Body text, descriptions |
| `font-medium` | 500 | Emphasis, navigation links, labels |
| `font-semibold` | 600 | Card titles, secondary headings |
| `font-bold` | 700 | h1, h2, hero headlines, CTAs |

- Never use `font-light` (300) or `font-thin` (100) for body text — hard to read on low-DPI screens and in bright sunlight.
- Never mix more than **3 weights on a single page**.
- Load only the weights you actually use. Every extra weight = extra network bytes.

## 2.4 Line Height

| Element | Class | Value |
|---|---|---|
| Display/hero (text-5xl+) | `leading-none` | 1 |
| Headings (text-3xl to 4xl) | `leading-tight` | 1.25 |
| Subheadings (text-xl to 2xl) | `leading-snug` | 1.375 |
| Body text | `leading-relaxed` | 1.625 |
| UI labels and buttons | `leading-none` | 1 |

## 2.5 Letter Spacing (Tracking)

- Headlines: `tracking-tight` (-0.025em)
- Body: `tracking-normal` (0)
- Uppercase labels: `tracking-wide` (0.025em) — only on uppercase text
- Never use `tracking-widest` on body text — reading becomes exhausting

## 2.6 Line Wrapping — Modern Standards

Use CSS `text-wrap` for visual polish on headlines and body:

```jsx
// Headings — prevents orphans/widows, produces balanced multi-line headlines
<h1 className="text-balance text-4xl font-bold md:text-5xl">
  Long headline that will wrap onto multiple lines
</h1>

// Body paragraphs — improves rag and ragged right edges
<p className="text-pretty max-w-prose leading-relaxed">
  Body paragraph with pretty wrapping to improve the last line.
</p>
```

Tailwind v3.5+ ships `text-balance` and `text-pretty` utilities. If your version doesn't support them, add via `@layer utilities`.

## 2.7 Maximum Line Length — Non-Negotiable

Every block of body text **MUST** be wrapped with `max-w-prose` or equivalent.

- `max-w-prose = 65ch` — proven optimal for readability.
- Never let a paragraph span more than ~75 characters.
- Wider containers are acceptable only for dense UI (tables, dashboards) where prose isn't the primary content.

```jsx
<p className="max-w-prose text-base leading-relaxed text-neutral-700">
  Your paragraph text here...
</p>
```

## 2.8 Font Pairing

Define one heading font and one body font. Never use more than two typefaces.

```ts
// tailwind.config.ts
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],      // body
  display: ['Cal Sans', 'Inter', 'sans-serif'],    // headings (optional)
  mono: ['JetBrains Mono', 'ui-monospace', 'monospace'], // code only
}
```

**Vetted professional pairings:**
- Inter alone (weights 400, 500, 600, 700) — clean SaaS default
- Inter body + Cal Sans display — modern SaaS
- Geist body + Geist display — developer tools
- DM Sans body + DM Serif Display headings — editorial/premium
- Outfit display + Inter body — modern consumer
- Space Grotesk display + Inter body — technical/playful

Maximum: **two font families, four weight variants total.**

## 2.9 Font Loading

Prevent FOIT (Flash of Invisible Text) and minimize CLS from fallback-to-webfont swap.

**Next.js (recommended):** use `next/font` — self-hosts, eliminates render-blocking, sets `font-display: swap`, can apply `size-adjust` to fallbacks to minimize layout shift.

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});
```

**Vite or static HTML:** preconnect + preload:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## 2.10 Semantic Tag Guide

Don't choose headings by size — choose by document meaning, then style with CSS.

| Tag | Purpose | Per page |
|---|---|---|
| `<h1>` | The page's primary subject | Exactly one |
| `<h2>` | Major section headings | 2–6 typical |
| `<h3>` | Subsection within an h2 | As needed |
| `<h4>–<h6>` | Deeper subsection | Rarely |
| `<p>` | Paragraphs of prose | — |
| `<strong>` | Semantic emphasis (important) | — |
| `<em>` | Semantic emphasis (stress) | — |
| `<small>` | Fine print, metadata | — |
| `<code>` | Inline code | — |

**Never skip heading levels** (don't go from h2 straight to h4). Never use a heading tag for size — use CSS.

---

# SECTION 3 — COLOR SYSTEM

## 3.1 Define Tokens First — Never Hardcode

All colors **MUST** be defined in `tailwind.config.ts` or as CSS variables. Never use raw hex in components.

```ts
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      brand: {
        50:  '#eff6ff',  // very light tint for backgrounds
        100: '#dbeafe',  // light tint for hover states
        200: '#bfdbfe',  // borders on light bg
        300: '#93c5fd',  // disabled state bg
        400: '#60a5fa',  // mid — avoid for text on white
        500: '#3b82f6',  // PRIMARY — buttons, links, key UI
        600: '#2563eb',  // hover state for primary
        700: '#1d4ed8',  // active/pressed
        800: '#1e40af',  // dark — for text on light bg
        900: '#1e3a8a',  // very dark — headings on brand tint
        950: '#172554',  // darkest — rare
      },
      neutral: {
        50:  '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
        950: '#030712',
      },
    },
  },
}
```

## 3.2 Semantic Tokens — The shadcn/ui Pattern

Beyond raw palette, define semantic roles as CSS variables. This makes dark mode a one-line toggle and makes refactors trivial.

```css
/* globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode values for every variable above */
  }
}
```

Then use them via Tailwind: `bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, `border`, `ring`.

## 3.3 Contrast — Hard Requirements (WCAG 2.2 AA)

These are not guidelines. They are legal accessibility requirements in the EU, UK, US (ADA), Canada (AODA), and Australia.

- **Body text on background:** minimum **4.5:1** contrast ratio
- **Large text (≥18px regular, ≥14px bold):** minimum **3:1**
- **UI components and graphics** (icons, borders that convey state): minimum **3:1** against adjacent colors

**Fail patterns to avoid:**
- `text-neutral-400` on `bg-white` → fails (~3.2:1)
- `text-brand-400` on `bg-white` → often fails (2.9:1 for brand-400 blues)
- Light grey on white — almost always fails
- Disabled buttons that are illegible — must still meet 3:1 for the disabled text

**Pass patterns:**
- `text-neutral-700` on `bg-white` → passes (~10.7:1)
- `text-neutral-900` on `bg-neutral-50` → passes
- `text-white` on `bg-brand-600` → passes

Verify every text/background combination at [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker).

## 3.4 Semantic Color Usage

Never use color alone to convey meaning — always pair with an icon or label.

| Role | Class pattern |
|---|---|
| Primary action | `bg-brand-500 hover:bg-brand-600` (buttons) |
| Destructive | `bg-red-600`, `text-red-600`, `bg-red-50` |
| Success | `bg-green-600`, `text-green-600`, `bg-green-50` |
| Warning | `bg-amber-600`, `text-amber-600`, `bg-amber-50` |
| Info | `bg-blue-600`, `text-blue-600`, `bg-blue-50` |
| Disabled | `bg-neutral-300 text-neutral-400` |

## 3.5 Borders and Dividers

- Subtle dividers: `border border-neutral-200 dark:border-neutral-800`
- Medium emphasis: `border border-neutral-300 dark:border-neutral-700`
- Focus borders: `border-brand-500` (plus the ring)
- Border weights: `1px` (default) is 95% of cases. `2px` only for emphasis (active tab, selected card).

## 3.6 Dark Mode — Built In, Not Bolted On

If the project supports dark mode (it almost always should), add `dark:` variants to **every color class**. Write both simultaneously; retrofitting dark mode is painful.

```jsx
<div className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
```

Full dark mode guidance is in Section 15.

## 3.7 Modern Color Functions

For mixing shades or creating transparent variants, use `color-mix()` in CSS or Tailwind's `opacity` suffix:

```jsx
// Transparency via Tailwind
<div className="bg-brand-500/10 text-brand-700" />  {/* 10% opacity brand background */}

// CSS — mix two colors
.custom-bg {
  background: color-mix(in oklch, var(--brand-500) 20%, transparent);
}
```

Prefer the `oklch` color space for mixing — produces perceptually-uniform results, unlike the legacy `sRGB` mixing.

---

# SECTION 4 — SPACING SYSTEM

## 4.1 Use Only Tailwind's 4px Base Scale

Every padding, margin, gap, and spacing value **MUST** come from Tailwind's scale. Never `p-[13px]` or `mt-[22px]`.

| Value | Pixels | Use |
|---|---|---|
| `1` | 4px | Tiny gaps, icon/text spacing |
| `2` | 8px | Label-to-input, compact stacks |
| `3` | 12px | Button padding-y |
| `4` | 16px | Button padding-x, card internal padding |
| `5` | 20px | Between related elements |
| `6` | 24px | Section internal padding, card gaps |
| `8` | 32px | Between distinct components |
| `10` | 40px | Section spacing on mobile |
| `12` | 48px | Section padding (small) |
| `16` | 64px | Section gap (desktop) |
| `20` | 80px | Hero padding, large section gaps |
| `24` | 96px | Maximum section padding |
| `32` | 128px | Very large hero spacing |

## 4.2 Section Rhythm — Vertical Spacing

Pick one pattern for non-hero sections and stay consistent across the site.

```jsx
// Standard section (most content sections)
<section className="py-16 md:py-24">

// Hero section
<section className="py-20 md:py-32 lg:py-40">

// Footer
<footer className="py-12 md:py-16">

// Compact section (between hero and first content)
<section className="py-10 md:py-12">
```

## 4.3 Internal Component Spacing

- **Cards:** `p-4` (16px) minimum, `p-6` (24px) standard, `p-8` (32px) generous
- **Buttons:** `px-4 py-2` (sm), `px-6 py-3` (md — default), `px-8 py-4` (lg)
- **Inputs:** `px-3 py-2` (tight), `px-4 py-3` (standard)
- **Between related items (same group):** `gap-2` to `gap-4`
- **Between unrelated items (different groups):** `gap-6` to `gap-8`

## 4.4 Logical Properties for Internationalization

If the site might serve RTL languages (Arabic, Hebrew, Persian), prefer logical properties over directional ones. Tailwind ships logical utilities.

| Directional | Logical | Meaning |
|---|---|---|
| `ml-4` | `ms-4` | margin-inline-start (left in LTR, right in RTL) |
| `pr-2` | `pe-2` | padding-inline-end |
| `mt-4` | `mbs-4`* | margin-block-start (*Tailwind uses `mt`, CSS is logical by default) |

For RTL-first or RTL-compatible sites: use `ms-`, `me-`, `ps-`, `pe-` instead of `ml-`, `mr-`, `pl-`, `pr-`.

---

# SECTION 5 — SHADOWS AND ELEVATION

Elevation communicates hierarchy. Use consistent shadow tokens, never ad-hoc `box-shadow` values.

## 5.1 Shadow Scale

| Token | Tailwind | Use |
|---|---|---|
| Flat | `shadow-none` | Pressed state, flat UI |
| Subtle | `shadow-sm` | Low-level cards, chips |
| Default | `shadow` | Standard cards, dropdowns |
| Elevated | `shadow-md` | Hovered cards, tooltips |
| Floating | `shadow-lg` | Modals, popovers, drawers on mobile |
| Dramatic | `shadow-xl` | Hero cards, key CTAs |
| Stacked | `shadow-2xl` | Overlays, key modals |

## 5.2 Rules

- In light mode: shadows are visible, soft, greyscale.
- In dark mode: standard shadows disappear against dark backgrounds. **Replace shadow with subtle borders** (`dark:border dark:border-neutral-800`) instead.
- Hover state on a card: bump shadow by one step (`shadow` → `shadow-md`) + optional `-translate-y-0.5`.
- Active/pressed: reduce or remove shadow.
- Inner shadows (`shadow-inner`): rarely needed; use for pressed states or inset controls.

## 5.3 Colored Shadows for Emphasis

For key CTAs, use a brand-tinted shadow to draw attention:

```jsx
<button className="bg-brand-500 shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30">
  Get started
</button>
```

Use sparingly — one or two per page, never on everyday buttons.

---

# SECTION 6 — BORDER RADIUS SYSTEM

Consistent corner radii define a brand's character (sharp & editorial vs. soft & friendly).

## 6.1 Radius Scale

| Token | Tailwind | Use |
|---|---|---|
| None | `rounded-none` | Full-bleed sections, tables |
| Small | `rounded-sm` (2px) | Checkboxes, tags |
| Default | `rounded-md` (6px) | Standard buttons |
| Larger | `rounded-lg` (8px) | Default for most cards and inputs |
| XL | `rounded-xl` (12px) | Feature cards, prominent surfaces |
| 2XL | `rounded-2xl` (16px) | Modal containers, showcase cards |
| 3XL | `rounded-3xl` (24px) | Large hero elements |
| Pill | `rounded-full` | Avatars, pills, circular icon buttons |

## 6.2 Rules

- **Pick one primary radius** (usually `rounded-lg` or `rounded-xl`) and use it for 80% of components.
- Reserve `rounded-2xl` / `rounded-3xl` for prominent moments (hero cards, featured sections).
- `rounded-full` only for circles (avatars, circular buttons) or pill shapes (tags, badges).
- Mixing 3+ radii on one page looks chaotic. Cap at 2–3 across a design.
- Inputs match button radius within a form (all `rounded-lg` or all `rounded-md`).
- Icons inside circular containers (`rounded-full bg-brand-50`): the container's size, not the icon's, defines the look.

---

# SECTION 7 — Z-INDEX SYSTEM

Never use arbitrary `z-[999]` or `z-[99999]`. Define tokens.

```ts
// tailwind.config.ts — extend zIndex
zIndex: {
  base: '0',
  dropdown: '1000',
  sticky: '1020',
  banner: '1030',
  overlay: '1040',
  modal: '1050',
  popover: '1060',
  tooltip: '1070',
  toast: '1080',
}
```

Usage: `z-sticky` on a sticky header, `z-modal` on a dialog overlay, `z-toast` on Sonner/toast containers.

Rule: if you ever need `z-[9999]` to force something on top, you have a z-index collision. Audit and use tokens.

---

# SECTION 8 — LAYOUT AND CONTAINERS

## 8.1 The Standard Container

Use on every page. This gives 1280px max width, centered, with responsive horizontal padding.

```jsx
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  {/* page content */}
</div>
```

Never let content span the full width on large screens.

## 8.2 Content Width Conventions

| Max width | Use |
|---|---|
| `max-w-prose` (65ch) | Long-form reading content |
| `max-w-sm` (384px) | Narrow forms, alerts |
| `max-w-md` (448px) | Login/signup cards |
| `max-w-lg` (512px) | Modal dialogs |
| `max-w-2xl` (672px) | Short article intros |
| `max-w-3xl` (768px) | Blog posts, documentation body |
| `max-w-4xl` (896px) | Wide content pages |
| `max-w-5xl` (1024px) | Feature pages |
| `max-w-6xl` (1152px) | Dashboards |
| `max-w-7xl` (1280px) | Standard full layouts |

Text content should never exceed `max-w-3xl` regardless of page width.

## 8.3 Grid Patterns

Use CSS Grid (Tailwind `grid`) for page-level layout. Flexbox for component-level layout (a row of items, a navbar, a button with icon).

```jsx
// Two-column feature split — stacks on mobile
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">

// Three-column feature grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Four-up (logos, small cards)
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">

// Sidebar layout — 280px sidebar + flexible main
<div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">

// Bento/asymmetric — explicit spans
<div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[minmax(200px,auto)]">
  <div className="md:col-span-4" />
  <div className="md:col-span-2" />
  <div className="md:col-span-2" />
  <div className="md:col-span-4" />
</div>

// Pricing cards with recommended highlighted
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <Card />
  <Card className="lg:scale-105 border-brand-500" /> {/* recommended */}
  <Card />
</div>
```

## 8.4 Container Queries — Modern Standard

For components that should adapt to **their container's width** (not the viewport), use container queries. Example: a card that's single-column when narrow and two-column when wide, regardless of viewport.

```jsx
<div className="@container">
  <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
    {/* grid adapts based on the parent's width */}
  </div>
</div>
```

Requires `@tailwindcss/container-queries` plugin. Use for reusable components that appear in different contexts (sidebar vs. main content).

## 8.5 Aspect Ratios — Never Distort Images or Video

```jsx
// 16:9 hero media
<div className="aspect-video overflow-hidden rounded-xl">
  <img className="h-full w-full object-cover" />
</div>

// Square avatar
<div className="aspect-square overflow-hidden rounded-full">
  <img className="h-full w-full object-cover" />
</div>

// 4:5 portrait product shot
<div className="aspect-[4/5] overflow-hidden rounded-lg">
  <img className="h-full w-full object-cover" />
</div>
```

## 8.6 Safe Areas on Mobile (Notch, Home Indicator)

On iOS devices with notches, respect `env(safe-area-inset-*)` for fixed/sticky elements.

```jsx
// Sticky header that avoids the notch
<header className="sticky top-0 pt-[env(safe-area-inset-top)]">

// Bottom nav that avoids the home indicator
<nav className="pb-[env(safe-area-inset-bottom)]">
```

For fullscreen PWAs or in-app browser views, this is not optional.

---

# SECTION 9 — RESPONSIVENESS

## 9.1 Mobile-First Is Mandatory

Write styles for mobile first. Add responsive prefixes to override for larger screens.

**WRONG:** design desktop first, add mobile overrides with `max-*` prefixes.

**RIGHT:** write the mobile style, then `sm:`, `md:`, `lg:` to scale up.

## 9.2 Tailwind Breakpoints

| Prefix | Min width | Typical device |
|---|---|---|
| (none) | 0 | Mobile portrait |
| `sm:` | 640px | Large phone / small tablet portrait |
| `md:` | 768px | Tablet portrait / main layout shift point |
| `lg:` | 1024px | Laptop / tablet landscape |
| `xl:` | 1280px | Desktop |
| `2xl:` | 1536px | Large monitor |

`md:` is the primary breakpoint where most layouts shift from mobile-stacked to multi-column.

## 9.3 Dynamic Viewport Units — Modern Standard

iOS Safari's address bar shrinks and grows on scroll. Using `100vh` causes flickering. Use dynamic viewport units:

| Unit | Meaning |
|---|---|
| `svh` / `svw` | Small viewport (smallest possible) |
| `lvh` / `lvw` | Large viewport (largest possible) |
| `dvh` / `dvw` | Dynamic viewport (current actual) |

```jsx
// Full-height hero that doesn't flicker on mobile
<section className="min-h-[100dvh]">

// Avoid 100vh on mobile — causes the dreaded flicker/overflow
// ❌ <section className="min-h-[100vh]">
```

Fallback: `min-h-screen` in Tailwind translates to `100vh` — override with `min-h-[100dvh]` on mobile-critical layouts.

## 9.4 Navigation — Required Behavior

Navigation **MUST** transform at the `md` breakpoint.

```jsx
<header className="sticky top-0 z-sticky w-full border-b bg-background/95 backdrop-blur">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <nav className="flex h-16 items-center justify-between" aria-label="Main navigation">

      <a href="/" className="flex items-center gap-2" aria-label="Home">
        <Logo className="h-8 w-8" />
        <span className="font-semibold">BrandName</span>
      </a>

      {/* Desktop nav — hidden on mobile */}
      <ul className="hidden md:flex items-center gap-8">
        <li><a href="/features" className="text-sm font-medium hover:text-foreground/80">Features</a></li>
        <li><a href="/pricing" className="text-sm font-medium hover:text-foreground/80">Pricing</a></li>
      </ul>

      {/* Desktop CTAs */}
      <div className="hidden md:flex items-center gap-3">
        <Button variant="ghost" asChild><a href="/login">Log in</a></Button>
        <Button asChild><a href="/signup">Get started</a></Button>
      </div>

      {/* Mobile hamburger — hidden on desktop */}
      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[280px]">
          {/* Mobile nav links — mirror desktop */}
        </SheetContent>
      </Sheet>

    </nav>
  </div>
</header>
```

**The mobile nav must:**
- Close when a link is clicked
- Be dismissible by clicking outside or pressing Escape
- Trap focus while open (shadcn Sheet handles this)
- Have an accessible label on the hamburger button
- Not cause scroll when open (`overflow-hidden` on body)

## 9.5 Typography Responsive Scaling

Headlines must scale down on mobile — they are too large at desktop sizes:

```jsx
// Hero headline
<h1 className="text-4xl font-bold md:text-5xl lg:text-6xl tracking-tight text-balance">

// Section heading
<h2 className="text-2xl font-bold md:text-3xl text-balance">

// Subheading
<h3 className="text-xl font-semibold md:text-2xl">

// Lead paragraph
<p className="text-base md:text-lg leading-relaxed text-pretty">
```

## 9.6 Spacing Responsive Scaling

```jsx
<section className="py-12 md:py-16 lg:py-24">
<div className="px-4 sm:px-6 lg:px-8">
<div className="gap-6 md:gap-8 lg:gap-12">
```

## 9.7 Minimum Touch Target Size — Non-Negotiable

Every tappable element must be at least **44×44px** on mobile (WCAG 2.5.5; WCAG 2.2 adopted 24×24px minimum but the practical standard is 44).

```jsx
<button className="min-h-11 min-w-11 flex items-center justify-center">
```

Exemption: inline text links inside paragraphs. All standalone clickable elements are not exempt.

## 9.8 Mobile Input Rules

- Inputs MUST be `text-base` (16px) on mobile — smaller triggers iOS Safari's auto-zoom.
- Use correct `type` (`email`, `tel`, `number`, `url`, `search`, `date`) to trigger the correct mobile keyboard.
- Set `autoComplete` on every input (full list in Section 20).
- Set `inputmode` when `type` alone isn't enough: `inputmode="numeric"` for OTP, `inputmode="decimal"` for prices.

## 9.9 Test at These Breakpoints

Before every merge, verify layout at:
- **375px** — iPhone SE / 13 mini (smallest common phone)
- **390px** — iPhone 14/15
- **768px** — iPad portrait
- **1024px** — small laptop / tablet landscape
- **1280px** — standard desktop
- **1536px** — large monitor

Use Chrome DevTools device toolbar. Do not rely on desktop browser resizing alone — real devices surface bugs that emulation misses.

## 9.10 Test on Real Safari

Mobile Safari behaves differently than Chrome. Before shipping:
- Test on a real iPhone (or iOS Simulator via Xcode)
- Test on a real Android Chrome if possible
- Check `100dvh`, sticky positioning, keyboard-open behavior, and fixed-position overlays specifically

---

# SECTION 10 — INTERACTIVE STATES

Every interactive element (button, link, input, checkbox, select, tab, menu item) **MUST** have all five states styled.

| State | Purpose | Tailwind |
|---|---|---|
| Default | Resting | (base classes) |
| Hover | Mouse over | `hover:*` |
| Focus-visible | Keyboard focus | `focus-visible:ring-2 focus-visible:ring-offset-2` |
| Active / pressed | Being clicked/tapped | `active:*` |
| Disabled | Not interactive | `disabled:opacity-50 disabled:cursor-not-allowed` |

Use `focus-visible`, not `focus`. `focus-visible` shows the ring only for keyboard users, not on mouse click.

## 10.1 Primary Button — Complete Reference

```jsx
<button
  type="button"
  className="
    inline-flex items-center justify-center gap-2
    rounded-lg px-6 py-3
    text-sm font-semibold
    bg-brand-500 text-white
    hover:bg-brand-600
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2
    active:bg-brand-700 active:scale-[0.98]
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    transition-all duration-150 ease-in-out
  "
>
  Click me
</button>
```

**Use `shadcn/ui` Button** instead of hand-rolling this every time. It encodes all five states in variants: `default`, `secondary`, `outline`, `ghost`, `link`, `destructive`.

## 10.2 Button Sizing

| Size | Classes | Use |
|---|---|---|
| Small | `h-9 px-3 text-sm` | Dense UIs, toolbars |
| Default | `h-10 px-4` | Standard |
| Large | `h-11 px-8` | Hero CTAs, mobile-first actions |
| Icon | `h-10 w-10` | Icon-only; MUST have `aria-label` |

## 10.3 Links — Always Distinguish From Body Text

```jsx
<a className="
  text-brand-600 underline underline-offset-2
  hover:text-brand-800
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-sm
  active:text-brand-900
">
  Text link
</a>
```

Rule: inline links inside paragraphs must have a visible non-color affordance (usually underline). Color alone fails WCAG 1.4.1 (Use of Color).

## 10.4 Form Inputs — Complete Reference

```jsx
<input
  id="email"
  name="email"
  type="email"
  autoComplete="email"
  aria-describedby={error ? "email-error" : undefined}
  aria-invalid={!!error}
  className="
    block w-full rounded-lg border border-neutral-300
    bg-white px-4 py-3 text-base text-neutral-900
    placeholder:text-neutral-400
    focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-0
    aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500
    disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed
    transition-colors duration-150
  "
/>
```

Every input MUST have:
- A visible `<label>` element connected via `htmlFor` / `id`
- `aria-describedby` pointing to any helper or error text
- Correct `type` and `autoComplete`
- Never use placeholder as the only label (disappears on input, harms a11y)

## 10.5 Hover Cards

```jsx
<div className="
  rounded-xl border border-neutral-200 bg-white p-6
  transition-all duration-200 ease-in-out
  hover:border-neutral-300 hover:shadow-md hover:-translate-y-0.5
  cursor-pointer
">
```

## 10.6 Selection States

For selectable cards (pricing plans, variants):

```jsx
<div className={cn(
  "rounded-xl border p-6 transition-all",
  isSelected
    ? "border-brand-500 ring-2 ring-brand-500 ring-offset-2"
    : "border-neutral-200 hover:border-neutral-300"
)}>
```

---

# SECTION 11 — ICON SYSTEM

## 11.1 Single Icon Library

Pick **one** icon library and use it everywhere. Mixing icon libraries produces visual inconsistency (different stroke widths, metaphors, optical sizes).

Recommended: **lucide-react** (shadcn/ui's default). Alternatives: Heroicons, Phosphor, Tabler.

## 11.2 Size Scale

| Size | Tailwind | Use |
|---|---|---|
| XS | `h-3 w-3` | Dense inline icons |
| SM | `h-4 w-4` | Inside buttons, next to text |
| Default | `h-5 w-5` | Standalone icons, icon buttons |
| LG | `h-6 w-6` | Navigation, prominent controls |
| XL | `h-8 w-8` | Empty-state illustrations |
| 2XL | `h-10 w-10` or larger | Hero illustrations, feature cards |

Rule: inside buttons, use `h-4 w-4` for SM/default buttons, `h-5 w-5` for large.

## 11.3 Icon + Text Spacing

```jsx
<button className="inline-flex items-center gap-2">
  <Icon className="h-4 w-4" />
  Label
</button>
```

Always `gap-2` (8px) between icon and label in buttons. Never eyeball margins.

## 11.4 Accessibility

- **Icon next to text label:** decorative, add `aria-hidden="true"`
- **Icon-only button:** the button MUST have `aria-label`

```jsx
<button aria-label="Close dialog" className="h-10 w-10 ...">
  <X className="h-5 w-5" aria-hidden="true" />
</button>
```

## 11.5 Icon Colors

Icons should inherit `currentColor` by default (lucide does this). Color via text utilities:

```jsx
<Icon className="h-5 w-5 text-neutral-500" />
<Icon className="h-5 w-5 text-brand-600" />
```

Never `<Icon fill="#3b82f6" />`. Tokenize.

---

# SECTION 12 — VISUAL HIERARCHY

## 12.1 The Three-Level Rule

Every page must have exactly three levels of visual hierarchy, no more:

1. **One primary headline (h1)** — largest, heaviest, most prominent
2. **Two to four subheadings (h2)** — clearly secondary
3. **Body text** — clearly distinct from headings

If you find yourself needing a fourth level, that's a signal to restructure content, not add another heading size.

## 12.2 White Space Is Not Empty Space

Generous spacing is a design feature, not waste.

**Signs of insufficient white space:**
- Elements feel cramped or cluttered
- The eye doesn't know where to land
- Users report the page feels busy

**Rule:** when in doubt, add more space. Double the spacing you think you need between major sections, then reduce from there.

## 12.3 Visual Weight Balance

Every page should have **one clear call to action at each decision point**.

- Never place two equally weighted buttons side by side.
- Primary button (filled, brand color) = the action you want them to take.
- Secondary button (outline or ghost) = the alternative.

```jsx
<div className="flex items-center gap-3">
  <Button variant="default">Get started</Button>    {/* primary */}
  <Button variant="outline">Learn more</Button>      {/* secondary */}
</div>
```

## 12.4 Scannable Content

- Break long text with subheadings every 3–5 paragraphs.
- Use bullet lists for 3+ items that share structure.
- Bold 1–2 key phrases per paragraph for scanning.
- Never bold entire sentences — it defeats the purpose.

## 12.5 Alignment

- Default to left-aligned for body text (better readability than centered).
- Center-align only for short headings and hero text.
- Never justify body text on the web — produces awkward word spacing.

---

# SECTION 13 — IMAGES AND MEDIA

## 13.1 Always Specify Dimensions

Every `<img>` MUST have explicit `width` and `height` attributes, or use Next.js `<Image>`. Without dimensions, the browser cannot reserve space and **CLS fails**.

```jsx
// Native img — always dimensions
<img
  src="/hero.webp"
  alt="Person using laptop in a bright office"
  width={800}
  height={450}
  loading="lazy"
  decoding="async"
/>

// Hero image — eager, prioritized (LCP element)
<img
  loading="eager"
  fetchPriority="high"
  {...rest}
/>
```

## 13.2 Next.js `<Image>` — Preferred When Available

```jsx
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Product dashboard"
  width={800}
  height={600}
  priority          // for above-the-fold / LCP
  sizes="(max-width: 768px) 100vw, 800px"
  placeholder="blur"
  blurDataURL="..."
/>
```

Handles srcset, sizes, lazy loading, blur placeholder, WebP/AVIF conversion automatically.

## 13.3 Alt Text Rules

- Describe what is **in** the image, not what it is a photo of.
  - ✅ "Person using laptop in a bright office"
  - ❌ "hero image" / "photo"
- Decorative images (add no info): `alt=""`
- Never use the filename.
- Product images: describe the product and key visible details.
- Charts/graphs: describe the key finding, not "bar chart".
- Links wrapping images: describe where the link goes, not the image.

## 13.4 Image Formats

| Content | Format | Fallback |
|---|---|---|
| Photographs | AVIF → WebP | JPEG |
| Icons, logos | SVG | — |
| Illustrations | SVG → WebP | PNG |
| Screenshots | WebP → PNG | — |
| Transparency | WebP → PNG | — |

**Never PNG for photos** (huge files).
**Never PNG for icons** (use SVG).

## 13.5 Responsive Images

```html
<picture>
  <source type="image/avif" srcset="hero-400.avif 400w, hero-800.avif 800w, hero-1600.avif 1600w" sizes="(max-width: 768px) 100vw, 800px">
  <source type="image/webp" srcset="hero-400.webp 400w, hero-800.webp 800w, hero-1600.webp 1600w" sizes="(max-width: 768px) 100vw, 800px">
  <img src="hero-800.jpg" srcset="hero-400.jpg 400w, hero-800.jpg 800w, hero-1600.jpg 1600w" sizes="(max-width: 768px) 100vw, 800px" alt="..." width="800" height="600">
</picture>
```

## 13.6 Image Loading Strategy

| Position | Attributes |
|---|---|
| LCP / hero (above fold) | `loading="eager" fetchPriority="high"` (or `priority` on Next Image) |
| Below fold | `loading="lazy" decoding="async"` |
| Footer | `loading="lazy" decoding="async"` |

## 13.7 Background Images

Use `image-set()` for responsive background images with fallbacks:

```css
.hero {
  background-image: image-set(
    url('/images/hero.avif') type('image/avif'),
    url('/images/hero.webp') type('image/webp'),
    url('/images/hero.jpg') type('image/jpeg')
  );
  background-size: cover;
  background-position: center;
}
```

## 13.8 Video

- Always include captions: `<track kind="captions" src="/captions.vtt">` for prerecorded video
- `preload="none"` unless video is the core content; `preload="metadata"` for controlled playback
- Never autoplay with sound. If autoplay is necessary (hero video): `muted playsInline loop`
- Provide `controls` for anything over 5 seconds
- Reserve aspect ratio with `aspect-video` (16/9) or `aspect-[9/16]` (vertical)

## 13.9 Image Compression Targets

- Hero images: under 200KB (ideally under 100KB for WebP/AVIF)
- Content images: under 100KB
- Icons (SVG): under 5KB after SVGO
- Never ship an image over 500KB without justification

Tools: Squoosh, TinyPNG, Cloudinary, `next/image` auto-optimization, SVGOMG for SVGs.

---

# SECTION 14 — ANIMATION AND MOTION

## 14.1 Keep It Purposeful

Animation must communicate something — state change, direction of navigation, loading progress, spatial relationship. Never add animation purely for decoration.

## 14.2 Duration and Easing

| Interaction | Duration | Easing |
|---|---|---|
| Micro-interactions (hover, button press) | 100–150ms | `ease-in-out` |
| State transitions (expand, collapse) | 200–300ms | `ease-in-out` |
| Page transitions / modals | 200–250ms | `ease-out` (open), `ease-in` (close) |
| Loaders / spinners | 600–1000ms | `linear` |

Never use animation durations above 500ms for UI interactions — it feels sluggish.

## 14.3 Tailwind Transition Classes

```jsx
// Standard — use on almost everything interactive
transition-all duration-150 ease-in-out

// Color transitions (hover on buttons, links)
transition-colors duration-150

// Transform transitions (hover lift on cards)
transition-transform duration-200

// Opacity (fade in/out)
transition-opacity duration-200
```

## 14.4 Animate Only `transform` and `opacity`

These don't trigger layout or paint — they run on the compositor (GPU).

**Do:**
- `translate-y-0.5`, `scale-[0.98]`, `rotate-3`
- `opacity-0` ↔ `opacity-100`

**Don't:**
- Animate `height`, `width`, `margin`, `top`, `left` (triggers layout)
- Animate `box-shadow` on many elements at once (paint-heavy)

For height animations (accordions), use `grid-template-rows: 0fr` ↔ `1fr` trick, or `max-height` with overflow hidden.

## 14.5 Respect User Preferences — Required

Every animation must be suppressed for users who prefer reduced motion. Add this to your global CSS:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

In Tailwind, prefer `motion-safe:` for opt-in animations (e.g. `motion-safe:animate-pulse`) rather than unconditional animations.

## 14.6 Page Transitions — View Transitions API (Modern)

For SPAs or MPAs that want cross-page animations, use the native View Transitions API:

```css
@view-transition { navigation: auto; }

::view-transition-old(root) {
  animation: fade-out 200ms ease-in;
}
::view-transition-new(root) {
  animation: fade-in 200ms ease-out;
}
```

Browser support: Chrome/Edge stable; Safari 18+; Firefox behind flag. Progressive enhancement — sites still work without it.

## 14.7 Loading States

| Duration | UI |
|---|---|
| < 1 second | Spinner |
| 1–3 seconds | Skeleton screen that mimics final layout |
| 3+ seconds | Progress bar (real progress if known, indeterminate if not) + status text |

Never leave the user looking at an empty screen. Always show *something* within 200ms of an action.

---

# SECTION 15 — DARK MODE

## 15.1 Decide Day One

Decide on day one whether you support dark mode. Retrofitting is painful.

**If yes:**

1. Set `darkMode: 'class'` in `tailwind.config.ts` so dark mode is triggered by a class on `<html>`.
2. Define all color tokens as CSS variables (see Section 3.2).
3. Install `next-themes` (or equivalent) for toggle with localStorage persistence and SSR support.
4. Respect `prefers-color-scheme` on first visit, then user's explicit choice.

## 15.2 Standard shadcn/ui Setup

```tsx
// app/layout.tsx
import { ThemeProvider } from 'next-themes';

<html lang="en" suppressHydrationWarning>
  <body>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  </body>
</html>
```

## 15.3 Write Both Modes Simultaneously

```jsx
// Every color class gets a dark: variant
<div className="
  bg-white dark:bg-neutral-950
  text-neutral-900 dark:text-neutral-100
  border-neutral-200 dark:border-neutral-800
">
```

Or better, use semantic tokens that handle it automatically: `bg-background text-foreground border-border`.

## 15.4 Dark Mode Quality Checklist

Before shipping dark mode, verify:

- [ ] **Contrast passes in BOTH modes** — gray text on white ≠ gray text on dark
- [ ] **Images with white backgrounds handled** — bad in dark mode; use transparent, invert, or swap
- [ ] **Screenshots/illustrations** — may need dark variants
- [ ] **Shadows are subtle or replaced with borders** — shadows barely visible on dark surfaces
- [ ] **Focus rings visible in both modes** — typically adjust `ring-offset` color
- [ ] **Brand color may need brightening** — a primary that works on white may look dull on near-black; use a shade or two lighter in dark mode
- [ ] **Pure black (`#000`) avoided** — use near-black (`neutral-950` = `#030712`) for reduced eye strain
- [ ] **Pure white (`#fff`) avoided in light mode too** — `neutral-50` often looks more professional

## 15.5 Theme Toggle Component

```jsx
'use client';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
```

---

# SECTION 16 — ACCESSIBILITY (WCAG 2.2 AA)

These are not optional. They affect real users and carry legal risk in many markets (EU Accessibility Act, ADA, AODA, EAA).

## 16.1 Semantic HTML First

Use the correct HTML element for the job. Semantic HTML does 80% of the accessibility work automatically.

| Element | Purpose |
|---|---|
| `<button>` | Actions (submit, open modal, toggle) |
| `<a href>` | Navigation (links to URLs or sections) |
| `<h1>–<h6>` | Page structure, logical order, no skipping |
| `<main>` | Main page content (one per page) |
| `<nav>` | Navigation landmarks (label if multiple) |
| `<header>` | Page or section header |
| `<footer>` | Page or section footer |
| `<section>` | Thematic grouping with a heading |
| `<article>` | Self-contained content (blog post, product card) |
| `<aside>` | Complementary content (sidebar) |
| `<label>` | Always paired with form inputs via `htmlFor` |
| `<ul>` / `<ol>` / `<li>` | Lists (nav menus, feature lists) |
| `<dialog>` | Modals (native HTML dialog or shadcn Dialog) |

**Never use `<div>` or `<span>` for interactive elements. Never `<div onClick>` where a `<button>` belongs.**

## 16.2 Heading Hierarchy

- Exactly **one `<h1>` per page**, describing what the page is about (not the logo).
- Never skip levels (h2 → h4 is wrong).
- Use CSS for size, not heading level. An `<h2>` can look like body text if the design requires it.

## 16.3 Focus Management

- **Focus ring ALWAYS visible on keyboard focus.** `focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2` on every interactive element.
- **Never `outline: none`** without replacing with a visible focus style.
- **Modal dialogs:** focus moves into the modal on open, returns to the trigger on close (shadcn Dialog handles this).
- **Route changes in SPAs:** focus should move to the new page's `<h1>` or `<main>`.

## 16.4 Skip to Content Link

Place as the first element after `<body>`:

```jsx
<a
  href="#main"
  className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-background focus:px-4 focus:py-2 focus:ring-2"
>
  Skip to main content
</a>
```

## 16.5 ARIA — Only When Needed

ARIA is a supplement to semantic HTML, not a replacement. The first rule of ARIA: **don't use ARIA** when HTML can express the same thing.

Common ARIA you'll actually need:

```jsx
// Icon-only button
<button aria-label="Close menu">
  <X className="h-5 w-5" aria-hidden="true" />
</button>

// Navigation landmark with context
<nav aria-label="Main navigation">
<nav aria-label="Footer navigation">

// Current page indicator
<a href="/pricing" aria-current="page">Pricing</a>

// Loading state
<button aria-busy={isLoading} disabled={isLoading}>
  {isLoading ? 'Loading...' : 'Submit'}
</button>

// Error message connected to input
<input aria-describedby="email-error" aria-invalid={!!error} />
<p id="email-error" role="alert" className="text-sm text-red-600">
  {errorMessage}
</p>

// Disclosure (accordion)
<button aria-expanded={isOpen} aria-controls="panel-1">
  Toggle
</button>
<div id="panel-1" hidden={!isOpen}>

// Live region for dynamic updates
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {statusMessage}
</div>
```

## 16.6 Keyboard Navigation — Required

Every interactive element must be reachable and operable by keyboard alone.

| Key | Action |
|---|---|
| Tab | Move forward through focusable elements |
| Shift+Tab | Move backward |
| Enter / Space | Activate buttons, submit forms |
| Arrow keys | Navigate within composite widgets (menus, tabs, radio groups) |
| Escape | Close modals, dropdowns, drawers |

**Test by unplugging the mouse** and navigating entirely by keyboard before every launch.

## 16.7 Screen Reader Testing

Test with at least one screen reader before major launches:
- **macOS:** VoiceOver (Cmd+F5)
- **Windows:** NVDA (free, nvaccess.org)
- **iOS:** Settings → Accessibility → VoiceOver
- **Android:** TalkBack

Walk through: homepage → primary flow → form submission. Listen for confusing or missing announcements.

## 16.8 Automated Accessibility Testing

Use in addition to manual testing:
- **axe DevTools** (Chrome extension, free)
- **Lighthouse Accessibility audit** (built into Chrome DevTools)
- **@axe-core/playwright** for CI integration

Target: zero `critical` or `serious` violations. `moderate` / `minor` reviewed case by case.

## 16.9 Reduced Motion

Already covered in Section 14.5 — respect `prefers-reduced-motion` via global CSS.

## 16.10 Color Contrast

Already covered in Section 3.3. Body text 4.5:1, large text/UI 3:1.

## 16.11 Form Accessibility

Already covered in Section 20. Every input has a label, error messages are announced, required fields indicated textually not just by color.

---

# SECTION 17 — SEO AND METADATA

## 17.1 Required Meta Tags on Every Page

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Page Title — under 60 chars</title>
  <meta name="description" content="Unique description, under 155 chars.">
  <link rel="canonical" href="https://example.com/current-page">

  <!-- Favicons -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/png" href="/favicon.png">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">

  <!-- Theme color -->
  <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#030712" media="(prefers-color-scheme: dark)">
</head>
```

## 17.2 Open Graph Tags

```html
<meta property="og:type" content="website">
<meta property="og:url" content="https://example.com/current-page">
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Unique description under 155 chars.">
<meta property="og:image" content="https://example.com/og/page.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="Brand">
<meta property="og:locale" content="en_US">
```

## 17.3 Twitter Card

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Page Title">
<meta name="twitter:description" content="Unique description.">
<meta name="twitter:image" content="https://example.com/og/page.png">
<meta name="twitter:site" content="@brand">
```

## 17.4 OG Image Specs

- **1200 × 630px** (1.91:1 ratio)
- Under 5MB; ideally under 300KB
- Text large and readable at small sizes — preview in Slack/iMessage/WhatsApp
- Design for both light and dark chat backgrounds

## 17.5 Next.js App Router Metadata

```tsx
// app/pricing/page.tsx
export const metadata = {
  title: 'Pricing — BrandName',
  description: 'Simple, transparent pricing for teams of any size.',
  openGraph: {
    title: 'Pricing — BrandName',
    description: 'Simple, transparent pricing for teams of any size.',
    images: ['/og/pricing.png'],
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: 'https://example.com/pricing' },
};
```

## 17.6 Required Files at Site Root

- `/robots.txt` — not blocking critical pages
- `/sitemap.xml` — submitted to Google Search Console
- `/favicon.svg` or `/favicon.ico`
- `/apple-touch-icon.png` (180×180)

## 17.7 Structured Data (JSON-LD)

At minimum: `Organization` on every page. Additional schemas per page type:

- `Product` for pricing/product pages
- `Article` for blog posts
- `BreadcrumbList` for inner pages
- `FAQPage` for FAQ sections
- `SoftwareApplication` for SaaS products

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BrandName",
    "url": "https://example.com",
    "logo": "https://example.com/logo.png",
  })}}
/>
```

Validate at [search.google.com/test/rich-results](https://search.google.com/test/rich-results).

## 17.8 Semantic Structure for SEO

- One `<h1>` per page, includes the primary keyword naturally
- Logical heading hierarchy
- Descriptive `<title>` and `<meta description>` unique per page
- Internal links use descriptive anchor text (not "click here")
- Image `alt` text where meaningful (helps image search too)

---

# SECTION 18 — FORMS (COMPREHENSIVE)

## 18.1 Anatomy of a Correct Form Field

```jsx
<div className="space-y-1.5">
  <label
    htmlFor="email"
    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
  >
    Email address
    <span className="text-red-600 ml-0.5" aria-hidden="true">*</span>
  </label>

  <input
    id="email"
    name="email"
    type="email"
    autoComplete="email"
    required
    aria-required="true"
    aria-invalid={!!errors.email}
    aria-describedby={errors.email ? "email-error" : "email-hint"}
    placeholder="you@example.com"
    className="
      block w-full rounded-lg border border-neutral-300 bg-white
      px-4 py-3 text-base text-neutral-900
      placeholder:text-neutral-400
      focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500
      aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500
      disabled:bg-neutral-100 disabled:cursor-not-allowed
      transition-colors duration-150
    "
  />

  {!errors.email && (
    <p id="email-hint" className="text-xs text-neutral-500">
      We'll never share your email.
    </p>
  )}

  {errors.email && (
    <p id="email-error" role="alert" className="text-xs text-red-600">
      {errors.email.message}
    </p>
  )}
</div>
```

## 18.2 Autocomplete Values — Complete Reference

Getting these right = free UX win. Password managers and browsers autofill correctly.

| Field | autoComplete |
|---|---|
| First name | `given-name` |
| Last name | `family-name` |
| Full name | `name` |
| Email | `email` |
| Username | `username` |
| Phone | `tel` |
| Current password | `current-password` |
| New password | `new-password` |
| One-time code | `one-time-code` |
| Organization | `organization` |
| Job title | `organization-title` |
| Street address | `street-address` |
| City | `address-level2` |
| State / Region | `address-level1` |
| Postal code | `postal-code` |
| Country | `country-name` |
| Credit card number | `cc-number` |
| Credit card expiry | `cc-exp` |
| Credit card CVC | `cc-csc` |
| Birth date | `bday` |

## 18.3 HTML5 Input Types

Use specific types — they trigger correct mobile keyboards and built-in validation.

```jsx
<input type="email" />     // shows @ key on mobile
<input type="tel" />       // numeric keypad
<input type="number" />    // numeric with - and .
<input type="url" />       // / key on mobile
<input type="date" />      // native date picker
<input type="time" />
<input type="datetime-local" />
<input type="search" />    // shows clear button on iOS
<input type="password" />
<input type="file" />
<input type="color" />
<input type="range" />
```

## 18.4 Validation Strategy

1. **Native HTML attributes first:** `required`, `minlength`, `maxlength`, `pattern`, `type`
2. **Zod schema** for client-side validation with `react-hook-form`
3. **Server-side validation always** — client-side is UX, not security
4. **Validate on blur** (not on every keystroke — noisy) and on submit
5. **Show errors adjacent to the field**, not in a distant summary

## 18.5 react-hook-form + Zod + shadcn Pattern

```tsx
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Must be at least 8 characters'),
});

type Values = z.infer<typeof schema>;

export function LoginForm() {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: Values) {
    // ...
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* ... */}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </Form>
  );
}
```

## 18.6 Submit Button States

Always update the label — a spinner alone doesn't tell screen readers what's happening.

```jsx
<Button type="submit" disabled={isSubmitting}>
  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  {isSubmitting ? 'Creating account...' : 'Create account'}
</Button>
```

## 18.7 Error Summary for Long Forms

For forms with 5+ fields, add a summary at the top on submit error — helps keyboard and screen-reader users:

```jsx
{Object.keys(errors).length > 0 && (
  <div role="alert" aria-labelledby="error-summary-heading" className="rounded-lg border border-red-200 bg-red-50 p-4">
    <h2 id="error-summary-heading" className="text-sm font-semibold text-red-800">
      Please fix the following errors:
    </h2>
    <ul className="mt-2 list-disc pl-5 text-sm text-red-700">
      {Object.entries(errors).map(([field, error]) => (
        <li key={field}>
          <a href={`#${field}`}>{error.message}</a>
        </li>
      ))}
    </ul>
  </div>
)}
```

## 18.8 Successful Submission

- Show clear success state: toast, inline message, or redirect to a confirmation page.
- For long-running actions (upload, large saves), show progress.
- Reset the form if it's likely to be reused; don't reset confirmation-type forms.

---

# SECTION 19 — LOADING, EMPTY, AND ERROR STATES

Every component that fetches data must handle **four states explicitly**: loading, empty, error, loaded.

## 19.1 Loading States

**Skeleton screens** (preferred for data-heavy UIs — they mimic final layout):

```jsx
<div className="animate-pulse space-y-3">
  <div className="h-6 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
  <div className="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
  <div className="h-4 w-5/6 rounded bg-neutral-200 dark:bg-neutral-800" />
</div>
```

**Spinners** (for short actions, button submit states):

```jsx
<Loader2 className="h-4 w-4 animate-spin" />
```

**Progress bars** (for long operations with known duration):

```jsx
<div className="h-2 w-full rounded-full bg-neutral-200 overflow-hidden">
  <div className="h-full bg-brand-500 transition-all" style={{ width: `${percent}%` }} />
</div>
```

## 19.2 Empty States

A blank screen with no data makes users think something's broken. Every empty state should include:

1. An icon or illustration
2. A heading explaining what's missing
3. A short description
4. A primary action to resolve

```jsx
<div className="flex flex-col items-center justify-center py-12 text-center">
  <div className="rounded-full bg-neutral-100 dark:bg-neutral-800 p-4 mb-4">
    <FileText className="h-8 w-8 text-neutral-500" aria-hidden="true" />
  </div>
  <h3 className="text-lg font-semibold mb-1">No projects yet</h3>
  <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-sm mb-6">
    Create your first project to get started. You'll be able to invite teammates and track progress.
  </p>
  <Button asChild>
    <a href="/projects/new">Create project</a>
  </Button>
</div>
```

## 19.3 Error States

Errors should be specific, actionable, and reassuring. Tell the user what happened, why (if relevant), and what they can do.

```jsx
<div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
  <div className="flex items-start gap-3">
    <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
    <div className="flex-1">
      <h3 className="text-sm font-semibold text-red-900 dark:text-red-100">
        Couldn't load projects
      </h3>
      <p className="mt-1 text-sm text-red-700 dark:text-red-300">
        Check your connection and try again. If the problem persists, contact support.
      </p>
      <Button variant="outline" size="sm" className="mt-3" onClick={retry}>
        Try again
      </Button>
    </div>
  </div>
</div>
```

## 19.4 Full-Page 404 / 500 Pages

Required pages: `/404`, `/500`. 500 pages **must inline their CSS** — if the server is broken, external stylesheets may fail.

```tsx
// Minimum viable 404
<main className="min-h-dvh flex flex-col items-center justify-center text-center px-4">
  <h1 className="text-6xl font-bold">404</h1>
  <p className="mt-4 text-lg text-neutral-600">This page doesn't exist.</p>
  <Button asChild className="mt-6">
    <a href="/">Go home</a>
  </Button>
</main>
```

## 19.5 Status / Toast Pattern

Use a toast library (Sonner for shadcn/ui) for transient confirmations:

```tsx
import { toast } from 'sonner';

toast.success('Project created');
toast.error('Could not save. Try again.');
toast.info('Export started — we\'ll email you when it\'s ready.');
```

Toasts should: auto-dismiss in 4–6s (errors longer), be dismissible, announce to screen readers (most libraries handle this), never obscure primary content.

---

# SECTION 20 — NAVIGATION PATTERNS

## 20.1 Primary Navigation Rules

- **Sticky on scroll** — makes long pages easier to navigate
- **Logo on the left** (LTR), links center or right, primary CTA far right
- **Current page indicated** with `aria-current="page"` and visual treatment
- **Backdrop blur** (`backdrop-blur bg-background/95`) on scrolled state
- **Border-bottom** for subtle separation from content

## 20.2 Mobile Navigation

- Hamburger triggers a Sheet/drawer, **not** a dropdown (dropdowns are hard to use on small screens)
- Drawer slides from the right (LTR) or left
- Links are large, stacked, `py-3` minimum for touch targets
- Close affordance visible (X in top right)
- Close on link click
- Close on backdrop click or Escape
- Focus trapped inside when open

## 20.3 Secondary Navigation

Tabs for switching between views of the same entity:

```jsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="activity">Activity</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">...</TabsContent>
</Tabs>
```

Use shadcn's Tabs — fully keyboard accessible out of the box.

## 20.4 Breadcrumbs

For deep hierarchies (documentation, ecommerce):

```jsx
<nav aria-label="Breadcrumb">
  <ol className="flex items-center gap-2 text-sm">
    <li><a href="/">Home</a></li>
    <li aria-hidden="true">/</li>
    <li><a href="/docs">Docs</a></li>
    <li aria-hidden="true">/</li>
    <li aria-current="page" className="text-neutral-500">Installation</li>
  </ol>
</nav>
```

## 20.5 Pagination

For lists over 20 items:

- Show current page clearly
- Previous/Next + 1, 2, 3 with ellipsis for long lists
- Disable (not hide) Previous on page 1 and Next on last page
- Use real `<a href>` so middle-click / right-click works

## 20.6 Footer Navigation

Standard structure:

- Logo + tagline + social icons on the left (or top on mobile)
- 3–4 columns of links: Product, Company, Resources, Legal
- Bottom bar: copyright, locale switcher, privacy/terms links
- Newsletter signup (optional)

Required legal links for a commercial site: **Terms**, **Privacy**, **Cookie Policy**, **Refund Policy** (if taking payments), contact email.

---

# SECTION 21 — MODALS, DIALOGS, AND OVERLAYS

## 21.1 Use shadcn Dialog

Always use a battle-tested dialog primitive (shadcn Dialog, which wraps Radix). Hand-rolled modals almost always break focus management, scroll behavior, or Escape handling.

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent className="max-w-lg">
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>This action cannot be undone.</DialogDescription>
    </DialogHeader>
    {/* body */}
    <DialogFooter>
      <Button variant="outline" onClick={close}>Cancel</Button>
      <Button variant="destructive" onClick={confirm}>Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## 21.2 Required Behaviors

- Focus moves into the dialog when opened (first focusable element or explicit target)
- Focus returns to the trigger when closed
- Escape closes
- Clicking backdrop closes (usually; not for destructive confirmations)
- Background content is inert (`aria-hidden` or `inert` attribute)
- Body scroll is locked while open
- Labeled via `aria-labelledby` pointing to `DialogTitle`

## 21.3 Destructive Confirmations

Use `AlertDialog` (not `Dialog`) for irreversible actions:
- Cannot be dismissed by clicking outside (prevents accidents)
- Explicit Cancel button
- Destructive button styled red
- Button labels describe the action ("Delete account", not "OK")

## 21.4 Sheets / Drawers

Use `Sheet` (shadcn) for:
- Mobile navigation
- Side panels (filters, details)
- Full-screen forms on mobile

## 21.5 Popovers and Tooltips

- **Popover:** click/tap to open, contains interactive content
- **Tooltip:** hover/focus to show, read-only label/hint (never put critical info in a tooltip — not reachable on touch devices by default)
- **Dropdown menu:** click to open, keyboard navigable, list of actions

---

# SECTION 22 — MICROCOPY AND CONTENT

## 22.1 Button Labels

Buttons do things. The label should describe the action.

- ✅ "Create account" / "Save changes" / "Delete project"
- ❌ "OK" / "Submit" / "Click here"

## 22.2 Error Messages

Specific, actionable, blame-free.

- ✅ "That email is already in use. Try signing in instead."
- ❌ "Error" / "Invalid input"

## 22.3 Loading Labels

Describe what's happening.

- ✅ "Creating your account..." / "Saving changes..."
- ❌ "Loading..." (for any action)

## 22.4 Empty State Copy

Turn an empty state into a useful moment.

- ✅ "No projects yet. Create your first project to invite teammates and track work."
- ❌ "No data"

## 22.5 Placeholder Copy

- Show format hints: `you@example.com`, `(555) 123-4567`, `MM/YY`
- Never replace labels with placeholders (disappears on focus, breaks a11y)
- Use sentence case, not Title Case

## 22.6 Consistency

- Pick one: "sign in" or "log in" — never mix
- Pick one: "email" or "email address" — pick and use everywhere
- Pick one: "delete" or "remove" — match to what actually happens

## 22.7 Voice

- **Second person** ("you", "your") — feels personal
- **Active voice** ("Save your changes" > "Changes will be saved")
- **Present tense** for actions ("Creating...") and past tense for confirmations ("Created")
- **Contractions are OK** — they sound human ("you'll", "we've")

## 22.8 Internationalization-Ready Copy

- Keep strings short — translated languages are often longer
- Don't concatenate strings ("You have " + count + " items")— use interpolation templates
- Externalize all user-facing strings to a translations file even if launching English-only
- Avoid idioms that don't translate

---

# SECTION 23 — PERFORMANCE STANDARDS

## 23.1 Core Web Vitals Targets (Mobile)

| Metric | Good | Needs Improvement | Poor |
|---|---|---|---|
| **LCP** Largest Contentful Paint | < 2.5s | 2.5–4.0s | > 4.0s |
| **INP** Interaction to Next Paint | < 200ms | 200–500ms | > 500ms |
| **CLS** Cumulative Layout Shift | < 0.1 | 0.1–0.25 | > 0.25 |

Measured at 75th percentile of real-user data on mobile 4G. These affect Google search ranking.

## 23.2 LCP Optimization

LCP is almost always an image or large text block above the fold.

- **Preload the LCP image:** `<link rel="preload" as="image" href="/hero.webp" fetchpriority="high">` or `priority` on Next Image
- **Serve modern formats:** AVIF → WebP → JPEG fallback
- **Correct sizing:** `sizes` attribute, appropriate `srcset`
- **Preconnect to font origin:** `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`
- **Server TTFB:** under 600ms — use a CDN

## 23.3 INP Optimization

INP measures responsiveness across all interactions (not just the first like FID did).

- **Break long tasks:** `await scheduler.yield()` or `setTimeout(() => ..., 0)` between chunks
- **Defer non-critical scripts:** `<Script strategy="lazyOnload">` for analytics, chat widgets
- **Debounce expensive handlers:** search inputs, autocomplete
- **Use `useTransition` / `useDeferredValue`** in React for non-urgent updates
- **Virtualize long lists:** `@tanstack/react-virtual`, `react-window`

## 23.4 CLS Optimization

CLS is almost always caused by content loading without reserved space.

- **Every image has width/height** or aspect-ratio container
- **Reserve space for ads, embeds, dynamic content** — don't let them push existing content
- **Preload fonts** with matching metrics overrides (`size-adjust`, `ascent-override`) to prevent font-swap reflow
- **Skeleton loaders** that match final dimensions
- **Never inject content above existing content** (e.g. GDPR banners at the top after render)

## 23.5 Performance Budgets

Set and enforce:

| Budget | Target |
|---|---|
| Total page weight | < 1500 KB (ideal < 500 KB) |
| Initial JS bundle (gzipped) | < 170 KB |
| CSS | < 100 KB |
| Web fonts total | < 300 KB (ideal) |
| LCP image | < 200 KB |
| Individual images | < 500 KB max |
| HTTP requests | Minimize; each justified |

Monitor with `next build` output, Bundle Analyzer, or size-limit in CI.

## 23.6 Resource Hints

```html
<!-- In <head> -->
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="dns-prefetch" href="https://api.example.com">
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high">
<link rel="preload" as="font" type="font/woff2" href="/fonts/inter.woff2" crossorigin>
```

Don't over-preload — more than 2-3 preloads can hurt performance.

## 23.7 Compression and Caching

- **Gzip or Brotli** enabled on all text responses (HTML, CSS, JS, JSON)
- **Cache-Control** headers: long-cache for hashed static assets (`max-age=31536000, immutable`), short or `no-cache` for HTML
- **CDN** in front of static assets (Vercel handles this automatically)

## 23.8 Lighthouse Targets

| Category | Target |
|---|---|
| Performance (mobile) | 85+ |
| Accessibility | 95+ |
| Best Practices | 95+ |
| SEO | 100 |

Run Lighthouse on every significant change. Pages regress silently.

## 23.9 Third-Party Script Strategy

Third-party scripts (analytics, chat, ads) are the #1 performance regression source.

- **Defer:** `<Script strategy="lazyOnload">` (Next.js) or `async` / `defer` attribute
- **Self-host** where possible (Plausible, Fathom)
- **Load on interaction:** chat widgets should only load when user clicks the bubble
- **Audit regularly:** WebPageTest's "Third Parties" tab

---

# SECTION 24 — COMPONENT STANDARDS

## 24.1 Naming and File Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui primitives (don't modify directly)
│   ├── layout/          # Navbar, Footer, PageContainer, Sidebar
│   ├── sections/        # HeroSection, FeaturesSection, PricingSection
│   ├── forms/           # ContactForm, SignupForm, LoginForm
│   ├── cards/           # FeatureCard, TestimonialCard, PricingCard
│   └── shared/          # Icons, dividers, small reusables
└── app/ or pages/       # route-level page components
```

- Components in `PascalCase.tsx`
- One component per file for reusable ones
- Colocate small helpers; extract if reused

## 24.2 Component Size Rule

If a component exceeds **150 lines**, split it. Each component should do one thing and do it completely.

## 24.3 Props and Defaults

Every component should have sensible defaults. No required prop should be required if a safe default exists.

```tsx
type Props = {
  title: string;
  description?: string;
  variant?: 'default' | 'compact';
  onClose?: () => void;
};

export function Banner({
  title,
  description,
  variant = 'default',
  onClose,
}: Props) { /* ... */ }
```

## 24.4 Four-State Components

Every component that fetches data must handle **all four states explicitly**:

```tsx
if (isLoading) return <ComponentSkeleton />;
if (error) return <ErrorState message={error.message} onRetry={retry} />;
if (!data || data.length === 0) return <EmptyState />;
return <ComponentContent data={data} />;
```

Never render nothing while loading.

## 24.5 Composition Over Configuration

Prefer small composable components over one god-component with 20 props.

```tsx
// ❌ One giant Card with 12 optional props
<Card title="..." description="..." image="..." actions={[...]} badge="..." />

// ✅ Composable
<Card>
  <CardHeader>
    <CardTitle>...</CardTitle>
    <CardDescription>...</CardDescription>
  </CardHeader>
  <CardContent>...</CardContent>
  <CardFooter>...</CardFooter>
</Card>
```

## 24.6 TypeScript Strict

- `strict: true` in `tsconfig.json`
- No `any` without a written comment explaining why
- Prefer `unknown` + narrowing to `any`
- Export prop types from the component file

## 24.7 `cn()` Utility for Conditional Classes

```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  "base classes here",
  isActive && "active-classes",
  variant === 'primary' ? "primary-classes" : "secondary-classes",
  className, // allow consumer override
)} />
```

Never use template strings for conditional Tailwind — `cn()` handles merge conflicts via `tailwind-merge`.

---

# SECTION 25 — MODERN CSS / PLATFORM FEATURES

Adopt current web platform features. They reduce dependencies and improve polish.

## 25.1 CSS Features to Use

- **`:has()` parent selector** — style a parent based on children (wide browser support as of 2024)
  ```css
  /* Card that has a featured badge */
  .card:has(.badge-featured) { border-color: gold; }
  ```

- **`:is()` and `:where()`** — cleaner selectors, `:where` has zero specificity

- **Container queries** — see Section 8.4

- **Logical properties** — `margin-inline`, `padding-block`, `inset-inline-start`

- **Dynamic viewport units** — `dvh`, `svh`, `lvh` (Section 9.3)

- **`text-wrap: balance` and `pretty`** — Section 2.6

- **`aspect-ratio`** — reserves space, prevents CLS (Section 8.5)

- **`accent-color`** — styles form controls with one property
  ```css
  :root { accent-color: var(--brand-500); }
  ```

- **`scroll-padding-top`** — prevents sticky header from hiding anchor targets
  ```css
  html { scroll-padding-top: 80px; }
  ```

- **`scrollbar-gutter: stable`** — prevents layout shift when scrollbar appears

## 25.2 Modern Selectors for Accessibility

```css
/* Only show focus ring for keyboard users */
.button:focus-visible { outline: 2px solid var(--brand-500); }

/* Style the current page in nav without JS */
.nav a[aria-current="page"] { color: var(--brand-600); }

/* Style inputs in error state */
.input[aria-invalid="true"] { border-color: var(--red-500); }
```

## 25.3 View Transitions API (Progressive Enhancement)

```css
@view-transition { navigation: auto; }

/* Fade between pages */
::view-transition-old(root) { animation: fade-out 200ms ease-in; }
::view-transition-new(root) { animation: fade-in 200ms ease-out; }
```

Works in Chrome/Edge stable and Safari 18+. Degrades gracefully.

## 25.4 CSS Variables for Runtime Theming

```css
.card {
  --card-bg: var(--background);
  background: var(--card-bg);
}
.card[data-variant="featured"] {
  --card-bg: var(--accent);
}
```

More maintainable than conditional Tailwind classes for complex theming.

---

# SECTION 26 — PRE-BUILD CHECKLIST

Run through this **before starting** any new page or component.

## 26.1 Before Writing Code

- [ ] Do I know the exact breakpoints where layout changes?
- [ ] Do I know the font sizes for each heading level on this page?
- [ ] Is the color palette defined in `tailwind.config.ts`?
- [ ] Is my design tokens document open (colors, spacing, radius, shadows)?
- [ ] Have I seen a reference for what this should look like on mobile?
- [ ] Do I know the data flow? What's loading, what errors can occur, what's the empty state?
- [ ] Do I know which shadcn/ui components already cover this need?

## 26.2 Before Marking a Component Complete

- [ ] All font sizes use `rem` via Tailwind `text-*` classes?
- [ ] All spacing uses Tailwind scale (no arbitrary px values)?
- [ ] Colors come from tokens (no hardcoded hex)?
- [ ] `max-w-prose` on all body text blocks?
- [ ] Standard container on page (`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`)?
- [ ] Every button has hover, focus-visible, active, disabled styles?
- [ ] Every input has a visible label (not just placeholder)?
- [ ] Every input has correct `type`, `autoComplete`, and aria attributes?
- [ ] All images have width, height, alt text, and correct loading attribute?
- [ ] Navigation collapses to hamburger at `md` breakpoint?
- [ ] Section spacing is `py-16 md:py-24` (or equivalent responsive)?
- [ ] `prefers-reduced-motion` respected via global CSS?
- [ ] No `div` or `span` where a semantic element belongs?
- [ ] Touch targets ≥ 44px on interactive elements?
- [ ] Loading / empty / error states all explicitly handled?
- [ ] Dark mode classes present on every color class (if dark mode is supported)?

## 26.3 Before Marking a Page Complete

- [ ] Tested at 375px, 768px, 1280px in Chrome DevTools?
- [ ] Tested on real mobile device (Safari on iPhone especially)?
- [ ] Keyboard-navigated through all interactive elements?
- [ ] Tab order matches visual order?
- [ ] Focus ring visible on every interactive element?
- [ ] No console errors or TypeScript errors?
- [ ] Contrast ratio passes 4.5:1 for all body text?
- [ ] Meta title, description, OG image set?
- [ ] Canonical URL set?
- [ ] One `<h1>`, correct heading hierarchy?
- [ ] Lighthouse mobile: Performance ≥ 85, Accessibility ≥ 95, SEO = 100?
- [ ] Dark mode tested (if supported)?

---

# SECTION 27 — COMMON PATTERNS (COPY THESE EXACTLY)

## 27.1 Page Shell

```tsx
export default function Page() {
  return (
    <main id="main">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* content */}
      </div>
    </main>
  );
}
```

## 27.2 Standard Section

```tsx
<section className="py-16 md:py-24">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
      <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
        Section heading
      </h2>
      <p className="mt-4 text-lg text-neutral-600 leading-relaxed text-pretty">
        Section description that provides context for what follows.
      </p>
    </div>
    {/* section content */}
  </div>
</section>
```

## 27.3 Hero Section

```tsx
<section className="relative py-20 md:py-32">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-balance">
          Hero headline that says what this is
        </h1>
        <p className="mt-6 text-lg md:text-xl text-neutral-600 leading-relaxed max-w-xl text-pretty">
          Subhead that adds one more specific detail without restating the headline.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Button size="lg" asChild>
            <a href="/signup">Get started</a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="/how-it-works">How it works</a>
          </Button>
        </div>
      </div>
      <div className="aspect-[4/3] lg:aspect-auto lg:h-[500px] rounded-2xl overflow-hidden">
        <Image
          src="/hero.webp"
          alt="Product dashboard showing analytics"
          width={800}
          height={600}
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  </div>
</section>
```

## 27.4 Feature Card

```tsx
<div className="
  rounded-xl border border-neutral-200 dark:border-neutral-800
  bg-white dark:bg-neutral-900 p-6
  hover:border-neutral-300 hover:shadow-md hover:-translate-y-0.5
  transition-all duration-200
">
  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950">
    <Icon className="h-5 w-5 text-brand-600" aria-hidden="true" />
  </div>
  <h3 className="text-lg font-semibold">Feature title</h3>
  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
    Feature description that explains the benefit clearly.
  </p>
</div>
```

## 27.5 Primary CTA Button

```tsx
<button className="
  inline-flex items-center justify-center gap-2
  rounded-lg bg-brand-500 px-6 py-3
  text-sm font-semibold text-white
  hover:bg-brand-600
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2
  active:bg-brand-700 active:scale-[0.98]
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-all duration-150
">
  Get started
  <ArrowRight className="h-4 w-4" aria-hidden="true" />
</button>
```

## 27.6 Form Field

```tsx
<div className="space-y-1.5">
  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
    Email address
  </label>
  <input
    id="email"
    type="email"
    name="email"
    autoComplete="email"
    placeholder="you@example.com"
    aria-describedby={error ? "email-error" : undefined}
    aria-invalid={!!error}
    className="
      block w-full rounded-lg border border-neutral-300 bg-white
      px-4 py-3 text-base text-neutral-900
      placeholder:text-neutral-400
      focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500
      aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500
      disabled:bg-neutral-100 disabled:cursor-not-allowed
      transition-colors duration-150
    "
  />
  {error && (
    <p id="email-error" role="alert" className="text-sm text-red-600">
      {error}
    </p>
  )}
</div>
```

## 27.7 Skeleton Loader

```tsx
<div className="animate-pulse space-y-3">
  <div className="h-6 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
  <div className="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
  <div className="h-4 w-5/6 rounded bg-neutral-200 dark:bg-neutral-800" />
</div>
```

## 27.8 Empty State

```tsx
<div className="flex flex-col items-center justify-center py-12 text-center">
  <div className="rounded-full bg-neutral-100 dark:bg-neutral-800 p-4 mb-4">
    <Inbox className="h-8 w-8 text-neutral-500" aria-hidden="true" />
  </div>
  <h3 className="text-lg font-semibold mb-1">Your inbox is empty</h3>
  <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-sm mb-6">
    New messages will appear here.
  </p>
  <Button variant="outline">Learn more</Button>
</div>
```

## 27.9 Error Banner

```tsx
<div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
  <div className="flex items-start gap-3">
    <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
    <div className="flex-1">
      <h3 className="text-sm font-semibold text-red-900 dark:text-red-100">
        Something went wrong
      </h3>
      <p className="mt-1 text-sm text-red-700 dark:text-red-300">
        {message}
      </p>
    </div>
  </div>
</div>
```

## 27.10 Pricing Card (Highlighted)

```tsx
<div className="
  rounded-2xl border p-6 flex flex-col
  border-brand-500 ring-2 ring-brand-500 ring-offset-2
  lg:scale-105 relative
">
  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-white">
    Most popular
  </div>
  <h3 className="text-lg font-semibold">Pro</h3>
  <p className="mt-1 text-sm text-neutral-600">For growing teams</p>
  <div className="mt-6">
    <span className="text-4xl font-bold tracking-tight">$29</span>
    <span className="text-neutral-600">/month</span>
  </div>
  <Button className="mt-6">Start free trial</Button>
  <ul className="mt-6 space-y-3 text-sm">
    <li className="flex gap-2">
      <Check className="h-5 w-5 text-brand-500 shrink-0" aria-hidden="true" />
      <span>Feature description</span>
    </li>
    {/* ... */}
  </ul>
</div>
```

---

# SECTION 28 — ANTI-PATTERNS TO REJECT

If the AI produces any of these, push back.

| Anti-pattern | Problem | Correct |
|---|---|---|
| `<div onClick>` | Not keyboard accessible | `<button onClick>` |
| `<div className="flex">` for nav | Not a landmark | `<nav>` |
| `<img src alt="..." />` no dimensions | CLS | Add `width` + `height` |
| `p-[13px]`, `text-[17px]` | Breaks token system | Round to scale |
| `focus:outline-none` with no ring | Removes a11y | `focus-visible:ring-2` |
| `text-xs` or `text-sm` for body on mobile | Too small, triggers iOS zoom on inputs | `text-base` minimum |
| `w-[500px]` on mobile | Breaks small screens | `w-full max-w-lg` |
| `<a onClick>` no href | Not a link | `<button>` |
| `color: #666` hardcoded | Not tokenized, may fail contrast | Use token |
| Hover-only tooltips with critical info | Unreachable on touch | Must have tap equivalent |
| Spinner with no label change | Silent for screen readers | Update text + `aria-busy` |
| `100vh` on mobile | iOS address bar causes overflow | `100dvh` |
| `any` type | Defeats TypeScript | Explicit type or `unknown` |
| Importing two icon libraries | Visual inconsistency | One library only |
| Three+ font families | Chaotic | Max two |
| Placeholder as only label | Breaks a11y | Visible `<label>` always |
| Inline hex colors | Not tokenized | Color token |
| Required prop that should have default | Friction for consumers | Give it a default |
| `z-[9999]` | Z-index collision waiting to happen | Define token |
| Rendering nothing while loading | Feels broken | Always skeleton |
| Error says "Error" | Unhelpful | Specific, actionable message |
| CSS shadows on dark mode | Invisible | Use subtle borders |

---

# SECTION 29 — THE FINAL AUDIT PROMPT

Use this before marking any page production-ready.

```
Audit the current page against FRONTEND_STANDARDS.md v2. Walk sections 2 through 25 in order. For each section, report PASS / FAIL / PARTIAL / N/A with file:line and the exact code fix.

After the walk, give me:
1. Counts: sections passed / failed / partial, broken down by criticality
2. Top 10 highest-impact fixes
3. Launch readiness verdict: READY (zero critical fails) or NOT READY (list blockers)

Critical = anything that causes:
- Accessibility violation at WCAG 2.2 AA
- CLS / LCP regression beyond the "good" threshold
- Breakage at 375px / 768px / 1280px
- Missing interactive state on any button/link/input
- Contrast failure on any text
- Unlabeled form input
- Missing alt text on meaningful image
- Missing h1 or broken heading hierarchy
- Dark mode visual break (if dark mode is supported)

Be specific. Show the broken line, show the fix. Do not hand-wave.
```

---

# SECTION 30 — INTEGRATION WITH COMMERCIAL-WEBSITE-PROTOCOL-V3

This document lives alongside the commercial-website-protocol-v3. Their relationship:

- **Protocol v3** governs the whole project lifecycle: legal, Supabase + RLS, Stripe with idempotency, email deliverability, observability (Sentry, PostHog), cost control, staging environments, pre-launch gates, post-launch monitoring.
- **This document (FRONTEND_STANDARDS v2)** governs the frontend specifically: how it looks, how it behaves, how it performs.

**When both apply at the same moment:**

- **Phase 3 (Design research) of Protocol v3** → use this doc's token systems (Sections 1–7) to define the design tokens before opening Lovable.
- **Phase 4 (Build in Lovable) of Protocol v3** → give Lovable this document's Master Prompt (top) as the standing brief.
- **Phase 5 (Fork to local) of Protocol v3** → save this document as `FRONTEND_STANDARDS.md` in the repo root and reference it in `CLAUDE.md`.
- **Phase 8 (Pre-launch gates) of Protocol v3** → run Section 29 (Final Audit Prompt) as part of the QA gate.
- **Phase 10 (Post-launch monitoring) of Protocol v3** → when Core Web Vitals regress, the fixes come from Section 23.

## 30.1 The CLAUDE.md entry

Add this to the project's `CLAUDE.md` so Cursor auto-loads it:

```markdown
# Frontend standards

All frontend work in this project follows FRONTEND_STANDARDS.md v2 (in the repo root).

Key non-negotiables:
- Tokens only, no arbitrary values (colors, type, spacing, shadow, radius, z-index)
- Mobile-first responsive, test at 375/768/1280
- All 5 interactive states on every button/link/input
- WCAG 2.2 AA (contrast 4.5:1 body / 3:1 large/UI, semantic HTML, keyboard, focus-visible, aria where needed)
- Every image: width, height, alt, loading
- Every input: label, type, autoComplete, aria
- Dark mode on every color class (if supported)
- Core Web Vitals targets: LCP < 2.5s, INP < 200ms, CLS < 0.1

Read FRONTEND_STANDARDS.md fully at session start. Apply Section 29 audit prompt before marking any page complete.
```

---

**END OF FRONTEND_STANDARDS.md v2**

Version: 2.0 — Review and update when Tailwind, shadcn/ui, or WCAG ships major changes, or quarterly at minimum.
