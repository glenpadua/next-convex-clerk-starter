import { ConvexError, v } from "convex/values"

import type { Id } from "./_generated/dataModel"
import { mutation, query } from "./_generated/server"
import { getViewer, requireViewer } from "./users"

const statusValidator = v.union(v.literal("all"), v.literal("active"), v.literal("completed"))
const priorityValidator = v.union(v.literal("low"), v.literal("medium"), v.literal("high"))

export const list = query({
  args: {
    status: v.optional(statusValidator),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getViewer(ctx)
    if (!user) {
      return []
    }

    const status = args.status ?? "all"
    const search = args.search?.trim().toLowerCase() ?? ""

    let todos = await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect()

    if (status === "active") {
      todos = todos.filter((todo) => !todo.completed)
    }

    if (status === "completed") {
      todos = todos.filter((todo) => todo.completed)
    }

    if (search) {
      todos = todos.filter((todo) => {
        const haystack = `${todo.title} ${todo.description ?? ""}`.toLowerCase()
        return haystack.includes(search)
      })
    }

    return todos.sort((a, b) => b.updatedAt - a.updatedAt)
  },
})

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.optional(priorityValidator),
  },
  returns: v.id("todos"),
  handler: async (ctx, args): Promise<Id<"todos">> => {
    const user = await requireViewer(ctx)

    const title = args.title.trim()
    if (!title) {
      throw new ConvexError("Title is required")
    }

    const now = Date.now()

    return ctx.db.insert("todos", {
      userId: user._id,
      title,
      description: args.description?.trim() || undefined,
      priority: args.priority ?? "medium",
      completed: false,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const toggle = mutation({
  args: {
    id: v.id("todos"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await requireViewer(ctx)
    const todo = await ctx.db.get(args.id)

    if (!todo || todo.userId !== user._id) {
      throw new ConvexError("Todo not found")
    }

    await ctx.db.patch(todo._id, {
      completed: !todo.completed,
      updatedAt: Date.now(),
    })

    return null
  },
})

export const remove = mutation({
  args: {
    id: v.id("todos"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await requireViewer(ctx)
    const todo = await ctx.db.get(args.id)

    if (!todo || todo.userId !== user._id) {
      throw new ConvexError("Todo not found")
    }

    await ctx.db.delete(todo._id)
    return null
  },
})
