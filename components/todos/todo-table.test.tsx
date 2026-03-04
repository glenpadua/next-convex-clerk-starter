import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import type { Doc, Id } from "@/convex/_generated/dataModel"
import { render, screen, waitFor } from "@/test-utils/render"

import { TodoTable } from "./todo-table"

function buildTodo(overrides: Partial<Doc<"todos">> = {}): Doc<"todos"> {
  return {
    _id: "todo_123" as Id<"todos">,
    _creationTime: 1,
    title: "Plan launch",
    description: "Sync the copy review",
    priority: "medium",
    completed: false,
    createdAt: new Date("2026-03-03T00:00:00.000Z").getTime(),
    updatedAt: new Date("2026-03-03T00:00:00.000Z").getTime(),
    ...overrides,
  }
}

describe("TodoTable", () => {
  it("shows an empty state when there are no todos", () => {
    render(<TodoTable todos={[]} onToggle={vi.fn()} onRemove={vi.fn()} />)

    expect(screen.getByText("No todos in this view yet.")).toBeInTheDocument()
  })

  it("renders visible todo details and lets the user toggle a todo", async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn().mockResolvedValue(undefined)
    const todo = buildTodo({ title: "Plan launch", description: "Sync the copy review", priority: "high" })

    render(<TodoTable todos={[todo]} onToggle={onToggle} onRemove={vi.fn()} />)

    expect(screen.getByText("Plan launch")).toBeInTheDocument()
    expect(screen.getByText("Sync the copy review")).toBeInTheDocument()
    expect(screen.getByText("high")).toBeInTheDocument()

    await user.click(screen.getByRole("checkbox", { name: "Toggle Plan launch" }))

    expect(onToggle).toHaveBeenCalledWith(todo._id)
  })

  it("lets the user remove a todo from the actions menu", async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn().mockResolvedValue(undefined)
    const todo = buildTodo({ title: "Delete this item" })

    render(<TodoTable todos={[todo]} onToggle={vi.fn()} onRemove={onRemove} />)

    await user.click(screen.getByRole("button", { name: "Todo actions" }))
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }))

    await waitFor(() => {
      expect(onRemove).toHaveBeenCalledWith(todo._id)
    })
  })
})
