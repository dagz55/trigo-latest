"use client"

import { Card, CardContent } from "@/components/ui/card"

interface Destination {
  id: string
  name: string
  image: string
  description: string
}

const popularDestinations: Destination[] = [
  {
    id: "1",
    name: "SM Mall of Asia",
    image: "/placeholder.svg?height=100&width=150",
    description: "One of the largest malls in the Philippines",
  },
  {
    id: "2",
    name: "Intramuros",
    image: "/placeholder.svg?height=100&width=150",
    description: "Historic walled area within Manila",
  },
  {
    id: "3",
    name: "Rizal Park",
    image: "/placeholder.svg?height=100&width=150",
    description: "Historical urban park in Manila",
  },
  {
    id: "4",
    name: "Bonifacio Global City",
    image: "/placeholder.svg?height=100&width=150",
    description: "Financial and lifestyle district in Taguig",
  },
]

export function PopularDestinations({ onSelect }: { onSelect: (destination: string) => void }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Popular Destinations</h3>
      <div className="grid grid-cols-2 gap-4">
        {popularDestinations.map((destination) => (
          <Card
            key={destination.id}
            className="overflow-hidden cursor-pointer hover:ring-1 hover:ring-primary transition-all"
            onClick={() => onSelect(destination.name)}
          >
            <div className="aspect-[3/2] relative">
              <img
                src={destination.image || "/placeholder.svg"}
                alt={destination.name}
                className="object-cover w-full h-full"
              />
            </div>
            <CardContent className="p-3">
              <h4 className="font-medium text-sm">{destination.name}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2">{destination.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

