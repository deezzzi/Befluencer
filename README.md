# Befluencer Frontend

Angular 19 standalone app with TailwindCSS, SCSS, and ngx-translate.

## Project documentation

For a comprehensive engineering guide (architecture, workflows, quality, operations), see `documentation.md`.

- Design System & Branding: See the "Design System & Branding" section inside `documentation.md` for typography, colors, spacing, components, and accessibility guidelines.

## Quick start

1) Install dependencies

```bash
npm install
```

2) Start the dev server (http://localhost:4200/)

```bash
npm run start   
```

Tips
- You can also use `ng serve`, but using npm scripts ensures the local CLI version is used.
- Hot reload is enabled; edits to templates/styles/typescript will refresh the app.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

Create a production build into `dist/frontend`:

```bash
npm run build
```

The production configuration applies output hashing and optimizations.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
npm run test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Internationalization (i18n)

- Library: `@ngx-translate/core`
- Locales: `public/assets/i18n/{en,fr,es,de,zh}.json`
- Persistence key: `app:lang` in `localStorage`
- At bootstrap, the saved language is applied and `<html lang>` / text direction are updated.

See `src/app/shared/services/translation.service.ts` and `src/app/app.config.ts` for the loader and initializer.


## Onboarding flows

- Product Tour (in-app, tooltip-driven) and Account Onboarding (modal, 6 steps) are distinct.
- The dashboard shows Account Onboarding on first visit, and gates the Tour until onboarding completes.

Details and APIs are documented in `documentation.md`.

## Troubleshooting

- Tailwind warnings in editors: If your editor flags `@tailwind` or `theme()` as unknown in SCSS, it’s an editor warning only; the PostCSS build handles them.
- Language not changing: Ensure locale files exist for the selected code and that `app:lang` isn’t blocked by the browser.
- Brand logo path: Templates reference `/logo.PNG`. Ensure the asset exists in `public/` or update references to the actual file (e.g., `/logo-ds.PNG`).

## Additional Resources

- Angular CLI reference: https://angular.dev/tools/cli
- Engineering guide: `documentation.md`
