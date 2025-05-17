"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Role } from "@/lib/constants";
import LoginForm from "./LoginForm";

interface RoleCardProps {
  role: Role;
}

export default function RoleCard({ role }: { role: Role }) {
  const router = useRouter();
  
  const handleSelectRole = () => {
    // Navigate to the role-specific login page
    router.push(`/${role.id}/login`);
  };

  return (
    <div className="w-full h-[350px] bg-gray-900/80 rounded-xl border border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="p-6 flex flex-col h-full justify-between">
        {/* Icon and title */}
        <div className="space-y-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRoleIconBg(role.id)}`}>
            <role.icon className={`w-6 h-6 ${getRoleIconColor(role.id)}`} />
          </div>
          <h3 className={`text-2xl font-bold ${getRoleTextColor(role.id)}`}>{role.name}</h3>
          <p className="text-gray-400">{role.description}</p>
        </div>
        
        {/* Select Role button */}
        <button 
          onClick={handleSelectRole}
          className={`
            mt-4 w-full py-2 px-4 rounded-md flex justify-between items-center
            ${getRoleButtonBg(role.id)}
            hover:${getRoleButtonHoverBg(role.id)}
            ${getRoleButtonText(role.id)}
            transition-all duration-300
          `}
        >
          Select Role <span className="opacity-70 group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </div>
  );
}

// Helper functions for role-specific styling
function getRoleGlassBg(roleId: string): string {
  switch(roleId) {
    case 'passenger': return 'bg-gradient-to-br from-red-500/10 via-red-600/5 to-red-800/20';
    case 'trider': return 'bg-gradient-to-br from-cyan-500/10 via-cyan-600/5 to-cyan-800/20'; 
    case 'dispatcher': return 'bg-gradient-to-br from-yellow-500/10 via-yellow-600/5 to-yellow-800/20';
    case 'admin': return 'bg-gradient-to-br from-green-500/10 via-green-600/5 to-green-800/20';
    default: return 'bg-gradient-to-br from-cyan-500/10 via-cyan-600/5 to-cyan-800/20';
  }
}

function getRoleIconBg(roleId: string): string {
  switch(roleId) {
    case 'passenger': return 'bg-red-500/20';
    case 'trider': return 'bg-cyan-500/20';
    case 'dispatcher': return 'bg-yellow-500/20';
    case 'admin': return 'bg-green-500/20';
    default: return 'bg-cyan-500/20';
  }
}

// The following code block has syntax errors - it should be completely removed or properly commented
/*
  switch(roleId) {
    case 'passenger': return 'text-orange-500';
    case 'trider': return 'text-cyan-500';
    case 'dispatcher': return 'text-yellow-500';
    case 'admin': return 'text-green-500';
    default: return 'text-cyan-500';
  }
}
*/

function getRoleButtonBg(roleId: string): string {
  switch(roleId) {
    case 'passenger': return 'bg-red-900/80 hover:bg-red-800/90';
    case 'trider': return 'bg-cyan-900/80 hover:bg-cyan-800/90';
    case 'dispatcher': return 'bg-yellow-900/80 hover:bg-yellow-800/90';
    case 'admin': return 'bg-green-900/80 hover:bg-green-800/90';
    default: return 'bg-cyan-900/80 hover:bg-cyan-800/90';
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