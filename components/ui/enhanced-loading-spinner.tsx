"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface EnhancedLoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  logoClassName?: string
}

export function EnhancedLoadingSpinner({ size = "md", className, logoClassName }: EnhancedLoadingSpinnerProps) {
  const [rotation, setRotation] = useState(0)

  // Animation for the rotating triangles
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 10) % 360)
    }, 50) // Rotate by 10 degrees every 50ms

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

  // Triangle sizes based on the spinner size
  const triangleSizes = {
    sm: { width: 6, height: 10 },
    md: { width: 8, height: 14 },
    lg: { width: 10, height: 18 },
    xl: { width: 12, height: 22 },
  }

  // Create 3 triangles positioned at different angles
  const triangles = [0, 120, 240].map((angle, index) => {
    const triangleStyle = {
      transform: `rotate(${angle + rotation}deg) translateY(-${size === "sm" ? 6 : size === "md" ? 9 : size === "lg" ? 12 : 15}px)`,
    }

    return (
      <div key={index} className="absolute top-1/2 left-1/2 origin-bottom" style={triangleStyle}>
        <div
          className="w-0 h-0 -translate-x-1/2 border-l-transparent border-r-transparent border-b-primary/30"
          style={{
            borderLeftWidth: `${triangleSizes[size].width}px`,
            borderRightWidth: `${triangleSizes[size].width}px`,
            borderBottomWidth: `${triangleSizes[size].height}px`,
          }}
        />
      </div>
    )
  })

  return (
    <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>
      {/* Outer spinning circle */}
      <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>

      {/* Middle spinning circle (opposite direction) */}
      <div className="absolute inset-[4px] rounded-full border-4 border-r-primary/70 border-t-transparent border-b-transparent border-l-transparent animate-spin-slow-reverse"></div>

      {/* Inner spinning circle */}
      <div className="absolute inset-[8px] rounded-full border-4 border-b-primary/40 border-t-transparent border-r-transparent border-l-transparent animate-spin-slow"></div>

      {/* Rotating triangles */}
      <div className="absolute inset-0 flex items-center justify-center">{triangles}</div>

      {/* Logo in the center */}
      <div className={cn("relative flex flex-col items-center justify-center z-10", logoClassName)}>
        <span className={cn("font-bold text-primary", logoSizeClasses[size])}>
          Tri<span className="text-green-500">Go</span>
        </span>
      </div>
    </div>
  )
}

