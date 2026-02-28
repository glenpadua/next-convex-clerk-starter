import { SignIn } from "@clerk/nextjs"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignInPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Clerk is not configured</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Todos work without auth. Add Clerk environment variables when you want sign-in.
          </p>
          <Button asChild variant="outline">
            <Link href="/dashboard/todos">Back to Todos</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return <SignIn routing="path" path="/sign-in" />
}
