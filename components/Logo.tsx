"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Triangle, Bike } from "lucide-react";

export default function Logo() {
  // Remove the pulsing animation state and effect
  return (
    <div className="text-center mb-8 flex flex-col items-center">
      <div className="mb-3">
        <h1 
          className={cn(
            "text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-300",
            "transition-all duration-300 ease-in-out",
            "drop-shadow-[0_0_25px_rgba(168,85,247,0.8)]"
          )}
        >
          TriGo
        </h1>
      </div>
      
      <div className="relative w-32 h-32 my-2 flex items-center justify-center">
        <Triangle 
          className={cn(
            "w-full h-full text-purple-400 absolute",
            "filter drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]",
            "stroke-[1.5px]"
          )}
        />
        <Bike 
          className={cn(
            "w-12 h-12 text-purple-200 z-10",
            "filter drop-shadow-[0_0_15px_rgba(233,213,255,0.9)]"
          )}
        />
      </div>
      
      <p className={cn(
        "text-purple-300 mt-2 text-xl text-center max-w-xs mx-auto leading-tight",
        "filter drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]",
        "tracking-wide"
      )}>
        Ride-hailing for Filipino
        <br /> 
        tricycle communities
      </p>
    </div>
  );
}