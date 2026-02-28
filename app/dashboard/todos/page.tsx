"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { ArrowLeft, ListTodo, PlusCircle } from "lucide-react"
import { toast } from "sonner"

import type { Doc, Id } from "@/convex/_generated/dataModel"
import { api } from "@/convex/_generated/api"
import { CreateTodoDialog } from "@/components/todos/create-todo-dialog"
import { SetupSheet } from "@/components/todos/setup-sheet"
import { TodoTable } from "@/components/todos/todo-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Filter = "all" | "active" | "completed"

type TodoDoc = Doc<"todos">

export default function TodosPage() {
  const [filter, setFilter] = useState<Filter>("all")
  const [search, setSearch] = useState("")

  const createTodo = useMutation(api.todos.create)
  const toggleTodo = useMutation(api.todos.toggle)
  const removeTodo = useMutation(api.todos.remove)

  const todos = useQuery(api.todos.list, {
    status: filter,
    search: search.trim() || undefined,
  })
  const allTodos = useQuery(api.todos.list, {
    status: "all",
  })

  const todoItems = todos ?? []
  const todoTotals = useMemo(() => {
    const items = allTodos ?? []
    const active = items.filter((todo) => !todo.completed).length
    const completed = items.length - active
    return { all: items.length, active, completed }
  }, [allTodos])

  const handleCreate = async (input: {
    title: string
    description?: string
    priority: "low" | "medium" | "high"
  }) => {
    try {
      await createTodo({
        title: input.title,
        description: input.description || undefined,
        priority: input.priority,
      })
      toast.success("Todo created")
    } catch (error) {
      console.error(error)
      toast.error("Unable to create todo.")
      throw error
    }
  }

  const handleToggle = async (todoId: Id<"todos">) => {
    try {
      await toggleTodo({ id: todoId })
    } catch (error) {
      console.error(error)
      toast.error("Unable to update todo.")
    }
  }

  const handleRemove = async (todoId: Id<"todos">) => {
    try {
      await removeTodo({ id: todoId })
      toast.success("Todo deleted")
    } catch (error) {
      console.error(error)
      toast.error("Unable to delete todo.")
    }
  }

  const completedCount = todoItems.filter((todo) => todo.completed).length

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="outline">
          <Link href="/dashboard" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </Button>

        <div className="flex items-center gap-3">
          <Badge variant="outline">Public demo</Badge>
          <SetupSheet />
        </div>
      </div>

      <section className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <ListTodo className="h-5 w-5 text-primary" />
                <CardTitle>Todo Workspace</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                Open for unauthenticated use. Works with auth enabled too.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{todoTotals.all} total</Badge>
              <Badge variant="outline">{completedCount} complete</Badge>
              <CreateTodoDialog onCreate={handleCreate} />
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search todos"
                className="sm:max-w-xs"
              />
              <Button
                onClick={() =>
                  void handleCreate({
                    title: "Untitled task",
                    description: "Fill this in after capture.",
                    priority: "low",
                  }).catch(() => {
                    // Error toast is handled in handleCreate.
                  })
                }
                variant="outline"
                className="gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Quick Add
              </Button>
            </div>

            <Tabs value={filter} onValueChange={(value) => setFilter(value as Filter)}>
              <TabsList>
                <TabsTrigger value="all">All ({todoTotals.all})</TabsTrigger>
                <TabsTrigger value="active">Active ({todoTotals.active})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({todoTotals.completed})</TabsTrigger>
              </TabsList>

              <TabsContent value={filter}>
                <TodoTable
                  todos={todoItems as TodoDoc[]}
                  onToggle={handleToggle}
                  onRemove={handleRemove}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
