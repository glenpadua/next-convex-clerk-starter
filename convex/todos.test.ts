// @vitest-environment edge-runtime

import { convexTest } from "convex-test"
import { describe, expect, it } from "vitest"

import { api } from "./_generated/api"
import type { Doc } from "./_generated/dataModel"
import schema from "./schema"

function buildTodo(overrides: Partial<Doc<"todos">> = {}) {
  return {
    title: "Default task",
    description: "Default description",
    priority: "medium" as const,
    completed: false,
    createdAt: 100,
    updatedAt: 100,
    ...overrides,
  }
}

describe("todos", () => {
  it("returns an empty array when no todos exist", async () => {
    const t = convexTest(schema)

    await expect(t.query(api.todos.list, {})).resolves.toEqual([])
  })

  it("returns only public todos ordered by updatedAt descending", async () => {
    const t = convexTest(schema)

    await t.run(async (ctx) => {
      await ctx.db.insert("todos", buildTodo({ title: "Older public", updatedAt: 100, createdAt: 100 }))
      await ctx.db.insert("todos", buildTodo({ title: "Newest public", updatedAt: 300, createdAt: 300 }))
      await ctx.db.insert(
        "todos",
        buildTodo({ title: "Private todo", ownerKey: "user_123", updatedAt: 400, createdAt: 400 }),
      )
    })

    const todos = await t.query(api.todos.list, {})

    expect(todos.map((todo) => todo.title)).toEqual(["Newest public", "Older public"])
  })

  it("filters todos by status and search text", async () => {
    const t = convexTest(schema)

    await t.run(async (ctx) => {
      await ctx.db.insert(
        "todos",
        buildTodo({ title: "Ship landing page", description: "Draft homepage copy", updatedAt: 100 }),
      )
      await ctx.db.insert(
        "todos",
        buildTodo({
          title: "Invoice contractor",
          description: "Finance follow-up",
          completed: true,
          updatedAt: 200,
          createdAt: 200,
        }),
      )
      await ctx.db.insert(
        "todos",
        buildTodo({
          title: "Design review",
          description: "Landing page polish",
          updatedAt: 300,
          createdAt: 300,
        }),
      )
    })

    const activeTodos = await t.query(api.todos.list, { status: "active" })
    const completedTodos = await t.query(api.todos.list, { status: "completed" })
    const searchResults = await t.query(api.todos.list, { search: "LANDING" })

    expect(activeTodos.map((todo) => todo.title)).toEqual(["Design review", "Ship landing page"])
    expect(completedTodos.map((todo) => todo.title)).toEqual(["Invoice contractor"])
    expect(searchResults.map((todo) => todo.title)).toEqual(["Design review", "Ship landing page"])
  })

  it("creates todos with trimmed values and a default priority", async () => {
    const t = convexTest(schema)

    const todoId = await t.mutation(api.todos.create, {
      title: "  Ship dashboard polish  ",
      description: "  Follow up on empty states  ",
    })

    const todo = await t.run((ctx) => ctx.db.get(todoId))

    expect(todo).toMatchObject({
      title: "Ship dashboard polish",
      description: "Follow up on empty states",
      priority: "medium",
      completed: false,
    })
  })

  it("drops empty descriptions and rejects blank titles", async () => {
    const t = convexTest(schema)

    const todoId = await t.mutation(api.todos.create, {
      title: "Valid title",
      description: "   ",
      priority: "high",
    })

    const todo = await t.run((ctx) => ctx.db.get(todoId))

    expect(todo?.description).toBeUndefined()
    await expect(
      t.mutation(api.todos.create, {
        title: "   ",
      }),
    ).rejects.toThrow("Title is required")
  })

  it("toggles a public todo and updates its timestamp", async () => {
    const t = convexTest(schema)

    const todoId = await t.run((ctx) =>
      ctx.db.insert("todos", buildTodo({ title: "Toggle me", updatedAt: 100, createdAt: 100 })),
    )

    const before = await t.run((ctx) => ctx.db.get(todoId))

    await t.mutation(api.todos.toggle, { id: todoId })

    const after = await t.run((ctx) => ctx.db.get(todoId))

    expect(before?.completed).toBe(false)
    expect(after?.completed).toBe(true)
    expect(after?.updatedAt).toBeGreaterThan(before?.updatedAt ?? 0)
  })

  it("rejects toggling missing or private todos", async () => {
    const t = convexTest(schema)

    const missingTodoId = await t.run(async (ctx) => {
      const id = await ctx.db.insert("todos", buildTodo({ title: "Missing soon" }))
      await ctx.db.delete(id)
      return id
    })

    const privateTodoId = await t.run((ctx) =>
      ctx.db.insert("todos", buildTodo({ title: "Private", ownerKey: "user_123" })),
    )

    await expect(t.mutation(api.todos.toggle, { id: missingTodoId })).rejects.toThrow("Todo not found")
    await expect(t.mutation(api.todos.toggle, { id: privateTodoId })).rejects.toThrow("Todo not found")
  })

  it("removes public todos and rejects missing or private ones", async () => {
    const t = convexTest(schema)

    const publicTodoId = await t.run((ctx) =>
      ctx.db.insert("todos", buildTodo({ title: "Delete me", updatedAt: 100 })),
    )
    const privateTodoId = await t.run((ctx) =>
      ctx.db.insert("todos", buildTodo({ title: "Keep me private", ownerKey: "user_123", updatedAt: 200 })),
    )

    await expect(t.mutation(api.todos.remove, { id: publicTodoId })).resolves.toBeNull()
    await expect(t.run((ctx) => ctx.db.get(publicTodoId))).resolves.toBeNull()
    await expect(t.mutation(api.todos.remove, { id: publicTodoId })).rejects.toThrow("Todo not found")
    await expect(t.mutation(api.todos.remove, { id: privateTodoId })).rejects.toThrow("Todo not found")
  })
})
