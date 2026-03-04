"use client"

import { ReactNode } from "react"
import { ConvexProvider, ConvexReactClient } from "convex/react"

let convexClient: ConvexReactClient | null = null

function getConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL

  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_CONVEX_URL in your .env file")
  }

  if (!convexClient) {
    convexClient = new ConvexReactClient(url)
  }

  return convexClient
}

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={getConvexClient()}>{children}</ConvexProvider>
}
