# Convex Backend

This starter keeps a minimal Convex surface:

- `schema.ts` defines `users` and `todos` tables.
- `users.ts` provides `viewer` and `syncUser`.
- `todos.ts` provides per-user todo CRUD APIs.
- `auth.config.ts` configures Clerk JWT auth for Convex.

## Local workflow

1. Run `npx convex dev`.
2. Connect or create a Convex project when prompted.
3. Keep `npx convex dev` running while developing.
4. Deploy backend with `npx convex deploy`.
