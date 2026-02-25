import { ConvexError, v } from "convex/values"

import type { Doc, Id } from "./_generated/dataModel"
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server"

type DbCtx = QueryCtx | MutationCtx

async function getIdentity(ctx: DbCtx) {
  return ctx.auth.getUserIdentity()
}

function getSubject(identity: NonNullable<Awaited<ReturnType<QueryCtx["auth"]["getUserIdentity"]>>>) {
  return identity.subject ?? identity.tokenIdentifier
}

export async function getViewer(ctx: DbCtx): Promise<Doc<"users"> | null> {
  const identity = await getIdentity(ctx)
  if (!identity) {
    return null
  }

  const clerkId = getSubject(identity)
  if (!clerkId) {
    return null
  }

  return ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
    .first()
}

export async function requireViewer(ctx: DbCtx): Promise<Doc<"users">> {
  const user = await getViewer(ctx)
  if (!user) {
    throw new ConvexError("User profile missing. Run api.users.syncUser first.")
  }
  return user
}

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    return getViewer(ctx)
  },
})

export const syncUser = mutation({
  args: {},
  returns: v.id("users"),
  handler: async (ctx): Promise<Id<"users">> => {
    const identity = await getIdentity(ctx)
    if (!identity) {
      throw new ConvexError("Not authenticated")
    }

    const clerkId = getSubject(identity)
    if (!clerkId) {
      throw new ConvexError("Missing Clerk subject")
    }

    const now = Date.now()
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first()

    const name = identity.name ?? identity.email?.split("@")[0] ?? "User"

    if (existing) {
      await ctx.db.patch(existing._id, {
        name,
        email: identity.email,
        image: identity.pictureUrl,
        updatedAt: now,
      })
      return existing._id
    }

    return ctx.db.insert("users", {
      clerkId,
      name,
      email: identity.email,
      image: identity.pictureUrl,
      createdAt: now,
      updatedAt: now,
    })
  },
})
