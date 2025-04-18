"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TodaSelector } from "@/components/toda/toda-selector"
import { supabase } from "@/lib/supabase-client"
import { toast } from "sonner"
import { useUser } from "@/contexts/user-context"
import { Loader2 } from "lucide-react"

export function TodaPreferences() {
  const { user, updateUser } = useUser()
  const [selectedTodaId, setSelectedTodaId] = useState<string | null>(user?.preferredTodaId || null)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!user?.id) {
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
        .eq("id", user.id)

      if (error) throw error

      // Update the user context
      updateUser({ preferredTodaId: selectedTodaId })

      toast.success("TODA preference saved", {
        description: "Your preferred TODA has been updated."
      })
    } catch (error) {
      console.error("Error saving TODA preference:", error)
      toast.error("Failed to save preference", {
        description: "Please try again or contact support."
      })
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
            <p className="text-sm font-medium mb-2">Preferred TODA</p>
            <TodaSelector 
              selectedTodaId={selectedTodaId} 
              onSelect={setSelectedTodaId}
              disabled={saving}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Setting a preferred TODA will prioritize triders from this association when booking rides.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSave} 
          disabled={saving || selectedTodaId === user?.preferredTodaId}
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
