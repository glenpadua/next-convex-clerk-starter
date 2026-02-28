import "./globals.css"

import type { Metadata } from "next"
import { JetBrains_Mono, Outfit } from "next/font/google"

import ConvexClientProvider from "@/app/providers/convex-client-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { ThemeProvider } from "@/components/theme-provider"
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
      <html lang="en" className={outfit.variable} suppressHydrationWarning>
        <body className={`${outfit.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="fixed top-4 right-4 z-50">
              <ModeToggle />
            </div>
            <ConvexClientProvider>
              {children}
              <Toaster richColors position="bottom-right" />
            </ConvexClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </OptionalClerkProvider>
  )
}
