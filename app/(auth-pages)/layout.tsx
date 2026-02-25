export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40 px-4 py-10">
      <div className="mx-auto flex w-full max-w-md items-center justify-center">{children}</div>
    </div>
  )
}
