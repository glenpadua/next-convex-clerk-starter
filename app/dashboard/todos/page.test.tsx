import type { ReactNode } from "react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import type { Doc, Id } from "@/convex/_generated/dataModel"
import { render, screen, waitFor } from "@/test-utils/render"

const mocks = vi.hoisted(() => ({
  createTodo: vi.fn(),
  toggleTodo: vi.fn(),
  removeTodo: vi.fn(),
  useMutation: vi.fn(),
  useQuery: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
}))

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: ReactNode
    href: string
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock("convex/react", () => ({
  useMutation: mocks.useMutation,
  useQuery: mocks.useQuery,
}))

vi.mock("sonner", () => ({
  toast: {
    success: mocks.toastSuccess,
    error: mocks.toastError,
  },
}))

vi.mock("@/convex/_generated/api", () => ({
  api: {
    todos: {
      create: "todos:create",
      toggle: "todos:toggle",
      remove: "todos:remove",
      list: "todos:list",
    },
  },
}))

import TodosPage from "./page"

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

function filterTodos(
  todos: Doc<"todos">[],
  status: "all" | "active" | "completed" = "all",
  search?: string,
) {
  const normalizedSearch = search?.trim().toLowerCase() ?? ""

  return todos.filter((todo) => {
    if (status === "active" && todo.completed) {
      return false
    }

    if (status === "completed" && !todo.completed) {
      return false
    }

    if (!normalizedSearch) {
      return true
    }

    return `${todo.title} ${todo.description ?? ""}`.toLowerCase().includes(normalizedSearch)
  })
}

describe("TodosPage", () => {
  const todos = [
    buildTodo({
      _id: "todo_1" as Id<"todos">,
      title: "Plan launch",
      description: "Sync the copy review",
      priority: "high",
    }),
    buildTodo({
      _id: "todo_2" as Id<"todos">,
      title: "Archive invoices",
      description: "Finance admin",
      priority: "low",
      completed: true,
      createdAt: new Date("2026-03-02T00:00:00.000Z").getTime(),
      updatedAt: new Date("2026-03-02T00:00:00.000Z").getTime(),
    }),
  ]

  beforeEach(() => {
    mocks.createTodo.mockReset()
    mocks.toggleTodo.mockReset()
    mocks.removeTodo.mockReset()
    mocks.useMutation.mockReset()
    mocks.useQuery.mockReset()
    mocks.toastSuccess.mockReset()
    mocks.toastError.mockReset()

    mocks.useMutation.mockImplementation((reference: string) => {
      if (reference === "todos:create") return mocks.createTodo
      if (reference === "todos:toggle") return mocks.toggleTodo
      if (reference === "todos:remove") return mocks.removeTodo
      throw new Error(`Unexpected mutation reference: ${reference}`)
    })

    mocks.useQuery.mockImplementation(
      (reference: string, args?: { status?: "all" | "active" | "completed"; search?: string }) => {
        if (reference !== "todos:list") {
          throw new Error(`Unexpected query reference: ${reference}`)
        }

        return filterTodos(todos, args?.status, args?.search)
      },
    )

    vi.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("shows visible totals and lets the user narrow the list with search", async () => {
    const user = userEvent.setup()

    render(<TodosPage />)

    expect(screen.getByText("2 total")).toBeInTheDocument()
    expect(screen.getByText("1 complete")).toBeInTheDocument()
    expect(screen.getByText("Plan launch")).toBeInTheDocument()
    expect(screen.getByText("Archive invoices")).toBeInTheDocument()

    await user.type(screen.getByPlaceholderText("Search todos"), "launch")

    await waitFor(() => {
      expect(screen.getByText("Plan launch")).toBeInTheDocument()
      expect(screen.queryByText("Archive invoices")).not.toBeInTheDocument()
    })
  })

  it("lets the user quick add a todo and shows success feedback", async () => {
    const user = userEvent.setup()
    mocks.createTodo.mockResolvedValue("todo_3")

    render(<TodosPage />)

    await user.click(screen.getByRole("button", { name: "Quick Add" }))

    await waitFor(() => {
      expect(mocks.createTodo).toHaveBeenCalledWith({
        title: "Untitled task",
        description: "Fill this in after capture.",
        priority: "low",
      })
      expect(mocks.toastSuccess).toHaveBeenCalledWith("Todo created")
    })
  })

  it("shows error feedback when quick add fails", async () => {
    const user = userEvent.setup()
    mocks.createTodo.mockRejectedValue(new Error("Request failed"))

    render(<TodosPage />)

    await user.click(screen.getByRole("button", { name: "Quick Add" }))

    await waitFor(() => {
      expect(mocks.toastError).toHaveBeenCalledWith("Unable to create todo.")
    })
  })
})
