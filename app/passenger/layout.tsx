export const metadata = {
  title: 'TriGO - Passenger',
  description: 'Passenger dashboard and booking interface',
}

export default function PassengerLayout({
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
