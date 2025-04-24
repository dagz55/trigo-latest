"use client"

import BackgroundAnimation from "@/components/BackgroundAnimation"
import { LoadingPage } from "@/components/ui/loading-page"
import { roles } from "@/lib/constants"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function RolesPage() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleRoleSelect = (route: string) => {
    router.push(route)
  }

  // Show loading or empty state until client-side rendering is ready
  if (!mounted) {
    return <LoadingPage message="Loading roles..." />
  }

  return (
    <main className="min-h-screen w-full relative flex flex-col items-center justify-center overflow-hidden py-12">
      <BackgroundAnimation />
      
      <div className="container mx-auto px-4 py-8 z-10 max-w-7xl">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-300 text-center mb-8">
          Select Your Role
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {roles.map((role, index) => {
            const Icon = role.icon
            
            return (
              <div 
                key={role.id} 
                className="min-h-[400px]"
              >
                <div 
                  className={`
                    h-[400px] w-full perspective-1000 cursor-pointer group relative
                    ${getRoleGlassBg(role.id)} 
                    border ${getRoleBorderGlow(role.id)} rounded-xl overflow-hidden
                    shadow-xl transition-all duration-300 flex flex-col items-center 
                    justify-center text-center p-8 backdrop-blur-sm
                  `}
                  onClick={() => handleRoleSelect(role.route)}
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
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
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

