import { TrigoLoadingSpinner } from "@/components/ui/trigo-loading-spinner"

interface LoadingOverlayProps {
  message?: string
}

export function LoadingOverlay({ message = "Loading..." }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md">
      <div className="mb-4">
        <TrigoLoadingSpinner size="md" />
      </div>
      <p className="text-lg font-medium text-center text-white/80">{message}</p>
    </div>
  )
}

