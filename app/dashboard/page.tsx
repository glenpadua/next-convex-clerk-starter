import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const setupChecklist = [
  "Install dependencies with npm install.",
  "Connect Convex with npx convex dev --configure.",
  "Add NEXT_PUBLIC_CONVEX_URL to .env.local.",
  "(Optional) Configure Clerk only if you want sign-in pages.",
]

export default function DashboardPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Badge>Starter</Badge>
          <p className="text-sm text-muted-foreground">
            Next.js + Convex + Clerk (optional) + shadcn/ui
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild>
            <Link href="/dashboard/todos" className="gap-2">
              Open Todos <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/sign-in">Auth Page</Link>
          </Button>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHeader className="space-y-3">
            <Badge variant="outline" className="w-fit">
              Personal Starter Template
            </Badge>
            <CardTitle className="text-3xl tracking-tight">
              Build new projects fast with a clean full-stack baseline.
            </CardTitle>
            <p className="max-w-2xl text-sm text-muted-foreground">
              The default todo app is public and works with no Clerk setup.
              Authentication pages are still included and can be enabled when needed.
            </p>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/dashboard/todos" className="gap-2">
                Go to Todos <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <a
                href="https://docs.convex.dev/quickstart/nextjs"
                target="_blank"
                rel="noreferrer"
              >
                Convex + Next.js Quickstart
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="https://ui.shadcn.com/docs" target="_blank" rel="noreferrer">
                shadcn/ui Docs
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Setup Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              {setupChecklist.map((item) => (
                <li key={item} className="flex items-start gap-2 text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
