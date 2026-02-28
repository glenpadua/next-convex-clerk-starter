# next-convex-clerk-starter

Personal starter template for shipping full-stack web apps quickly.

## Stack

- Next.js (App Router, TypeScript)
- Convex (database + server functions)
- Tailwind CSS + shadcn/ui
- Clerk (optional auth pages)

## What you get

- Public landing page at `/`
- Public todo app at `/todos` (works without auth)
- Optional Clerk auth routes:
  - `/sign-in/[[...sign-in]]`
  - `/sign-up/[[...sign-up]]`
- Convex API surface:
  - `api.todos.list`
  - `api.todos.create`
  - `api.todos.toggle`
  - `api.todos.remove`

## Quick start (no auth required)

Node.js 20+ recommended.

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

This starter already ships with a current `components.json` and Tailwind CSS variable setup, so normal shadcn CLI commands work out of the box:

```bash
npx shadcn@latest add button
npx shadcn@latest add select
```

If you want a full custom shadcn theme, use [shadcn Create](https://ui.shadcn.com/create) to generate a preset URL and scaffold a reference app from it:

```bash
npx shadcn@latest create --preset "https://ui.shadcn.com/init?base=radix&style=maia&baseColor=stone&theme=amber&iconLibrary=tabler&font=noto-sans&menuAccent=subtle&menuColor=default&radius=default&template=next&rtl=false" --template next
```

Recommended workflow for this starter:

1. Run the `create --preset ...` command in a temporary directory or sibling repo.
2. Copy the shadcn-owned files you want back into this starter:
   - `components.json`
   - `app/globals.css`
   - any regenerated `components/ui/*`
   - font changes from `app/layout.tsx` if your preset picked a different font
3. Keep the Convex/Clerk app wiring from this starter and only bring over the UI/theme pieces.
4. Run `npm install` if the preset switched icon libraries or added UI dependencies.

Notes:
- This repo keeps `@/components/ui`, `@/lib`, and `@/hooks` aliases aligned with the current shadcn CLI, so future `npx shadcn@latest add ...` commands continue to work after you adopt a preset.
- Presets are broader than color tokens; they can also change fonts, icon libraries, and the generated component source.
- For small tweaks, editing tokens directly in `app/globals.css` is still the fastest path.

Useful docs:
- [https://ui.shadcn.com/docs](https://ui.shadcn.com/docs)
- [https://ui.shadcn.com/docs/theming](https://ui.shadcn.com/docs/theming)
- [https://ui.shadcn.com/create](https://ui.shadcn.com/create)

## Project structure

```txt
app/
  (auth-pages)/
  todos/
  layout.tsx
  page.tsx
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
