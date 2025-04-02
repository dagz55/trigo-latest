"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface NeonLoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  logoClassName?: string
  showLogo?: boolean
}

export function NeonLoadingSpinner({
  size = "md",
  className,
  logoClassName,
  showLogo = true,
}: NeonLoadingSpinnerProps) {
  const [glowIntensity, setGlowIntensity] = useState(0.7)

  // Pulsing glow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity((prev) => {
        // Oscillate between 0.5 and 1
        const newValue = prev + 0.02 * (prev < 0.75 ? 1 : -1)
        return Math.max(0.5, Math.min(1, newValue))
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-40 h-40",
  }

  const logoSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  }

  const triangleSizes = {
    sm: { width: 40, height: 35 },
    md: { width: 60, height: 52 },
    lg: { width: 80, height: 70 },
    xl: { width: 100, height: 87 },
  }

  // Calculate rotation for spinning effect
  const [rotation, setRotation] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360)
    }, 30)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>
      {/* Background glow */}
      <div
        className="absolute rounded-full bg-purple-900/20 animate-pulse"
        style={{
          width: triangleSizes[size].width * 1.5,
          height: triangleSizes[size].width * 1.5,
          filter: `blur(${triangleSizes[size].width / 5}px)`,
        }}
      />

      {/* Spinning neon triangle */}
      <div
        className="absolute"
        style={{
          transform: `rotate(${rotation}deg)`,
          width: triangleSizes[size].width,
          height: triangleSizes[size].height,
        }}
      >
        {/* Triangle with neon effect */}
        <div className="relative w-full h-full">
          {/* Top line */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 bg-purple-500 rotate-[270deg] origin-bottom"
            style={{
              width: "2px",
              height: `${triangleSizes[size].height * 0.95}px`,
              boxShadow: `0 0 ${8 * glowIntensity}px ${3 * glowIntensity}px rgba(168,85,247,${glowIntensity})`,
            }}
          />

          {/* Bottom left line */}
          <div
            className="absolute bottom-0 left-0 bg-purple-500 rotate-[330deg] origin-right"
            style={{
              width: `${triangleSizes[size].width * 0.5}px`,
              height: "2px",
              boxShadow: `0 0 ${8 * glowIntensity}px ${3 * glowIntensity}px rgba(168,85,247,${glowIntensity})`,
            }}
          />

          {/* Bottom right line */}
          <div
            className="absolute bottom-0 right-0 bg-purple-500 rotate-[30deg] origin-left"
            style={{
              width: `${triangleSizes[size].width * 0.5}px`,
              height: "2px",
              boxShadow: `0 0 ${8 * glowIntensity}px ${3 * glowIntensity}px rgba(168,85,247,${glowIntensity})`,
            }}
          />
        </div>
      </div>

      {/* Logo in the center */}
      {showLogo && (
        <div className={cn("relative flex flex-col items-center justify-center z-10", logoClassName)}>
          <span className={cn("font-bold text-primary drop-shadow-md", logoSizeClasses[size])}>
            Tri<span className="text-green-500">Go</span>
          </span>
        </div>
      )}
    </div>
  )
}

