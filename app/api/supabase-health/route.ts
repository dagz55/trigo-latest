import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"

export async function GET() {
  try {
    // Simple query to check if Supabase connection is working
    const { data, error } = await supabase.from("profiles").select("count").limit(1)

    if (error) {
      throw error
    }

    return NextResponse.json({
      status: "ok",
      message: "Supabase connection successful",
      environment: process.env.ENVIRONMENT || "unknown",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Supabase health check failed:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Supabase connection failed",
        error: process.env.DEBUG === "true" ? error : "Check server logs for details",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

