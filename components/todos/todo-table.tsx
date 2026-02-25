"use client"

import { MoreHorizontal, Trash2 } from "lucide-react"

import type { Doc, Id } from "@/convex/_generated/dataModel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type TodoDoc = Doc<"todos">

interface TodoTableProps {
  todos: TodoDoc[]
  onToggle: (todoId: Id<"todos">) => Promise<void>
  onRemove: (todoId: Id<"todos">) => Promise<void>
}

const priorityToBadgeVariant: Record<TodoDoc["priority"], "default" | "secondary" | "outline"> = {
  high: "default",
  medium: "secondary",
  low: "outline",
}

export function TodoTable({ todos, onToggle, onRemove }: TodoTableProps) {
  if (todos.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        No todos in this view yet.
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">Done</TableHead>
          <TableHead>Task</TableHead>
          <TableHead className="w-28">Priority</TableHead>
          <TableHead className="w-40">Created</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {todos.map((todo) => (
          <TableRow key={todo._id}>
            <TableCell>
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => void onToggle(todo._id)}
                aria-label={`Toggle ${todo.title}`}
              />
            </TableCell>
            <TableCell>
              <p className={todo.completed ? "text-muted-foreground line-through" : "font-medium"}>
                {todo.title}
              </p>
              {todo.description ? (
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{todo.description}</p>
              ) : null}
            </TableCell>
            <TableCell>
              <Badge variant={priorityToBadgeVariant[todo.priority]} className="capitalize">
                {todo.priority}
              </Badge>
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {new Date(todo.createdAt).toLocaleString()}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="Todo actions">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => void onRemove(todo._id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
