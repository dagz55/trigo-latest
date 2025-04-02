import { TrigoLoadingSpinner } from "@/components/ui/trigo-loading-spinner"

interface LoadingPageProps {
  message?: string
}

export function LoadingPage({ message = "Loading..." }: LoadingPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="mb-4">
        <TrigoLoadingSpinner size="lg" />
      </div>
      <p className="text-lg font-medium text-center">{message}</p>
    </div>
  )
}

