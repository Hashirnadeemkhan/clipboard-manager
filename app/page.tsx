"use client"

import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase"
import { ClipboardProvider } from "@/contexts/clipboard-context"
import { ClipboardDashboard } from "@/components/clipboard-dashboard"
import { Auth } from "@/components/auth"

export default function Home() {
  const [user] = useAuthState(auth)

  if (!user) {
    return <Auth />
  }

  return (
    <ClipboardProvider>
      <div className="min-h-screen bg-background">
        <Auth />
        <ClipboardDashboard />
      </div>
    </ClipboardProvider>
  )
}
