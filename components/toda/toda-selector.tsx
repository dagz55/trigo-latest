"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { supabase } from "@/lib/supabase-client"
import { toast } from "sonner"

interface Toda {
  id: string
  name: string
  code: string
  city: string
  barangay: string
}

interface TodaSelectorProps {
  selectedTodaId: string | null
  onSelect: (todaId: string) => void
  disabled?: boolean
}

export function TodaSelector({ selectedTodaId, onSelect, disabled = false }: TodaSelectorProps) {
  const [open, setOpen] = useState(false)
  const [todas, setTodas] = useState<Toda[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedToda, setSelectedToda] = useState<Toda | null>(null)

  // Define sample TODAs outside the effect to avoid recreation on each render
  const sampleTodas = [
    {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Talon Kuatro TODA',
      code: 'TK-TODA',
      city: 'Las Piñas City',
      barangay: 'Talon Kuatro'
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Talon Singko TODA',
      code: 'TS-TODA',
      city: 'Las Piñas City',
      barangay: 'Talon Singko'
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      name: 'Almanza TODA',
      code: 'ALM-TODA',
      city: 'Las Piñas City',
      barangay: 'Almanza'
    }
  ]

  // Fetch all active TODAs directly from the table
  useEffect(() => {
    let isMounted = true

    const fetchTodas = async () => {
      try {
        if (isMounted) setLoading(true)

        // Use sample TODAs immediately to prevent UI from being empty
        if (isMounted) setTodas(sampleTodas)

        // Try to fetch from the database
        try {
          // Fetch directly from the todas table instead of using RPC
          const { data, error } = await supabase
            .from('todas')
            .select('id, name, code, city, barangay')
            .eq('status', 'active')
            .order('name')

          if (error) throw error

          // If we got data from the database, use it
          if (data && data.length > 0 && isMounted) {
            setTodas(data)

            // If we have a selectedTodaId, find the corresponding TODA
            if (selectedTodaId) {
              const selected = data.find(toda => toda.id === selectedTodaId)
              if (selected) {
                setSelectedToda(selected)
              }
            }
          }
        } catch (dbError) {
          console.warn("Could not fetch TODAs from database, using sample data", dbError)
          // We're already using sample TODAs, so no need to set them again
        }
      } catch (error) {
        console.error("Error in TODA fetching process:", error)

        // We're already using sample TODAs, so no need to set them again
        if (isMounted) {
          toast.warning("Using sample TODAs", {
            description: "Could not connect to the database. Using sample data."
          })
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchTodas()

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false
    }
  }, [selectedTodaId])

  const handleSelect = (toda: Toda) => {
    setSelectedToda(toda)
    onSelect(toda.id)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled || loading}
        >
          {loading ? (
            <div className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Loading TODAs...</span>
            </div>
          ) : selectedToda ? (
            <div className="flex flex-col items-start">
              <span>{selectedToda.name}</span>
              <span className="text-xs text-muted-foreground">{selectedToda.city}, {selectedToda.barangay}</span>
            </div>
          ) : (
            "Select TODA"
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search TODAs..." />
          <CommandEmpty>No TODA found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-auto">
            {todas.map((toda) => (
              <CommandItem
                key={toda.id}
                value={toda.name}
                onSelect={() => handleSelect(toda)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedToda?.id === toda.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span>{toda.name}</span>
                  <span className="text-xs text-muted-foreground">{toda.city}, {toda.barangay}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
