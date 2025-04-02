import { NextResponse } from "next/server"

export async function GET() {
  // Return the full URL to our proxy
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

  return NextResponse.json({
    url: `${baseUrl}/api/maps-proxy`,
  })
}

