"use client" // Add the directive

import AuthForm from "@/components/auth/auth-form"
import BackgroundAnimation from "@/components/BackgroundAnimation"

export default function AuthPage() {
  return (
    <main className="min-h-screen w-full relative flex flex-col items-center justify-center overflow-hidden py-12">
      <BackgroundAnimation />
      
      <div className="container mx-auto px-4 py-8 z-10 max-w-7xl">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-300 text-center mb-8">
            Welcome to Trigo
          </h1>
          
          <div className="w-full max-w-md mx-auto backdrop-blur-sm bg-black/20 p-1 rounded-xl border border-white/10 shadow-xl">
            <AuthForm />
          </div>
        </div>
      </div>
    </main>
  )
}
