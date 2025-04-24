export const metadata = {
  title: 'TriGO - Authentication',
  description: 'Sign in and authentication pages',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
