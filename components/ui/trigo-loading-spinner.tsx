"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface TrigoLoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  textClassName?: string
}

export function TrigoLoadingSpinner({ size = "md", className, textClassName }: TrigoLoadingSpinnerProps) {
  const [rotation, setRotation] = useState(0)

  // Animation for rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 2) % 360)
    }, 10)

    return () => clearInterval(interval)
  }, [])

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-40 h-40",
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  }

  return (
    <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>
      {/* Logo in the center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img src="/images/trigo-logo.png" alt="Trigo Logo" className="w-full h-full object-contain" />
      </div>

      {/* Rotating outer glow */}
      <div
        className="absolute w-full h-full border-4 border-transparent border-t-purple-500/50 border-r-purple-400/50 rounded-full"
        style={{ transform: `rotate(${rotation}deg)` }}
      />

      {/* Inner rotating circle (opposite direction) */}
      <div
        className="absolute w-[80%] h-[80%] border-4 border-transparent border-b-purple-300/50 border-l-purple-200/50 rounded-full"
        style={{ transform: `rotate(${-rotation * 1.5}deg)` }}
      />
    </div>
  )
}

