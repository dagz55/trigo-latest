"use client";

import { useState } from "react";
import { Role } from "@/lib/constants";
import LoginForm from "./LoginForm";

interface RoleCardProps {
  role: Role;
}

export default function RoleCard({ role }: RoleCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const Icon = role.icon;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className={`
        h-[400px] w-full perspective-1000 cursor-pointer group
        ${isFlipped ? "fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm" : "relative"}
      `}
      aria-label={`${role.name} selection card`}
      style={{
        position: isFlipped ? 'fixed' : 'relative',
        top: isFlipped ? '0' : 'auto',
        left: isFlipped ? '0' : 'auto',
        right: isFlipped ? '0' : 'auto',
        bottom: isFlipped ? '0' : 'auto',
        height: isFlipped ? '100%' : '400px',
        width: isFlipped ? '100%' : '100%',
      }}
    >
      <div
        className={`
          relative h-full w-full transition-all duration-500 preserve-3d
          ${isFlipped ? "rotate-y-180 shadow-2xl max-w-md mx-auto" : ""}
        `}
      >
        {/* Front of card */}
        <div 
          className={`
            absolute inset-0 backface-hidden cursor-pointer
            ${getRoleGlassBg(role.id)} 
            border ${getRoleBorderGlow(role.id)} rounded-xl overflow-hidden
            shadow-xl transition-all duration-300 flex flex-col items-center 
            justify-center text-center p-8 backdrop-blur-sm animate-shine
          `}
          onClick={handleFlip}
        >
          <div className={`w-20 h-20 rounded-full bg-gray-800/50 flex items-center justify-center mb-6 border-2 ${getRoleBorderColor(role.id)} shadow-lg ${getRoleShadowColor(role.id)}`}>
            <Icon className={`w-10 h-10 ${getRoleIconColor(role.id)}`} />
          </div>
          
          <h2 className={`text-2xl font-bold ${getRoleTextColor(role.id)} mb-2`}>{role.name}</h2>
          
          <p className="text-white/80 mb-4">{role.description}</p>
          
          <div className="mt-auto">
            <button 
              className={`px-4 py-2 ${getRoleButtonBg(role.id)} ${getRoleButtonText(role.id)} rounded-lg hover:${getRoleButtonHoverBg(role.id)} transition-colors flex items-center justify-center gap-2 group-hover:scale-105 duration-300`}
            >
              <span>Select Role</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Back of card */}
        <div 
          className={`
            absolute inset-0 backface-hidden rotate-y-180 
            ${getRoleGlassBackBg(role.id)} border ${getRoleBorderGlow(role.id)} 
            rounded-xl shadow-xl p-6 flex flex-col overflow-y-auto 
            backdrop-blur-md
          `}
        >
          <button 
            onClick={handleFlip}
            className={`absolute top-3 right-3 ${getRoleTextColor(role.id)} hover:${getRoleTextHoverColor(role.id)} transition-colors`}
            aria-label="Go back to role selection"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m18 6-12 12" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
          
          <div className="text-center mb-4">
            <h3 className={`text-lg font-semibold ${getRoleTextColor(role.id)}`}>{role.name} Login</h3>
            <p className="text-xs text-white/60">Enter your credentials to continue</p>
          </div>
          
          <LoginForm role={role.id} route={role.route} />
        </div>
      </div>
    </div>
  );
}

// Helper functions for role-specific styling
function getRoleGlassBg(roleId: string): string {
  switch(roleId) {
    case 'passenger': return 'bg-gradient-to-br from-orange-500/10 via-orange-600/5 to-orange-800/20';
    case 'trider': return 'bg-gradient-to-br from-cyan-500/10 via-cyan-600/5 to-cyan-800/20'; 
    case 'dispatcher': return 'bg-gradient-to-br from-yellow-500/10 via-yellow-600/5 to-yellow-800/20';
    case 'admin': return 'bg-gradient-to-br from-green-500/10 via-green-600/5 to-green-800/20';
    default: return 'bg-gradient-to-br from-cyan-500/10 via-cyan-600/5 to-cyan-800/20';
  }
}

function getRoleGlassBackBg(roleId: string): string {
  switch(roleId) {
    case 'passenger': return 'bg-gradient-to-br from-gray-900/95 via-orange-950/30 to-gray-950/90';
    case 'trider': return 'bg-gradient-to-br from-gray-900/95 via-cyan-950/30 to-gray-950/90'; 
    case 'dispatcher': return 'bg-gradient-to-br from-gray-900/95 via-yellow-950/30 to-gray-950/90';
    case 'admin': return 'bg-gradient-to-br from-gray-900/95 via-green-950/30 to-gray-950/90';
    default: return 'bg-gradient-to-br from-gray-900/95 via-cyan-950/30 to-gray-950/90';
  }
}

function getRoleBorderGlow(roleId: string): string {
  switch(roleId) {
    case 'passenger': return 'border-orange-500/20 hover:border-orange-400/30';
    case 'trider': return 'border-cyan-500/20 hover:border-cyan-400/30'; 
    case 'dispatcher': return 'border-yellow-500/20 hover:border-yellow-400/30';
    case 'admin': return 'border-green-500/20 hover:border-green-400/30';
    default: return 'border-cyan-500/20 hover:border-cyan-400/30';
  }
}

function getRoleIconColor(roleId: string): string {
  switch(roleId) {
    case 'passenger': return 'text-orange-400';
    case 'trider': return 'text-cyan-400'; 
    case 'dispatcher': return 'text-yellow-400';
    case 'admin': return 'text-green-400';
    default: return 'text-cyan-400';
  }
}

function getRoleBorderColor(roleId: string): string {
  switch(roleId) {
    case 'passenger': return 'border-orange-400/50';
    case 'trider': return 'border-cyan-400/50'; 
    case 'dispatcher': return 'border-yellow-400/50';
    case 'admin': return 'border-green-400/50';
    default: return 'border-cyan-400/50';
  }
}

function getRoleShadowColor(roleId: string): string {
  switch(roleId) {
    case 'passenger': return 'shadow-orange-400/10';
    case 'trider': return 'shadow-cyan-400/10'; 
    case 'dispatcher': return 'shadow-yellow-400/10';
    case 'admin': return 'shadow-green-400/10';
    default: return 'shadow-cyan-400/10';
  }
}

function getRoleTextColor(roleId: string): string {
  switch(roleId) {
    case 'passenger': return 'text-orange-300';
    case 'trider': return 'text-cyan-300'; 
    case 'dispatcher': return 'text-yellow-300';
    case 'admin': return 'text-green-300';
    default: return 'text-white';
  }
}

function getRoleTextHoverColor(roleId: string): string {
  switch(roleId) {
    case 'passenger': return 'text-orange-200';
    case 'trider': return 'text-cyan-200'; 
    case 'dispatcher': return 'text-yellow-200';
    case 'admin': return 'text-green-200';
    default: return 'text-cyan-200';
  }
}

function getRoleButtonBg(roleId: string): string {
  switch(roleId) {
    case 'passenger': return 'bg-orange-500/20';
    case 'trider': return 'bg-cyan-500/20'; 
    case 'dispatcher': return 'bg-yellow-500/20';
    case 'admin': return 'bg-green-500/20';
    default: return 'bg-cyan-500/20';
  }
}

function getRoleButtonText(roleId: string): string {
  switch(roleId) {
    case 'passenger': return 'text-orange-300';
    case 'trider': return 'text-cyan-300'; 
    case 'dispatcher': return 'text-yellow-300';
    case 'admin': return 'text-green-300';
    default: return 'text-cyan-300';
  }
}

function getRoleButtonHoverBg(roleId: string): string {
  switch(roleId) {
    case 'passenger': return 'bg-orange-500/30';
    case 'trider': return 'bg-cyan-500/30'; 
    case 'dispatcher': return 'bg-yellow-500/30';
    case 'admin': return 'bg-green-500/30';
    default: return 'bg-cyan-500/30';
  }
}