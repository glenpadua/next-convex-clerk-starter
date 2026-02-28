# next-convex-clerk-starter

Personal starter template for shipping full-stack web apps quickly.

## Stack

- Next.js (App Router, TypeScript)
- Convex (database + server functions)
- Tailwind CSS v4 + shadcn/ui
- Clerk (optional auth pages)

## What you get

- shadcn theme/root page at `/`
- Starter dashboard at `/dashboard`
- Public todo app at `/dashboard/todos` (works without auth)
- Optional Clerk auth routes:
  - `/sign-in/[[...sign-in]]`
  - `/sign-up/[[...sign-up]]`
- Convex API surface:
  - `api.todos.list`
  - `api.todos.create`
  - `api.todos.toggle`
  - `api.todos.remove`

## Quick start (no auth required)

Node.js `24.13.1` LTS recommended.

If you use `nvm`:

```bash
nvm install
nvm use
```

If you use `asdf` or another version manager that reads `.node-version`, this repo now pins the same version there as well.

1. Install dependencies

```bash
npm install
```

2. Set up or connect a Convex project

Option A (recommended):

```bash
npx convex dev --configure
```

Use `--configure` on first setup (or when cloning this starter) so Convex doesn't silently reuse a previous deployment.
This opens interactive setup where you can create a new project or connect an existing one.

Option B (dashboard first):

- Create/manage a project in Convex dashboard.
- Then run `npx convex dev --configure` in this repo and select that project.

Convex project docs: [https://docs.convex.dev/dashboard/projects](https://docs.convex.dev/dashboard/projects)

3. Configure `.env.local`

```bash
cp .env.local.example .env.local
```

Notes:
- `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL` are shown/populated after `npx convex dev --configure` connects.
- Keep `npx convex dev` running while developing.
- If this repo points at the wrong deployment, rerun `npx convex dev --configure`.

4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful routes:
- `/`
- `/dashboard`
- `/dashboard/todos`

`npm run dev` uses webpack-based dev mode for stability. If you want to try Turbopack explicitly, run:

```bash
npm run dev:turbo
```

## Optional Clerk setup

You only need this if you want the auth pages active.

1. Create a Clerk app and get:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

2. Add those keys to `.env.local`.

That’s it. Convex does not require Clerk env vars in this starter by default.

## Scripts

```bash
npm run dev
npm run dev:turbo
npm run build
npm run start
npm run convex:configure
npm run convex:dev
npm run convex:codegen
```

## Deployment

### GitHub

```bash
git init
git add .
git commit -m "initial starter"
git remote add origin <your-repo-url>
git push -u origin main
```

### Convex (backend)

```bash
npx convex deploy
```

### Vercel (frontend)

- Import your GitHub repo into Vercel.
- Add environment variable:
  - `NEXT_PUBLIC_CONVEX_URL`
- Optionally add Clerk keys if you want auth pages.
- Deploy.

## shadcn/ui setup and theming

This starter already ships with a current `components.json` and Tailwind CSS v4 CSS-first setup in `app/globals.css`, so normal shadcn CLI commands work out of the box:

```bash
npx shadcn@latest add button
npx shadcn@latest add select
```

Current preset in this repo:
- style: `radix-mira`
- base color: `stone`
- icon library: `tabler`
- fonts: `Outfit` + `JetBrains Mono`

If you want to re-run shadcn Create in place:

```bash
rm components.json
npx shadcn@latest create --preset "<your-preset-url>" --template next
```

Notes:
- `create` will refuse to run if `components.json` already exists, so removing it first is expected for this workflow.
- The starter app lives under `/dashboard` and `/dashboard/todos`, so letting `create` overwrite `/` is safe.
- The shared UI components in this repo use semantic shadcn tokens without starter-specific visual overrides, so they inherit the generated preset cleanly.
- This repo keeps `@/components/ui`, `@/lib`, and `@/hooks` aliases aligned with the current shadcn CLI, so future `npx shadcn@latest add ...` commands continue to work after you adopt a preset.
- This repo is already on Tailwind CSS v4, so current shadcn Create output should land much closer to the generated default without manual CSS cleanup.

Useful docs:
- [https://ui.shadcn.com/docs](https://ui.shadcn.com/docs)
- [https://ui.shadcn.com/docs/theming](https://ui.shadcn.com/docs/theming)
- [https://ui.shadcn.com/create](https://ui.shadcn.com/create)

## Project structure

```txt
app/
  (auth-pages)/
  dashboard/
    todos/
  layout.tsx
  page.tsx
  providers/
convex/
  schema.ts
  users.ts
  todos.ts
  auth.config.ts
components/
  todos/
  ui/
```

## License

MIT. See [LICENSE](./LICENSE).
