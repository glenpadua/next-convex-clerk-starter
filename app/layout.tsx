import "./globals.css"

import type { Metadata } from "next"
import { Inter, JetBrains_Mono, Outfit } from "next/font/google"

import ConvexClientProvider from "@/app/providers/convex-client-provider"
import OptionalClerkProvider from "@/app/providers/optional-clerk-provider"
import { Toaster } from "@/components/ui/sonner"

const outfit = Outfit({subsets:['latin'],variable:'--font-sans'})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "next-convex-clerk-starter",
    template: "%s | next-convex-clerk-starter",
  },
  description:
    "Personal project starter with Next.js, Convex, Clerk, and shadcn/ui.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <OptionalClerkProvider>
      <html lang="en" className={outfit.variable}>
        <body className={`${outfit.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
          <ConvexClientProvider>
            {children}
            <Toaster richColors position="top-right" />
          </ConvexClientProvider>
        </body>
      </html>
    </OptionalClerkProvider>
  )
}
