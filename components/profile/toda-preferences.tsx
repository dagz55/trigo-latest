"use client"

import { TodaSelector } from "@/components/toda/toda-selector"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/contexts/user-context"
import { supabase } from "@/lib/supabase-client"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface TodaPreferencesProps {
  userId: string;
  preferredTodaId: string | null;
  onUpdate?: () => void;
}

export function TodaPreferences({ userId, preferredTodaId, onUpdate }: TodaPreferencesProps) {
  const { updateUser } = useUser()
  const [selectedTodaId, setSelectedTodaId] = useState<string | null>(preferredTodaId || null)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!userId) {
      toast.error("You must be logged in to save preferences")
      return
    }

    try {
      setSaving(true)
      
      // Update the profile in Supabase
      const { error } = await supabase
        .from("profiles")
        .update({
          preferred_toda_id: selectedTodaId
        })
        .eq("id", userId)

      if (error) throw error

      // Update the user context
      updateUser({ preferredTodaId: selectedTodaId })

      toast.success("TODA preference saved")
      
      // Call the callback if provided
      if (onUpdate) {
        onUpdate()
      }
    } catch (error) {
      console.error("Error saving TODA preference:", error)
      toast.error("Failed to save preference")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>TODA Preferences</CardTitle>
        <CardDescription>
          Select your preferred Tricycle Operators and Drivers Association (TODA)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2 text-white/80">Preferred TODA</p>
            <TodaSelector 
              selectedTodaId={selectedTodaId} 
              onSelect={setSelectedTodaId}
              disabled={saving}
            />
          </div>
          <p className="text-sm text-white/60">
            Setting a preferred TODA will prioritize triders from this association when booking rides.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSave} 
          disabled={saving || selectedTodaId === preferredTodaId}
          className="bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 transition-all duration-300"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Preferences"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
