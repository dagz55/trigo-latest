"use client";

import { useState, useEffect } from "react";
import { roles } from "@/lib/constants";
import RoleCard from "./RoleCard";

export default function RoleSelection() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same dimensions to prevent layout shift
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {roles.map((role) => (
          <div 
            key={role.id} 
            className="h-[350px] bg-gray-800/30 rounded-xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {roles.map((role, index) => (
        <div 
          key={role.id} 
          className="opacity-0 min-h-[400px]"
          style={{ 
            animationDelay: `${index * 150}ms`, 
            animationFillMode: 'forwards',
            opacity: 1 // Make immediately visible instead of animating
          }}
        >
          <RoleCard role={role} />
        </div>
      ))}
    </div>
  );
}