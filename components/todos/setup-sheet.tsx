"use client"

import { CheckCircle2, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const checklist = [
  "Run npx convex dev to create or connect a Convex project.",
  "Copy NEXT_PUBLIC_CONVEX_URL from Convex into .env.local.",
  "Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY.",
  "Set CLERK_JWT_ISSUER_DOMAIN in Convex dashboard env vars.",
  "Deploy frontend to Vercel and backend with npx convex deploy.",
]

export function SetupSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Setup Guide</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Project setup checklist</SheetTitle>
          <SheetDescription>
            Fast path for wiring Convex + Clerk and shipping this starter.
          </SheetDescription>
        </SheetHeader>

        <ul className="mt-6 space-y-3 text-sm">
          {checklist.map((item) => (
            <li key={item} className="flex items-start gap-2 text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 grid gap-3">
          <Button asChild variant="outline">
            <a href="https://docs.convex.dev/dashboard/projects" target="_blank" rel="noreferrer">
              Convex Projects Docs
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href="https://ui.shadcn.com/docs/theming" target="_blank" rel="noreferrer">
              shadcn Theme Docs
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
