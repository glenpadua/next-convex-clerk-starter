# Next.js + Convex + Clerk Starter

Personal starter template for shipping full-stack web apps quickly.

## Stack

- Next.js (App Router, TypeScript)
- Convex (database + server functions)
- Clerk (authentication)
- Tailwind CSS + shadcn/ui

## What you get

- Public landing page at `/`
- Protected todo app at `/todos`
- Clerk auth routes:
  - `/sign-in/[[...sign-in]]`
  - `/sign-up/[[...sign-up]]`
- Convex API surface:
  - `api.users.viewer`
  - `api.users.syncUser`
  - `api.todos.list`
  - `api.todos.create`
  - `api.todos.toggle`
  - `api.todos.remove`

## Quick start

1. Install dependencies

```bash
npm install
```

2. Create a Clerk app

- Create a Clerk application.
- Copy:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
- In Clerk, create a JWT template named `convex`.
- Copy your Clerk issuer domain for Convex (`CLERK_JWT_ISSUER_DOMAIN`).

Clerk docs: [https://clerk.com/docs](https://clerk.com/docs)

3. Set up or connect a Convex project

Option A (recommended):

```bash
npx convex dev
```

This opens interactive setup where you can create a new project or connect an existing one.

Option B (dashboard first):

- Create/manage a project in Convex dashboard.
- Then run `npx convex dev` in this repo and select that project.

Convex project docs: [https://docs.convex.dev/dashboard/projects](https://docs.convex.dev/dashboard/projects)

4. Configure environment variables

Create `.env.local` (or update it):

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
NEXT_PUBLIC_CONVEX_URL=...
```

In Convex dashboard environment variables, add:

```bash
CLERK_JWT_ISSUER_DOMAIN=...
```

Notes:
- `NEXT_PUBLIC_CONVEX_URL` is shown after `npx convex dev` connects.
- Keep `npx convex dev` running while developing.

5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev
npm run build
npm run start
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
- Add environment variables:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `NEXT_PUBLIC_CONVEX_URL`
- Deploy.

## shadcn/ui setup and theming

This repo is already configured with `components.json` and Tailwind CSS variables.

Add components as needed:

```bash
npx shadcn@latest add button
npx shadcn@latest add select
```

Theme workflow:

1. Update tokens in `app/globals.css` (`--primary`, `--background`, `--radius`, etc.).
2. Add or refine component styles in `components/ui/*`.
3. Optionally adjust `components.json` base color/style.

Useful docs:
- [https://ui.shadcn.com/docs](https://ui.shadcn.com/docs)
- [https://ui.shadcn.com/docs/theming](https://ui.shadcn.com/docs/theming)

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
