# Befluencer Frontend  Guide

This document provides a comprehensive, professional overview of the frontend codebase: architecture, conventions, environments, developer workflows, testing and quality gates, performance, accessibility, and operational guidelines. It reflects recent improvements: externalized templates/styles, i18n via ngx-translate, and two distinct onboarding flows.

## 1. System Overview

- Stack: Angular 19 (standalone), TypeScript 5.7, TailwindCSS 3, SCSS, RxJS 7, Karma/Jasmine, ngx-translate
- Package scripts: `start`, `build`, `watch`, `test` (see `package.json`)
- Styling: TailwindCSS (PostCSS + Autoprefixer); component-level SCSS for focused styles
- Routing: Angular Router with standalone components and lazy loading
- Target: SPA served by any static host (build artifacts in `dist/frontend`)

## 2. Architecture

### 2.1 High-level

- App Bootstrap: `src/main.ts` bootstraps `AppComponent` using `appConfig` for global providers.
- Routing: Defined in `src/app/app.routes.ts` with a `DashboardLayoutComponent` hosting feature routes.
- Features: Implemented under `src/app/features/*` using standalone Angular components.
- Shared UI and Services: Under `src/app/shared/*` (components, services, utilities).
- Styling: Global styles in `src/styles.scss`; Tailwind setup via `tailwind.config.js` and `postcss.config.js`. Global font is Poppins with smoothing.

### 2.2 Directory layout

- `src/app/features/*`: Feature pages/components (e.g., dashboard, analytics, media-kit)
- `src/app/layout/*`: Layout components (e.g., topbar, sidebar, dashboard layout)
- `src/app/shared/*`: Reusable components, services (e.g., onboarding, local-storage)
- `public/`: Static assets copied verbatim to build output (note: ensure brand logo path matches references; some templates use `/logo.PNG`, repo includes `logo-ds.PNG`)

### 2.3 State & data flow

- Local component state: Signals/inputs/outputs where appropriate
- Cross-feature state: Lightweight services with RxJS (e.g., `OnboardingService`)
- Storage: `LocalStorageService` for simple persistence

## 3. Development

### 3.1 Prerequisites

- Node.js LTS (ensure npm per `angular.json` config)
- Global Angular CLI optional; project uses local CLI via npm scripts

### 3.2 Common tasks

- Dev server: `npm run start` (serves at http://localhost:4200/ by default)
- Build: `npm run build` (outputs to `dist/frontend`)
- Watch build: `npm run watch`
- Unit tests: `npm run test`
Windows shell note: When chaining commands locally, use `;` in PowerShell.

### 3.3 Code style & conventions

- Standalone components (no NgModules) with `ChangeDetectionStrategy.OnPush` where possible
- Use Tailwind utility classes for layout/spacing/colors; keep component SCSS focused
- Prefer `loadComponent` for lazy pages; route titles via `data.title`
- Keep selectors prefixed with `bf-` to avoid collisions
- Keep separation of concerns: external `templateUrl` and `styleUrls`, avoid inline HTML/SCSS in TS

## 4. Features

### 4.1 Dashboard Layout

- Cards layout tailored to match design: no initial scroll, second row in three columns
- Topbar includes notification bell and profile entry points
- Sidebar hosts navigation including Collab Tools

### 4.2 Product Tour (Onboarding)

- Location: `src/app/shared/onboarding/`
- Flow: 4 steps; Step 1 modal (blurred backdrop), Steps 2–4 anchored tooltips without blur
- Anchors: `#bf-bell-anchor`, `#bf-profile-anchor`, `#bf-collab-anchor`
- Service API: `open(step=1)`, `close()`, `next()`, `back()`; `totalSteps = 4`
- First-visit logic: gated via `localStorage` in dashboard (auto-open ~5s after first load)
 - Gate with key `tour:dashboard:seen` (boolean) stored via `LocalStorageService`.

Customization and troubleshooting details are in the Onboarding section at the end of this guide.

### 4.3 Account Onboarding (Post-login)

- Location: `src/app/shared/account-onboarding/`
- Flow: 6 modal steps; always centered with blurred/dimmed backdrop
- Trigger: After login/first arrival to the dashboard, opens automatically if not completed
- Service API: `open(step=1)`, `close()`, `next()`, `back()`, `isCompleted()`, `markCompleted()`
- Persistence: Uses `localStorage` (via `LocalStorageService`). Completion key: `account-onboarding.v1`.
- Step 1: Welcome modal that matches the provided mock (orange “Welcome”, user name, supportive copy)
- Steps 2–5: Placeholders for profile basics, socials, audience/categories, and preferences
- Step 6: Review & Finish — marks completed and closes the flow
- Display name: Resolved from `befluencer:profile:displayName` or `befluencer:auth:user` (fallback to “John Doe”)

Files:
- `account-onboarding.service.ts` — state, step navigation, completion persistence
- `account-onboarding-overlay.component.ts` — modal host with actions, step indicators
- `steps/account-onboarding-step[1-6].component.ts` — six standalone step components

Dashboard wiring:
- The dashboard checks `AccountOnboardingService.isCompleted()` in `ngAfterViewInit()` and opens step 1 with a small delay if not completed. The Product Tour remains gated separately and opens only after the Account Onboarding is finished.

## 5. Quality Gates

- Build: `npm run build` must succeed with no TypeScript errors
- Tests: `npm run test` should pass (Karma/Jasmine)
- Linting: If eslint is introduced, ensure `npm run lint` passes (not configured yet)
- Budgets: See `angular.json` production budgets; stay within thresholds or justify changes

## 6. Testing Strategy

- Unit tests: Focus on component inputs/outputs and service behavior; mock DOM where needed
- Component tests: Prefer shallow tests to isolate logic from child components
- E2E (future): Consider Playwright or Cypress for flows like Tour steps and anchor alignment

## 7. Performance

- Lazy-load non-critical routes/components
- Keep component trees shallow; use `OnPush` change detection and signals
- Tailwind utility-first reduces CSS bloat; purge is handled via `content` in `tailwind.config.js`
- Use Angular production build (`ng build`) for minification and output hashing

## 8. Accessibility (a11y)

- Dialogs: Include `role="dialog"` and `aria-modal="true"` for modals (Step 1)
- Focus management: Ensure focus moves to the modal on open and returns after close (future improvement)
- Color contrast: Tailwind brand palette should meet WCAG AA where practical
- Keyboard: Provide ESC/Enter navigation for the Tour (future enhancement)

## 9. Internationalization (i18n)

Library: `@ngx-translate/core` with a custom HttpClient loader.

- Locale files: `public/assets/i18n/{en,fr,es,de,zh}.json`
- Service: `src/app/shared/services/translation.service.ts` provides `current`, `use(lang)`, and `isRtl(lang)`; persists language in `localStorage` under `app:lang` and updates `<html lang>` and direction.
- Bootstrap: `APP_INITIALIZER` applies the saved language at startup in `app.config.ts`.
- Usage: `{{ 'key.path' | translate }}` in templates; keep keys descriptive.

Notes:
- RTL is detected for common right-to-left languages (ar, he, fa, ur).
- Ensure all user-facing strings route through translation keys; avoid hard-coded literals.

## 10. Security

- Avoid storing sensitive data in `localStorage`
- Sanitize user-generated content before rendering
- Prefer route guards for protected areas (future)
- Consider HTTP interceptors for auth headers and error handling (future)

## 11. Deployment

- Build artifacts: `dist/frontend`
- Any static host or CDN can serve the SPA (configure fallback to `index.html`)
- Production configuration in `angular.json` applies output hashing and budgets

## 12. Observability

- Console logging kept minimal in production
- Recommend adding a telemetry pipeline (e.g., Application Insights or Sentry) for errors and perf

## 13. Operations Runbook

- Symptom: App fails to bootstrap
  - Check console for template parse or missing provider errors
  - Validate Angular/CLI versions match in `package.json`

- Symptom: Tour arrows misaligned
  - Verify anchor IDs exist and are visible
  - Ensure no parent containers interfere with positioning (e.g., transforms)

- Symptom: Styles missing in production
  - Confirm Tailwind content glob includes all template locations
  - Verify `styles.scss` is included in `angular.json`
  - Editor shows `@tailwind` unknown at-rule: this is a linter/editor warning only; the PostCSS build resolves it.

## 14.  Contribution

- Code ownership: `src/app/features/*` by respective feature owners; shared components under `src/app/shared/*`
- PR guidelines: Keep diffs small, include before/after screenshots for UI, and unit tests when logic changes
- Commit messages: Conventional, terse, and scoped (e.g., `feat(tour): add close CTA to step 4`)

## Design System & Branding

This section defines the visual and interaction language to ensure consistency, quality, and scale across the app.



### Typography

- Primary font: Inter; headlines may use "Inter Tight" where appropriate.
- Font stack: `poppins, sans-serif` (set in `styles.scss`; also configured in Tailwind `fontFamily.inter` and `fontFamily.tight`).
- Prefer semantic elements (h1–h3, p, button) with Tailwind utilities for sizing/weight.

### Color palette

Defined in `tailwind.config.js` under `theme.extend.colors` (OKLCH for perceptual consistency):

- Brand
  - brand.blue: oklch(51.01% 0.274 263.83)
  - brand.violet: oklch(53.18% 0.28 296.97)
  - brand.violetDark: oklch(47.66% 0.246 305.88)
  - brand.pink: oklch(69.02% 0.277 332.77)
  - brand.red: oklch(61.42% 0.238 15.34)
  - brand.orange: oklch(63.32% 0.24 31.68)

- Grays
  - gray.900: oklch(19.37% 0.006 300.98)
  - gray.700: oklch(36.98% 0.014 302.71)
  - gray.400: oklch(70.9% 0.015 304.04)

Usage guidelines:
- Primary actions: `bg-brand-orange text-white` (hover slightly darker).
- Active nav: orange pill (see `.nav-active` styles in `sidebar.component.scss`).
- Body text: gray.900 on light; gray.400 on dark.

Gradients:
- Exposed via CSS variables in `:root`: `--color-gradient-horizontal`, `--color-gradient-vertical` (see Tailwind plugin in `tailwind.config.js`).
- Use `.gradient-border` helper in `styles.scss` for emphasized cards and highlights.

### Spacing & layout

- Base unit: Tailwind spacing scale (4px baseline).
- Container: centered with `container` and `padding: 1rem` (Tailwind config).
- Sidebar width: 240–260px (see `tailwind.config.js` and `sidebar.component.scss`).

### Components & patterns

- Buttons: Tailwind utilities for color/size/shape; CTAs often `rounded-full px-4 py-2 text-sm font-semibold`.
- Cards: `rounded-2xl bg-white shadow-card ring-1 ring-black/5`.
- Tooltips: absolutely positioned; arrow via 14px rotated square; clamp to viewport.
- Modals: include `role="dialog" aria-modal="true"`; blurred backdrop for high-emphasis flows.


### Iconography

- Use a consistent set (e.g., Heroicons/Lucide), keep stroke width consistent.
- Standard sizes 16–24px; provide `aria-label` or visible text for icon-only buttons.

### Motion & feedback

- Transitions: 120–200ms ease; avoid excessive motion.
- Use subtle scale/translate and shadows on hover/active states.

### Imagery & illustration

- Prefer inline SVG for crispness and dynamic coloring; raster only when necessary.
- Shared assets go in `public/` and are copied to the build output.

### Accessibility notes

- Maintain at least WCAG AA contrast for interactive elements.
- Keep visible focus styles; ensure keyboard access for menus, dialogs, and tooltips.

### Usage examples

- Primary Button
  - `class="inline-flex items-center gap-2 bg-brand-orange text-white hover:bg-orange-600 px-4 py-2 rounded-full text-sm font-semibold"`
- Card Shell
  - `class="rounded-2xl bg-white shadow-card ring-1 ring-black/5"`

---

### Appendix A — Onboarding (Tour) Deep Dive

- Files:
  - `shared/onboarding/onboarding.service.ts` — state and navigation
  - `shared/onboarding/onboarding-overlay.component.ts` — host rendering and backdrop logic
  - `shared/onboarding/steps/*` — four standalone step components

- Behavior:
  - Step 1: modal with blur; Steps 2–4: tooltips with clamp/flip logic
  - Final CTA: Step 4 uses Close which calls `svc.close()`

- Extensibility:
  - Add a new `onboarding-stepX.component.ts`
  - Render it in the overlay with a new `step === X`
  - Update `totalSteps` accordingly

- Persistence:
  - Gate auto-open in the dashboard via `localStorage` flag `tour:dashboard:seen = true`

### Appendix B — Scripts

- `npm run start` — dev server (serve:development)
- `npm run build` — prod build with budgets and hashing
- `npm run watch` — development watch build
- `npm run test` — unit tests (Karma/Jasmine)
 - `ng serve` — alternatively start dev server (local CLI)
