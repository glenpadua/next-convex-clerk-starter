import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { render, screen, waitFor } from "@/test-utils/render"

import { CreateTodoDialog } from "./create-todo-dialog"

function deferredPromise() {
  let resolve!: () => void
  const promise = new Promise<void>((res) => {
    resolve = res
  })

  return { promise, resolve }
}

describe("CreateTodoDialog", () => {
  it("validates the form before submission", async () => {
    const user = userEvent.setup()
    const onCreate = vi.fn()

    render(<CreateTodoDialog onCreate={onCreate} />)

    await user.click(screen.getByRole("button", { name: "Add Todo" }))
    await user.click(screen.getByRole("button", { name: "Create" }))

    expect(await screen.findByText("Title is required")).toBeInTheDocument()
    expect(onCreate).not.toHaveBeenCalled()
  })

  it("submits trimmed values the user entered and closes on success", async () => {
    const user = userEvent.setup()
    const onCreate = vi.fn().mockResolvedValue(undefined)

    render(<CreateTodoDialog onCreate={onCreate} />)

    await user.click(screen.getByRole("button", { name: "Add Todo" }))
    await user.type(screen.getByRole("textbox", { name: "Title" }), "  Ship launch checklist  ")
    await user.type(screen.getByRole("textbox", { name: "Notes" }), "  Confirm email copy  ")
    await user.click(screen.getByRole("tab", { name: "High" }))
    await user.click(screen.getByRole("button", { name: "Create" }))

    await waitFor(() => {
      expect(onCreate).toHaveBeenCalledWith({
        title: "Ship launch checklist",
        description: "Confirm email copy",
        priority: "high",
      })
    })

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    })
  })

  it("shows a saving state while the submission is in flight", async () => {
    const user = userEvent.setup()
    const pending = deferredPromise()
    const onCreate = vi.fn().mockReturnValue(pending.promise)

    render(<CreateTodoDialog onCreate={onCreate} />)

    await user.click(screen.getByRole("button", { name: "Add Todo" }))
    await user.type(screen.getByRole("textbox", { name: "Title" }), "Ship status update")
    await user.click(screen.getByRole("button", { name: "Create" }))

    const savingButton = await screen.findByRole("button", { name: "Saving..." })
    expect(savingButton).toBeDisabled()

    pending.resolve()

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: "Saving..." })).not.toBeInTheDocument()
    })
  })
})
