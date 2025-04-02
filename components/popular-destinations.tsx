"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"

interface Destination {
  id: string
  name: string
  image: string
  description: string
}

const PopularDestinations = () => {
  const [popularDestinations, setPopularDestinations] = useState<Destination[]>([])

  useEffect(() => {
    const fetchPopularDestinations = async () => {
      const { data, error } = await supabase.from("popular_destinations").select("*").limit(4)

      if (!error && data) {
        setPopularDestinations(
          data.map((dest) => ({
            id: dest.id,
            name: dest.name,
            image: dest.image_url || "/placeholder.svg?height=100&width=150",
            description: dest.description || "",
          })),
        )
      } else {
        // Fallback to some default destinations if query fails
        setPopularDestinations([
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
        ])
      }
    }

    fetchPopularDestinations()
  }, [])

  return (
    <div>
      <h2>Popular Destinations</h2>
      <ul>
        {popularDestinations.map((destination) => (
          <li key={destination.id}>
            <img src={destination.image || "/placeholder.svg"} alt={destination.name} />
            <h3>{destination.name}</h3>
            <p>{destination.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PopularDestinations

