<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

Next.js 16 App Router app (React 19) — StudioSpace studio/workspace marketing site. All code under `src/`; `@/*` aliases to `src/*` (tsconfig `paths`). No tests, no backend in this repo.

## Commands

- `npm run dev` — Turbopack dev server on :3000.
- `npm run build` — production build (also runs Turbopack).
- `npm run lint` — ESLint (flat config in `eslint.config.mjs`).
- No test runner and no `typecheck` script. Verify types with `npx tsc --noEmit`.

## Next.js 16 config quirks (all set in `next.config.ts` — don't "fix" them)

- `cacheComponents: true` + `partialPrefetching: true` — the new Cache Components model. Uncached request-time data must either use the `'use cache'` directive (pair with `cacheLife`, from `next/cache`) or be rendered inside a `<Suspense>` boundary, or the build fails during prerender. Do NOT copy caching advice from pre-Next-16 docs; read `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md`.
- `reactCompiler: true` — React Compiler auto-memoizes components, so don't add `useMemo`/`useCallback`/`React.memo` by default. It is Babel-based, so dev/build are slow; some code patterns don't compile under it.

## Styling & components

- Tailwind v4, CSS-first: there is no `tailwind.config.js`. Theme tokens live in the `@theme inline` block / CSS variables in `src/app/globals.css`, which also imports `"shadcn/tailwind.css"` and `"tw-animate-css"`. Tailwind runs via `@tailwindcss/turbopack` (a Turbopack rule in `next.config.ts`, not a PostCSS config).
- Site is dark-only: root `<html>` gets the `dark` class and hardcoded dark hex colors (e.g. `bg-[#111215]`). There is no light theme even though globals.css defines light/dark variables.
- Brand accents are hardcoded hex too: orange `#ff7a00` and teal `#00c5cb` (see `src/app/page.tsx`). Don't invent theme tokens for them.
- shadcn-style components live in `src/components/ui/`; add new ones with `npx shadcn add <name>` — `components.json` pins `style: base-nova`, no config tailwind file, lucide icons. Support logic goes in `src/lib/` (`utils.ts` for `cn`, `highlighter.tsx` for shiki code highlighting: JS regex engine, langs lazy-load on first use).

## Primitives & imports (differ from a typical shadcn starter — don't "fix" them)

- `src/components/ui/*` are built on Base UI primitives imported as `@base-ui/react/<slot>` (e.g. `@base-ui/react/tabs`), NOT Radix or `@base-ui-components/react`.
- `cn` is imported from the `cn` npm package (which `src/lib/utils.ts` just re-exports) — not the usual `clsx` + `tailwind-merge` pairing.
- Icons come from `lucide-react` using v0-style names (e.g. `House`, not `Home`).

## App structure

- Single route (`src/app/page.tsx`); root `layout.tsx` renders `<Navbar />` itself with `<body className="...dark...">`, so page code shouldn't add higher-level chrome. Brand assets live in `public/images/` (Logo-Brand, Hero-image, Footer-logo).
