"use client"

import type React from "react"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, PhoneCall, Bike, ShieldCheck, ArrowRight } from "lucide-react"

interface RoleCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
}

function RoleCard({ title, description, icon, href, color }: RoleCardProps) {
  return (
    <Card className="flex flex-col h-full transition-all hover:shadow-md">
      <CardHeader>
        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center mb-2`}>{icon}</div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">
          {title === "Passenger" && "Book rides and track your journey"}
          {title === "Trider" && "Accept ride requests and manage your schedule"}
          {title === "Dispatcher" && "Assign rides and coordinate triders"}
          {title === "Admin" && "Manage users, rides, and system settings"}
        </p>
      </CardContent>
      <CardFooter>
        <Link href={href} className="w-full">
          <Button className="w-full">
            Go to {title} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export function RoleNavigation() {
  const roles = [
    {
      title: "Passenger",
      description: "Book and track rides",
      icon: <Users className="h-6 w-6 text-white" />,
      href: "/passenger",
      color: "bg-blue-500",
    },
    {
      title: "Trider",
      description: "Accept and complete rides",
      icon: <Bike className="h-6 w-6 text-white" />,
      href: "/trider",
      color: "bg-green-500",
    },
    {
      title: "Dispatcher",
      description: "Manage ride assignments",
      icon: <PhoneCall className="h-6 w-6 text-white" />,
      href: "/dispatcher",
      color: "bg-amber-500",
    },
    {
      title: "Admin",
      description: "System administration",
      icon: <ShieldCheck className="h-6 w-6 text-white" />,
      href: "/admin",
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Select Your Role</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {roles.map((role) => (
          <RoleCard key={role.title} {...role} />
        ))}
      </div>
    </div>
  )
}

