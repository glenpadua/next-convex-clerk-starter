import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    phone: v.optional(v.string()),
    phoneNormalized: v.optional(v.string()),
    role: v.optional(v.union(v.literal("host"), v.literal("admin"))),
    billingStatus: v.optional(
      v.union(v.literal("unpaid"), v.literal("active"), v.literal("past_due")),
    ),
    billingNote: v.optional(v.string()),
    billingUpdatedAt: v.optional(v.number()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  }).index("by_clerk_id", ["clerkId"]),

  todos: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    completed: v.boolean(),
    ownerKey: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_updated_at", ["updatedAt"])
    .index("by_owner", ["ownerKey"]),
})
