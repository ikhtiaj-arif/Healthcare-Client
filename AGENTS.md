<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# healthcare-frontend

Next 16 / React 19 frontend for a healthcare booking platform. It talks to a separate
Express backend that must be running on port 5000 for anything beyond the marketing pages.

## Commands

- `npm run dev` — port 3000. Also regenerates the block above.
- `npm run build` — Next 16 runs the project-local `tsc` CLI during build, so this *is* the
  typecheck; a TS error fails the build. It also writes the static export to `out/`.
- `npx tsc --noEmit` — the fast standalone typecheck. Currently passes.
- `npm run lint` — `biome check`, read-only (no `--write`). **It fails on the current tree**:
  130 errors / 51 warnings over 107 files, mostly formatting and import order. Don't gate on it,
  and never run a repo-wide `biome format --write`; scope to the files you touched.
- `npm run format` — `biome format --write` (formatting only; no import sorting, no lint fixes).
- No tests, no CI, no pre-commit hooks. Verify changes in the browser against the local backend.

## Toolchain notes that break assumptions

- **Next 16.3.4, not 15.** Turbopack is the default bundler, `next lint` no longer exists, and
  `middleware.ts` is renamed `proxy.ts`. See the block above for the bundled docs.
- **Typed routes are on by default** (no `typedRoutes` key in `next.config.ts`).
  `.next/types/routes.d.ts` is generated and `tsconfig.json` includes it, so `next/link` `href`
  and `router.push/replace` are checked against the route table — a typo is a type error.
  Non-literal URLs need `` `${x}` as Route ``. Page/layout props come from the generated globals
  `PageProps<"/doctor/schedule">` / `LayoutProps<"/">` (see `src/app/layout.tsx`); don't hand-roll
  `params` / `searchParams` types.
- `next.config.ts` sets `reactCompiler: true` (don't break memoization rules) and
  `output: "export"` (static export into `out/`). No route handlers, no server actions, no
  middleware; `npm start` cannot serve an export. Because it's static, `NEXT_PUBLIC_*` values are
  inlined at build time — changing `.env.local` requires a rebuild.

## Data and auth

- `.env.local` (git-ignored) holds `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.
  The base URL must end in `/api/v1` — `src/lib/apiClient.ts` appends module-relative paths like
  `/schedule/create-schedule`. A missing Google client id degrades silently: `GoogleAuthProvider`
  just renders its children and Google login disappears.
- One HTTP client only: `src/lib/apiClient.ts` (`ofetch`, `credentials: "include"`). Auth is a
  backend-set cookie; there is no token in storage. Cookies cross 3000 → 5000, so the backend's
  `FRONTEND_URL` CORS allowlist has to match.
- Envelope is `{success, statusCode, message, data, meta?}` (`src/types/api-response.type.ts`).
  Lists take `?page&limit` (server default limit is 10) and return
  `meta: {page, limit, total, totalPages}`. **The pagination shape is not uniform**:
  `/doctor/all-doctors` nests `{data: {data, meta}}` while the schedule endpoints send `meta` as a
  sibling of `data`. `src/api/schedule.api.ts` documents this with a local `PaginatedApiResponse<T>`;
  follow whichever shape the endpoint you call actually returns.
- Read error text with `getApiErrorMessage(error, fallback)` from `@/utils`. ofetch's
  `error.message` is a technical `[POST] "http://...": 409 Conflict` string, and the backend masks
  real messages as `"Internal Server Error"` outside development.
- Layering: `src/api/<f>.api.ts` (typed wrappers that unwrap `response.data`) →
  `src/hooks/<f>.hook.ts` (react-query; query-key constant; invalidate on mutation success) →
  component. Every layer re-exports from its `index.ts`, so import from `@/api`, `@/hooks`,
  `@/types`, `@/utils`, `@/validation` rather than deep paths.
- Query keys are plain arrays: `["user"]`, `["doctors", params]`, and
  `SCHEDULES_QUERY_KEY = ["schedules"]` (`src/hooks/schedule.hook.ts`). Invalidate by prefix, not by
  the full key. Logout removes `["user"]` in `src/components/layouts/public/Header.tsx`.
- Pick the fetching hook deliberately: `useSuspenseQuery` throws to the segment's `error.tsx`
  (only `src/app/(dashboard)/doctor/schedule/error.tsx` exists today), whereas `useQuery` with
  `placeholderData: keepPreviousData` keeps the table on screen across page/tab changes instead of
  dropping to a skeleton. `useGetMe` sets `retry: false`.
- Forms use `@tanstack/react-form` `useForm` with the zod schema from
  `src/validation/<f>.validation.ts` passed as `validators.onSubmit`. Mirror server-side rules
  client-side (see `schedule.validation.ts`) instead of round-tripping to discover them.
- Toasts come from a local Base UI manager in `src/components/ui/toast.tsx`:
  `toast.add({ title, description, type })`. This is not sonner, so `toast.success(...)` does not
  exist. `<Toaster />` is already mounted in the root layout.
- Route groups only group layouts and never appear in URLs — login is `/login`, not
  `/(public)/(authentication)/login`. `src/routes/*.routes.ts` is sidebar nav data keyed by
  `UserRole`, not API routes. Each `src/app/(dashboard)/<role>/layout.tsx` wraps children in
  `RoleGuard` with the allowed roles; `(dashboard)/layout.tsx` wraps them in `AuthGuard`.

## UI

- shadcn style `base-sera` on **@base-ui/react**, not Radix. Composition uses Base UI's
  `render={<Button />}` prop — there is no `asChild` in this codebase. Add primitives with
  `npx shadcn add <name>`.
- `cn` comes from the `cn` npm package, re-exported by `src/lib/utils.ts`.
- `src/components/ui/*` is shadcn-generated: **PascalCase filenames, 2-space indent, no
  semicolons** (Biome wants semicolons, which is most of the lint noise). Don't rename these files
  to kebab-case. Everything else under `src/` is kebab-case and semicolon-terminated.
- The theme is CSS variables in `src/app/globals.css` (Tailwind v4 `@theme inline`). Add or change
  design tokens there — there is no `tailwind.config`.

## Style and workflow

- Biome 2.4.2, 2-space indent, `organizeImports` assist on. Match the file you're editing rather
  than reformatting the repo.
- Commits are conventional-ish: `feat: ...`, `fix: ...`. Default branch is `dev`.
- `src/components/form/LoginForm.tsx` ships hard-coded dev credentials as `useForm` `defaultValues`;
  strip them before any real deploy.

## Known issues — pre-existing, don't fix unless asked

- `npm run lint` fails repo-wide (see Commands).
- `src/components/dashboard/dashboars-shell.tsx` has JSX at module scope after the component, plus
  unused imports.
- `src/hooks/debounce.hook.ts` ignores its `delay` argument (hardcodes 500ms in the effect) and
  carries a blanket `biome-ignore-all` on line 1.

Cross-project context — backend boot, `prisma generate`/`migrate`, seed accounts, Postman
collection, and the shared response envelope — lives in `../AGENTS.md`.
