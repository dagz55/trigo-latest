import { TrigoLoadingSpinner } from "@/components/ui/trigo-loading-spinner"

interface LoadingInlineProps {
  size?: "sm" | "md"
  className?: string
}

export function LoadingInline({ size = "sm", className }: LoadingInlineProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <TrigoLoadingSpinner size={size} />
    </div>
  )
}

