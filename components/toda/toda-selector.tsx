"use client"

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
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Toda {
  id: string
  name: string
  city: string
  province: string
  barangay: string
  coverage_area?: string
}

interface TodaSelectorProps {
  selectedTodaId: string | null
  onSelect: (todaId: string) => void
  disabled?: boolean
}

export function TodaSelector({ selectedTodaId, onSelect, disabled }: TodaSelectorProps) {
  const [open, setOpen] = useState(false)
  const [todas, setTodas] = useState<Toda[]>([])
  const [selectedToda, setSelectedToda] = useState<Toda | null>(null)
  const [loading, setLoading] = useState(false)

  // Fetch TODAs on component mount
  useEffect(() => {
    const fetchTodas = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('todas')
          .select('id, name, city, province, barangay')
          .order('name')

        if (error) throw error

        if (data && data.length > 0) {
          setTodas(data)
          
          if (selectedTodaId) {
            const selected = data.find(toda => toda.id === selectedTodaId)
            if (selected) {
              setSelectedToda(selected)
            }
          }
        }
      } catch (error) {
        console.error("Error fetching TODAs:", error)
        toast.error("Failed to load TODAs", {
          description: "Please try again or contact support."
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTodas()
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
          className="w-full justify-between bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 hover:border-gray-600 text-white"
          disabled={disabled || loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : selectedToda?.name ? (
            selectedToda.name
          ) : (
            "Select TODA..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-gray-800/95 border border-gray-700">
        <Command className="bg-transparent">
          <CommandInput placeholder="Search TODAs..." className="bg-gray-800 text-white" />
          <CommandEmpty className="text-white/60">No TODA found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-auto">
            {todas.map((toda) => (
              <CommandItem
                key={toda.id}
                value={toda.name}
                onSelect={() => handleSelect(toda)}
                className="hover:bg-gray-700/80 aria-selected:bg-gray-700"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedToda?.id === toda.id ? "opacity-100 text-purple-400" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span className="text-white">{toda.name}</span>
                  <span className="text-xs text-white/60">
                    {toda.city}, {toda.barangay}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
